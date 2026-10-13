import type { StudyId } from './study-config';

/** Decorative marks stay in the margins, independently of the reading grid. */
function Pixels({seed=0}:{seed?:number}) {
 return <span className="mix-pixels">{Array.from({length:16},(_,i)=><i key={i} className={(i*5+seed*3)%13<6?'on':''}/>)}</span>;
}
function Ticks(){return <span className="mix-ticks">{Array.from({length:13},(_,i)=><i key={i}/>)}</span>}
function Mark({index}:{index:number}){
 return <span className={`mix-mark mark-${index%5}`}>
  {index%5===0?<span className="mix-ring"/>:index%5===1?<Pixels seed={index}/>:index%5===2?<><span className="mix-plus"/><Ticks/></>:index%5===3?<span className="mix-angle"/>:<><Ticks/><span className="mix-plus"/></>}
 </span>;
}
/** Kept outside the animated main so viewport anchors never follow its transform. */
export function WorkbenchViewportPixels(){
 return <div className="workbench-pixels" aria-hidden="true">{['tl','tr','bl','br'].map((side,i)=><span key={side} className={`workbench-pixel workbench-pixel-${side}`}><Pixels seed={i<2?1:3}/></span>)}</div>;
}
export function PageAccents({variant}:{variant:StudyId}){
 if(Number(variant)<6||variant==='09')return null;
 if(variant==='07'||variant==='10'||variant==='11')return <div className="page-accents page-accents-07" aria-hidden="true"><div className="page-rule page-rule-left"/><div className="page-rule page-rule-right"/></div>;
 return <>
  <div className={`page-accents page-accents-${variant}`} aria-hidden="true">
   <div className="page-rule page-rule-left"/><div className="page-rule page-rule-right"/>
   {['left','right'].map((side,n)=><div key={side} className={`margin-marks margin-marks-${side}`}>{Array.from({length:18},(_,i)=><Mark key={i} index={i+n*2}/>)}</div>)}
  </div>
  {variant==='08'&&<div className="signal-frame" aria-hidden="true"><span className="signal-progress"/>{['tl','tr','bl','br'].map((side,i)=><span key={side} className={`signal-corner signal-${side}`}>{i%2?<Pixels seed={i}/>:<span className="mix-plus"/>}</span>)}</div>}
 </>;
}
export function MixHeroAccents({variant}:{variant:StudyId}){
 if(variant==='09')return null;
 if(variant==='07'||variant==='10'||variant==='11')return <div className="mix-hero-accents mix-hero-07" aria-hidden="true">{['tl','tr','bl','br'].map(side=><span key={side} className={`workbench-corner workbench-corner-${side}`}><Ticks/><span className="mix-plus"/></span>)}</div>;
 return <div className={`mix-hero-accents mix-hero-${variant}`} aria-hidden="true">
  <span className="mix-hero-left"><span className="mix-plus"/><Ticks/><Pixels seed={Number(variant)}/></span>
  <span className="mix-hero-right"><Pixels seed={2}/><Ticks/><span className="mix-plus"/></span>
  <span className="mix-hero-bottom"><Ticks/><span className="mix-plus"/></span>
 </div>;
}
