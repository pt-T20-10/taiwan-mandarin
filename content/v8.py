"""Replace terminology quizzes with practical meaning/context questions, archive IDs."""
import copy

def upgrade(units):
 retired=[]
 grammar={g['id']:g for u in units for g in u['grammar']}
 all_examples=[e for g in grammar.values() for e in g['examples']]
 for unit in units:
  collections=[g['exercises'] for g in unit['grammar']]+[l['exercises'] for l in unit['lessons']]
  for exercises in collections:
   for ex in exercises:
    if 'minh họa cấu trúc nào' not in ex['prompt']:continue
    g=grammar[ex['grammar_id']];example=g['examples'][0]
    retired.append(copy.deepcopy(ex))
    alternatives=list(dict.fromkeys(e['vi'] for e in all_examples if e['vi']!=example['vi']))[:3]
    ex.update(id=ex['id']+'.v8',kind='meaning',prompt='Câu này muốn nói điều gì?',stimulus=copy.deepcopy(example),answers=[example['vi']],choices=[example['vi'],*alternatives],explanation=f"{example['hanzi']} ({example['pinyin']}) — {example['vi']}",tokens=[])
 return retired
