"""Optional Kokoro comparison voices; CPU, local files, no network or fallback."""
import asyncio
import subprocess
import tempfile
from pathlib import Path
from .content import ROOT

VOICES = {
    'neural:kokoro-zf001': (3, 'Kokoro · nữ 001'),
    'neural:kokoro-zf002': (4, 'Kokoro · nữ 002'),
    'neural:kokoro-zm009': (58, 'Kokoro · nam 009'),
}

def paths():
    return ROOT/'runtime/sherpa-tts/bin/sherpa-onnx-offline-tts.exe', ROOT/'models/kokoro-v1.1-zh'

def available():
    exe, model = paths()
    return exe.is_file() and all((model/name).exists() for name in (
        'model.onnx', 'voices.bin', 'tokens.txt', 'lexicon-zh.txt', 'lexicon-us-en.txt',
        'espeak-ng-data', 'number-zh.fst', 'date-zh.fst'))

def voices():
    return [{'id': key, 'label': label, 'accent': 'Quan thoại phổ thông · chưa xác minh giọng Đài Loan'}
            for key, (_, label) in VOICES.items()] if available() else []

async def synthesize(text, voice, rate):
    if voice not in VOICES:
        raise ValueError('Giọng neural không hợp lệ. Hãy chọn lại giọng đọc.')
    if not available():
        raise RuntimeError('Chưa cài đủ Kokoro offline. Chọn giọng Windows hoặc cài lại bộ giọng neural.')
    if not text.strip():
        raise ValueError('Hãy nhập câu để nghe.')
    exe, model = paths()
    with tempfile.TemporaryDirectory(prefix='mandarin-kokoro-') as temp:
        output = Path(temp)/'speech.wav'
        args = [str(exe), f'--kokoro-model={model / "model.onnx"}',
                f'--kokoro-voices={model / "voices.bin"}', f'--kokoro-tokens={model / "tokens.txt"}',
                f'--kokoro-data-dir={model / "espeak-ng-data"}',
                '--kokoro-lexicon='+','.join(str(model/n) for n in ('lexicon-zh.txt','lexicon-us-en.txt')),
                '--tts-rule-fsts='+','.join(str(model/n) for n in ('number-zh.fst','date-zh.fst')),
                '--num-threads=4', '--tts-max-num-sentences=1', '--tts-silence-scale=0.2',
                f'--sid={VOICES[voice][0]}', f'--speed={ {-2:0.85, -1:0.92, 0:1, 1:1.1}[rate]}',
                '--print-args=false', f'--output-filename={output}', '--', text]
        proc = await asyncio.create_subprocess_exec(*args, cwd=exe.parent,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
            creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        try:
            _, err = await asyncio.wait_for(proc.communicate(), timeout=90)
        except BaseException as exc:
            if proc.returncode is None:
                proc.kill()
                await proc.wait()
            if isinstance(exc, TimeoutError):
                raise RuntimeError('Tạo giọng neural quá thời gian. Hãy thử câu ngắn hơn.') from exc
            raise
        if proc.returncode or not output.exists():
            raise RuntimeError('Kokoro không tạo được audio. Hãy thử câu ngắn hơn hoặc chọn giọng khác.')
        if b'Ignore OOV' in err:
            raise RuntimeError('Câu có chữ giọng neural chưa đọc được; hãy chọn giọng Windows để đối chiếu.')
        result = output.read_bytes()
        if len(result) < 100 or result[:4] != b'RIFF' or result[8:12] != b'WAVE':
            raise RuntimeError('Giọng neural trả audio trống hoặc không hợp lệ.')
        return result
