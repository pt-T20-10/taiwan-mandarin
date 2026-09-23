import {useEffect,useRef,useState} from 'react';
import {matchesStroke,strokeModels,strokeSource,type Stroke,type Point} from '../core/strokes';

export function Handwriting({initial='一',onComplete}:{initial?:string;onComplete:(character:string)=>void}){
  const [char,setChar]=useState(strokeModels[initial]?initial:'一');
  const [mode,setMode]=useState('trace'),[count,setCount]=useState(0),[message,setMessage]=useState('');
  const [animation,setAnimation]=useState<{index:number;progress:number}|null>(null);
  const canvas=useRef<HTMLCanvasElement>(null),drawing=useRef<Stroke>([]),accepted=useRef<Stroke[]>([]),down=useRef(false);
  const frame=useRef<number>(0),expected=strokeModels[char];
  function stopAnimation(){cancelAnimationFrame(frame.current);setAnimation(null);}
  function redraw(){
    const context=canvas.current?.getContext('2d');if(!context)return;
    context.clearRect(0,0,300,300);context.strokeStyle='#245f50';context.lineWidth=8;context.lineCap='round';context.lineJoin='round';
    for(const stroke of [...accepted.current,...(down.current?[drawing.current]:[])]){
      context.beginPath();stroke.forEach((p,i)=>i?context.lineTo(...p):context.moveTo(...p));context.stroke();
    }
  }
  function reset(){down.current=false;accepted.current=[];drawing.current=[];setCount(0);setMessage('');stopAnimation();redraw();}
  useEffect(()=>{setChar(strokeModels[initial]?initial:'一');},[initial]);
  useEffect(()=>{reset();return()=>cancelAnimationFrame(frame.current);},[char,mode]);
  function point(e:React.PointerEvent):Point{const r=e.currentTarget.getBoundingClientRect();return[(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*300/r.height];}
  function end(e:React.PointerEvent){
    if(!down.current)return;drawing.current.push(point(e));down.current=false;
    const next=accepted.current.length;
    if(expected[next]&&matchesStroke(drawing.current,expected[next])){
      accepted.current.push(drawing.current);setCount(next+1);
      const complete=next+1===expected.length;
      setMessage(complete?'Đủ nét và đúng hướng theo mẫu. Không phải điểm thư pháp.':`Đúng nét ${next+1}. Tiếp tục nét kế.`);
      if(complete)onComplete(char);
    }else setMessage(`Nét ${next+1} chưa khớp vị trí, hướng hoặc đường đi. Hãy thử lại nét này.`);
    drawing.current=[];redraw();
  }
  function play(){
    reset();const started=performance.now();
    const tick=(now:number)=>{const elapsed=(now-started)/1100,index=Math.floor(elapsed);if(index>=expected.length){setAnimation(null);return;}
      setAnimation({index,progress:Math.min(1,(elapsed-index)/.8)});frame.current=requestAnimationFrame(tick);};
    frame.current=requestAnimationFrame(tick);
  }
  const hints=mode!=='memory'||animation!==null;
  return <section className="panel">
    <div className="section-title"><h3>Luyện nét bằng chuột</h3><span className="tag">{count}/{expected.length} nét</span></div>
    <div className="actions"><label>Chữ <select value={char} onChange={e=>setChar(e.target.value)}>{Object.keys(strokeModels).map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Gợi ý <select value={mode} onChange={e=>setMode(e.target.value)}><option value="trace">Tô theo mẫu</option><option value="faint">Mẫu nhạt</option><option value="memory">Tự nhớ</option></select></label></div>
    {!strokeModels[initial]&&<p className="notice">Chưa có mẫu nét cho chữ {initial}. Bạn có thể chọn chữ cơ bản trong danh sách.</p>}
    <div className="writing-pad"><svg viewBox="0 0 300 300" aria-hidden="true">
      <path d="M150 0V300M0 150H300M0 0L300 300M300 0L0 300" stroke="#dfd9cb" strokeDasharray="5 5"/>
      {hints&&expected.map((stroke,i)=><g key={i}>
        <path d={'M'+stroke.map(p=>p.join(',')).join(' L')} fill="none" stroke="#c5cbbb" strokeWidth={mode==='faint'?3:11} strokeLinecap="round" strokeLinejoin="round" opacity={animation&&i>animation.index ? .25 : 1}/>
        {animation?.index===i&&<path d={'M'+stroke.map(p=>p.join(',')).join(' L')} fill="none" stroke="#d88145" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-animation.progress}/>}
        {mode==='trace'&&!animation&&i===count&&<text x={stroke[0][0]-18} y={stroke[0][1]-9} fill="#526b5c" fontSize="15">{i+1}</text>}
      </g>)}
    </svg><canvas ref={canvas} width="300" height="300" aria-label="Ô luyện nét" onPointerDown={e=>{if(accepted.current.length>=expected.length||down.current)return;stopAnimation();e.currentTarget.setPointerCapture(e.pointerId);down.current=true;drawing.current=[point(e)];}}
      onPointerMove={e=>{if(down.current){drawing.current.push(point(e));redraw();}}} onPointerUp={end} onPointerCancel={()=>{down.current=false;drawing.current=[];redraw();}}/></div>
    <div className="actions"><button onClick={play}>Xem thứ tự nét</button><button onClick={reset}>Làm lại</button></div><p role="status">{message}</p>
    <small>Mẫu hình học tự biên soạn; thứ tự và hướng đã đối chiếu MOE. Đường nét được giản lược để luyện chuột, không chấm thư pháp.</small>
    <details><summary>Nguồn đối chiếu nét</summary><p>MOE Taiwan, kiểm tra ngày 23/09/2026. Đã đối chiếu {expected.length} nét của chữ {char}; không phân phối hình hoặc hoạt họa của MOE.</p><small>{strokeSource(char)}</small></details>
  </section>;
}
