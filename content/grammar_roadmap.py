"""Editorial work batches, separate from TBCL levels and learner achievement.

Numbers refer to the pinned 496-row source catalog. Topic assignments are an
authored planning aid, not an official TBCL/CEFR equivalence or coverage claim.
"""
GROUPS = ['Câu cơ bản', 'Thời–thể và bổ ngữ', 'So sánh và câu phức', 'Lập luận, sắc thái và văn viết']
TOPICS = [
 ('sentence', 0, 'Câu và cụm danh từ', 'Giới thiệu, miêu tả và nối các cụm danh từ đúng ngữ cảnh.', '',
  '1-4 16 18-19 32 38 40 46 62 68 75 78 84 97 102 105 107 113-116 144-146 149-151 154 159 204 217 222 240'),
 ('questions', 0, 'Hỏi thông tin và yêu cầu', 'Hỏi, xác nhận và nhờ giúp; phân biệt câu hỏi thật với phản vấn.', 'sentence',
  '5-7 13-15 44 48 50 54 56 58 65 67 69-71 103 117 156-157 160 163-165 187 226-228 241 265 296'),
 ('quantity', 0, 'Số lượng và lượng từ', 'Diễn đạt lượng, số gần đúng, tỉ lệ và phạm vi.', 'sentence',
  '11-12 22 55 61 66 88 106 158 188 230-231 234-239 276 295 297'),
 ('place', 0, 'Vị trí, phương tiện và giới từ', 'Xác định nơi chốn, lộ trình, người cùng làm và phương tiện.', 'sentence',
  '8-9 41-42 51 63 73-74 79 85 100-101 120 147 207 256-257 267-273 290 310-312 322-323 347 351-352'),
 ('modal', 0, 'Ý muốn, khả năng và cho phép', 'Phân biệt kỹ năng, khả năng theo hoàn cảnh, ý định và nghĩa vụ.', 'sentence',
  '20 24-26 29 33-35 39 49 98 119 155 166-168 176 179 218 242-246 250 259 309 327 360'),
 ('aspect', 1, 'Thời gian, thể và lặp lại', 'Kể trình tự sự việc; phân biệt hoàn tất, trải nghiệm, tiếp diễn và lặp lại.', 'sentence',
  '10 17 21 27 30-31 43 47 53 59 64 90-91 99 108-109 111-112 118 130-137 143 148 152-153 172-175 205-206 221 223 225 274-275 277-278 280-281 314 317-318 354-357 359 361 376'),
 ('complement', 1, 'Kết quả, hướng và bổ ngữ khả năng', 'Nói kết quả đạt được, hướng chuyển động và khả năng thực hiện.', 'aspect',
  '37 52 57 60 72 76 86 89 92-93 104 110 138-141 169-171 184-186 202-203 208-216 247 249 282 315-316 371-372'),
 ('disposal', 1, 'Xử lý đối tượng và bị động', 'Dùng 把/被 với kết quả và đối tượng đã xác định.', 'complement',
  '36 193-199 298-303 378'),
 ('comparison', 2, 'So sánh và mức độ', 'So sánh, diễn đạt thay đổi và mức độ có căn cứ.', 'sentence',
  '80 83 87 94-95 123 127-129 181-182 189-192 251-254 313 319-321 353 405-407 437'),
 ('clauses', 2, 'Điều kiện, nguyên nhân và nhượng bộ', 'Nối ý theo quan hệ nguyên nhân, điều kiện, đối lập và lựa chọn.', 'aspect',
  '23 28 45 77 81-82 96 121-122 124-126 132-133 137 142 161-162 177-178 180 183 201 219-220 224 232-233 255 258 260-263 266 279 283-287 324-326 328-337 358 362-365 377 403 408-413 420-422 430-435 449 477-484 489-494'),
 ('discourse', 3, 'Sắc thái, lập luận và liên kết ý', 'Đánh giá, dẫn chứng, nhấn mạnh và tổ chức lập luận trong ngữ cảnh.', 'clauses', ''),
 ('formal', 3, 'Văn viết và diễn đạt học thuật', 'Chuyển từ lời nói sang email, tóm tắt và đoạn văn có liên kết.', 'discourse',
  '391-402 404 414-419 423-429 436 448 466-476 485-488 496'),
]

def numbers(spec):
    for token in spec.split():
        bounds=list(map(int, token.split('-')))
        yield from range(bounds[0],bounds[-1]+1)

def organize(rows):
    assignments={i:'discourse' for i in range(1,497)}
    for key,_,_,_,_,spec in TOPICS:
        for n in numbers(spec): assignments[n]=key
    rows=[dict(r) for r in rows]
    batches=[]
    for key,group,title,objective,prerequisite,_ in TOPICS:
        members=[r for r in rows if assignments[int(r['id'].split('.')[1])]==key]
        # Source is already ordered by TBCL level; keep that order within a topic.
        members.sort(key=lambda r:r['id'])
        for start in range(0,len(members),24):
            part=start//24+1;batch_id=f'{key}.{part}'
            selected=members[start:start+24]
            prerequisites=([f'{key}.{part-1}'] if part>1 else [prerequisite+'.1'] if prerequisite else [])
            batch={'id':batch_id,'title':f'{title} · lô {part}','group':GROUPS[group],
                   'objective':objective,'prerequisites':prerequisites,
                   'source_levels':list(dict.fromkeys(r['tbcl_level'] for r in selected)),
                   'status':'planned'}
            batches.append(batch)
            for r in selected:r.update(group=GROUPS[group],batch_id=batch_id,batch=len(batches))
    return rows,batches
