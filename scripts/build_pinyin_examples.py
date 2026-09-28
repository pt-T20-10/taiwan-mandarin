"""Build independent Hanzi listening examples from cached official TBCL headwords.

No definitions, sentences, audio, curriculum, or inferred readings are imported.
Run with --refresh-source only to explicitly fetch the reference text.
"""
import hashlib
import html
import json
import re
import sys
import unicodedata
from functools import lru_cache
from urllib.parse import quote
from setup_learning_assets import ROOT, CACHE, OUT, dump, fetch

URL = 'https://bcoct.naer.edu.tw/standsys/querycorevocab.php?q=&num=10000&page=1&deng_ji=all'
SOURCE = CACHE/'vocabulary/pinyin-all.html'
MARKS = dict(zip('āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ', [(v, t) for v in 'aoeiuü' for t in range(1, 5)]))

def marked(base, tone):
    if not tone: return base
    i = base.index('a') if 'a' in base else base.index('e') if 'e' in base else base.index('o') if 'ou' in base else max(i for i,c in enumerate(base) if c in 'aoeiuü')
    return base[:i] + next(c for c, pair in MARKS.items() if pair == (base[i], tone)) + base[i+1:]

def main():
    if '--refresh-source' in sys.argv:
        fetch(URL, 'vocabulary/pinyin-all.html')
    catalog = json.loads((OUT/'pinyin/catalog.json').read_text(encoding='utf-8'))
    tokens = {marked(s['base'], t): (s['base'], t) for s in catalog for t in range(5)}
    @lru_cache(None)
    def split(value, count):
        if count == 0: return [()] if not value else []
        result = []
        for size in range(1, min(6, len(value))+1):
            token = value[:size]
            if token in tokens:
                result.extend((token,)+tail for tail in split(value[size:], count-1))
        return result
    clean = lambda s: html.unescape(re.sub('<[^>]+>', '', s)).strip()
    candidates = []
    # Low-level core vocabulary, ordered by official level then source row.
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', SOURCE.read_text(encoding='utf-8'), re.S):
        cells = [clean(s) for s in re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)]
        if len(cells) < 6: continue
        names, readings = cells[1].split('/'), cells[4].split('/')
        if len(names) != len(readings): continue
        for hanzi, reading in zip(names, readings):
            hanzi = hanzi.strip()
            if not re.fullmatch(r'[\u4e00-\u9fff]{1,2}', hanzi): continue
            reading = unicodedata.normalize('NFC', reading.strip().lower())
            parts = split(re.sub(r"[\s'’\-]", '', reading), len(hanzi))
            if len(parts) != 1: continue  # Never guess ambiguous syllable boundaries.
            candidates.append((hanzi, reading, parts[0], cells[0], cells[2]))
    single_readings = {}
    for hanzi, _, parts, _, _ in candidates:
        if len(hanzi) == 1: single_readings.setdefault(hanzi, set()).add(parts[0])
    examples = {}
    for hanzi, reading, parts, row, level in sorted(candidates, key=lambda c: len(c[0])):
        # Polyphonic single headwords and bare neutral syllables need context.
        if len(hanzi) == 1 and (len(single_readings[hanzi]) != 1 or tokens[parts[0]][1] == 0): continue
        for index, token in enumerate(parts):
            base, tone = tokens[token]
            key = f'{base}:{tone}'
            if key in examples: continue
            examples[key] = dict(base=base, tone=tone, hanzi=hanzi, pinyin=' '.join(parts),
                target_index=index, kind='character' if len(hanzi)==1 else 'phrase',
                source=dict(name='TBCL / NAER — từ vựng cốt lõi', url='https://bcoct.naer.edu.tw/standsys/querycorevocab.php?q='+quote(hanzi)+'&num=50&page=1&deng_ji=all', row=row, level=level, reading=reading),
                dictionary_status='verified', listening_status='not-reviewed')
    # Validate all mappings together, including every uncovered catalogue key.
    keys = [f'{s["base"]}:{t}' for s in catalog for t in range(5)]
    for key, e in examples.items():
        assert key in keys and e['source']['url'].startswith('https://bcoct.naer.edu.tw/')
        assert e['pinyin'].split()[e['target_index']] == marked(e['base'], e['tone'])
        assert len(e['pinyin'].split()) == len(e['hanzi'])
        assert e['tone'] != 0 or e['kind'] == 'phrase'
        assert e['dictionary_status'] == 'verified' and e['listening_status'] == 'not-reviewed'
    coverage = dict(combinations=len(keys), mapped=len(examples), dictionary_verified=len(examples),
        dictionary_unverified=0, listening_unverified=len(examples), unavailable=len(keys)-len(examples),
        by_tone={str(t):sum(e['tone']==t for e in examples.values()) for t in range(5)})
    dump(OUT/'pinyin/examples.json', dict(schema=1, examples=examples, coverage=coverage))
    sources = json.loads((OUT/'sources.json').read_text(encoding='utf-8'))
    sources['pinyin_mode'] = 'hanzi-tts-examples; visual-only spelling'
    sources['pinyin_examples'] = dict(url=URL, sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(), date='2026-09-28', asset='pinyin/examples.json')
    dump(OUT/'sources.json', sources)
    dump(ROOT/'docs/pinyin-coverage.json', dict(date='2026-09-28', **coverage,
        reference_url=URL, reference_sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        selection='Unambiguous segmentation of one/two-character TBCL core headwords; prefer single-reading standalone entries, then short phrases, in source level order. Dictionary match is not human TTS review.',
        unavailable_reason='No reviewed example selected from this bounded source; not a claim of linguistic impossibility.',
        unavailable_keys=[key for key in keys if key not in examples]))
    print(json.dumps(coverage))

if __name__ == '__main__': main()
