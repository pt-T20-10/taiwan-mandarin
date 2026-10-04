import type {PracticeItem} from './types';
import {verbPacket,verbUnit} from './verbs';
type Question=Omit<PracticeItem,'id'|'stimulus'|'evidence_index'>;
const choice=(prompt:string,answer:string,others:string[],explanation:string):Question=>({kind:'choice',prompt,answers:[answer],choices:[answer,...others],explanation});
const fill=(prompt:string,answers:string[],explanation:string):Question=>({kind:'cloze-input',prompt:prompt.includes('＿＿')?prompt.replace('＿＿','___'):prompt+' Câu hoàn chỉnh: ___.',answers,choices:[],explanation});
export const verbLessons=[
 {id:'recognize',title:'1. Nhận biết động từ',notes:['Đơn âm/song âm nói về số âm tiết, không nói động từ có tân ngữ hay có tách được không. 看 là đơn âm; 參加 là song âm.','Động từ li hợp cũng thường có hai âm tiết. Không phải mọi từ hai chữ đều là li hợp: 參加, 休息 không tách theo mẫu 見面.','Từ loại gắn với nghĩa trong câu. Hãy đọc cả mẫu dùng thay vì đoán chỉ từ mặt chữ.'],related:[],questions:[
 choice('Từ nào có một âm tiết?','看',['參加','休息'],'看 đọc kàn, có một âm tiết.'),
 choice('Từ nào có hai âm tiết?','討論',['買','聽'],'討論 đọc tǎolùn, có hai âm tiết.'),
 choice('Thấy một động từ có hai chữ, có thể kết luận gì?','Cần xem âm đọc và cách dùng của từ',['Luôn có thể tách hai chữ','Luôn có tân ngữ theo sau'],'Số âm tiết và tính li hợp là hai tiêu chí khác nhau.'),
 choice('Cặp nào đều là động từ song âm nhưng khác tính li hợp?','參加 / 見面',['看 / 見面','買 / 聽'],'參加 không tách như 見面; cả hai đều có hai âm tiết.'),
 choice('Trong 我買了兩本書, phần nào là động từ mua?','買',['兩本','書'],'買 là hành động; 兩本書 là đối tượng được mua.'),
 choice('Cách học phù hợp nhất cho từ mới là gì?','Học từ cùng câu và mẫu kết hợp',['Tách mọi từ hai chữ','Chỉ đếm số chữ rồi đoán ngữ pháp'],'Ví dụ thực tế giúp biết vị trí đối tượng và thành phần có thể chen vào.'),
 ]},
 {id:'objects',title:'2. Động từ và tân ngữ',notes:['Tân ngữ nêu người/vật hoặc nội dung liên quan đến động từ: 看書, 參加活動. Động từ có thể nhận tân ngữ không có nghĩa lúc nào cũng phải nói ra tân ngữ.','買書 là cụm động từ + tân ngữ, không tự động là một từ li hợp. Trong 我想休息, 休息 không cần đối tượng theo sau.','Với 見面, học mẫu 跟／和某人見面. Với 幫忙, mẫu nhập môn là 幫某人一個忙; cách dùng tại Đài Loan có biến thể, không chấm mọi trường hợp bằng một quy tắc cấm tuyệt đối.'],related:['跟','可以'],questions:[
 choice('Trong 我參加活動, tân ngữ là gì?','活動',['我','參加'],'活動 là hoạt động được tham gia.'),
 choice('Chọn câu diễn đạt “Tôi muốn nghỉ ngơi”.','我想休息。',['我想休息他。','我想休他息。'],'休息 trong nghĩa nghỉ ngơi không nhận 他 làm tân ngữ và không tách theo mẫu này.'),
 choice('Diễn đạt “Ngày mai tôi gặp cô ấy”.','我明天跟她見面。',['我明天見面她。','我明天跟見面她。'],'Dùng 跟她 trước 見面 để nêu người gặp.'),
 choice('買書 trong “mua sách” là gì?','Cụm động từ + tân ngữ',['Một từ li hợp chắc chắn vì có hai chữ','Một lượng từ'],'買 kết hợp với tân ngữ 書; không đồng nhất mọi kết cấu động–tân với từ li hợp.'),
 fill('Điền động từ “tham gia”: 我想＿＿這個活動。',['參加'],'參加 nhận 這個活動 làm tân ngữ.'),
 choice('Khi được hỏi “Ai mua vé?”, 我買了 có thể đủ ý không?','Có, khi ngữ cảnh đã rõ thứ được mua',['Không, 買 luôn bắt buộc nêu vật mua','Có, vì 買 không bao giờ nhận tân ngữ'],'Có thể lược tân ngữ đã biết; không thay đổi khả năng nhận tân ngữ của 買.'),
 ]},
 {id:'separable',title:'3. Dạng liền và dạng tách',notes:['Một số động từ cho phép chen thành phần vào giữa: 洗澡 → 洗了個澡, 見面 → 見了一次面. Hai phần vẫn cùng diễn đạt hành động gốc.','了 và 過 trong các mẫu này đứng sau phần động từ: 打過工. Tuy nhiên, 了 cuối câu còn có chức năng khác; 見面了 không tự động sai.','Không phải từ nào cũng dùng được tất cả kiểu tách. Học theo cặp ví dụ được soạn cho từng từ.'],related:['已經','過'],questions:[
 choice('Chọn mẫu “đã tắm một lần”.','洗了個澡',['洗澡了個','洗個了澡'],'了 và 個 nằm giữa 洗 và 澡 trong mẫu này.'),
 choice('Chọn mẫu “đã gặp nhau một lần”.','見了一次面',['見面一次了次','見一次了面'],'一次 bổ sung số lần gặp ở giữa 見 và 面.'),
 fill('Điền 過 vào đúng chỗ bằng cách gõ cả cụm: 打＿＿工 (từng làm thêm).',['打過工'],'過 đặt sau 打 để nói trải nghiệm làm thêm.'),
 choice('Mẫu nào giữ 參加 nguyên từ?','參加了活動',['參了加活動','參活動加了'],'參加 không phải động từ li hợp theo mẫu của bài này.'),
 choice('我已經報了名 có nghĩa gì?','Tôi đã đăng ký rồi',['Tôi muốn hỏi tên','Tôi chưa đăng ký'],'報名 được tách thành 報了名 trong câu này.'),
 choice('Gặp câu 他們見面了, nên nhận xét thế nào?','Xem ngữ cảnh; 了 cuối câu có thể hợp lệ',['Luôn sai vì 了 không chen giữa','Luôn phải bỏ 面'],'Không áp quy tắc 了 giữa hai phần cho mọi chức năng của 了.'),
 ]},
 {id:'duration',title:'4. Thời gian và số lần',notes:['Phân biệt thời điểm với thời lượng: 九點上班 là đi làm lúc chín giờ; 上了八個小時的班 là làm việc tám tiếng.','Với một số hành động, thời lượng có thể chen giữa hoặc dùng mẫu lặp động từ: 睡了八個小時的覺 / 睡覺睡了八個小時.','Không đổi thời gian sau một sự kiện thành thời lượng thực hiện sự kiện. 結婚三年了 thường nói đã kết hôn được ba năm, không phải lễ cưới kéo dài ba năm.'],related:['幾點','從','已經'],questions:[
 choice('我九點上班 nêu điều gì?','Thời điểm bắt đầu làm việc',['Làm việc chín tiếng','Đã làm chín ngày'],'九點 là chín giờ trên đồng hồ.'),
 choice('我上了八個小時的班 nêu điều gì?','Đã làm việc tám tiếng',['Bắt đầu lúc tám giờ','Nghỉ phép tám ngày'],'八個小時 là thời lượng làm việc.'),
 fill('Xếp thành câu “Tôi đã xin nghỉ hai ngày”: 我 / 請 / 了 / 兩天 / 假',['我請了兩天假','我請了兩天的假'],'兩天 nằm giữa 請 và 假; cả hai cách có/không có 的 được chấp nhận ở đây.'),
 choice('我們見了兩次面 có nghĩa gì?','Chúng tôi đã gặp nhau hai lần',['Chúng tôi gặp lúc hai giờ','Chúng tôi gặp nhau hai tiếng'],'兩次 đếm số lần gặp.'),
 fill('Xếp câu “Tôi đã ngủ tám tiếng”: 我 / 睡 / 了 / 八個小時 / 的 / 覺',['我睡了八個小時的覺','我睡了八個小時覺','我睡覺睡了八個小時'],'Có thể chen thời lượng hoặc lặp động từ theo mẫu đã học.'),
 choice('他們結婚三年了 thường có nghĩa gì?','Họ đã kết hôn được ba năm',['Đám cưới kéo dài ba năm','Họ đã cưới ba lần'],'Thời gian tính từ sự kiện kết hôn; không phải thời lượng tổ chức lễ cưới.'),
 ]},
 {id:'brief',title:'5. Hành động ngắn và lặp động từ',notes:['Với động từ hành động phù hợp, lặp lại có thể diễn đạt làm thử/làm một chút hoặc làm lời đề nghị nhẹ hơn: 看看, 看一看.','Một số động từ song âm không li hợp dùng ABAB: 討論討論. Li hợp thường gặp mẫu AAB: 散散步, 聊聊天.','Không lặp máy móc mọi động từ: 喜歡 và 生病 không dùng như 看看 trong các mẫu này. 一下 cũng cần xét cách kết hợp: 看一下, 幫一下忙.'],related:['一下','想'],questions:[
 choice('Chọn cách mời “xem thử một chút”.','看一看',['看一個看','看看的看'],'V一V là một mẫu lặp của động từ đơn âm 看.'),
 choice('Chọn mẫu lặp thường dùng của 討論.','討論討論',['討討論','討論論'],'Động từ song âm này dùng mẫu ABAB.'),
 choice('Chọn cách đề nghị đi dạo một chút.','散散步',['散步散','散步步'],'散步 dùng mẫu AAB trong ví dụ này.'),
 fill('Điền phần còn thiếu để nói chuyện một chút: 聊聊＿＿',['天'],'聊天 → 聊聊天, không dùng một công thức ABAB cho mọi từ.'),
 choice('Có nên tự biến 生病 thành 生生病 để nói “ốm một chút” không?','Không; mẫu lặp này không phù hợp',['Có; mọi từ li hợp đều dùng AAB','Có; mọi động từ đều phải lặp'],'生病 biểu thị thay đổi trạng thái; không áp mẫu hành động thử/ngắn một cách máy móc.'),
 choice('Chọn lời nhờ giúp một chút.','請幫一下忙。',['請幫一忙下。','請忙一下幫。'],'一下 chen giữa 幫 và 忙 trong mẫu này.'),
 ]},
 {id:'conversation',title:'6. Dùng động từ trong giao tiếp',notes:['Gắn mẫu động từ với mục đích nói: 跟朋友見面, 向老師道歉, 請兩天假.','Học cả câu để biết đối tượng đứng đâu. 請幫我一個忙 có 我 ở giữa; không suy tất cả động từ li hợp đều cấm mọi đối tượng.','Luyện nói/viết ở phần Theo chủ đề. Bài mở có nhiều đáp án hợp lệ; câu mẫu chỉ để đối chiếu.'],related:['跟','可以','過'],questions:[
 choice('Bạn muốn nhờ ai đó giúp một việc. Chọn câu phù hợp.','請幫我一個忙。',['請我一個幫忙。','請幫一個我忙。'],'Người được giúp 我 đứng sau 幫, trước 一個忙.'),
 choice('Bạn muốn xin lỗi thầy/cô. Chọn câu phù hợp.','我想向老師道歉。',['我想道歉老師。','我想向道歉老師。'],'向老師 đứng trước 道歉 trong mẫu này.'),
 fill('Xếp câu hẹn gặp ngày mai: 我 / 明天 / 跟朋友 / 見面',['我明天跟朋友見面','明天我跟朋友見面'],'Có thể đặt thời gian trước hoặc sau chủ ngữ.'),
 choice('我要先掛號 diễn đạt việc gì?','Tôi cần đăng ký khám trước',['Tôi đã xuất viện','Tôi cần mua vé tàu'],'掛號 trong ngữ cảnh đi khám là đăng ký khám.'),
 choice('我在那裡打過工 diễn đạt điều gì?','Tôi từng làm thêm ở đó',['Tôi sẽ nghỉ học ở đó','Tôi đang tìm đường đến đó'],'打過工 nêu trải nghiệm; 過 nằm giữa 打 và 工.'),
 choice('“Xin nghỉ hai ngày” và “họp hai tiếng” dùng cặp nào?','請兩天假 / 開兩個小時的會',['請兩個小時的假 / 開兩天會','請兩次假 / 開兩次會'],'天 đo ngày nghỉ; 個小時 đo thời lượng họp. Chọn theo đúng ý, không chỉ theo hình thức.'),
 ]},
];
export function verbLessonUnit(id:string){const lesson=verbLessons.find(l=>l.id===id)!;return verbUnit('lesson:'+id,lesson.title,[verbPacket(`verbs:lesson:${id}:v1`,lesson.title,'reading',lesson.questions.map((q,i)=>({...q,id:`verbs:lesson:${id}:${i+1}`,stimulus:null,evidence_index:null})))]);}
