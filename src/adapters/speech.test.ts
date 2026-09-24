import {afterEach,describe,expect,it,vi} from 'vitest';
import {speech,configureSpeech} from './local';

class Utterance {
  voice:unknown;lang='';rate=1;
  onend=()=>{};onerror=(_event:{error:string})=>{};
  constructor(public text:string){}
}
afterEach(()=>{speech.stop();configureSpeech();vi.unstubAllGlobals();});
describe('TTS local và hủy phát',()=>{
  function setup(voices:unknown[]){
    const synth={getVoices:()=>voices,speak:vi.fn(),cancel:vi.fn()};
    vi.stubGlobal('window',{speechSynthesis:synth});vi.stubGlobal('SpeechSynthesisUtterance',Utterance);return synth;
  }
  it('gửi nguyên câu, dùng giọng đã chọn và tốc độ thường mặc định',async()=>{
    const first={voiceURI:'hanhan',lang:'zh-TW',localService:true},second={voiceURI:'yating',lang:'zh-TW',localService:true};
    const synth=setup([first,second]);configureSpeech({voice:'browser:yating',pace:'normal'});
    const pending=speech.speak('我是越南人，我是留學生。');
    expect(synth.speak).toHaveBeenCalledTimes(1);const utterance=synth.speak.mock.calls[0][0] as Utterance;
    expect(utterance.text).toBe('我是越南人，我是留學生。');expect(utterance.voice).toBe(second);expect(utterance.rate).toBe(1);
    utterance.onend();await pending;
  });
  it('không âm thầm đổi sang giọng khác khi giọng đã chọn không còn',async()=>{
    setup([{voiceURI:'other',lang:'zh-TW',localService:true}]);configureSpeech({voice:'browser:missing'});
    await expect(speech.speak('你好')).rejects.toThrow('chọn lại');
  });
  it('chọn đúng zh-TW local và báo lỗi phát từ trình duyệt',async()=>{
    const local={name:'Hanhan',lang:'zh-TW',localService:true};
    const synth=setup([{lang:'zh-CN',localService:true},{lang:'zh-TW',localService:false},local]);
    const pending=speech.speak('你好');const utterance=synth.speak.mock.calls[0][0] as Utterance;
    expect(utterance.voice).toBe(local);utterance.onerror({error:'audio-hardware'});
    await expect(pending).rejects.toThrow('audio-hardware');
  });
  it('dừng khi đang đọc kết thúc promise mà không báo lỗi',async()=>{
    const synth=setup([{lang:'zh-TW',localService:true}]);const pending=speech.speak('你好');
    speech.stop();(synth.speak.mock.calls[0][0] as Utterance).onerror({error:'interrupted'});
    await expect(pending).resolves.toBeUndefined();
  });
  it('thiếu voice local gọi native và hủy request đang chờ',async()=>{
    setup([{lang:'zh-TW',localService:false}]);let signal:AbortSignal|undefined;
    vi.stubGlobal('fetch',vi.fn((_url:string,options:RequestInit)=>new Promise((_resolve,reject)=>{
      signal=options.signal as AbortSignal;signal.addEventListener('abort',()=>reject(new DOMException('Cancelled','AbortError')));
    })));
    const pending=speech.speak('你好');speech.stop();await expect(pending).resolves.toBeUndefined();expect(signal?.aborted).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/api/ai/tts',expect.anything());
  });
});
