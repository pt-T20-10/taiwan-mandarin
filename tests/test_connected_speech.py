import hashlib
import json
from fastapi.testclient import TestClient
from backend import db, connected_speech
from backend.app import app


def test_catalog_only_serves_fixed_integrity_checked_clips(tmp_path, monkeypatch):
    monkeypatch.setattr(db, 'DATA', tmp_path)
    client = TestClient(app)
    assert client.get('/api/pronunciation/audio').json()['clips'] == {}
    folder = tmp_path / 'connected-speech'
    folder.mkdir()
    key = 'third-third-context'
    # Route integrity test only, not a listening-quality fixture.
    raw = b'RIFF-test-audio'
    (folder / f'{key}.wav').write_bytes(raw)
    text = json.loads((connected_speech.ROOT / 'content/connected-speech.json').read_text(encoding='utf-8'))[0]['context']
    entry = {'text': text, 'sha256': hashlib.sha256(raw).hexdigest()}
    manifest = {'version': 1, 'engine': 'BreezyVoice', 'clips': {key: entry, 'unknown': entry}}
    path = folder / 'manifest.json'
    path.write_text(json.dumps(manifest), encoding='utf-8')
    response = client.get('/api/pronunciation/audio').json()
    assert set(response['clips']) == {key}
    assert response['clips'][key]['status'] == 'experimental'
    assert client.get(response['clips'][key]['url']).content == raw
    assert client.get('/api/pronunciation/audio/unknown').status_code == 404
    (folder / f'{key}.wav').write_bytes(b'corrupted')
    assert client.get('/api/pronunciation/audio').json()['clips'] == {}
    assert client.get(response['clips'][key]['url']).status_code == 404
    path.write_text('{broken', encoding='utf-8')
    assert client.get('/api/pronunciation/audio').json()['clips'] == {}


def test_render_inputs_preserve_hanzi_and_case_coverage():
    import re
    cases = json.loads((connected_speech.ROOT / 'content/connected-speech.json').read_text(encoding='utf-8'))
    source = (connected_speech.ROOT / 'src/core/pronunciation.ts').read_text(encoding='utf-8')
    assert len(cases) == len({c['id'] for c in cases}) == 11
    for case in cases:
        row = next(line for line in source.splitlines() if "{id:'"+case['id']+"',title:" in line)
        for variant, field in [('phrase','hanzi'),('context','context')]:
            expected = re.search(field+r":'([^']+)'", row)[1]
            actual = re.sub(r'\[:[^\]]+\]', '', case[variant])
            assert actual.rstrip('。') == expected.rstrip('。')
