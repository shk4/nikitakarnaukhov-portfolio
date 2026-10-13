import { useId } from 'react';
import type { StudyId } from './study-config';
import type { ProjectSlug } from './project-art';
import { Tile } from './study-covers';
import { ArtCrop } from './studio-art';
import vectors from './atlas-vectors.json';

type Box=[number,number,number,number];
function Detail({box,to,source='ds-1.webp',radius=12}:{box:Box;to:Box;source?:keyof typeof vectors;radius?:number}){
 const id=useId().replace(/:/g,'');
 const inner=vectors[source].replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 return <svg x={to[0]} y={to[1]} width={to[2]} height={to[3]} viewBox={box.join(' ')} overflow="hidden">
  <defs><clipPath id={`detail-${id}`}><rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} rx={radius*box[2]/to[2]}/></clipPath></defs>
  <g clipPath={`url(#detail-${id})`} dangerouslySetInnerHTML={{__html:inner}}/>
 </svg>;
}
function Plus({x,y,size=22}:{x:number;y:number;size?:number}){return <path d={`M${x-size/2} ${y}h${size}M${x} ${y-size/2}v${size}`} fill="none" stroke="#d9ff62" strokeWidth="2"/>}
function Handles({x,y,w,h}:{x:number;y:number;w:number;h:number}){return <g stroke="#a9c765" strokeWidth="2" fill="#232623"><rect x={x} y={y} width={w} height={h} fill="none"/>{[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([a,b],i)=><rect key={i} x={a-6} y={b-6} width="12" height="12"/>)}</g>}
function Photo({kind,x,y,w,angle=0}:{kind:number;x:number;y:number;w:number;angle?:number}){
 const boxes:Box[]=[[995,895,128,157],[1207,895,180,157],[1456,895,142,157]];
 const h=w*1.16;
 return <g className="mix-photo" transform={`rotate(${angle} ${x+w/2} ${y+h/2})`}>
  <rect x={x-14} y={y-14} width={w+28} height={h+28} rx="24" fill="#d4d4ce"/>
  <ArtCrop file="shot-08.webp" from={boxes[kind%3]} to={[x,y,w,h]} radius={14}/>
 </g>;
}

/** Field: a deliberately oversized detail, framed by the product's larger canvas. */
function Field({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <>
   <g className="field-underlay" transform="rotate(-8 900 600)"><Tile sample="builder" x={-500} y={80} w={2020} chrome/></g>
   <g className="field-focus" transform="rotate(-8 1170 620)"><Tile sample="spacing" x={804} y={239} w={858}/><Handles x={778} y={213} w={910} h={726}/></g>
  </>;
  case 'email-personalization':return <>
   <g className="field-underlay" transform="rotate(-9 900 600)"><Tile sample="date" x={-330} y={100} w={900}/><Tile sample="decimal" x={1270} y={500} w={870}/></g>
   <g className="field-focus" transform="rotate(-6 900 600)"><Tile sample="text" x={500} y={174} w={914}/><Plus x={472} y={152}/><Plus x={1440} y={1045}/></g>
  </>;
  case 'image-gallery':return <>
   <Photo kind={1} x={125} y={236} w={480} angle={-13}/><Photo kind={2} x={1180} y={210} w={460} angle={12}/><Photo kind={0} x={580} y={102} w={565} angle={-3}/>
   <g className="field-focus"><ArtCrop file="shot-08.webp" from={[736,472,882,47]} to={[269,940,1260,67]} radius={12}/><Plus x={250} y={914}/><Plus x={1548} y={1034}/></g>
  </>;
  case 'campaigns-redesign':return <>
   <g className="field-underlay" transform="rotate(-9 900 600)"><Tile sample="campaigns" x={-120} y={-200} w={2280} chrome/></g>
   <g className="field-focus" transform="rotate(-9 1000 650)"><ArtCrop file="shot-10.webp" from={[450,338,1200,616]} to={[188,204,1620,832]} radius={24}/></g>
  </>;
  case 'design-system':return <>
   <g className="field-underlay" transform="rotate(-8 900 600)"><Tile sample="inputs" x={-150} y={-270} w={1850}/><Tile sample="buttons" x={-510} y={720} w={2400}/></g>
   <g className="field-focus" transform="rotate(-8 900 600)"><Detail box={[389,276,231,56]} to={[260,485,1038,252]} radius={32}/><Tile sample="button-props" x={1190} y={140} w={482}/></g>
  </>;
 }
}

/** Workbench: real screens are collected in a dark, tactile project folio. */
function Folio({slug}:{slug:ProjectSlug}){
 const id=useId().replace(/:/g,'');
 return <g className="folio-object">
  <defs><clipPath id={`folio-pocket-${id}`}><rect x="0" y="0" width="1800" height="796"/></clipPath></defs>
  <path d="M278 350Q278 318 310 318H680Q704 318 725 339L774 387H1485Q1518 387 1518 420V1020H278Z" fill="#41463e"/>
  <g clipPath={`url(#folio-pocket-${id})`}>
  <g className="folio-leaf folio-back">
   {slug==='email-builder-settings'&&<Tile sample="builder" x={400} y={213} w={1120} angle={9} chrome/>}
   {slug==='email-personalization'&&<Tile sample="decimal" x={766} y={151} w={638} angle={12}/>}
   {slug==='image-gallery'&&<><Photo kind={2} x={1120} y={236} w={350} angle={14}/><Photo kind={1} x={745} y={144} w={430} angle={4}/></>}
   {slug==='campaigns-redesign'&&<Tile sample="campaigns" x={400} y={195} w={1130} angle={10} chrome/>}
  </g>
  <g className="folio-leaf folio-front">
   {slug==='email-builder-settings'&&<Tile sample="spacing" x={296} y={203} w={750} angle={-9}/>}
   {slug==='email-personalization'&&<Tile sample="text" x={299} y={194} w={740} angle={-9}/>}
   {slug==='image-gallery'&&<Photo kind={0} x={345} y={203} w={480} angle={-11}/>}
   {slug==='campaigns-redesign'&&<Tile sample="previews" x={267} y={344} w={1210} angle={-8} chrome/>}
   {slug==='design-system'&&<Tile sample="buttons" x={263} y={311} w={1180} angle={-8}/>}
  </g>
  {slug==='design-system'&&<g className="folio-leaf folio-detail"><Tile sample="input-props" x={1040} y={125} w={400} angle={8}/></g>}
  </g>
  <path className="folio-face" d="M232 785Q232 745 272 745H627Q659 745 678 726L717 687Q736 668 764 668H1516Q1556 668 1556 708L1519 1040Q1515 1072 1480 1072H310Q275 1072 270 1037Z" fill="#292d29" stroke="#50564c" strokeWidth="2"/>
  <path d="M276 798H637Q675 798 699 774L739 735Q759 715 786 715H1517" fill="none" stroke="#747d68" strokeWidth="2" opacity=".55"/>
  <g transform="translate(357 871)" fill="#d9ff62">{[[0,0],[24,0],[24,24],[48,24],[48,48],[0,48]].map(([x,y],i)=><rect key={i} x={x} y={y} width="16" height="16"/>)}</g>
  <g stroke="#7c8571" strokeWidth="2">{Array.from({length:15},(_,i)=><path key={i} d={`M${1140+i*16} 963v${i%4===0?30:12}`}/>)}</g>
  <Plus x={1429} y={816} size={30}/>
 </g>;
}

/** Signal: a graphic emblem made from each project's most recognisable elements. */
function Signal({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <>
   <g fill="none" stroke="#555c50" strokeWidth="2"><rect x={270} y={165} width={1170} height={824} rx="28"/><rect x={323} y={218} width={1064} height={716} rx="18"/></g>
   <g transform="rotate(-4 900 600)"><Tile sample="spacing" x={419} y={297} w={852}/><Handles x={391} y={269} w={908} h={726}/></g>
   <g transform="rotate(8 1410 830)"><Tile sample="radius" x={1128} y={737} w={575}/></g>
   <g fill="#d9ff62"><rect x="230" y="98" width="38" height="38"/><rect x="270" y="138" width="38" height="38"/></g>
  </>;
  case 'email-personalization':return <>
   <g stroke="#7a8967" strokeWidth="3" fill="none"><path d="M426 199H338Q289 199 289 248V481Q289 537 210 571Q289 605 289 657V904Q289 953 338 953H426"/><path d="M1374 199H1462Q1511 199 1511 248V481Q1511 537 1590 571Q1511 605 1511 657V904Q1511 953 1462 953H1374"/></g>
   <Tile sample="text" x={491} y={156} w={818}/><Plus x={216} y={202} size={38}/><Plus x={1590} y={952} size={38}/>
   <g transform="rotate(7 1340 921)"><rect x="1225" y="837" width="223" height="161" rx="27" fill="#d9ff62"/><text x="1336" y="948" fill="#1c2217" textAnchor="middle" fontFamily="Onest, sans-serif" fontSize="92">{'{x}'}</text></g>
  </>;
  case 'image-gallery':return <>
   <g stroke="#434b3a" strokeWidth="2" fill="none"><circle cx="900" cy="600" r="476"/><path d="M360 600H1440M900 62V1138"/></g>
   <Photo kind={2} x={986} y={184} w={510} angle={13}/><Photo kind={1} x={358} y={259} w={520} angle={-14}/><Photo kind={0} x={668} y={357} w={510} angle={4}/>
   <rect x="265" y="785" width="146" height="146" rx="26" fill="#d9ff62"/><path d="M304 884V833H372V884ZM306 877 325 855 343 875 354 863 371 881" stroke="#26311e" strokeWidth="5" fill="none"/><circle cx="357" cy="847" r="5" fill="#26311e"/>
  </>;
  case 'campaigns-redesign':return <>
   <g stroke="#4d5842" fill="none" strokeWidth="3"><rect x="226" y="221" width="1348" height="798" rx="44"/><path d="m228 239 673 507 670-507M227 1002l473-402M1573 1002l-473-402"/></g>
   <g transform="rotate(-5 900 600)"><Tile sample="previews" x={330} y={236} w={1190} chrome/></g>
   <circle cx="1488" cy="872" r="119" fill="#d9ff62"/><path d="m1447 913 82-82m-76-2h78v78" fill="none" stroke="#27321e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
  case 'design-system':return <g transform="rotate(-8 900 600)">
   <rect x="214" y="223" width="1372" height="760" rx="40" fill="#222622" stroke="#454d3e" strokeWidth="2"/>
   <g fill="#30382b"><rect x="256" y="265" width="271" height="270" rx="25"/><rect x="564" y="573" width="650" height="366" rx="25"/></g>
   <g fill="#d9ff62">{[[304,323],[362,323],[420,323],[304,381],[420,381],[304,439],[362,439],[420,439]].map(([x,y],i)=><rect key={i} x={x} y={y} width="31" height="31" rx="2"/>)}</g>
   <Detail box={[389,276,231,56]} to={[565,298,650,158]} radius={20}/>
   <Detail box={[654,276,231,56]} to={[565,646,650,158]} radius={20}/>
   <Tile sample="input-props" x={1254} y={266} w={292}/>
   <Plus x={390} y={750} size={99}/>
  </g>;
 }
}

const names:Record<ProjectSlug,string>={'email-builder-settings':'Система настроек конструктора','email-personalization':'Персонализация данных','image-gallery':'Галерея изображений','campaigns-redesign':'Кампании и превью рассылок','design-system':'Компоненты и настройки'};
export function MixCover({slug,variant}:{slug:ProjectSlug;variant:StudyId}){
 const id=useId().replace(/:/g,'');
 return <svg className={`cover-canvas mix-cover-canvas mix-cover-${variant}`} viewBox="0 0 1800 1200" role="img" aria-label={names[slug]} preserveAspectRatio="xMidYMid slice">
  <defs>
   <radialGradient id={`mix-light-${id}`} cx=".58" cy=".4" r=".8"><stop stopColor={variant==='07'?'#343831':variant==='08'?'#292e25':'#343637'}/><stop offset="1" stopColor="#181a19"/></radialGradient>
   <linearGradient id={`mix-shade-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stopColor="#111412" stopOpacity="0"/><stop offset="1" stopColor="#111412" stopOpacity=".8"/></linearGradient>
   <pattern id={`mix-dots-${id}`} width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#78836c"/></pattern>
  </defs>
  <rect width="1800" height="1200" fill={`url(#mix-light-${id})`}/>
  {variant==='08'&&<rect width="1800" height="1200" fill={`url(#mix-dots-${id})`} opacity=".22"/>}
  <g className="cover-composition">{variant==='06'?<Field slug={slug}/>:variant==='07'?<Folio slug={slug}/>:<Signal slug={slug}/>}</g>
  {variant==='06'&&<rect width="1800" height="1200" fill={`url(#mix-shade-${id})`} pointerEvents="none"/>}
 </svg>;
}
