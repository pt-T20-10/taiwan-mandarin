"""Original Vietnamese teaching notes and examples; not copied textbook text.

The source reference identifies the construction, not a teacher certification
of the authored examples. Positional rows map to existing stable grammar IDs.
"""
ROWS = [
('Là ai: 是','A + 是 + danh từ','Không dùng 是 để nối trực tiếp với tính từ chỉ trạng thái.','我是忙。','我是學生。|Wǒ shì xuéshēng.|Tôi là học sinh/sinh viên.','她是老師。|Tā shì lǎoshī.|Cô ấy là giáo viên.','她___老師。','是','我是學生。','繫動詞'),
('Hỏi thông tin: 什麼','Chủ ngữ + động từ + 什麼 + danh từ','Từ hỏi ở đúng vị trí thông tin cần biết; không đưa 什麼 lên đầu theo tiếng Việt.','什麼你叫名字？','你叫什麼名字？|Nǐ jiào shénme míngzi?|Bạn tên là gì?','你喝什麼茶？|Nǐ hē shénme chá?|Bạn uống trà gì?','你喝___茶？','什麼','你叫什麼名字？','什麼'),
('Hỏi giờ: 幾點','現在 + 幾點','幾點 hỏi giờ; 多少錢 hỏi giá, không thay thế cho nhau.','現在多少錢？','現在幾點？|Xiànzài jǐ diǎn?|Bây giờ mấy giờ?','你幾點上課？|Nǐ jǐ diǎn shàngkè?|Bạn học lúc mấy giờ?','你___上課？','幾點','現在幾點？','幾'),
('Thời gian trong câu','Chủ ngữ + thời gian + động từ','Thời gian có thể đứng trước chủ ngữ; thường không đặt cuối câu như tiếng Việt.','我們見明天。','我們明天見。|Wǒmen míngtiān jiàn.|Ngày mai chúng ta gặp nhau.','明天我上課。|Míngtiān wǒ shàngkè.|Ngày mai tôi đi học.','我們___見。','明天','我們明天見。','時間表達'),
('Số và lượng từ','Số + lượng từ + danh từ','Chọn lượng từ theo danh từ; không dùng 個 thay cho mọi lượng từ.','我要一茶。','我要一杯茶。|Wǒ yào yī bēi chá.|Tôi muốn một ly trà.','他買兩本書。|Tā mǎi liǎng běn shū.|Anh ấy mua hai quyển sách.','他買兩___書。','本','我要一杯茶。','量詞'),
('Phủ định: 不','Chủ ngữ + 不 + động từ/tính từ','Sở hữu 有 phủ định bằng 沒有. 不 trước thanh 4 thường đọc bú khi nói liền.','這碗麵沒辣。','這碗麵不辣。|Zhè wǎn miàn bù là.|Bát mì này không cay.','我不喝咖啡。|Wǒ bù hē kāfēi.|Tôi không uống cà phê.','我___喝咖啡。','不','這碗麵不辣。','不'),
('Hỏi giá và số lượng: 多少','Danh từ + 多少 + đơn vị','多少錢 hỏi giá; không dùng 幾點 để hỏi giá.','這個幾點？','這個多少錢？|Zhège duōshǎo qián?|Cái này bao nhiêu tiền?','這裡有多少學生？|Zhèlǐ yǒu duōshǎo xuéshēng?|Ở đây có bao nhiêu học sinh?','這個___錢？','多少','這個多少錢？','多少'),
('Mong muốn: 想','Chủ ngữ + 想 + động từ','想 đứng trước hành động mong muốn; nghĩa nhớ/nghĩ thuộc ngữ cảnh khác.','我買想蘋果。','我想買蘋果。|Wǒ xiǎng mǎi píngguǒ.|Tôi muốn mua táo.','她想喝茶。|Tā xiǎng hē chá.|Cô ấy muốn uống trà.','她___喝茶。','想','我想買蘋果。','想'),
('Đi bằng phương tiện','Chủ ngữ + 坐 + phương tiện + 去 + nơi đến','坐 đi với phương tiện có thể đi/ngồi; đi bộ dùng 走路, không dùng 坐腳.','我坐學校去公車。','我坐公車去學校。|Wǒ zuò gōngchē qù xuéxiào.|Tôi đi xe buýt đến trường.','他坐火車去臺南。|Tā zuò huǒchē qù Táinán.|Anh ấy đi tàu đến Đài Nam.','他___火車去臺南。','坐','我坐公車去學校。','連動'),
('Vị trí: 在','Người/vật + 在 + nơi chốn','Không thêm 是 trước 在 khi chỉ vị trí thông thường.','車站是在右邊。','車站在右邊。|Chēzhàn zài yòubiān.|Nhà ga ở bên phải.','老師在教室。|Lǎoshī zài jiàoshì.|Giáo viên ở trong lớp.','老師___教室。','在','車站在右邊。','在1'),
('Sở hữu: 有 / 沒有','Chủ ngữ + 有／沒有 + danh từ','Không dùng 不有 để phủ định sở hữu.','我不有妹妹。','我沒有妹妹。|Wǒ méiyǒu mèimei.|Tôi không có em gái.','她有兩個哥哥。|Tā yǒu liǎng ge gēge.|Cô ấy có hai anh trai.','我___妹妹。','沒有','我沒有妹妹。','有'),
('Sở hữu: 的','Người sở hữu + 的 + vật/người','Với quan hệ gần gũi có thể lược 的; không bỏ tùy ý trong mọi cụm.','這是我書。','這是我的書。|Zhè shì wǒ de shū.|Đây là sách của tôi.','那是老師的車。|Nà shì lǎoshī de chē.|Kia là xe của giáo viên.','那是老師___車。','的','這是我的書。','表所有「的」'),
('Miêu tả bằng tính từ: 很','Chủ ngữ + 很 + tính từ','很 thường làm câu miêu tả tự nhiên; không phải lúc nào cũng nhấn mạnh rất.','房間是乾淨。','房間很乾淨。|Fángjiān hěn gānjìng.|Căn phòng sạch sẽ.','這本書很有趣。|Zhè běn shū hěn yǒuqù.|Quyển sách này thú vị.','房間___乾淨。','很','房間很乾淨。','很'),
('Tồn tại: nơi chốn + 有','Nơi chốn + 有 + sự vật','Giới thiệu vật ở một nơi dùng 有; xác định vị trí của vật đã biết thường dùng 在.','桌子上在一本書。','桌子上有一本書。|Zhuōzi shàng yǒu yī běn shū.|Trên bàn có một quyển sách.','學校旁邊有銀行。|Xuéxiào pángbiān yǒu yínháng.|Bên cạnh trường có ngân hàng.','學校旁邊___銀行。','有','桌子上有一本書。','有'),
('Khoảng thời gian: 從…到…','從 + điểm đầu + 到 + điểm cuối','Giữ đúng thứ tự điểm bắt đầu rồi điểm kết thúc; không đảo 從 và 到.','我到九點上課從十二點。','我從九點上課到十二點。|Wǒ cóng jiǔ diǎn shàngkè dào shíèr diǎn.|Tôi học từ chín giờ đến mười hai giờ.','從這裡到學校很近。|Cóng zhèlǐ dào xuéxiào hěn jìn.|Từ đây đến trường rất gần.','從這裡___學校很近。','到','我從九點上課到十二點。','從'),
('Nối danh từ: 和','Danh từ/cụm danh từ + 和 + danh từ/cụm danh từ','和 không thay mọi chữ và; nối hai mệnh đề độc lập cần cấu trúc phù hợp khác.','我和喜歡喝茶。','我和她喜歡喝茶。|Wǒ hé tā xǐhuān hē chá.|Tôi và cô ấy thích uống trà.','我買茶和咖啡。|Wǒ mǎi chá hé kāfēi.|Tôi mua trà và cà phê.','我買茶___咖啡。','和','我和她喜歡喝茶。','和'),
('Xin phép hoặc nhờ: 可以…嗎','可以 + hành động + 嗎','可以 hỏi sự cho phép/khả năng trong hoàn cảnh; không đồng nhất với kỹ năng học được của 會.','我可以嗎進去。','我可以進去嗎？|Wǒ kěyǐ jìnqù ma?|Tôi có thể vào không?','你可以幫我嗎？|Nǐ kěyǐ bāng wǒ ma?|Bạn có thể giúp tôi không?','你___幫我嗎？','可以','我可以進去嗎？','可以'),
('Nguyên nhân và kết quả','因為 + nguyên nhân，所以 + kết quả','因為 đặt trước nguyên nhân, 所以 trước kết quả; có thể lược một vế liên từ khi ngữ cảnh rõ.','所以我有課，因為不能去。','因為我有課，所以不能去。|Yīnwèi wǒ yǒu kè, suǒyǐ bù néng qù.|Vì tôi có tiết học nên không thể đi.','因為下雨，所以我在家。|Yīnwèi xiàyǔ, suǒyǐ wǒ zài jiā.|Vì trời mưa nên tôi ở nhà.','因為下雨，___我在家。','所以','因為我有課，所以不能去。','因為'),
('Lặp lại hành động: 再','再 + động từ + số lần','再 thường dùng cho lần tiếp theo; 又 thường nói hành động đã lặp lại.','請說再一次。','請再說一次。|Qǐng zài shuō yī cì.|Xin nói lại một lần.','我想再看一次。|Wǒ xiǎng zài kàn yī cì.|Tôi muốn xem lại một lần.','請___說一次。','再','請再說一次。','再'),
('Bổ ngữ khả năng: V 不 C','Động từ + 不 + kết quả','聽不懂 nói không hiểu điều nghe được; 不聽懂 không phải cách đặt bổ ngữ khả năng này.','我不聽懂。','我聽不懂。|Wǒ tīng bù dǒng.|Tôi nghe không hiểu.','這個字我看不懂。|Zhège zì wǒ kàn bù dǒng.|Chữ này tôi đọc không hiểu.','這個字我看不___。','懂','我聽不懂。','可能補語'),
('Đã: 已經…了','已經 + hành động/trạng thái + 了','了 không phải dấu quá khứ dùng cho mọi câu. Cần phân biệt hoàn tất hành động và thay đổi trạng thái.','我吃飯已經了。','我已經吃飯了。|Wǒ yǐjīng chīfàn le.|Tôi đã ăn rồi.','他已經到學校了。|Tā yǐjīng dào xuéxiào le.|Anh ấy đã đến trường rồi.','他___到學校了。','已經','我已經吃飯了。','已經'),
('Kỹ năng học được: 會','Chủ ngữ + 會 + động từ','會 còn có nghĩa dự đoán sẽ; bài này chỉ luyện kỹ năng học được, không thay bằng 在.','我在游泳。','我會游泳。|Wǒ huì yóuyǒng.|Tôi biết bơi.','她會說華語。|Tā huì shuō Huáyǔ.|Cô ấy biết nói Hoa ngữ.','她___說華語。','會','我會游泳。','會'),
('Cùng ai: 跟','Chủ ngữ + 跟 + người + hành động','Cụm 跟 + người đứng trước hành động trong cấu trúc luyện ở đây.','我想跟討論老師報告。','我想跟老師討論報告。|Wǒ xiǎng gēn lǎoshī tǎolùn bàogào.|Tôi muốn thảo luận báo cáo với giáo viên.','她跟朋友一起吃飯。|Tā gēn péngyǒu yīqǐ chīfàn.|Cô ấy ăn cùng bạn.','她___朋友一起吃飯。','跟','我想跟老師討論報告。','跟'),
('Hỏi khi nào: 什麼時候','Chủ ngữ + 什麼時候 + vị ngữ','什麼時候 hỏi thời điểm; hỏi ai dùng 誰. 您 thể hiện cách xưng hô kính trọng.','您誰方便？','您什麼時候方便？|Nín shénme shíhou fāngbiàn?|Khi nào thầy/cô/ông/bà tiện?','你什麼時候回家？|Nǐ shénme shíhou huí jiā?|Khi nào bạn về nhà?','你___回家？','什麼時候','您什麼時候方便？','什麼時候'),
]

ADDITIONAL = [
'他是醫生。|Tā shì yīshēng.|Anh ấy là bác sĩ.',
'你想買什麼？|Nǐ xiǎng mǎi shénme?|Bạn muốn mua gì?',
'老師幾點來？|Lǎoshī jǐ diǎn lái?|Giáo viên đến lúc mấy giờ?',
'我今天買書。|Wǒ jīntiān mǎi shū.|Hôm nay tôi mua sách.',
'我有三個杯子。|Wǒ yǒu sān ge bēizi.|Tôi có ba cái ly.',
'他不去學校。|Tā bù qù xuéxiào.|Anh ấy không đến trường.',
'你有多少本書？|Nǐ yǒu duōshǎo běn shū?|Bạn có bao nhiêu quyển sách?',
'我們想去臺灣。|Wǒmen xiǎng qù Táiwān.|Chúng tôi muốn đến Đài Loan.',
'她坐捷運去車站。|Tā zuò jiéyùn qù chēzhàn.|Cô ấy đi MRT đến nhà ga.',
'書在桌子上。|Shū zài zhuōzi shàng.|Sách ở trên bàn.',
'我沒有車。|Wǒ méiyǒu chē.|Tôi không có xe.',
'這是她的手機。|Zhè shì tā de shǒujī.|Đây là điện thoại của cô ấy.',
'今天很冷。|Jīntiān hěn lěng.|Hôm nay trời lạnh.',
'教室裡有三個人。|Jiàoshì lǐ yǒu sān ge rén.|Trong lớp có ba người.',
'我從家裡走到學校。|Wǒ cóng jiā lǐ zǒu dào xuéxiào.|Tôi đi bộ từ nhà đến trường.',
'爸爸和媽媽都在家。|Bàba hé māma dōu zài jiā.|Bố và mẹ đều ở nhà.',
'我可以坐這裡嗎？|Wǒ kěyǐ zuò zhèlǐ ma?|Tôi có thể ngồi đây không?',
'因為很忙，所以我沒去。|Yīnwèi hěn máng, suǒyǐ wǒ méi qù.|Vì rất bận nên tôi đã không đi.',
'請再等五分鐘。|Qǐng zài děng wǔ fēnzhōng.|Xin đợi thêm năm phút.',
'我買不起這部車。|Wǒ mǎi bù qǐ zhè bù chē.|Tôi không đủ tiền mua chiếc xe này.',
'我已經寫完了。|Wǒ yǐjīng xiě wán le.|Tôi đã viết xong rồi.',
'他會開車。|Tā huì kāichē.|Anh ấy biết lái xe.',
'我跟同學一起讀書。|Wǒ gēn tóngxué yīqǐ dúshū.|Tôi học cùng bạn học.',
'老師什麼時候來？|Lǎoshī shénme shíhou lái?|Khi nào giáo viên đến?',
]

def enrich(grammar, index, roadmap):
    title,pattern,restriction,wrong,second,third,cloze,missing,correct,term=ROWS[index]
    examples=[{k:grammar[k] for k in ('hanzi','pinyin','vi')},dict(zip(('hanzi','pinyin','vi'),second.split('|'))),dict(zip(('hanzi','pinyin','vi'),third.split('|')))]
    unique={e['hanzi']:e for e in examples}
    if len(unique)<3:
        extra=dict(zip(('hanzi','pinyin','vi'),ADDITIONAL[index].split('|')));unique[extra['hanzi']]=extra
    examples=list(unique.values())
    if index==9:
        restriction='Câu chỉ vị trí trung tính dùng 在. 是在 có thể nhấn mạnh/xác nhận vị trí trong ngữ cảnh khác; không coi mọi câu 是在 đều sai.'
        grammar={**grammar,'explanation':restriction}
    cloze_sentence=cloze.replace('___',missing)
    cloze_meaning=next(e['vi'] for e in examples if e['hanzi']==cloze_sentence)
    # Explicit references avoid matching every sense of words such as 會/在.
    reference_numbers=[[1],[6],[10,66],[10],[12],[4],[66],[39],[204],[8],
                       [19],[2,3],[],[217],[73,74],[18],[24,49],[77],
                       [133,223],[185,208],[17,53],[20],[68],[6,10]]
    matches=[r for r in roadmap if r['id'] in {f'tbcl.{n:03d}' for n in reference_numbers[index]}]
    refs=[{'title':r['title'],'tbcl_level':r['tbcl_level'],'url':r['source'],'id':r['id']} for r in matches]
    # Search reference is explicit when the broader construction label has no exact match.
    if not refs:refs=[{'title':term,'tbcl_level':'','url':'https://bcoct.naer.edu.tw/standsys/querygrammars.php?q='+term,'id':''}]
    group='So sánh và câu phức' if index==17 else 'Thời–thể và bổ ngữ' if index in (18,19,20) else 'Câu cơ bản'
    g={**grammar,'title':title,'pattern':pattern,'restrictions':restriction,'common_mistake':wrong,'examples':examples,'status':'ready','group':group,'level':'Nền tảng','prerequisites':[],'references':refs}
    def ex(suffix,kind,prompt,answers,explanation,choices=None,tokens=None):
        return {'id':grammar['id']+'.practice.'+suffix,'grammar_id':grammar['id'],'kind':kind,'prompt':prompt,'answers':answers,'explanation':explanation,'choices':choices or [],'tokens':tokens or [],'skill':'grammar'}
    import re
    # Recognition asks about a construction's use, not a self-referential formula.
    descriptions=[r[0] for r in ROWS]
    options=[title,descriptions[(index+5)%24],descriptions[(index+11)%24],descriptions[(index+17)%24]]
    options=options[index%4:]+options[:index%4]
    sentence=examples[2]['hanzi'];tokens=list(re.sub(r'[，。！？、：；「」,.!?\s]','',sentence));tokens=tokens[1:]+tokens[:1]
    g['exercises']=[
      ex('use','meaning','Câu “'+examples[0]['hanzi']+'” minh họa cấu trúc nào đang học?', [title],grammar['explanation'],options),
      ex('cloze','cloze','Điền cấu trúc đang học để diễn đạt “'+cloze_meaning+'”: '+cloze,[missing],restriction),
      ex('order','order','Sắp xếp hoặc gõ câu theo nghĩa: '+examples[2]['vi'],[sentence],grammar['explanation'],tokens=tokens),
      ex('correct','hanzi','Viết lại câu sau theo cấu trúc đang học để diễn đạt “'+second.split('|')[2]+'”: '+wrong,[correct],restriction+' Câu tham khảo: '+correct)
    ]
    variants={3:['明天我們見。'],6:['這個要多少錢？'],10:['我沒妹妹。'],
              14:['我從九點到十二點上課。'],16:['可以讓我進去嗎？'],
              17:['我因為有課，所以不能去。'],19:['我聽不明白。'],
              20:['我已經吃過飯了。'],22:['我想和老師討論報告。'],23:['什麼時候您方便？']}
    g['exercises'][3]['answers']+=variants.get(index,[])
    return g
