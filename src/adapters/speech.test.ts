import {afterEach,describe,expect,it,vi} from 'vitest';
import {speech} from './local';

class Utterance {
  voice:unknown;lang='';rate=1;
  onend=()=>{};onerror=(_event:{error:string})=>{};
  constructor(public text:string){}
}
afterEach(()=>{speech.stop();vi.unstubAllGlobals();});
describe('TTS local và hủy phát',()=>{
  function setup(voices:unknown[]){
    const synth={getVoices:()=>voices,speak:vi.fn(),cancel:vi.fn()};
    vi.stubGlobal('window',{speechSynthesis:synth});vi.stubGlobal('SpeechSynthesisUtterance',Utterance);return synth;
  }
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
