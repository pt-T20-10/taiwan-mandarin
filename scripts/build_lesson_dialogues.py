"""Compile authored lesson conversations. Keep foundation v8 IDs/history intact."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def build():
    content = json.loads((ROOT / 'content/foundation.pack.json').read_text(encoding='utf-8'))['content']
    lessons = {l['id']: (u, l) for u in content['units'] for l in u['lessons']}
    dialogues = {}
    key = None
    for line in (ROOT / 'content/lesson-dialogues.tsv').read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):
            continue
        if line.startswith('@'):
            topic, number = line[1:].split('.')
            key = f'tw.{topic}.lesson.{number}'
            assert key not in dialogues, key
            dialogues[key] = []
        else:
            h, p, v = line.split('|')
            assert key and h and p and v
            dialogues[key].append(dict(hanzi=h, pinyin=p, vi=v, speaker='Người A' if len(dialogues[key]) % 2 == 0 else 'Người B'))
    assert set(dialogues) == set(lessons), 'Every lesson needs its own dialogue'
    for key, passage in dialogues.items():
        unit, lesson = lessons[key]
        assert len(passage) >= 4
        for word in unit['words']:
            if word['id'] in lesson['word_ids']:
                assert any(word['hanzi'] in s['hanzi'] for s in passage), (key, word['hanzi'])
    (ROOT / 'src/core/lesson-dialogues.json').write_text(json.dumps(dialogues, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(dialogues)} lesson conversations; all focus words covered.')

if __name__ == '__main__':
    build()
