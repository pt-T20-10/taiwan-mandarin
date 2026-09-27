"""Grammar enrichment keyed by stable ID, independent of unit ordering."""
import copy,json
from pathlib import Path
from . import a2
FOUNDATION=json.loads(Path(__file__).with_name('grammar_foundation.json').read_text(encoding='utf-8'))

def enrich(grammar,roadmap):
    if grammar['id'] in FOUNDATION:
        return copy.deepcopy(FOUNDATION[grammar['id']])
    return a2.enrich(grammar,roadmap)
