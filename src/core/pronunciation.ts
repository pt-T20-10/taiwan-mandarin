// Teaching notes are authored for this app. These are listening cases, not
// certified audio; dictionary spelling and connected-speech notes stay separate.
export const pronunciationCases = [
  {id:'third-third',title:'Hai thanh 3 trong cùng cụm',hanzi:'你好',pinyin:'nǐ hǎo',vi:'xin chào',spoken:'Thường nghe gần ní hǎo: thanh 3 đầu đổi sang thanh 2 trước thanh 3. Phiên âm từ điển vẫn giữ nǐ hǎo.',context:'你好，我是越南人。'},
  {id:'half-third',title:'Thanh 3 trước thanh khác',hanzi:'很忙',pinyin:'hěn máng',vi:'rất bận',spoken:'很 thường giữ phần thấp của thanh 3 khi nối với 忙, không cần uốn đầy đủ xuống–lên như đọc chữ riêng.',context:'我今天很忙。'},
  {id:'yi-first',title:'一 trước thanh 1',hanzi:'一杯',pinyin:'yī bēi',vi:'một ly',spoken:'Khi nói cụm này, 一 thường đọc yì: yì bēi.',context:'我要一杯茶。'},
  {id:'yi-third',title:'一 trước thanh 3',hanzi:'一本',pinyin:'yī běn',vi:'một quyển',spoken:'Khi nói cụm này, 一 thường đọc yì: yì běn.',context:'我想買一本書。'},
  {id:'yi-fourth',title:'一 trước thanh 4',hanzi:'一次',pinyin:'yī cì',vi:'một lần',spoken:'Khi nói cụm này, 一 thường đọc yí: yí cì.',context:'請再說一次。'},
  {id:'yi-ordinal',title:'一 trong số thứ tự',hanzi:'第一',pinyin:'dì yī',vi:'thứ nhất',spoken:'一 trong số thứ tự này giữ yī; không áp dụng đổi thanh theo chữ sau một cách máy móc.',context:'這是第一課。'},
  {id:'bu-fourth',title:'不 trước thanh 4',hanzi:'不要',pinyin:'bù yào',vi:'không muốn; đừng',spoken:'Trong cụm này 不 thường đọc bú: bú yào.',context:'我不要冰。'},
  {id:'bu-other',title:'不 trước thanh 1',hanzi:'不喝',pinyin:'bù hē',vi:'không uống',spoken:'不 giữ thanh 4 trước 喝; không phải mọi 不 đều đổi thành bú.',context:'我不喝咖啡。'},
  {id:'neutral',title:'Thanh nhẹ trong từ',hanzi:'名字',pinyin:'míngzi',vi:'tên',spoken:'MOE ghi zi là âm nhẹ ở 名字 và 桌子 (zhuōzi). Âm nhẹ thường ngắn và ít nhấn hơn; cao độ phụ thuộc âm trước. Không ấn định cùng độ dài/cao độ cho mọi thanh nhẹ, cũng không mặc định mọi âm cuối đều nhẹ.',context:'你叫什麼名字？'},
  {id:'polyphonic',title:'Chữ đa âm cần ngữ cảnh',hanzi:'銀行',pinyin:'yínháng',vi:'ngân hàng',spoken:'行 trong 銀行 đọc háng; 行 trong 行走 đọc xíng. Phải nghe cả từ/câu, không ghép âm từng chữ.',context:'銀行在學校旁邊。'},
  {id:'grouping',title:'Nhịp câu và chỗ ngắt',hanzi:'我是越南人，我是留學生。',pinyin:'Wǒ shì Yuènán rén, wǒ shì liúxuéshēng.',vi:'Tôi là người Việt Nam, tôi là du học sinh.',spoken:'Nối các âm thành cụm theo nghĩa, ngắt tại dấu phẩy. Độ dài còn phụ thuộc trọng âm, tốc độ và vị trí trong câu; không có một số mili giây cố định cho mỗi thanh.',context:'我是越南人，我是留學生。'},
];

export const pronunciationGroups=[
 {id:'third',title:'Thanh 3',summary:'Thanh 3 nối thanh 3 và dạng thấp trước thanh khác.',cases:['third-third','half-third']},
 {id:'yi',title:'一 · yī',summary:'Đọc yì trước thanh 1/2/3, yí trước thanh 4; giữ yī trong số thứ tự.',cases:['yi-first','yi-third','yi-fourth','yi-ordinal']},
 {id:'bu',title:'不 · bù',summary:'Đọc bú trước thanh 4; giữ bù trước thanh 1/2/3.',cases:['bu-fourth','bu-other']},
 {id:'neutral',title:'Thanh nhẹ',summary:'Ngắn, ít nhấn; cao độ phụ thuộc ngữ cảnh.',cases:['neutral']},
 {id:'polyphonic',title:'Chữ đa âm',summary:'Chọn âm đọc theo từ và nghĩa trong câu.',cases:['polyphonic']},
 {id:'grouping',title:'Nhịp câu',summary:'Nối theo cụm nghĩa, ngắt tại ranh giới câu.',cases:['grouping']},
];
