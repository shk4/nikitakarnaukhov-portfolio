import type { CSSProperties } from 'react';
import type { ProjectSlug } from './project-art';

type Rect = readonly [number, number, number, number];
type Layer = { file: string; crop: Rect; frame: Rect };
// Crops use a common 1800px source width. Frames share one 1920 × 1080 canvas
// in the project grid, related projects and full-size case hero.
const covers: Record<ProjectSlug, { alt: string; screen: Layer; detail: Layer }> = {
 'email-builder-settings': {
  alt: 'Email-конструктор: письмо и настройки отображения, фона, обводки и скруглений блока',
  screen: {file:'settings-structure.webp',crop:[0,319,1629,765],frame:[110,130,1450,681]},
  detail: {file:'builder-regular-block.png',crop:[0,0,1800,2187.6923],frame:[1180,275,600,729.23]},
 },
 'email-personalization': {
  alt: 'Персонализация: редактор письма и увеличенные настройки переменной',
  screen: {file:'shot-04.webp',crop:[134,149,1534,848],frame:[110,130,1450,802]},
  detail: {file:'shot-03.webp',crop:[1031,492,591,360],frame:[1040,550,760,463]},
 },
 'image-gallery': {
  alt: 'Галерея изображений: библиотека и превью бежевой толстовки с бирюзовым узором',
  screen: {file:'shot-08.webp',crop:[0,104,1666,980],frame:[110,130,1450,853]},
  detail: {file:'gallery-selected-card.png',crop:[0,0,1800,1823.5294],frame:[1180,400,600,608]},
 },
 'campaigns-redesign': {
  alt: 'Кампании: список рассылок и увеличенное меню создания кампании',
  screen: {file:'campaigns-clean.png',crop:[0,0,1800,1012.5],frame:[110,130,1450,815.625]},
  detail: {file:'campaigns-menu.png',crop:[0,0,1800,4702.0408],frame:[1460,230,300,783.67]},
 },
 'design-system': {
  alt: 'Дизайн-система: реальные компоненты и увеличенная панель их свойств',
  screen: {file:'ds-1.webp',crop:[50,90,1700,900],frame:[110,130,1450,768]},
  detail: {file:'ds-1.webp',crop:[1269,306,448,448],frame:[1190,405,600,600]},
 },
};

function CoverLayer({layer,kind,priority}:{layer:Layer;kind:string;priority:boolean}) {
 const [sx,sy,sw,sh]=layer.crop;
 const [x,y,w,h]=layer.frame;
 const scale=Math.max(w/sw,h/sh);
 const frame:CSSProperties={left:`${x/1920*100}%`,top:`${y/1080*100}%`,width:`${w/1920*100}%`,height:`${h/1080*100}%`};
 const crop:CSSProperties={width:`${1800*scale/w*100}%`,left:`${(-sx*scale+(w-sw*scale)/2)/w*100}%`,top:`${(-sy*scale+(h-sh*scale)/2)/h*100}%`};
 return <div className={`real-cover__layer real-cover__${kind}`} style={frame} aria-hidden="true"><img src={`/media/figma-shots/${layer.file}`} alt="" style={crop} loading={priority?'eager':'lazy'} decoding="async" draggable={false}/></div>;
}

export function VisualCaseCover({slug,priority=true,interactive=false}:{slug:ProjectSlug;priority?:boolean;interactive?:boolean}) {
 const cover=covers[slug];
 return <div className={`visual-cover-art real-cover real-cover--${slug}`} role="img" aria-label={cover.alt} tabIndex={interactive?0:undefined}>
  <CoverLayer layer={cover.screen} kind="screen" priority={priority}/>
  {slug==='image-gallery'?<div className="real-cover__layer real-cover__detail gallery-preview-card" aria-hidden="true"><div className="gallery-preview-card__body"><div className="gallery-preview-card__image"><img src="/media/figma-shots/gallery-selected-card.png" alt="" loading={priority?'eager':'lazy'} decoding="async" draggable={false}/></div><p>Флисовая толстовка с пуговицами на воротнике</p></div></div>:<CoverLayer layer={cover.detail} kind="detail" priority={priority}/>}
 </div>;
}
