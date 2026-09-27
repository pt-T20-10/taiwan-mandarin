"""Build the visual Pinyin grid without audio files or network requests."""
import json
from setup_learning_assets import ROOT,OUT,dump
def main():
    rows=json.loads((ROOT/'content/pinyin_syllables.json').read_text(encoding='utf-8'))
    assert len(rows)==406 and len({r['base'] for r in rows})==406
    assert all(set(r)=={'base','initial','final'} for r in rows)
    dump(OUT/'pinyin/catalog.json',rows)
    print('Visual Pinyin syllables:',len(rows))
if __name__=='__main__':main()
