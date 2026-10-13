import type { ProjectSlug } from './project-art';

const covers:Record<ProjectSlug,{src:string;alt:string}>={
 'email-builder-settings':{src:'/media/visual-covers/email-builder-settings-4k.webp',alt:'Email-конструктор Mindbox: письмо и упорядоченная система настроек'},
 'email-personalization':{src:'/media/visual-covers/email-personalization-monitor-figma-4k.webp',alt:'Персонализация Mindbox на мониторе: письмо, панель «Продукт» из Figma и две вынесенные панели переменных'},
 'image-gallery':{src:'/media/visual-covers/image-gallery-4k.webp',alt:'Галерея Mindbox: общее пространство для поиска и повторного использования изображений'},
 'campaigns-redesign':{src:'/media/visual-covers/campaigns-redesign-4k.webp',alt:'Кампании Mindbox: создание, поиск и организация рассылок'},
 'design-system':{src:'/media/visual-covers/design-system-4k.webp',alt:'Дизайн-система Mindbox: компоненты и состояния в единой системе'},
};
export function VisualCaseCover({slug,priority=true,interactive=false}:{slug:ProjectSlug;priority?:boolean;interactive?:boolean}){
 const {src,alt}=covers[slug];
 const srcSet=`${src.replace('-4k.webp','-960.webp')} 960w, ${src.replace('-4k.webp','-1920.webp')} 1920w, ${src} 3840w`;
 return <div className={`visual-cover-art visual-cover-art--${slug}`} tabIndex={interactive?0:undefined}><img src={src} srcSet={srcSet} sizes={interactive?'100vw':'(max-width: 760px) 100vw, 50vw'} alt={alt} width={3840} height={2560} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async"/></div>;
}
