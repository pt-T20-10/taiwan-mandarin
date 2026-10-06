"""Serve only complete, integrity-checked local experimental recordings."""
import hashlib
import json
from .content import ROOT
from . import db


def catalog():
    folder = db.DATA / 'connected-speech'
    try:
        manifest = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
        cases = json.loads((ROOT / 'content/connected-speech.json').read_text(encoding='utf-8'))
        if manifest.get('version') != 1 or manifest.get('engine') != 'BreezyVoice':
            return {}
        clips = {}
        for case in cases:
            for variant in ('phrase', 'context'):
                key = f"{case['id']}-{variant}"
                entry = manifest.get('clips', {}).get(key, {})
                path = folder / f'{key}.wav'
                if entry.get('text') != case[variant] or not path.is_file():
                    continue
                if hashlib.sha256(path.read_bytes()).hexdigest() != entry.get('sha256'):
                    continue
                clips[key] = {'url': f'/api/pronunciation/audio/{key}', 'sha256': entry['sha256'], 'status': 'experimental'}
        return clips
    except (OSError, ValueError, TypeError, KeyError):
        return {}


def clip_path(key):
    if key not in catalog():
        return None
    return db.DATA / 'connected-speech' / f'{key}.wav'
