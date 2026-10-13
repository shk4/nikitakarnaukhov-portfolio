"use client";
import { usePathname } from "next/navigation";
export function RhythmMarks({fixed=false}:{fixed?:boolean}){
 return <div className={`rhythm-marks${fixed?' rhythm-marks--fixed':''}`} aria-hidden="true">
  {['top-left','top-right','left','right','bottom-left','bottom-right'].map(position=><span key={position} className={`rhythm-mark rhythm-mark--${position}`}><i/><i/></span>)}
 </div>;
}
export function FixedRhythm(){ return usePathname()==='/fixed' ? <RhythmMarks fixed/> : null; }
