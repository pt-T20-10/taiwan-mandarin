import type {PracticeItem,PracticeSet,PracticeSkill,TextItem,Unit} from './types';

export type ClassifierExample=TextItem&{id:string;measure:string;reading:string;use:string;phrase:TextItem;accepted:string[]};
// Authored examples; dictionary spelling retains 一/不 base tones.
const rows=[
 ['people','個','gè','Lượng từ thông dụng cho người và nhiều đồ vật','兩個朋友','liǎng ge péngyǒu','hai người bạn','我有兩個朋友。','Wǒ yǒu liǎng ge péngyǒu.','Tôi có hai người bạn。','個,位'],
 ['teacher','位','wèi','Đếm người với sắc thái lịch sự','一位老師','yī wèi lǎoshī','một thầy/cô (cách gọi lịch sự)','這是一位老師。','Zhè shì yī wèi lǎoshī.','Đây là một thầy/cô giáo.','位'],
 ['cup','杯','bēi','Đồ uống tính theo ly','兩杯茶','liǎng bēi chá','hai ly trà','我要兩杯茶。','Wǒ yào liǎng bēi chá.','Tôi muốn hai ly trà.','杯'],
 ['bottle','瓶','píng','Chất lỏng tính theo chai','三瓶水','sān píng shuǐ','ba chai nước','請給我三瓶水。','Qǐng gěi wǒ sān píng shuǐ.','Cho tôi ba chai nước.','瓶'],
 ['bowl','碗','wǎn','Thức ăn tính theo bát','一碗麵','yī wǎn miàn','một bát mì','我要一碗麵。','Wǒ yào yī wǎn miàn.','Tôi muốn một bát mì.','碗'],
 ['meal','份','fèn','Một phần hoặc suất','兩份早餐','liǎng fèn zǎocān','hai suất ăn sáng','我們要兩份早餐。','Wǒmen yào liǎng fèn zǎocān.','Chúng tôi muốn hai suất ăn sáng.','份'],
 ['book','本','běn','Sách, vở đóng thành quyển','兩本書','liǎng běn shū','hai quyển sách','我買了兩本書。','Wǒ mǎi le liǎng běn shū.','Tôi đã mua hai quyển sách.','本'],
 ['ticket','張','zhāng','Vé, giấy và nhiều đồ vật có mặt phẳng','兩張票','liǎng zhāng piào','hai tấm vé','我要買兩張票。','Wǒ yào mǎi liǎng zhāng piào.','Tôi muốn mua hai tấm vé.','張'],
 ['paper','張','zhāng','Giấy tính theo tờ','三張紙','sān zhāng zhǐ','ba tờ giấy','請給我三張紙。','Qǐng gěi wǒ sān zhāng zhǐ.','Cho tôi ba tờ giấy.','張'],
 ['clothes','件','jiàn','Áo và một số loại quần áo','一件外套','yī jiàn wàitào','một chiếc áo khoác','我想買一件外套。','Wǒ xiǎng mǎi yī jiàn wàitào.','Tôi muốn mua một chiếc áo khoác.','件'],
 ['trousers','條','tiáo','Quần và nhiều vật dài','一條褲子','yī tiáo kùzi','một chiếc quần','這條褲子很好看。','Zhè tiáo kùzi hěn hǎokàn.','Chiếc quần này rất đẹp.','條'],
 ['shoes','雙','shuāng','Vật đi thành đôi','一雙鞋子','yī shuāng xiézi','một đôi giày','我需要一雙鞋子。','Wǒ xūyào yī shuāng xiézi.','Tôi cần một đôi giày.','雙'],
 ['car','輛','liàng','Xe cộ như xe hơi, xe đạp','一輛車','yī liàng chē','một chiếc xe','門口有一輛車。','Ménkǒu yǒu yī liàng chē.','Trước cửa có một chiếc xe.','輛'],
 ['room','間','jiān','Phòng và một số cơ sở','兩間房間','liǎng jiān fángjiān','hai căn phòng','這裡有兩間房間。','Zhèlǐ yǒu liǎng jiān fángjiān.','Ở đây có hai căn phòng.','間'],
 ['chair','把','bǎ','Ghế và nhiều vật có tay cầm','四把椅子','sì bǎ yǐzi','bốn chiếc ghế','教室裡有四把椅子。','Jiàoshì lǐ yǒu sì bǎ yǐzi.','Trong lớp có bốn chiếc ghế.','把'],
 ['cat','隻','zhī','Nhiều động vật; một chiếc trong một đôi','一隻貓','yī zhī māo','một con mèo','我家有一隻貓。','Wǒ jiā yǒu yī zhī māo.','Nhà tôi có một con mèo.','隻'],
 ['course','門','mén','Môn học, khóa học','兩門課','liǎng mén kè','hai môn học','這學期我選了兩門課。','Zhè xuéqí wǒ xuǎn le liǎng mén kè.','Học kỳ này tôi đã chọn hai môn học.','門'],
 ['class','節','jié','Tiết học; khác với môn học','三節課','sān jié kè','ba tiết học','今天有三節課。','Jīntiān yǒu sān jié kè.','Hôm nay có ba tiết học.','節'],
 ['medicine','顆','kē','Vật nhỏ dạng hạt, một số thuốc viên','一顆藥','yī kē yào','một viên thuốc','這是一顆藥。','Zhè shì yī kē yào.','Đây là một viên thuốc.','顆,粒'],
 ['letter','封','fēng','Thư từ','一封信','yī fēng xìn','một bức thư','我收到一封信。','Wǒ shōudào yī fēng xìn.','Tôi nhận được một bức thư.','封'],
 ['shop','家','jiā','Cửa hàng, công ty, cơ sở kinh doanh','一家商店','yī jiā shāngdiàn','một cửa hàng','學校旁邊有一家商店。','Xuéxiào pángbiān yǒu yī jiā shāngdiàn.','Cạnh trường có một cửa hàng.','家,間'],
 ['photo','張','zhāng','Ảnh tính theo tấm','兩張照片','liǎng zhāng zhàopiàn','hai tấm ảnh','我拍了兩張照片。','Wǒ pāi le liǎng zhāng zhàopiàn.','Tôi đã chụp hai tấm ảnh.','張'],
];
export const classifierExamples:ClassifierExample[]=rows.map(([id,measure,reading,use,phrase,pinyin,vi,hanzi,sentencePinyin,translation,accepted])=>({id,measure,reading,use,phrase:{hanzi:phrase,pinyin,vi},hanzi,pinyin:sentencePinyin,vi:translation.replace('。','.'),accepted:accepted.split(',')}));
const topics:Record<string,string[]>={greetings:['people','teacher'],numbers:['book','ticket','cup'],food:['cup','bottle','bowl','meal'],shopping:['clothes','trousers','shoes','shop'],transport:['car','ticket'],family:['people','cat'],home:['room','chair','cat'],schedule:['course','class'],information:['teacher','shop','ticket'],classroom:['book','paper','chair'],daily:['meal','cup','book'],campus:['course','class','book'],health:['medicine','bottle'],renting:['room','chair'],services:['letter','shop','ticket'],worklife:['letter','paper','people'],travel:['ticket','room','photo'],social:['people','photo','cup']};
export function examplesFor(topic:string){const ids=topics[topic.replace('tw.','')];return ids?classifierExamples.filter(e=>ids.includes(e.id)):classifierExamples;}
export function classifierUnit(topic:string,title:string):Unit{
 const examples=topic==='all'?classifierExamples.filter(e=>['people','cup','bottle','book','ticket','car'].includes(e.id)):examplesFor(topic),id='classifiers:'+topic;
 const practice_sets:PracticeSet[]=(['reading','listening','speaking','writing'] as PracticeSkill[]).map(skill=>{
  const items:PracticeItem[]=examples.flatMap<PracticeItem>((e,i)=>{
   const base={id:`${id}:${skill}:${e.id}`,answers:e.accepted,choices:[],stimulus:null,explanation:`${e.measure} (${e.reading}): ${e.use}. ${e.phrase.hanzi} — ${e.phrase.vi}.`+(e.accepted.length>1?` Cũng chấp nhận: ${e.accepted.join(' / ')} trong ngữ cảnh này.`:''),evidence_index:null};
   if(skill==='reading')return [{...base,kind:'cloze-input',prompt:`Điền lượng từ để diễn đạt “${e.phrase.vi}”: ${e.phrase.hanzi.replace(e.measure,'＿＿')}`},{...base,id:base.id+':meaning',kind:'choice',prompt:`Câu “${e.hanzi}” có nghĩa gì?`,answers:[e.vi],choices:[e.vi,...examples.filter(x=>x.id!==e.id).slice(0,2).map(x=>x.vi)],evidence_index:i}];
   if(skill==='listening')return [{...base,kind:'dictation',prompt:'Nghe và gõ lại cả câu, chú ý lượng từ.',stimulus:e,answers:[e.hanzi]}];
   if(skill==='speaking')return [{...base,kind:'read-aloud',prompt:'Đọc cả câu, nối số lượng với lượng từ và danh từ.',stimulus:e,answers:[e.hanzi]},{...base,id:base.id+':respond',kind:'respond',prompt:`Hãy tự đặt một câu có cụm mang nghĩa “${e.phrase.vi}”.`,answers:[e.hanzi]}];
   return [{...base,kind:'write',prompt:`Viết một câu dùng “${e.phrase.vi}”. Sau khi nộp, đối chiếu với câu mẫu; có thể có nhiều cách viết đúng.`,answers:[e.hanzi]}];
  });
  return {id:`${id}:${skill}:v1`,title:`Lượng từ · ${title}`,skill,source:'authored',verification:'draft',reference:'Ví dụ do dự án biên soạn; chưa giáo viên duyệt.',passage:examples.map(({hanzi,pinyin,vi})=>({hanzi,pinyin,vi})),items};
 });
 return {id,title,description:'Ôn lượng từ bổ sung',words:[],grammar:[],dialogue:[],writing_prompt:'',character:'量',lessons:[],practice_sets};
}
