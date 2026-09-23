import {useEffect,useRef} from 'react';
/** Counts foreground time with activity in the last 30s; never counts a hidden tab. */
export function useActiveTimer(enabled:boolean){
 const elapsed=useRef(0),lastActivity=useRef(performance.now());
 useEffect(()=>{let previous=performance.now();const activity=()=>{lastActivity.current=performance.now();};const tick=setInterval(()=>{const now=performance.now();if(enabled&&document.visibilityState==='visible'&&document.hasFocus()&&now-lastActivity.current<30000)elapsed.current+=Math.min(now-previous,2000);previous=now;},1000);for(const name of ['pointerdown','keydown','input','focus'])window.addEventListener(name,activity);return()=>{clearInterval(tick);for(const name of ['pointerdown','keydown','input','focus'])window.removeEventListener(name,activity);};},[enabled]);
 return {consume(){const ms=Math.min(300000,Math.round(elapsed.current));elapsed.current=0;lastActivity.current=performance.now();return ms;},reset(){elapsed.current=0;lastActivity.current=performance.now();}};
}
