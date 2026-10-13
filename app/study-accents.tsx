import type { StudyId } from './study-config';

function Signature({kind}:{kind:number}) {
 if(kind===0)return <svg viewBox="0 0 330 22"><path d="M1 21V1h24M61 1v20h-24"/><path className="accent-fill" d="M88 2h4v18h-4zm9 0h1v18h-1zm7 0h5v18h-5zm12 0h2v18h-2zm9 0h1v18h-1zm6 0h5v18h-5zm12 0h3v18h-3zm10 0h1v18h-1zm7 0h4v18h-4z"/><path d="M192 11h138"/><circle cx="235" cy="11" r="7" className="accent-fill"/></svg>;
 if(kind===1)return <svg viewBox="0 0 255 22"><path d="M0 11h145"/><circle cx="164" cy="11" r="9"/><path d="M155 11h18M164 2v18M194 3l15 16m-7-16 15 16m-7-16 15 16M242 1h12v20h-12"/></svg>;
 if(kind===2)return <svg viewBox="0 0 305 24"><path d="M0 12h66m20 0h68m20 0h66"/><circle cx="8" cy="12" r="6" className="accent-fill"/><circle cx="94" cy="12" r="6"/><path d="m180 6 6 6-6 6m80-16v20m9-20v20m9-20v20m14-20v20m11-20v20"/></svg>;
 return <svg viewBox="0 0 175 28"><path d="M0 14h108m-6-6 8 6-8 6"/><circle cx="160" cy="14" r="13"/><path d="M160 5v17m-5-5 5 5 5-5"/></svg>;
}
export function StudyAccents({variant}:{variant:StudyId}) {
 return <div className={`study-accents accents-${variant}`} aria-hidden="true">
  {variant==='01'&&<><span className="edge-disc"/><span className="edge-angle"/><span className="edge-slots"><i/><i/><i/></span><span className="edge-cut"/></>}
  {variant==='02'&&[0,1,2,3].map(i=><span key={i} className={`signature signature-${i}`}><Signature kind={i}/></span>)}
  {variant==='03'&&<><span className="instrument-rule instrument-rule--left"/><span className="instrument-rule instrument-rule--right"/>{['tl','tr','bl','br'].map(p=><span key={p} className={`instrument-cross instrument-${p}`}/>)}<span className="instrument-scale">{Array.from({length:24},(_,i)=><i key={i}/>)}</span></>}
  {variant==='04'&&<><svg className="orbit orbit-one" viewBox="0 0 240 100"><ellipse cx="120" cy="50" rx="116" ry="32"/><ellipse cx="120" cy="50" rx="116" ry="32" transform="rotate(-16 120 50)"/><circle cx="218" cy="32" r="5"/></svg><svg className="orbit orbit-two" viewBox="0 0 110 110"><circle cx="55" cy="55" r="46"/><path d="M55 0v110M0 55h110"/><circle cx="55" cy="9" r="6"/></svg><span className="orbit-dash"/><span className="orbit-bottom"/></>}
  {variant==='05'&&['tl','tr','bl','br'].map((p,n)=><span key={p} className={`pixel-mark pixel-${p}`}>{Array.from({length:16},(_,i)=><i key={i} className={(i*7+n*3)%11<5?'lit':''}/>)}</span>)}
 </div>;
}
