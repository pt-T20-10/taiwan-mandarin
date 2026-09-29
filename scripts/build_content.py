import json
import re
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from content.seeds import UNITS, READING
from content.a2 import UNITS as A2_UNITS, READING as A2_READING
from content.grammar_details import enrich
from content.grammar_roadmap import organize
from content.practice import extend_unit
from backend.content import Content, envelope

def text(row):
    return dict(zip(('hanzi', 'pinyin', 'vi'), row[:3]))

def sentence_tokens(sentence, words):
    lexicon=sorted(set(words+['我們','什麼時候','什麼','名字','越南人','臺灣人','三點','九點','十二點','星期一','星期三','一杯','一碗','一個','一本','一點','一次','聽不懂']),key=len,reverse=True)
    remaining=re.sub(r'[，。！？、：；「」]', '', sentence)
    tokens=[]
    while remaining:
        token=next((w for w in lexicon if remaining.startswith(w)),remaining[0])
        tokens.append(token);remaining=remaining[len(token):]
    return tokens[1:]+tokens[:1]

def build(limit=None):
    roadmap,batches=organize(json.loads((ROOT/'content/grammar-roadmap.json').read_text(encoding='utf-8')))
    source_checks=json.loads((ROOT/'content/source_checks.json').read_text(encoding='utf-8'))['words']
    a2_audit={r['hanzi']:r for r in json.loads((ROOT/'docs/a2-vocabulary-audit.json').read_text(encoding='utf-8'))['words']}
    units = []
    for slug, title, description, character, rows, grammar_rows, dialogue_rows, writing in (UNITS+A2_UNITS)[:limit]:
        uid = 'tw.' + slug
        words = []
        for row in rows.splitlines():
            fields = row.split('|')
            word = text(fields)
            word['id'] = uid + '.w.' + '-'.join(f'{ord(c):x}' for c in fields[0])
            if fields[0] in source_checks:word.update(source_checks[fields[0]])
            if slug in {u[0] for u in A2_UNITS}:
                audit=a2_audit[fields[0]]
                word['source']=audit['url']
                word['note']=('Đã đối chiếu mục từ và Pinyin với TBCL; nghĩa Việt và cách dùng trong bài chưa giáo viên duyệt.' if audit['reading_matches'] else 'Đã tra TBCL nhưng chưa khớp mục từ/Pinyin tự động; còn là bản nháp cần đối chiếu thêm.')
                if fields[0]=='垃圾':word['note']+=' Cách đọc Đài Loan: lèsè.'
            words.append(word)
        grammar = [enrich(dict(id=f'{uid}.g.{i+1}', **text(r), explanation=r[3]),roadmap) for i, r in enumerate(grammar_rows)]
        dialogue = [text(r) for r in dialogue_rows]
        lessons = []
        def exercise(lid, suffix, kind, prompt, answers, explanation, stimulus=None, choices=None, word=None, skill='vocabulary'):
            return dict(id=f'{lid}.{suffix}', kind=kind, prompt=prompt, answers=answers, explanation=explanation, stimulus=stimulus, choices=choices or [], word_id=word, skill=skill)
        for index, name in enumerate(('Khám phá từ mới', 'Ghép ý thành câu', 'Nghe và đọc', 'Tự diễn đạt & ôn lại')):
            lid = f'{uid}.lesson.{index+1}'
            selected = words[index*5:index*5+5]
            exercises = []
            for j, w in enumerate(selected):
                if index == 0:
                    options = [w['vi']] + [words[(index*5+j+k)%len(words)]['vi'] for k in (3,7,11)]
                    options = options[j%4:] + options[:j%4]
                    exercises.append(exercise(lid, f'meaning{j}', 'meaning', 'Chọn nghĩa của từ này.', [w['vi']], 'Nghĩa của từ trong ngữ cảnh bài này: ' + w['vi'], text(tuple(w[k] for k in ('hanzi','pinyin','vi'))), options, w['id']))
                else:
                    exercises.append(exercise(lid, f'recall{j}', 'hanzi', 'Gõ Hán tự Phồn thể: ' + w['vi'], [w['hanzi']], 'Đáp án biên soạn: ' + w['hanzi'], {k:w[k] for k in ('hanzi','pinyin','vi')}, word=w['id'], skill='writing'))
            if index == 0:
                w=words[0]
                exercises.append(exercise(lid, 'pinyin', 'pinyin', 'Gõ Pinyin có dấu hoặc số thanh: '+w['hanzi'], [w['pinyin']], 'Cần giữ đúng thanh điệu; u khác ü.', word=w['id'], skill='sound'))
            if index == 1:
                for j,g in enumerate(grammar):
                    item=exercise(lid, f'translate{j}', 'order', 'Sắp xếp hoặc gõ câu theo nghĩa: '+g['vi'], [g['hanzi']], g['explanation'], text(tuple(g[k] for k in ('hanzi','pinyin','vi'))), skill='grammar')
                    item['tokens']=sentence_tokens(g['hanzi'],[w['hanzi'] for w in words])
                    item['grammar_id']=g['id']
                    exercises.append(item)
                exercises.append(exercise(lid, 'cloze', 'cloze', 'Điền từ còn thiếu: '+grammar[0]['hanzi'].replace(words[0]['hanzi'],'___') if words[0]['hanzi'] in grammar[0]['hanzi'] else 'Hoàn thành câu bằng cách gõ Hán tự: '+grammar[0]['vi'], [words[0]['hanzi']] if words[0]['hanzi'] in grammar[0]['hanzi'] else [grammar[0]['hanzi']], grammar[0]['explanation'], skill='grammar'))
            if index == 2:
                d=dialogue[0]
                exercises.append(exercise(lid, 'listen', 'listening', 'Nghe câu rồi chọn nghĩa phù hợp.', [d['vi']], 'Đối chiếu transcript sau khi nộp.', d, [dialogue[1]['vi'],d['vi'],dialogue[2]['vi']], skill='listening'))
                exercises.append(exercise(lid, 'dictate', 'dictation', 'Nghe và chép lại bằng Hán tự Phồn thể.', [d['hanzi']], 'Dấu câu không ảnh hưởng kết quả; chữ phải đúng.', d, skill='listening'))
                d=dialogue[1]
                exercises.append(exercise(lid, 'read', 'reading', 'Chọn nghĩa phù hợp với câu đọc.', [d['vi']], 'Thông tin nằm trong câu được hiển thị.', d, [dialogue[2]['vi'],dialogue[0]['vi'],d['vi']], skill='reading'))
                question,answer,alternatives,evidence={**READING,**A2_READING}[slug]
                paragraph={key:' '.join(d[key] for d in dialogue) for key in ('hanzi','pinyin','vi')}
                exercises.append(exercise(lid,'reading-detail','reading',question,[answer],evidence,paragraph,[alternatives[0],alternatives[1],answer,alternatives[2]],skill='reading'))
            if index == 3:
                d=dialogue[2]
                exercises.append(exercise(lid, 'say', 'speaking', 'Đọc câu, ghi âm và nghe lại. Không chấm điểm thanh điệu.', [d['hanzi']], 'Transcript chỉ giúp bạn phát hiện từ có thể nghe nhầm.', d, skill='speaking'))
                exercises.append(exercise(lid, 'write', 'writing', writing, [grammar[0]['hanzi']], 'Đáp án mẫu chỉ để tham khảo; bài mở không chấm đúng/sai tự động.', skill='writing'))
            lessons.append(dict(id=lid,title=name,objective=description,word_ids=[w['id'] for w in selected],grammar_ids=[g['id'] for g in grammar] if index==1 else [],exercises=exercises))
        units.append(dict(id=uid,title=title,description=description,words=words,grammar=grammar,dialogue=dialogue,writing_prompt=writing,character=character,lessons=lessons))
    for unit in units:extend_unit(unit)
    payload = Content.model_validate(dict(id='foundation-tw',version=7,title='Bước đầu đến Đài Loan',license='Original AI-assisted teaching text. TBCL catalog: reference labels and levels only; no textbook examples copied. Local assets carry separate licenses.',source_note='Nội dung do dự án biên soạn; chưa có giáo viên duyệt. Có ngân hàng luyện bốn kỹ năng; bài AI được tách điểm. Sáu chủ đề mới định hướng A2, không chứng nhận trình độ. Từ/câu dùng zh-TW; bảng Pinyin dùng bản thu riêng có nhãn nguồn.',units=units,grammar_roadmap=roadmap,grammar_batches=batches)).model_dump()
    (ROOT/'content/foundation.pack.json').write_text(json.dumps(envelope(payload),ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Built {len(units)} units; {sum(len(u["words"]) for u in units)} words')

if __name__=='__main__':
    build(1 if '--first' in sys.argv else None)
