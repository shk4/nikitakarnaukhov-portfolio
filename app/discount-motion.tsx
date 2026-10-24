"use client";
import { MediaSvgImage } from "./media-image";

import { useEffect, useRef, useState } from "react";
import specs from "./discount-specs.json";

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*x*(x*(x*6-15)+10);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const groups=["Продукт","Список продуктов","Заказ"];
const stages=["Проанализировал все скидки","Систематизировал","Перевёл в интерфейс"];

// Reuses the approved editorial source's data, timings, grouping and original
// Figma dialogs. Vector text and geometry remain sharp at any viewport density.
export function DiscountMotion(){
 const root=useRef<HTMLDivElement>(null);
 const clock=useRef(0);
 const [time,setTime]=useState(0);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  if(reduced.matches){clock.current=9.4;setTime(9.4);setPaused(true);return;}
 },[]);
 useEffect(()=>{
  let visible=false,frame=0,last=0,rendered=0;
  const tick=(now:number)=>{
   frame=0;
   if(visible&&!paused&&!document.hidden){
    if(last)clock.current=(clock.current+Math.min((now-last)/1000,.1))%11.6;
    if(now-rendered>32){setTime(clock.current);rendered=now;}
    last=now;
   }else last=0;
   if(visible&&!paused&&!document.hidden)frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
   last=0;
   if(visible&&!paused&&!document.hidden){if(!frame)frame=requestAnimationFrame(tick);}
   else{cancelAnimationFrame(frame);frame=0;}
  };
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});
  if(root.current)observer.observe(root.current);
  document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',sync);};
 },[paused]);
 const phase=time<3.2?0:time<6.35?1:2;
 const organized=ease((time-3.2)/.85),leaving=ease((time-6)/.4),enter=ease((time-6.35)/.55),selected=ease((time-5.45)/.25);
 const words=ease((time-3.6)/.42);
 const panel=time<7.7?"amount":time<8.7?"0":time<10.15?"1":"2";
 return <div className="discount-motion" ref={root}>
  <svg viewBox="0 0 1920 1080" role="img" aria-label="Цены и скидки: двенадцать формул объединяются в три группы, затем переходят в интерфейс форматирования скидки">
   <rect width="1920" height="1080" fill="#131414"/>
   {stages.map((label,i)=><g key={label} transform={`translate(${112+574*i} 0)`}>
    <text x="0" y="91" className="dm-mono" fontSize="33" fill={phase===i?"#d9ff62":"#747b74"}>0{i+1}</text>
    <text x="68" y="89" fontSize="21" fill={phase===i?"#f0f0e9":"#a2a5a0"}>{label}</text>
    <path d="M0 125H536" stroke="#383b37"/>
    {i<=phase&&<path d={`M0 125H${536*ease((time-[0,3.2,6.35][i])/.35)}`} stroke={phase===i?"#d9ff62":"#707b50"} strokeWidth="2"/>}
   </g>)}
   <g opacity={1-leaving}>
    <text x="112" y="225" fontSize="32" fill="#f0f0e9" opacity={1-organized}>Формулы в HTML-шаблонах</text>
    <g opacity={organized}>{groups.map((title,k)=><g key={title} transform={`translate(${112+k*574} 272)`}>
     <rect width="548" height="574" rx="20" fill={k===0&&selected?"#252c20":"#1c1f1c"} stroke={k===0&&selected?"#d9ff62":"#303630"}/>
     <text x="24" y="51" fontSize="29" fill="#f0f0e9">{title}</text>
     <path d="M24 66H524" stroke="#383b37"/>
    </g>)}</g>
    {specs.map((spec,i)=>{
     const [group,row,title,context,expression]=spec as [number,number,string[],string,string, string[]];
     const motion=ease((time-3.25-group*.09-row*.025)/1.05),appear=1-Math.pow(1-clamp((time-.17-Math.floor(i/4)*.19-(i%4)*.055)/.55),3);
     const x=mix(112+(i%4)*434,136+group*574,motion),y=mix(272+Math.floor(i/4)*198+14*(1-appear),356+row*119,motion);
     const w=mix(394,500,motion),h=mix(178,109,motion);
     return <g key={i} transform={`translate(${x} ${y})`} opacity={appear*(group>0?1-.25*selected:1)}>
      <rect x=".5" y=".5" width={w-1} height={h-1} rx="12" fill="#242924" stroke="#414a3f"/>
      <g opacity={1-words}><text x="20" y="35" className="dm-mono" fontSize="15" fill="#849579">{String(i+1).padStart(2,"0")}</text>
       <text x="58" y="35" fontSize="15" fill="#a2ada0">{context}</text><path d={`M20 49H${w-20}`} stroke="#414a3f"/>
       <text x="20" y="105" className="dm-mono" fontSize="18" fill="#d9ff62">{expression}</text>
      </g>
      <g opacity={words}>{title.map((line,q)=><text key={q} x="20" y={39+q*27} fontSize="25" fill="#f0f0e9">{line}</text>)}<text x="20" y="96" fontSize="16" fill="#a2a5a0">{context}</text></g>
     </g>;
    })}
   </g>
   <g opacity={enter}>
    <text x="112" y="318" fontSize="52" fill="#f0f0e9">Сложность — в системе.</text>
    <text x="112" y="383" fontSize="52" fill="#d9ff62">Простота — в интерфейсе.</text>
    {groups.map((title,i)=><g key={title} transform={`translate(112 ${477+i*91})`}>
     <rect width="632" height="72" rx="12" fill={i===0?"#29321d":"#1c1f1c"} stroke={i===0?"#d9ff62":"#383b37"}/>
     <text x="24" y="47" fontSize="25" fill={i===0?"#d9ff62":"#a2a5a0"}>{title}</text>
     {i===0&&<g><circle cx="598" cy="36" r="11" fill="#d9ff62"/><path d="m593 36 4 4 7-8" fill="none" stroke="#131414" strokeWidth="2"/></g>}
    </g>)}
    <text x="112" y="826" fontSize="19" fill="#a2a5a0">Формат · округление · пример результата</text>
    <path d="M744 513H879V561H1083" fill="none" stroke="#d9ff62" strokeWidth="1.6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ease((time-6.53)/.46)}/>
    <rect x="1096" y="222" width="662" height="684" rx="20" fill="#343b30"/>
    <MediaSvgImage href={`/media/discount-system/dialog-${panel}.png`} x="1100" y="226" width="654" height="676" preserveAspectRatio="none"/>
   </g>
   <path d="M112 950H1808" stroke="#383b37"/>
  </svg>
 </div>;
}
