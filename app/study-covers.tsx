import { useId, type ReactNode } from 'react';
import type { StudyId } from './study-config';
import type { ProjectSlug } from './project-art';
import { ArtCrop } from './studio-art';
import vectors from './atlas-vectors.json';

type Rect = [number,number,number,number];
type Sample = 'builder'|'block'|'spacing'|'background'|'radius'|'text'|'decimal'|'date'|'gallery'|'photos'|'image-row'|'upload'|'campaigns'|'previews'|'folders'|'buttons'|'button-props'|'inputs'|'input-props';
const clips:Partial<Record<Sample,{file:string;box:Rect}>>={
 builder:{file:'settings-structure.webp',box:[0,319,1629,765]},
 block:{file:'settings-structure.webp',box:[970,319,660,765]},
 spacing:{file:'settings-noise.webp',box:[876,270,397,312]},
 background:{file:'settings-noise.webp',box:[1296,92,397,216]},
 radius:{file:'settings-noise.webp',box:[1296,573,397,216]},
 gallery:{file:'shot-08.webp',box:[688,104,978,1096]},
 photos:{file:'shot-08.webp',box:[704,560,962,640]},
 'image-row':{file:'shot-08.webp',box:[704,880,962,229]},
 upload:{file:'shot-08.webp',box:[704,202,962,334]},
 campaigns:{file:'shot-09.webp',box:[50,120,1685,970]},
 previews:{file:'shot-10.webp',box:[140,145,1505,850]},
 folders:{file:'campaign-folders.webp',box:[112,335,610,706]},
};
const native:Partial<Record<Sample,{file:keyof typeof vectors;box:Rect}>>={
 buttons:{file:'ds-1.webp',box:[370,240,810,528]},
 'button-props':{file:'ds-1.webp',box:[1220,200,440,558]},
 inputs:{file:'ds-2.webp',box:[153,276,1020,465]},
 'input-props':{file:'ds-2.webp',box:[1212,204,452,581]},
};
const images:Partial<Record<Sample,{src:string;w:number;h:number}>>={
 text:{src:'/media/cover-panels/1715-272348.png',w:1086,h:1014},
 decimal:{src:'/media/cover-panels/1715-272506.png',w:1086,h:921},
 date:{src:'/media/cover-panels/1715-272434.png',w:1086,h:900},
};
function ratio(sample:Sample){const c=clips[sample]||native[sample];if(c)return c.box[2]/c.box[3];const i=images[sample]!;return i.w/i.h;}
export function SampleArt({sample,w,h}:{sample:Sample;w:number;h:number}){
 const c=clips[sample];if(c)return <ArtCrop file={c.file} from={c.box} to={[0,0,w,h]} radius={0}/>;
 const n=native[sample];if(n){const inner=vectors[n.file].replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');return <svg width={w} height={h} viewBox={n.box.join(' ')} overflow="hidden" dangerouslySetInnerHTML={{__html:inner}}/>;}
 const i=images[sample]!;return <image href={i.src} width={w} height={h} preserveAspectRatio="xMidYMid meet"/>;
}
export function Tile({sample,x,y,w,h,angle=0,chrome=false,frame=true,opacity=1}:{sample:Sample;x:number;y:number;w:number;h?:number;angle?:number;chrome?:boolean;frame?:boolean;opacity?:number}){
 const id=useId().replace(/:/g,'');const bar=chrome?40:0;const height=h??w/ratio(sample);const dark=sample in native;
 return <g className="study-tile" opacity={opacity} transform={`translate(${x} ${y}) rotate(${angle} ${w/2} ${(height+bar)/2})`}>
  <defs><clipPath id={`tile-${id}`}><rect width={w} height={height+bar} rx={frame?18:0}/></clipPath></defs>
  {frame&&<rect width={w} height={height+bar} rx="18" fill={dark?'#131414':'#ffffff'} className="study-tile-shadow"/>}
  <g clipPath={`url(#tile-${id})`}>
   {chrome&&<g><rect width={w} height={bar} fill="#303433"/>{[0,1,2].map(i=><circle key={i} cx={20+i*18} cy="20" r="4" fill={i===0?'#8e958e':'#59615b'}/>)}</g>}
   <g transform={`translate(0 ${bar})`}><SampleArt sample={sample} w={w} h={height}/></g>
  </g>
 </g>;
}
function Group({children,x=0,y=0,angle=0}:{children:ReactNode;x?:number;y?:number;angle?:number}){return <g transform={`translate(${x} ${y}) rotate(${angle} 900 600)`}>{children}</g>}

/* 01 — large, straight crops: the useful interaction is the focal point. */
function Focus({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <><Tile sample="builder" x={120} y={220} w={1560} chrome/></>;
  case 'email-personalization':return <><Tile sample="decimal" x={112} y={340} w={565}/><Tile sample="text" x={695} y={169} w={855}/><Tile sample="date" x={1430} y={460} w={500}/></>;
  case 'image-gallery':return <><Tile sample="photos" x={160} y={150} w={1480}/></>;
  case 'campaigns-redesign':return <><Tile sample="campaigns" x={120} y={146} w={1560} chrome/></>;
  case 'design-system':return <><Tile sample="buttons" x={100} y={230} w={1150}/><Tile sample="button-props" x={1300} y={220} w={390}/></>;
 }
}
/* 02 — an interface and its detail, connected by a shared baseline. */
function Pair({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <><Tile sample="builder" x={95} y={206} w={1500} chrome/><Tile sample="block" x={1170} y={420} w={536}/></>;
  case 'email-personalization':return <><Tile sample="text" x={215} y={250} w={795}/><Tile sample="decimal" x={1060} y={340} w={536}/></>;
  case 'image-gallery':return <><Tile sample="photos" x={90} y={190} w={1320}/><Tile sample="upload" x={690} y={750} w={1020}/></>;
  case 'campaigns-redesign':return <><Tile sample="previews" x={115} y={202} w={1450} chrome/><Tile sample="folders" x={1190} y={390} w={500}/></>;
  case 'design-system':return <><Tile sample="buttons" x={95} y={180} w={980}/><Tile sample="input-props" x={1240} y={180} w={440}/><Tile sample="inputs" x={160} y={890} w={1050}/></>;
 }
}
/* 03 — orthographic sample trays. Deliberate margins, no tilted windows. */
function Specimen({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <><Tile sample="spacing" x={120} y={296} w={704}/><Tile sample="background" x={882} y={169} w={788}/><Tile sample="radius" x={882} y={662} w={788}/></>;
  case 'email-personalization':return <><Tile sample="text" x={108} y={240} w={695}/><Tile sample="decimal" x={859} y={153} w={496}/><Tile sample="date" x={1120} y={628} w={576}/></>;
  case 'image-gallery':return <><Tile sample="upload" x={230} y={130} w={1340}/><Tile sample="image-row" x={120} y={706} w={1560}/></>;
  case 'campaigns-redesign':return <><Tile sample="folders" x={120} y={170} w={488}/><Tile sample="previews" x={654} y={330} w={1020}/></>;
  case 'design-system':return <><Tile sample="buttons" x={110} y={140} w={1120}/><Tile sample="button-props" x={1290} y={140} w={400}/><Tile sample="inputs" x={110} y={940} w={1550}/></>;
 }
}
/* 04 — one calm depth axis. Plates share the same angle and soft lighting. */
function Depth({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <Group angle={-8}><Tile sample="builder" x={110} y={360} w={1420} opacity={.7}/><Tile sample="spacing" x={970} y={140} w={720}/><Tile sample="radius" x={1340} y={794} w={610}/></Group>;
  case 'email-personalization':return <Group angle={-8}><Tile sample="decimal" x={22} y={585} w={600}/><Tile sample="text" x={565} y={212} w={775}/><Tile sample="date" x={1260} y={26} w={575}/></Group>;
  case 'image-gallery':return <Group angle={-7}><Tile sample="photos" x={96} y={247} w={1160}/><Tile sample="gallery" x={1120} y={65} w={730}/><Tile sample="upload" x={449} y={863} w={1010}/></Group>;
  case 'campaigns-redesign':return <Group angle={-8}><Tile sample="campaigns" x={15} y={71} w={1510} opacity={.65}/><Tile sample="previews" x={436} y={576} w={1510}/></Group>;
  case 'design-system':return <Group angle={-8}><Tile sample="buttons" x={54} y={317} w={1200}/><Tile sample="button-props" x={1270} y={98} w={410}/><Tile sample="inputs" x={408} y={1000} w={1260}/></Group>;
 }
}
/* 05 — a tight contact sheet; repetition shows the scale of the system. */
function Montage({slug}:{slug:ProjectSlug}){
 switch(slug){
  case 'email-builder-settings':return <Group angle={-4}><Tile sample="background" x={-170} y={-142} w={680}/><Tile sample="spacing" x={-170} y={276} w={680}/><Tile sample="radius" x={-170} y={870} w={680}/><Tile sample="block" x={550} y={82} w={700}/><Tile sample="spacing" x={1290} y={-95} w={680}/><Tile sample="background" x={1290} y={500} w={680}/><Tile sample="radius" x={1290} y={940} w={680}/></Group>;
  case 'email-personalization':return <Group angle={-4}><Tile sample="text" x={-218} y={-270} w={660}/><Tile sample="date" x={-218} y={395} w={660}/><Tile sample="decimal" x={-218} y={990} w={660}/><Tile sample="date" x={480} y={-590} w={800}/><Tile sample="text" x={480} y={116} w={800}/><Tile sample="decimal" x={480} y={922} w={800}/><Tile sample="decimal" x={1320} y={-160} w={660}/><Tile sample="date" x={1320} y={450} w={660}/><Tile sample="text" x={1320} y={1060} w={660}/></Group>;
  case 'image-gallery':return <Group angle={-4}><Tile sample="photos" x={-325} y={-175} w={940}/><Tile sample="upload" x={-325} y={514} w={940}/><Tile sample="photos" x={-325} y={891} w={940}/><Tile sample="gallery" x={660} y={45} w={970}/><Tile sample="photos" x={1675} y={-170} w={950}/></Group>;
  case 'campaigns-redesign':return <Group angle={-4}><Tile sample="campaigns" x={-620} y={-415} w={1280}/><Tile sample="previews" x={-620} y={375} w={1280}/><Tile sample="previews" x={710} y={-555} w={1340}/><Tile sample="campaigns" x={710} y={260} w={1340}/><Tile sample="folders" x={1155} y={1035} w={690}/></Group>;
  case 'design-system':return <Group angle={-4}><Tile sample="inputs" x={-180} y={-90} w={1050}/><Tile sample="buttons" x={-180} y={437} w={1050}/><Tile sample="button-props" x={934} y={54} w={650}/><Tile sample="input-props" x={1624} y={-390} w={650}/><Tile sample="inputs" x={934} y={946} w={1110}/></Group>;
 }
}
const compositions:Partial<Record<StudyId,typeof Focus>>={'01':Focus,'02':Pair,'03':Specimen,'04':Depth,'05':Montage};
export function StudyCover({slug,variant}:{slug:ProjectSlug;variant:StudyId}){
 const id=useId().replace(/:/g,'');const Composition=compositions[variant]||Focus;
 const names:Record<ProjectSlug,string>={'email-builder-settings':'Настройки конструктора','email-personalization':'Форматирование персональных данных','image-gallery':'Поиск и загрузка изображений','campaigns-redesign':'Управление кампаниями','design-system':'Компоненты дизайн-системы'};
 return <svg className={`cover-canvas cover-canvas-${variant}`} viewBox="0 0 1800 1200" role="img" aria-label={names[slug]} preserveAspectRatio="xMidYMid slice">
  <defs>
   <radialGradient id={`light-${id}`} cx=".5" cy=".28" r=".82"><stop stopColor={variant==='04'?'#30372f':'#303532'}/><stop offset="1" stopColor="#151716"/></radialGradient>
   <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#131414" stopOpacity=".5"/><stop offset=".23" stopColor="#131414" stopOpacity="0"/><stop offset=".76" stopColor="#131414" stopOpacity="0"/><stop offset="1" stopColor="#131414" stopOpacity=".75"/></linearGradient>
   <pattern id={`grid-${id}`} width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.2" fill="#526050"/></pattern>
  </defs>
  <rect width="1800" height="1200" fill={variant==='03'?'#191d1a':`url(#light-${id})`}/>
  {variant==='03'&&<rect width="1800" height="1200" fill={`url(#grid-${id})`} opacity=".3"/>}
  <g className="cover-composition"><Composition slug={slug}/></g>
  {variant==='05'&&<rect width="1800" height="1200" fill={`url(#fade-${id})`} pointerEvents="none"/>}
 </svg>;
}
