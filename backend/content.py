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

class Content(Strict):
    id: Literal['foundation-tw']
    version: int = Field(ge=1)
    title: str
    license: str
    source_note: str
    units: list[Unit] = Field(min_length=1, max_length=100)

    @model_validator(mode='after')
    def references(self):
        ids = set()
        for unit in self.units:
            words = {w.id for w in unit.words}
            grammars = {g.id for g in unit.grammar}
            entities = [unit, *unit.words, *unit.grammar, *unit.lessons]
            for lesson in unit.lessons:
                if not set(lesson.word_ids) <= words or not set(lesson.grammar_ids) <= grammars:
                    raise ValueError('Tham chiếu bài học không tồn tại')
                entities.extend(lesson.exercises)
                for ex in lesson.exercises:
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
