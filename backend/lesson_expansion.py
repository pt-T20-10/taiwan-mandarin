"""Validate the authored supplemental lesson snapshot, without a schema migration."""
import json


def validate_run(data):
    packet = data.get('packet')
    if not isinstance(packet, dict) or packet.get('revision') != 1:
        raise ValueError('Bài vận dụng thiếu nội dung hoặc phiên bản')
    lesson_id = data.get('lesson_id', '')
    if not isinstance(lesson_id, str) or not lesson_id.startswith('expansion:v1:') or packet.get('id') != lesson_id or packet.get('unit_id') != data.get('unit_id'):
        raise ValueError('Sai liên kết bài vận dụng')
    if not isinstance(data.get('run'), str) or not data['run'] or not isinstance(data.get('created_at'), str):
        raise ValueError('Thiếu ID hoặc ngày tạo lượt học')
    questions = packet.get('questions')
    if not isinstance(questions, list) or not 3 <= len(questions) <= 12:
        raise ValueError('Bài vận dụng cần 3–12 câu')
    ids = []
    for q in questions:
        if not isinstance(q, dict) or q.get('kind') not in ('choice', 'input', 'listening', 'translate_vi', 'translate_zh'):
            raise ValueError('Loại câu vận dụng không hợp lệ')
        if not isinstance(q.get('id'), str) or not q['id'].startswith(lesson_id + ':q'):
            raise ValueError('Sai ID câu vận dụng')
        ids.append(q['id'])
        for key in ('prompt', 'explanation'):
            if not isinstance(q.get(key), str) or not q[key].strip():
                raise ValueError('Câu vận dụng thiếu đề hoặc giải thích')
        solution = q.get('solution')
        if not isinstance(solution, dict) or any(not isinstance(solution.get(k), str) or not solution[k].strip() for k in ('hanzi', 'pinyin', 'vi')):
            raise ValueError('Đáp án thiếu Hán tự/Pinyin/nghĩa')
        answers, choices = q.get('answers'), q.get('choices')
        if not isinstance(answers, list) or not answers or any(not isinstance(a, str) or not a for a in answers) or not isinstance(choices, list) or any(not isinstance(c, str) for c in choices):
            raise ValueError('Đáp án/lựa chọn không hợp lệ')
        if q['kind'] in ('choice', 'listening') and (len(set(choices)) < 2 or not set(answers).issubset(choices)):
            raise ValueError('Đáp án không có trong lựa chọn')
    if len(set(ids)) != len(ids):
        raise ValueError('Trùng ID câu vận dụng')
    index, phase, answers = data.get('index'), data.get('phase'), data.get('answers')
    if type(index) is not int or not 0 <= index <= len(questions) or phase not in ('intro', 'exercise', 'summary') or not isinstance(answers, list):
        raise ValueError('Tiến độ bài vận dụng không hợp lệ')
    if phase == 'intro' and (index != 0 or answers):
        raise ValueError('Bài giới thiệu chưa có đáp án')
    if phase == 'exercise' and index == len(questions):
        raise ValueError('Vị trí câu vượt bộ đề')
    if phase == 'summary' and (index != len(questions) or data.get('submitted')):
        raise ValueError('Bài vận dụng chưa hoàn thành')
    expected_count = index + (1 if phase == 'exercise' and data.get('submitted') else 0)
    if len(answers) != expected_count or any(not isinstance(a, dict) or a.get('id') != ids[i] for i, a in enumerate(answers)):
        raise ValueError('Đáp án không khớp thứ tự bộ đề')
    if not isinstance(data.get('draft'), str) or len(data['draft']) > 5000 or len(json.dumps(data)) > 150_000:
        raise ValueError('Bản nháp hoặc bài vận dụng quá lớn')
