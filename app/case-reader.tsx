'use client';
import { useState, type ReactNode } from 'react';

type Props={className:string;accents:ReactNode;navigation:ReactNode;hero:ReactNode;detailed:ReactNode;summary:ReactNode;after:ReactNode};
/** Only the active reading mode is mounted, including its media and disclosures. */
export function CaseReader({className,accents,navigation,hero,detailed,summary,after}:Props){
 const [mode,setMode]=useState<'detailed'|'tldr'>('detailed');
 return <main id="top" className={className} data-reading-mode={mode}>
  {accents}
  <nav className="case-project-nav" aria-label="Навигация по проектам">
   {navigation}
   <div className="case-reading-switch" role="group" aria-label="Объём текста кейса">
    <button type="button" aria-pressed={mode==='detailed'} aria-controls="case-reading-content" onClick={()=>setMode('detailed')}>Подробно</button>
    <button type="button" aria-pressed={mode==='tldr'} aria-controls="case-reading-content" onClick={()=>setMode('tldr')}>TLDR</button>
   </div>
  </nav>
  {hero}
  <article id="case-reading-content" className="notion-page notion-page--case" aria-label={mode==='detailed'?'Подробный кейс':'Краткий кейс'}>{mode==='detailed'?detailed:summary}</article>
  {after}
 </main>;
}
