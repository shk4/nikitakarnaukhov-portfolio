import { MediaImage } from "./media-image";
import type { CSSProperties } from 'react';
import type { ProjectSlug } from './project-art';
import coverMedia from './cover-media.json';

type Rect = readonly [number, number, number, number];
type Layer = { frame: Rect };
// Frames share one 1920 × 1080 canvas; cover-media supplies pre-cropped responsive layers.
const covers: Record<ProjectSlug, { alt: string; screen: Layer; detail: Layer }> = {
 'email-builder-settings': {
  alt: 'Email-конструктор: письмо и настройки отображения, фона, обводки и скруглений блока',
  screen: {frame:[110,130,1450,681]},
  detail: {frame:[1180,275,600,729.23]},
 },
 'email-personalization': {
  alt: 'Персонализация: редактор письма и увеличенные настройки переменной',
  screen: {frame:[110,130,1450,802]},
  detail: {frame:[1040,550,760,463]},
 },
 'image-gallery': {
  alt: 'Галерея изображений: библиотека и превью бежевой толстовки с бирюзовым узором',
  screen: {frame:[110,130,1450,853]},
  detail: {frame:[1180,400,600,608]},
 },
 'campaigns-redesign': {
  alt: 'Кампании: список рассылок и увеличенное меню создания кампании',
  screen: {frame:[110,130,1450,815.625]},
  detail: {frame:[1460,230,300,783.67]},
 },
 'design-system': {
  alt: 'Дизайн-система: реальные компоненты и увеличенная панель их свойств',
  screen: {frame:[110,130,1450,768]},
  detail: {frame:[1190,405,600,600]},
 },
};

function CoverLayer({layer,slug,kind,priority,large}:{layer:Layer;slug:ProjectSlug;kind:string;priority:boolean;large:boolean}) {
 const [x,y,w,h]=layer.frame;
 const frame:CSSProperties={left:`${x/1920*100}%`,top:`${y/1080*100}%`,width:`${w/1920*100}%`,height:`${h/1080*100}%`};
 const media = coverMedia[`${slug}-${kind}` as keyof typeof coverMedia];
 const sizes = kind === 'screen' ? (large ? '80vw' : '(max-width:760px) 80vw, 40vw') : (large ? '35vw' : '(max-width:760px) 35vw, 18vw');
 return <div className={`real-cover__layer real-cover__${kind}`} style={frame} aria-hidden="true"><MediaImage src={media.src} srcSet={media.srcSet} sizes={sizes} width={media.width} height={media.height} alt="" style={{width:'100%',height:'100%',inset:0}} loading={priority?'eager':'lazy'} decoding="async" fetchPriority={priority&&kind==='screen'?'high':undefined} draggable={false}/></div>;
}

export function VisualCaseCover({slug,priority=true,interactive=false}:{slug:ProjectSlug;priority?:boolean;interactive?:boolean}) {
 const cover=covers[slug];
 return <div className={`visual-cover-art real-cover real-cover--${slug}`} role="img" aria-label={cover.alt} tabIndex={interactive?0:undefined}>
  <CoverLayer layer={cover.screen} slug={slug} kind="screen" priority={priority} large={interactive}/>
  {slug==='image-gallery'?<div className="real-cover__layer real-cover__detail gallery-preview-card" aria-hidden="true"><div className="gallery-preview-card__body"><div className="gallery-preview-card__image"><MediaImage src="/media/figma-shots/gallery-selected-card.png" width={612} height={620} alt="" loading={priority?'eager':'lazy'} decoding="async" draggable={false}/></div><p>Флисовая толстовка с пуговицами на воротнике</p></div></div>:<CoverLayer layer={cover.detail} slug={slug} kind="detail" priority={priority} large={interactive}/>}
 </div>;
}
