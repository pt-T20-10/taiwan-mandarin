"""Offline, fixed-case BreezyVoice experiment. Run with runtime/breezy/venv Python.

Feature extraction follows Apache-2.0 CosyVoice cli/frontend.py (Alibaba, 2024).
No text normalizer, G2PW download, ASR model or training dependencies are needed
for these explicitly authored inputs. Output is NOT certified pronunciation.
"""
import argparse
import hashlib
import json
import logging
import os
from pathlib import Path
import sys
import time
import types

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'runtime/breezy/source'
MODEL = ROOT / 'models/breezyvoice'
OUTPUT = ROOT / 'data/connected-speech'
PROMPT = '在密碼學中，加密是將明文資訊改變為難以讀取的密文內容，使之不可讀的方法。只有擁有解密方法的對象,經由解密過程才能將密文還原為正常可讀的內容。'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--case', help='Render one fixed case only')
    parser.add_argument('--fp32', action='store_true', help='Use unquantized LLM for comparison')
    parser.add_argument('--resume', action='store_true', help='Keep valid previously rendered fixed clips')
    args = parser.parse_args()
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    os.environ['HF_HOME'] = str(ROOT / 'runtime/breezy/cache/huggingface')
    os.environ['NUMBA_CACHE_DIR'] = str(ROOT / 'runtime/breezy/cache/numba')
    sys.path[:0] = [str(SOURCE), str(SOURCE / 'third_party/Matcha-TTS')]
    # Matcha's utils initializer imports its training UI. Only expose its audio
    # module and ordinary single-process logging; model computations are intact.
    package = types.ModuleType('matcha.utils')
    package.__path__ = [str(SOURCE / 'third_party/Matcha-TTS/matcha/utils')]
    sys.modules['matcha.utils'] = package
    logger = types.ModuleType('matcha.utils.pylogger')
    logger.get_pylogger = logging.getLogger
    sys.modules['matcha.utils.pylogger'] = logger
    import numpy as np
    import onnxruntime as ort
    import soundfile as sf
    import torch
    import torchaudio
    import whisper
    from hyperpyyaml import load_hyperpyyaml
    from cosyvoice.cli.model import CosyVoiceModel
    from matcha.utils.audio import mel_spectrogram

    torch.set_num_threads(4)
    started = time.perf_counter()
    config = (MODEL / 'cosyvoice.yaml').read_text(encoding='utf-8').split('# processor functions')[0]
    config = load_hyperpyyaml(config)
    model = CosyVoiceModel(config['llm'], config['flow'], config['hift'])
    model.load(*(str(MODEL / f'{name}.pt') for name in ('llm', 'flow', 'hift')))
    if not args.fp32:
        model.llm = torch.ao.quantization.quantize_dynamic(model.llm, {torch.nn.Linear}, dtype=torch.qint8)
    for name in ('llm', 'flow', 'hift'):
        component = getattr(model, name)
        original = component.inference
        def timed(*a, _original=original, _name=name, **kw):
            start = time.perf_counter()
            print(json.dumps({'stage': _name, 'state': 'start'}), flush=True)
            result = _original(*a, **kw)
            print(json.dumps({'stage': _name, 'seconds': round(time.perf_counter()-start, 2)}), flush=True)
            return result
        component.inference = timed
    tokenizer = whisper.tokenizer.get_tokenizer(multilingual=True, num_languages=100, language='en', task='transcribe')

    def tokens(text):
        token = torch.tensor([tokenizer.encode(text, allowed_special='all')], dtype=torch.int32)
        return token, torch.tensor([token.shape[1]], dtype=torch.int32)

    reference = SOURCE / 'data/example.wav'
    signal, rate = sf.read(reference, dtype='float32', always_2d=True)
    speech = torch.from_numpy(signal.mean(axis=1)).unsqueeze(0)
    speech = torchaudio.functional.resample(speech, rate, 16000)
    option = ort.SessionOptions()
    option.intra_op_num_threads = 4
    with torch.inference_mode():
        session = ort.InferenceSession(str(MODEL / 'speech_tokenizer_v1.onnx'), sess_options=option, providers=['CPUExecutionProvider'])
        mel = whisper.log_mel_spectrogram(speech, n_mels=128)
        unit = session.run(None, {session.get_inputs()[0].name: mel.numpy(), session.get_inputs()[1].name: np.array([mel.shape[2]], dtype=np.int32)})[0]
        unit = torch.tensor(unit.reshape(1, -1), dtype=torch.int32)
        del session
        session = ort.InferenceSession(str(MODEL / 'campplus.onnx'), sess_options=option, providers=['CPUExecutionProvider'])
        feat = torchaudio.compliance.kaldi.fbank(speech, num_mel_bins=80, dither=0, sample_frequency=16000)
        feat -= feat.mean(dim=0, keepdim=True)
        embedding = torch.tensor(session.run(None, {session.get_inputs()[0].name: feat.unsqueeze(0).numpy()})[0].reshape(1, -1))
        del session
        feat = mel_spectrogram(torchaudio.functional.resample(speech, 16000, 22050), n_fft=1024, num_mels=80, sampling_rate=22050, hop_size=256, win_size=1024, fmin=0, fmax=8000, center=False).squeeze(0).transpose(0, 1).unsqueeze(0)
    prompt, prompt_len = tokens(PROMPT)
    common = dict(prompt_text=prompt, prompt_text_len=prompt_len,
                  llm_prompt_speech_token=unit, llm_prompt_speech_token_len=torch.tensor([unit.shape[1]], dtype=torch.int32),
                  flow_prompt_speech_token=unit[:, :150], flow_prompt_speech_token_len=torch.tensor([150], dtype=torch.int32),
                  prompt_speech_feat=feat[:, :258], prompt_speech_feat_len=torch.tensor([258], dtype=torch.int32),
                  llm_embedding=embedding, flow_embedding=embedding)
    print(json.dumps({'loaded_seconds': round(time.perf_counter()-started, 2), 'device': str(model.device)}), flush=True)
    cases = json.loads((ROOT / 'content/connected-speech.json').read_text(encoding='utf-8'))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest_path = OUTPUT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {'version': 1, 'engine': 'BreezyVoice', 'status': 'experimental', 'clips': {}}
    manifest['installation'] = json.loads((ROOT / 'data/breezy-install.json').read_text(encoding='utf-8'))
    manifest['reference_sha256'] = hashlib.sha256(reference.read_bytes()).hexdigest()
    manifest['flow_reference_seconds'] = 3
    for case in cases:
        if args.case and case['id'] != args.case:
            continue
        for variant in ('phrase', 'context'):
            key = f"{case['id']}-{variant}"
            text = case[variant]
            path = OUTPUT / f'{key}.wav'
            previous = manifest['clips'].get(key, {})
            if args.resume and previous.get('text') == text and path.exists() and hashlib.sha256(path.read_bytes()).hexdigest() == previous.get('sha256'):
                print(json.dumps({'clip': key, 'state': 'kept'}), flush=True)
                continue
            start = time.perf_counter()
            torch.manual_seed(1986)
            encoded, length = tokens(text)
            with torch.inference_mode():
                wave = model.inference(text=encoded, text_len=length, **common)['tts_speech'].numpy().reshape(-1)
            if not np.isfinite(wave).all() or len(wave) < 2205 or len(wave) > 22050*40 or np.max(np.abs(wave)) < .001:
                raise ValueError(f'Invalid audio: {key}')
            sf.write(path.with_suffix('.tmp'), wave, 22050, format='WAV', subtype='PCM_16')
            path.with_suffix('.tmp').replace(path)
            manifest['clips'][key] = {'text': text, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'seconds': round(len(wave)/22050, 3), 'render_seconds': round(time.perf_counter()-start, 2), 'status': 'experimental', 'llm_precision': 'fp32' if args.fp32 else 'dynamic-int8', 'flow_reference_seconds': 3}
            temp = manifest_path.with_suffix('.tmp')
            temp.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
            temp.replace(manifest_path)
            print(json.dumps({'clip': key, **manifest['clips'][key]}, ensure_ascii=True), flush=True)


if __name__ == '__main__':
    main()
