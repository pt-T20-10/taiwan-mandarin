"""Build annotated practice packets from original, reviewable scenario fields."""
from copy import deepcopy
from .practice_scenarios import SCENARIOS
from .practice_dialogues import TAILS

def text(value):
    h,p,v=value.split('|');return dict(hanzi=h,pinyin=p,vi=v)

def wrap(value, h, p, v):
    t=text(value);return dict(hanzi=h.format(t['hanzi']),pinyin=p.format(t['pinyin']),vi=v.format(t['vi']))

PEOPLE=['小安|Xiǎo Ān|Tiểu An','美玲|Měilíng|Mỹ Linh','志明|Zhìmíng|Chí Minh']
TIMES=['星期一上午九點|xīngqí yī shàngwǔ jiǔ diǎn|chín giờ sáng thứ hai','星期三下午兩點|xīngqí sān xiàwǔ liǎng diǎn|hai giờ chiều thứ tư','星期六上午十點|xīngqí liù shàngwǔ shí diǎn|mười giờ sáng thứ bảy']
MATES=['同學|tóngxué|bạn học','朋友|péngyou|bạn','姐姐|jiějie|chị gái']

def build_packets(unit):
    slug=unit['id'].removeprefix('tw.');scenarios=SCENARIOS[slug];packets=[]
    for n,(place,action,needed,after) in enumerate(scenarios):
        fields=[PEOPLE[n],TIMES[n],MATES[n],place,action,needed,after]
        passage=[wrap(PEOPLE[n],'我是{}。','Wǒ shì {}.','Tôi là {}.'),
            wrap(TIMES[n],'我們{}出發。','Wǒmen {} chūfā.','Chúng tôi xuất phát lúc {}.'),
            wrap(MATES[n],'我和{}一起去。','Wǒ hé {} yīqǐ qù.','Tôi đi cùng {}.'),
            wrap(place,'我們要去{}。','Wǒmen yào qù {}.','Chúng tôi sẽ đến {}.'),
            wrap(action,'我打算{}。','Wǒ dǎsuàn {}.','Tôi dự định {}.'),
            wrap(needed,'我需要帶{}。','Wǒ xūyào dài {}.','Tôi cần mang theo {}.'),
            wrap(after,'到了以後，我會先{}。','Dào le yǐhòu, wǒ huì xiān {}.','Sau khi đến, trước tiên tôi sẽ {}.'),
            text('如果時間不夠，我會改天再去。|Rúguǒ shíjiān bù gòu, wǒ huì gǎitiān zài qù.|Nếu không đủ thời gian, tôi sẽ đổi sang hôm khác.')]
        for skill in ('reading','listening','speaking','writing'):
            bid=f'{unit["id"]}.practice.{skill}.{n+1}'
            items=[]
            def add(kind,prompt,answers,choices=None,stimulus=None,evidence=None):
                items.append(dict(id=f'{bid}.q{len(items)+1}',kind=kind,prompt=prompt,answers=answers,choices=choices or [],stimulus=stimulus,
                    explanation=('Căn cứ trong đoạn: '+passage[evidence]['hanzi']+' — '+passage[evidence]['vi']) if evidence is not None else 'Câu tham khảo theo ngữ cảnh; có thể diễn đạt khác.',evidence_index=evidence))
            if skill in ('reading','listening'):
                for field,prompt in [(1,'Họ xuất phát lúc nào?'),(2,'Người kể đi cùng ai?'),(3,'Họ định đến đâu?'),(4,'Mục đích chính của chuyến đi là gì?'),(5,'Người kể cần mang theo gì?')]:
                    pool=TIMES if field==1 else MATES if field==2 else [s[field-3] for s in scenarios]
                    choices=list(dict.fromkeys(text(s)['vi'] for s in pool))
                    # Some destinations recur in a theme; add a distinct, explicit distractor.
                    for extra in ['Không được đề cập trong đoạn.','Đi một mình.' if field==2 else 'Ở nhà cả ngày.']:
                        if len(choices)<3 and extra not in choices:choices.append(extra)
                    add('choice',prompt,[text(fields[field])['vi']],choices,evidence=field)
                add('choice','Sau khi đến nơi, người kể sẽ làm gì trước?', [text(after)['vi']],[text(s[3])['vi'] for s in scenarios],evidence=6)
                for field,prefix in [(3,'我們要去'),(5,'我需要帶')]:
                    pool=list(dict.fromkeys(text(s[field-3])['hanzi'] for s in scenarios))
                    for extra in ['學校','雨傘','車站']:
                        if len(pool)<3 and extra not in pool:pool.append(extra)
                    add('cloze-choice',f'Chọn từ/cụm phù hợp ({text(fields[field])["vi"]}): {prefix}___。',[text(fields[field])['hanzi']],pool,evidence=field)
                if skill=='reading':
                    add('cloze-input',f'Điền từ/cụm chỉ người đi cùng ({text(MATES[n])["vi"]}): 我和___一起去。',[text(MATES[n])['hanzi']],evidence=2)
                    add('cloze-input','Điền từ chỉ việc xuất phát: 我們'+text(TIMES[n])['hanzi']+'___。',['出發'],evidence=1)
                else:
                    for field in (2,4):add('dictation','Nghe rồi gõ lại câu bằng Hán tự.',[passage[field]['hanzi']],stimulus=passage[field],evidence=field)
            elif skill=='speaking':
                for field in (3,4,5,6):add('read-aloud','Đọc câu mẫu, ghi âm và nghe lại.',[passage[field]['hanzi']],stimulus=passage[field])
                for field,prompt in [(3,'Nói bạn định đến đâu trong tình huống này.'),(4,'Nói mục đích chuyến đi.'),(5,'Nói bạn cần mang theo gì.'),(6,'Nói bạn sẽ làm gì khi đến nơi.')]:
                    add('respond',prompt+' Thông tin tình huống: '+passage[field]['vi'],[passage[field]['hanzi']],stimulus=passage[field])
            else:
                add('write',f'Viết một câu nói bạn sẽ đến {text(place)["vi"]} và dự định {text(action)["vi"]}.',[passage[3]['hanzi']+passage[4]['hanzi']])
                add('write',f'Viết đoạn 3–5 câu về kế hoạch {text(action)["vi"]}: thời gian, người đi cùng, nơi đến, thứ cần mang và việc làm khi đến.', [''.join(passage[i]['hanzi'] for i in (1,2,3,5,6))])
            packets.append(dict(id=bid,title=f'{unit["title"]} · tình huống {n+1}',skill=skill,source='authored',verification='draft',
                reference='Nội dung gốc của dự án; content/practice_scenarios.py. Chưa giáo viên duyệt.',passage=deepcopy(passage),items=items))
    return packets

def extend_unit(unit):
    unit['practice_sets']=build_packets(unit)
    # Keep the original turns, then continue that same conversation.
    unit['dialogue'].extend(text(s) for s in TAILS[unit['id'].removeprefix('tw.')])
    assert len(unit['dialogue'])==8
    for index,lesson in enumerate(unit['lessons']):
        lesson['legacy_exercise_ids']=[e['id'] for e in lesson['exercises']]
        if index==0:
            candidates=[dict(kind='meaning',prompt='Chọn nghĩa của từ trong chủ đề.',stimulus={k:w[k] for k in ('hanzi','pinyin','vi')},answers=[w['vi']],choices=[w['vi']]+[v['vi'] for v in unit['words'] if v['vi']!=w['vi']][:2],word_id=w['id'],skill='vocabulary') for w in unit['words'][5:9]]
        else:
            packet=next(p for p in unit['practice_sets'] if p['skill']==('reading' if index<3 else 'speaking'))
            picked=packet['items'][6:8] if index==1 else packet['items'][0:1] if index==2 else packet['items'][:3]
            candidates=[]
            for q in picked:
                stimulus=q['stimulus']
                if index==2:stimulus={k:' '.join(s[k] for s in packet['passage']) for k in ('hanzi','pinyin','vi')}
                candidates.append(dict(kind='cloze' if index==1 else 'reading' if index==2 else 'speaking',prompt=q['prompt'],answers=q['answers'],choices=q['choices'],stimulus=stimulus,skill='grammar' if index==1 else 'reading' if index==2 else 'speaking',explanation=q['explanation']))
        for extra in candidates:
            if len(lesson['exercises'])>=10:break
            lesson['exercises'].append(dict(id=f'{lesson["id"]}.v7.extra{len(lesson["exercises"])+1}',explanation='Đối chiếu với từ/câu đã học.',tokens=[],grammar_id=None,word_id=None) | extra)
        assert len(lesson['exercises'])==10
