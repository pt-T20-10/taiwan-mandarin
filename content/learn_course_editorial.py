"""PC editorial policy: semantic slot meanings and excluded teaching contexts.

These checks supplement review of every frame/slot family; they are not a
claim that regex can establish language correctness.
"""
import re

MEANINGS={
 '冰':'đá','先生':'chồng','太太':'vợ','朋友':'người bạn',
 '車站':'nhà ga','運動':'tập thể dục','上課':'lên lớp','上班':'đi làm',
 '跳舞':'khiêu vũ','讀書':'học bài','考試':'kỳ thi','記錄':'bản ghi',
 '建議':'gợi ý','問題':'vấn đề','高鐵':'tàu cao tốc','退租':'trả phòng thuê',
 '老師':'giáo viên','主管':'cấp trên','學生證':'thẻ sinh viên',
}

def exclusion(h):
 if not re.search(r'[。？！!?]$',h):return 'isolated vocabulary is not a sentence exercise'
 if re.search(r'(老師|學生|同學)(?:也)?(?:不是|是)(?:學生|老師)',h):return 'role-as-subject: redundant or contradictory identity'
 if re.search(r'我(?:也)?是(?:學生|老師)嗎',h):return 'self-identity question without a context'
 if re.search(r'第.+個(?:學生|老師)',h):return 'ordinal person without a meaningful context'
 if re.search(r'(上個月|這個月|下個月|上星期|下星期).*(是學生|是老師)',h):return 'month plus arbitrary occupation'
 if '你是' in h and re.search(r'(爸爸|媽媽|哥哥|姐姐|妹妹|爺爺|奶奶|先生|太太|家人)嗎',h):return 'family relation needs an explicit referent'
 if re.search(r'認識這位(爸爸|媽媽|哥哥|姐姐|妹妹|爺爺|奶奶|先生|太太|家人)',h):return 'family relation used as an occupational title'
 if re.search(r'(有|要|給我)漢字',h):return 'abstract script used as a physical object'
 return None

def revise(t):
 t=dict(t)
 if '您是老師嗎' in t['hanzi']:
  t['vi']='Xin hỏi, anh/chị có phải là giáo viên không?' if '請問' in t['hanzi'] else 'Anh/chị có phải là giáo viên không?'
 t['vi']=t['vi'][0].upper()+t['vi'][1:]
 return t

# Everyday courtesy utterances with an actual communicative purpose.
# No arbitrary thank-you/apology + identity combinations.
COURTESY='''老師，謝謝您。|Lǎoshī, xièxie nín.|Cảm ơn thầy/cô.
謝謝你的幫忙。|Xièxie nǐ de bāngmáng.|Cảm ơn bạn đã giúp đỡ.
請問，你叫什麼名字？|Qǐngwèn, nǐ jiào shénme míngzi?|Xin hỏi, bạn tên gì?
您好，請問您是老師嗎？|Nín hǎo, qǐngwèn nín shì lǎoshī ma?|Xin chào, anh/chị có phải là giáo viên không?
請問，他叫什麼名字？|Qǐngwèn, tā jiào shénme míngzi?|Xin hỏi, anh ấy tên gì?
請問，她叫什麼名字？|Qǐngwèn, tā jiào shénme míngzi?|Xin hỏi, cô ấy tên gì?
請問，你是學生嗎？|Qǐngwèn, nǐ shì xuéshēng ma?|Xin hỏi, bạn có phải học sinh không?
請問，他是學生嗎？|Qǐngwèn, tā shì xuéshēng ma?|Xin hỏi, anh ấy có phải học sinh không?
請問，她是學生嗎？|Qǐngwèn, tā shì xuéshēng ma?|Xin hỏi, cô ấy có phải học sinh không?
請問，你是老師嗎？|Qǐngwèn, nǐ shì lǎoshī ma?|Xin hỏi, bạn có phải giáo viên không?
請問，他是老師嗎？|Qǐngwèn, tā shì lǎoshī ma?|Xin hỏi, anh ấy có phải giáo viên không?
請問，她是老師嗎？|Qǐngwèn, tā shì lǎoshī ma?|Xin hỏi, cô ấy có phải giáo viên không?
老師，您好！|Lǎoshī, nín hǎo!|Em chào thầy/cô!
老師，再見！|Lǎoshī, zài jiàn!|Em chào tạm biệt thầy/cô!
同學，再見！|Tóngxué, zài jiàn!|Chào tạm biệt bạn!
謝謝你，老師。|Xièxie nǐ, lǎoshī.|Cảm ơn thầy/cô.
謝謝您，老師。|Xièxie nín, lǎoshī.|Em cảm ơn thầy/cô.
請進，老師。|Qǐng jìn, lǎoshī.|Mời thầy/cô vào.
老師，請坐。|Lǎoshī, qǐng zuò.|Mời thầy/cô ngồi.
您好，請坐。|Nín hǎo, qǐng zuò.|Xin chào, mời anh/chị ngồi.
老師，對不起。|Lǎoshī, duìbuqǐ.|Em xin lỗi thầy/cô.
對不起，老師。|Duìbuqǐ, lǎoshī.|Xin lỗi thầy/cô.
沒關係，請進。|Méi guānxi, qǐng jìn.|Không sao, mời vào.
不客氣，再見。|Bú kèqi, zài jiàn.|Không có gì, chào tạm biệt.
謝謝老師的幫忙。|Xièxie lǎoshī de bāngmáng.|Cảm ơn sự giúp đỡ của thầy/cô.
謝謝你的老師。|Xièxie nǐ de lǎoshī.|Cảm ơn giáo viên của bạn.
請老師幫忙。|Qǐng lǎoshī bāngmáng.|Nhờ thầy/cô giúp đỡ.
請你幫忙。|Qǐng nǐ bāngmáng.|Nhờ bạn giúp đỡ.
請他幫忙。|Qǐng tā bāngmáng.|Nhờ anh ấy giúp đỡ.
請她幫忙。|Qǐng tā bāngmáng.|Nhờ cô ấy giúp đỡ.
謝謝你，再見。|Xièxie nǐ, zài jiàn.|Cảm ơn bạn, chào tạm biệt.
謝謝您，再見。|Xièxie nín, zài jiàn.|Cảm ơn anh/chị, chào tạm biệt.
您好，我叫小明。|Nín hǎo, wǒ jiào Xiǎomíng.|Xin chào, tôi tên Tiểu Minh.
您好，我是學生。|Nín hǎo, wǒ shì xuéshēng.|Xin chào, tôi là học sinh.
您好，我是老師。|Nín hǎo, wǒ shì lǎoshī.|Xin chào, tôi là giáo viên.'''
COURTESY+='''
您好，請進。|Nín hǎo, qǐng jìn.|Xin chào, mời anh/chị vào.
不客氣，老師。|Bú kèqi, lǎoshī.|Không có gì, thưa thầy/cô.'''

ADDITIONS={
 'numbers':'''今天是我的生日。|Jīntiān shì wǒ de shēngrì.|Hôm nay là sinh nhật của tôi.
明天是她的生日。|Míngtiān shì tā de shēngrì.|Ngày mai là sinh nhật của cô ấy.
昨天是他的生日。|Zuótiān shì tā de shēngrì.|Hôm qua là sinh nhật của anh ấy.
你的生日是幾月幾號？|Nǐ de shēngrì shì jǐ yuè jǐ hào?|Sinh nhật của bạn là ngày mấy tháng mấy?''',
 'social':'''我同意你的意見。|Wǒ tóngyì nǐ de yìjiàn.|Tôi đồng ý với ý kiến của bạn.
我不同意這個建議。|Wǒ bù tóngyì zhè ge jiànyì.|Tôi không đồng ý với đề xuất này.
我想聽聽你的意見。|Wǒ xiǎng tīngting nǐ de yìjiàn.|Tôi muốn nghe ý kiến của bạn.
我們可以再商量。|Wǒmen kěyǐ zài shāngliáng.|Chúng ta có thể bàn thêm.
謝謝你的建議。|Xièxie nǐ de jiànyì.|Cảm ơn gợi ý của bạn.
我尊重你的選擇。|Wǒ zūnzhòng nǐ de xuǎnzé.|Tôi tôn trọng lựa chọn của bạn.
抱歉，打擾你了。|Bàoqiàn, dǎrǎo nǐ le.|Xin lỗi đã làm phiền bạn.
你有別的建議嗎？|Nǐ yǒu bié de jiànyì ma?|Bạn có đề xuất nào khác không?''',
}
