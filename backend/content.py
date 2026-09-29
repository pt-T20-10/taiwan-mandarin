"""Content packages contain canonical UTF-8 JSON and a SHA-256 manifest."""
import hashlib
import json
import re
from pathlib import Path
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

ROOT = Path(__file__).resolve().parents[1]

class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid')

class Text(Strict):
    hanzi: str = Field(min_length=1, max_length=2000)
    pinyin: str = Field(min_length=1, max_length=4000)
    vi: str = Field(min_length=1, max_length=4000)
    source: str = 'original-ai-draft'
    verification: Literal['draft','source-checked'] = 'draft'
    audio: str = 'Windows/browser zh-TW local; not yet auditioned'

class Word(Text):
    id: str
    note: str = ''
    source: str = 'original-ai-draft'
    verification: Literal['draft', 'source-checked'] = 'draft'

class Grammar(Text):
    id: str
    explanation: str
    title: str = ''
    pattern: str = ''
    restrictions: str = ''
    common_mistake: str = ''
    examples: list[Text] = []
    exercises: list['Exercise'] = []
    status: Literal['planned','ready'] = 'planned'
    group: str = 'Câu cơ bản'
    level: str = 'Nền tảng'
    prerequisites: list[str] = []
    references: list[dict[str,str]] = []

class Exercise(Strict):
    id: str
    kind: Literal['meaning', 'hanzi', 'pinyin', 'cloze', 'order', 'reading', 'listening', 'dictation', 'writing', 'speaking']
    prompt: str
    stimulus: Text | None = None
    answers: list[str] = Field(min_length=1)
    choices: list[str] = []
    tokens: list[str] = []
    explanation: str
    word_id: str | None = None
    grammar_id: str | None = None
    skill: Literal['vocabulary', 'grammar', 'reading', 'listening', 'writing', 'speaking', 'sound']
    source: str = 'original-ai-draft'
    verification: Literal['draft','source-checked'] = 'draft'

class Lesson(Strict):
    id: str
    title: str
    objective: str
    word_ids: list[str]
    grammar_ids: list[str]
    exercises: list[Exercise] = Field(min_length=1)
    legacy_exercise_ids: list[str] = []

class PracticeItem(Strict):
    id: str
    kind: Literal['choice','cloze-choice','cloze-input','dictation','read-aloud','respond','write']
    prompt: str = Field(min_length=1,max_length=2000)
    answers: list[str] = Field(min_length=1,max_length=10)
    choices: list[str] = Field(default=[],max_length=6)
    stimulus: Text | None = None
    explanation: str = Field(min_length=1,max_length=3000)
    evidence_index: int | None = Field(default=None,ge=0,le=7)

    @model_validator(mode='after')
    def check_answer(self):
        if any(not a.strip() or len(a)>3000 for a in self.answers):raise ValueError('Đáp án trống/quá dài')
        if self.kind in ('choice','cloze-choice'):
            if len(self.choices)<3 or len(set(self.choices))!=len(self.choices) or not set(self.answers)<=set(self.choices):raise ValueError('Lựa chọn không hợp lệ')
        elif self.choices:raise ValueError('Dạng tự trả lời không có lựa chọn')
        if self.kind.startswith('cloze') and self.prompt.count('___')!=1:raise ValueError('Cần đúng một chỗ trống')
        if self.kind in ('dictation','read-aloud','respond') and not self.stimulus:raise ValueError('Thiếu câu tham khảo')
        return self

class PracticeSet(Strict):
    id: str
    title: str
    skill: Literal['reading','listening','speaking','writing']
    source: Literal['authored','ai'] = 'authored'
    verification: Literal['draft'] = 'draft'
    reference: str = Field(min_length=1)
    passage: list[Text] = Field(min_length=8,max_length=8)
    items: list[PracticeItem]

    @model_validator(mode='after')
    def check_set(self):
        from collections import Counter
        expected={'reading':{'choice':6,'cloze-choice':2,'cloze-input':2},'listening':{'choice':6,'cloze-choice':2,'dictation':2},'speaking':{'read-aloud':4,'respond':4},'writing':{'write':2}}
        if Counter(q.kind for q in self.items)!=expected[self.skill]:raise ValueError('Sai số lượng/loại câu trong bộ')
        if len({q.id for q in self.items})!=len(self.items):raise ValueError('ID câu trùng')
        for q in self.items:
            if self.skill in ('reading','listening') and q.evidence_index is None:raise ValueError('Thiếu căn cứ câu trả lời')
        return self

class Unit(Strict):
    id: str
    title: str
    description: str
    words: list[Word]
    grammar: list[Grammar]
    dialogue: list[Text]
    writing_prompt: str
    character: str
    lessons: list[Lesson]
    practice_sets: list[PracticeSet] = []

class GrammarBatch(Strict):
    id: str
    title: str
    group: str
    objective: str
    prerequisites: list[str] = []
    source_levels: list[str]
    status: Literal['planned'] = 'planned'

def validate_dependencies(graph):
    visited,active=set(),set()
    def visit(node):
        if node not in graph:raise ValueError('Kiến thức tiên quyết không tồn tại')
        if node in active:raise ValueError('Kiến thức tiên quyết tạo vòng lặp')
        if node in visited:return
        active.add(node)
        for parent in graph[node]:visit(parent)
        active.remove(node);visited.add(node)
    for node in graph:visit(node)

class Content(Strict):
    id: Literal['foundation-tw']
    version: int = Field(ge=1)
    title: str
    license: str
    source_note: str
    units: list[Unit] = Field(min_length=1, max_length=100)
    grammar_roadmap: list[dict] = []
    grammar_batches: list[GrammarBatch] = []

    @model_validator(mode='after')
    def references(self):
        ids = set()
        all_grammar={g.id for u in self.units for g in u.grammar}
        validate_dependencies({g.id:g.prerequisites for u in self.units for g in u.grammar})
        batches={b.id:b for b in self.grammar_batches}
        if len(batches)!=len(self.grammar_batches):raise ValueError('ID lô ngữ pháp trùng')
        validate_dependencies({b.id:b.prerequisites for b in self.grammar_batches})
        if batches:
            references=set()
            for row in self.grammar_roadmap:
                if row['id'] in references:raise ValueError('ID danh mục ngữ pháp trùng')
                references.add(row['id'])
                batch=batches.get(row.get('batch_id'))
                if not batch or row.get('group')!=batch.group or row.get('status')!='planned':
                    raise ValueError('Liên kết lô ngữ pháp không hợp lệ')
            for batch in batches.values():
                rows=[r for r in self.grammar_roadmap if r['batch_id']==batch.id]
                if not 1<=len(rows)<=24 or set(batch.source_levels)!={r['tbcl_level'] for r in rows}:
                    raise ValueError('Lô ngữ pháp cần 1–24 mục và đúng cấp nguồn')
        for unit in self.units:
            if self.version>=7:
                if len(unit.dialogue)!=8 or len(unit.practice_sets)!=12:raise ValueError('Thiếu nội dung v7')
                for skill in ('reading','listening','speaking','writing'):
                    packets=[p for p in unit.practice_sets if p.skill==skill]
                    if len(packets)!=3 or len({tuple(s.hanzi for s in p.passage) for p in packets})!=3:raise ValueError('Bộ luyện thiếu/trùng')
                if any(len(l.exercises)!=10 or not set(l.legacy_exercise_ids)<={e.id for e in l.exercises} for l in unit.lessons):raise ValueError('Bài v7/ID kế thừa sai')
            words = {w.id for w in unit.words}
            grammars = {g.id for g in unit.grammar}
            entities = [unit, *unit.words, *unit.grammar, *unit.lessons]
            for packet in unit.practice_sets:
                entities.extend([packet,*packet.items])
            for grammar in unit.grammar:
                if grammar.status=='ready' and (len(grammar.examples)<3 or len(grammar.exercises)<4 or not grammar.pattern or not grammar.references):
                    raise ValueError('Ngữ pháp sẵn sàng phải đủ ví dụ, bài tập, cấu trúc và nguồn')
                if not set(grammar.prerequisites)<=all_grammar or grammar.id in grammar.prerequisites:
                    raise ValueError('Ngữ pháp tiên quyết không tồn tại')
                if grammar.status=='ready' and len({e.hanzi for e in grammar.examples})<3:
                    raise ValueError('Ngữ pháp sẵn sàng cần ít nhất ba ví dụ khác nhau')
                entities.extend(grammar.exercises)
                for exercise in grammar.exercises:
                    if exercise.grammar_id!=grammar.id:raise ValueError('Bài tập sai liên kết ngữ pháp')
                    if exercise.choices and not set(exercise.answers)<=set(exercise.choices):raise ValueError('Đáp án ngữ pháp không nằm trong lựa chọn')
                    if len(exercise.choices)!=len(set(exercise.choices)):raise ValueError('Lựa chọn ngữ pháp trùng')
                    if exercise.tokens:
                        normal=lambda s:re.sub(r'[\s，。！？、：；「」,.!?]','',s)
                        if sorted(''.join(exercise.tokens))!=sorted(normal(exercise.answers[0])):raise ValueError('Mảnh ghép ngữ pháp không khớp đáp án')
            for lesson in unit.lessons:
                if not set(lesson.word_ids) <= words or not set(lesson.grammar_ids) <= grammars:
                    raise ValueError('Tham chiếu bài học không tồn tại')
                entities.extend(lesson.exercises)
                for ex in lesson.exercises:
                    if ex.grammar_id and ex.grammar_id not in grammars:raise ValueError('Tham chiếu ngữ pháp không tồn tại')
                    if ex.word_id and ex.word_id not in words:
                        raise ValueError('Tham chiếu từ không tồn tại')
                    if ex.choices and not set(ex.answers) <= set(ex.choices):
                        raise ValueError('Đáp án không nằm trong lựa chọn')
                    if len(ex.choices) != len(set(ex.choices)):
                        raise ValueError('Lựa chọn trùng')
                    if ex.stimulus:
                        if ex.kind in ('meaning','listening') and ex.stimulus.vi not in ex.answers:
                            raise ValueError('Nghĩa stimulus không khớp đáp án')
                        if ex.kind in ('hanzi','dictation','speaking') and ex.stimulus.hanzi not in ex.answers:
                            raise ValueError('Hán tự stimulus không khớp đáp án')
                    if ex.kind=='pinyin' and ex.word_id:
                        word=next(w for w in unit.words if w.id==ex.word_id)
                        if word.pinyin not in ex.answers:raise ValueError('Pinyin bài tập không khớp từ')
                    if ex.tokens:
                        normal=lambda value:re.sub(r'[\s，。！？、：；「」,.!?]','',value)
                        if sorted(''.join(ex.tokens))!=sorted(normal(ex.answers[0])):
                            raise ValueError('Mảnh sắp xếp không khớp câu đáp án')
            for entity in entities:
                if not re.fullmatch(r'[a-z0-9][a-z0-9._:-]{0,199}',entity.id):
                    raise ValueError('ID nội dung không hợp lệ')
                if entity.id in ids:
                    raise ValueError(f'ID trùng: {entity.id}')
                ids.add(entity.id)
            for word in unit.words:
                if not re.search(r'[\u3400-\u9fff]',word.hanzi):raise ValueError('Mục từ thiếu Hán tự')
                if re.search(r'[\u3400-\u9fff0-9]',word.pinyin):raise ValueError('Pinyin xuất bản phải có chữ Latin/dấu, không dùng Hán tự/số thanh')
        return self

def canonical(payload):
    return json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')

def envelope(payload):
    raw = canonical(payload)
    return {'manifest': {'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw), 'schema': 1}, 'content': payload}

def validate_package(package):
    raw = canonical(package['content'])
    manifest = package['manifest']
    if manifest.get('schema') != 1 or manifest['sha256'] != hashlib.sha256(raw).hexdigest() or manifest['bytes'] != len(raw):
        raise ValueError('Hash/kích thước/schema gói không hợp lệ')
    return Content.model_validate(package['content']).model_dump()

def bundled():
    return json.loads((ROOT / 'content/foundation.pack.json').read_text(encoding='utf-8'))

if __name__ == '__main__':
    c = validate_package(bundled())
    print(json.dumps({'units': len(c['units']), 'lessons': sum(len(u['lessons']) for u in c['units']), 'words': sum(len(u['words']) for u in c['units']), 'grammar': sum(len(u['grammar']) for u in c['units']), 'exercises': sum(len(l['exercises']) for u in c['units'] for l in u['lessons'])}))
