"""Build an offline, recursive IDS lookup from the already pinned AnimCJK cache.

Dictionary data: AnimCJK ec5e17cca76c87587790bcbce5ea0b4d4fb753d6, LGPL-3.0.
Keep project-corrected character IDS in preference to upstream dictionary rows.
This describes visible components, not etymology or semantic roles.
"""
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OPS = {chr(c): (3 if c in (0x2ff2, 0x2ff3) else 2) for c in range(0x2ff0, 0x2ffc)}


def leaves(value):
    pending = 1
    result = []
    for char in value:
        if pending == 0:
            return None
        pending -= 1
        if char in OPS:
            pending += OPS[char]
        else:
            result.append(char)
    return result if pending == 0 and all(c != '？' for c in result) else None


def main():
    stops = {unicodedata.normalize('NFKC', chr(c)) for c in range(0x2f00, 0x2fd6)}
    stops.update('亻𠆢忄扌氵氺灬糹釒飠⻎辶艹艸刂阝⻖⻏礻衤⺮𥫗犭牜⺈爫罒耂⺗⺌⺍')
    rows = {}
    for name in ('dictionaryZhHans.txt', 'dictionaryZhHant.txt'):
        for line in (ROOT / 'data/learning-source' / name).read_text(encoding='utf-8').splitlines():
            row = json.loads(line)
            rows[row['character']] = row.get('decomposition', '')
    index = json.loads((ROOT / 'public/learning/characters/index.json').read_text(encoding='utf-8'))
    rows.update({char: row['decomposition'] for char, row in index.items()})
    result = {}
    visited = set()

    def visit(char):
        if char in visited or char in stops:
            return
        visited.add(char)
        value = rows.get(char, '')
        parts = leaves(value)
        if not parts or parts == [char] or char in parts:
            return
        result[char] = value
        for part in parts:
            visit(part)

    for char in index:
        visit(char)
    output = {'source': 'AnimCJK ec5e17cca76c87587790bcbce5ea0b4d4fb753d6 + project IDS corrections',
              'license': 'LGPL-3.0; see public/learning/licenses/animcjk/LGPL.txt',
              'terminals': ''.join(sorted(stops)), 'decompositions': dict(sorted(result.items()))}
    (ROOT / 'src/core/character-components.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Packaged {len(result)} recursive component structures.')


if __name__ == '__main__':
    main()
