import type { ReactNode } from "react";
import vectors from "./atlas-vectors.json";
import { mediaDimensions } from "./media-dimensions";

const base="/media/figma-shots/";
export function ArtCrop({file,from,to,radius=12}:{file:string;from:number[];to:number[];radius?:number}){
 const [sx,sy,sw,sh]=from,[x,y,w,h]=to;
 const dimensions=mediaDimensions[base+file];
 const sourceHeight=1800*(dimensions?.height||2400)/(dimensions?.width||3840);
 const id=`crop-${file.replace(/\W/g,'')}-${from.join('-')}-${to.join('-')}`;
 return <svg x={x} y={y} width={w} height={h} viewBox={`${sx} ${sy} ${sw} ${sh}`} preserveAspectRatio="xMidYMid meet">
  <defs><clipPath id={id}><rect x={sx} y={sy} width={sw} height={sh} rx={radius*sw/w}/></clipPath></defs>
  <image href={base+file} width="1800" height={sourceHeight} clipPath={`url(#${id})`}/>
 </svg>;
}
export function ArtBoard({title,kicker,subtitle,footer="СИСТЕМА / КОМПОНЕНТЫ / ПАТТЕРНЫ",compactHeight,hideTitle=false,children}:{title:string;kicker?:string;subtitle?:string;footer?:string|null;compactHeight?:number;hideTitle?:boolean;children:ReactNode}){
 const extraTop = hideTitle ? 16 : 36;
 const boardHeight = compactHeight ? compactHeight + extraTop + 36 : 1000;
 const contentY = compactHeight ? (hideTitle ? -185 : kicker ? -95 : -125) + extraTop : -35;
 return <svg className="studio-art studio-art--board" viewBox={`0 0 1800 ${boardHeight}`} role="img" aria-label={title}>
  <rect width="1800" height={boardHeight} fill="#303332"/>
  {kicker&&<text x="84" y="50" className="art-mono" fill="#bec3bb" fontSize="12">{kicker}</text>}
  {!hideTitle&&<text x="84" y={compactHeight && !kicker ? 62 : 91} fontSize="26" fontWeight="500" letterSpacing="-.5" fill="#f0f0e9">{title}</text>}
  {subtitle&&<text x="84" y="126" fontSize="18" fill="#bec3bb">{subtitle}</text>}
  <g transform={`translate(90 ${contentY}) scale(.9)`}>{children}</g>
  {footer&&<g>
   <path d="M84 925H1716" stroke="#525751"/>
   <text x="84" y="960" className="art-mono" fontSize="12" fill="#bec3bb">{footer}</text>
  </g>}
 </svg>;
}
function Label({x,y,children,accent=false}:{x:number;y:number;children:ReactNode;accent?:boolean}){return <text x={x} y={y} fontSize="16" className="art-mono" fill={accent?'#d9ff62':'#a2a5a0'}>{children}</text>}
function Statement({x,y,children}:{x:number;y:number;children:ReactNode}){return <text x={x} y={y} fontSize="28" fill="#f0f0e9">{children}</text>}

function DirectAccess(){return <ArtBoard title="Настройки – в один клик" footer={null} compactHeight={820}>
 <Label x={84} y={267}>ДО / ПОИСК В ОБЩЕЙ ПАНЕЛИ</Label><Label x={965} y={267} accent>ПОСЛЕ / КЛИК ПО ЭЛЕМЕНТУ</Label>
 <Statement x={84} y={309}>Блок / Карточка</Statement><Statement x={965} y={309}>Блок / Карточка / Кнопка</Statement>
 <ArtCrop file="settings-direct-access.webp" from={[84,393,309,547]} to={[84,352,309,547]}/>
 <ArtCrop file="settings-direct-access.webp" from={[418,393,418,580]} to={[418,352,418,580]}/>
 <ArtCrop file="settings-direct-access.webp" from={[965,393,309,547]} to={[965,352,309,547]}/>
 <ArtCrop file="settings-direct-access.webp" from={[1298,393,418,447]} to={[1298,352,418,447]}/>
 <path d="M900 254V1000" stroke="#525751"/>
 <path d="M393 444H413m-7-7 7 7-7 7" stroke="#a2a5a0" fill="none" strokeWidth="2"/>
 <path d="M1274 749H1284Q1290 749 1290 743V680H1297" stroke="#d9ff62" fill="none" strokeWidth="2"/>
 <Label x={84} y={995}>КАРТОЧКА → ПРОКРУТКА → НАСТРОЙКИ</Label><Label x={965} y={995} accent>КНОПКА → ЕЁ НАСТРОЙКИ</Label>
 </ArtBoard>}
function Folders(){return <ArtBoard title="Гибкая структура папок" footer={null} compactHeight={810}>
 <Label x={84} y={266}>01 / НАВИГАЦИЯ</Label><Label x={830} y={266}>02 / ПЕРЕНОС МЕЖДУ ПАПКАМИ</Label>
 <ArtCrop file="campaign-folders.webp" from={[112,335,610,706]} to={[84,300,587,680]}/>
 <ArtCrop file="campaign-folders.webp" from={[838,338,780,215]} to={[830,310,850,235]}/>
 <Label x={830} y={627}>03 / ФИЛЬТРЫ В ЛЮБОМ РАЗДЕЛЕ</Label>
 <rect x="830" y="670" width="850" height="248" rx="12" fill="#fafbf9"/>
 <ArtCrop file="campaign-folders.webp" from={[838,780,850,236]} to={[858,682,822,228]}/>
 <text x="830" y="978" fontSize="23" fill="#d9ff62">Перенести рассылку. Сохранить её историю.</text>
 </ArtBoard>}
function Upload(){return <ArtBoard title="Загрузка изображений" footer={null} compactHeight={780}>
 <Label x={84} y={260}>01 / ВЫБОР ИЗОБРАЖЕНИЯ</Label><Label x={950} y={260}>02 / ФАЙЛ ЗАГРУЖЕН</Label>
 {["DEFAULT","HOVER","PRESSED","LOADING"].map((label,i)=><g key={label}>
  <Label x={84} y={326+i*174}>{label}</Label>
  <ArtCrop file="gallery-entry.webp" from={[148,334+i*130,674,71]} to={[84,347+i*174,730,77]} radius={8}/>
 </g>)}
 {["DEFAULT / ПРЕВЬЮ И ИМЯ","PRESSED / ВЫБОР ФАЙЛА","HOVER / ПОЛНОЕ ИМЯ","EDIT / РЕДАКТИРОВАТЬ"].map((label,i)=><g key={label}>
  <Label x={950} y={326+i*174}>{label}</Label>
  <ArtCrop file="gallery-entry.webp" from={[978,334+(i<2?i:0)*130,673,71]} to={[950,347+i*174,730,77]} radius={8}/>
  {i>=2&&<g><rect x={i===2?1250:1490} y={317+i*174} width={i===2?145:220} height="38" rx="5" fill="#45494a"/><text x={i===2?1322.5:1600} y={343+i*174} fontSize="18" textAnchor="middle" fill="#ffffff">{i===2?'cover.png':'Редактировать'}</text></g>}
 </g>)}
 </ArtBoard>}
function Foundations(){return <ArtBoard title="Основа дизайна Mindbox" hideTitle footer={null} compactHeight={790}>
 <Label x={84} y={258}>01 / ТИПОГРАФИКА</Label><Label x={570} y={258}>02 / СЕМАНТИКА ЦВЕТА</Label><Label x={1190} y={258}>03 / ДЕЙСТВИЯ</Label>
 <text x="84" y="353" fontSize="83" fill="#f0f0e9">Aa Бб</text><text x="345" y="353" fontSize="18" fill="#a2a5a0">Inter</text>
 <text x="84" y="403" fontSize="28" fill="#f0f0e9">Заголовок</text><text x="84" y="447" fontSize="22" fill="#f0f0e9">Основной текст</text><text x="84" y="486" fontSize="18" fill="#a2a5a0">Подпись и метаданные</text>
 {[['#009b83','Акцент'],['#292b2d','Текст'],['#73818c','Вторичный'],['#ffffff','Фон']].map(([color,label],i)=><g key={label} transform={`translate(${570+(i%2)*227} ${294+Math.floor(i/2)*119})`}><rect width="195" height="65" rx="7" fill={color} stroke="#454a43"/><text y="93" fontSize="18" fill="#a2a5a0">{label}</text></g>)}
 <ArtCrop file="campaign-foundations.webp" from={[1152,285,164,43]} to={[1190,310,194,54]} radius={7}/>
 <ArtCrop file="campaign-foundations.webp" from={[1328,284,207,121]} to={[1412,310,240,140]} radius={11}/>
 <path d="M84 536H1716" stroke="#525751"/>
 <Label x={84} y={582}>04 / КОНТРОЛЫ</Label><Label x={1190} y={582}>05 / СТАТУСЫ</Label>
 <ArtCrop file="campaign-foundations.webp" from={[88,610.5,145,33]} to={[84,622,185,46]} radius={5}/>
 <ArtCrop file="campaign-foundations.webp" from={[244.5,610.5,145,33]} to={[287,622,185,46]} radius={5}/>
 <ArtCrop file="campaign-foundations.webp" from={[400.5,610,319,34]} to={[490,621,402,48]} radius={6}/>
 <ArtCrop file="campaign-foundations.webp" from={[90,687,67,33]} to={[84,702,88,46]} radius={5}/>
 <ArtCrop file="campaign-foundations.webp" from={[168,687,194,33]} to={[190,702,246,46]} radius={5}/>
 <ArtCrop file="campaign-foundations.webp" from={[1150,609,90,30]} to={[1190,622,125,42]} radius={21}/>
 <ArtCrop file="campaign-foundations.webp" from={[1291,610,133,29]} to={[1355,622,185,41]} radius={21}/>
 <ArtCrop file="campaign-foundations.webp" from={[1150,663,223,30]} to={[1190,702,310,42]} radius={21}/>
 <Label x={84} y={790}>06 / ПАТТЕРН ТАБЛИЦЫ</Label><Label x={1340} y={790}>07 / ЗАГРУЗКА</Label>
 <ArtCrop file="campaign-foundations.webp" from={[84,831,1040,206]} to={[84,814,1130,224]}/>
 <rect x="1316" y="814" width="400" height="224" rx="12" fill="#edf1ef"/>
 {[0,1,2,3].map(i=><g key={i} fill="#b4bfba"><rect x="1340" y={846+i*48} width="112" height="13" rx="4"/><rect x="1470" y={846+i*48} width="90" height="13" rx="4"/><rect x="1578" y={846+i*48} width="110" height="13" rx="4"/></g>)}
 </ArtBoard>}
function ButtonComparison(){return <ArtBoard kicker="BEFORE / AFTER" title="Вместо нескольких конкурирующих настроек – ширина и высота." footer={null} compactHeight={810}>
 <Label x={84} y={270}>ДО / РАЗРОЗНЕННЫЕ НАСТРОЙКИ</Label><Label x={965} y={270} accent>ПОСЛЕ / ДВА ПАРАМЕТРА</Label>
 <Statement x={84} y={321}>Размер, отступы, позиционирование</Statement><Statement x={965} y={321}>Ширина и высота в одном месте</Statement>
 <ArtCrop file="settings-button.webp" from={[151,370,598,448]} to={[84,373,720,539]}/>
 <ArtCrop file="settings-button.webp" from={[1074,524,552,162]} to={[965,373,751,220]}/>
 <path d="M890 253V950" stroke="#525751"/>
 <Label x={965} y={690}>ШИРИНА ПОДСТРАИВАЕТСЯ ПОД КОНТЕЙНЕР</Label>
 <rect x="965" y="723" width="751" height="165" rx="15" fill="#20251f" stroke="#414a37"/>
 <rect x="993" y="751" width="695" height="65" rx="8" fill="#d9ff62"/>
 <text x="1340" y="792" fontSize="23" fill="#20251f" textAnchor="middle">Купить</text>
 <path d="M993 850H1688m-8-6 8 6-8 6M1001 844l-8 6 8 6" fill="none" stroke="#879770"/>
 <text x="1340" y="945" fontSize="22" fill="#d9ff62" textAnchor="middle">px / % от ширины контейнера</text>
 </ArtBoard>}
function CampaignComparison(){return <ArtBoard kicker="BEFORE / AFTER" title="Создание, поиск и управление рассылками – на первом экране." footer={null} compactHeight={850}>
 <Label x={84} y={278}>ДО / СТРУКТУРА СИСТЕМЫ</Label><Label x={932} y={278} accent>ПОСЛЕ / ЗАДАЧИ ПОЛЬЗОВАТЕЛЯ</Label>
 <Statement x={84} y={333}>Сложно начать и найти нужное</Statement><Statement x={932} y={333}>Главное действие сразу доступно</Statement>
 <ArtCrop file="campaign-before-after.webp" from={[50,376,800,450]} to={[84,384,788,443]}/>
 <ArtCrop file="campaign-before-after.webp" from={[950,376,800,450]} to={[932,384,788,443]}/>
 <path d="M902 253V1000" stroke="#525751"/>
 {['Создание в глубине раздела','Сложная фильтрация','Рассылки без превью'].map((text,i)=><text key={text} x="84" y={879+i*46} fontSize="22" fill="#a2a5a0">{text}</text>)}
 {['Создать – с первого экрана','Поиск, фильтры и сортировка','Визуальные превью рассылок'].map((text,i)=><g key={text}><circle cx="940" cy={872+i*46} r="4" fill="#d9ff62"/><text x="960" y={879+i*46} fontSize="22" fill="#f0f0e9">{text}</text></g>)}
 </ArtBoard>}
function UploadComparison(){return <ArtBoard kicker="BEFORE / AFTER" title="После запуска выяснилось: для части клиентов загрузка по ссылке – основной способ." footer={null} compactHeight={780}>
 <Label x={84} y={268}>ДО / ДОПОЛНИТЕЛЬНЫЙ ШАГ</Label><Label x={964} y={268} accent>ПОСЛЕ / ПРЯМОЙ ДОСТУП</Label>
 <Statement x={84} y={314}>Ссылка спрятана за вкладкой</Statement><Statement x={964} y={314}>Файл и URL – в одном островке</Statement>
 <svg x="84" y="362" width="752" height="290" viewBox="1800 0 1400 540"><defs><clipPath id="upload-before"><rect x="1800" y="0" width="1400" height="540" rx="22"/></clipPath></defs><image href="/media/1b9e0e5b-dd49-4779-b9d4-f416014df1f1.png" width="3200" height="1798" clipPath="url(#upload-before)"/></svg>
 <svg x="964" y="362" width="752" height="354" viewBox="1800 0 1400 659"><defs><clipPath id="upload-after"><rect x="1800" y="0" width="1400" height="659" rx="22"/></clipPath></defs><image href="/media/78028cf0-bbab-4545-b11f-9e6a60750e46.png" width="3200" height="1798" clipPath="url(#upload-after)"/></svg>
 <rect x="459" y="438" width="356" height="40" rx="9" fill="none" stroke="#87938c" strokeWidth="1.25" strokeDasharray="3 5" strokeLinecap="round"/>
 <g transform="translate(684 456)"><path d="M0 0V29.5L7.2 22.5L13 35L18.4 32.4L12.5 20.2L23 19.8Z" fill="#161818" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round"/></g>
 <path d="M824 458H836Q852 458 852 474V670Q852 686 836 686H600" stroke="#87938c" strokeWidth="1.15" strokeDasharray="3 6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
 <text x="84" y="706" fontSize="22" fill="#a2a5a0">Сначала переключиться. Затем вставить URL.</text>
 <rect x="1002" y="643" width="664" height="42" rx="6" fill="none" stroke="#009b83" strokeWidth="2"/>
 <path d="M890 251V915" stroke="#525751"/>
 <path d="M84 767H836M964 767H1716" stroke="#525751"/>
 <g transform="translate(0 -60)">
 <text x="84" y="861" fontSize="25" fill="#f0f0e9">Открыть вкладку</text><path d="M313 852H362m-8-7 8 7-8 7" stroke="#a2a5a0" fill="none" strokeWidth="2"/><text x="384" y="861" fontSize="25" fill="#f0f0e9">Вставить URL</text>
 <text x="964" y="861" fontSize="25" fill="#d9ff62">Сразу вставить URL</text>
 <text x="84" y="945" fontSize="21" fill="#a2a5a0">Лишний клик при каждом добавлении</text>
 <rect x="964" y="910" width="273" height="50" rx="8" fill="#283020"/><text x="988" y="943" fontSize="24" fill="#d9ff62">−1 лишний клик</text>
 </g>
 </ArtBoard>}
const boards:Record<string,()=>ReactNode>={"gallery-upload-comparison":UploadComparison,"settings-direct-access.webp":DirectAccess,"campaign-folders.webp":Folders,"gallery-entry.webp":Upload,"campaign-foundations.webp":Foundations,"settings-button.webp":ButtonComparison,"campaign-before-after.webp":CampaignComparison};
export function StudioArt({file}:{file:string}){
 const vector=vectors[file as keyof typeof vectors];
 if(vector)return <div className="studio-art-vector" dangerouslySetInnerHTML={{__html:vector}}/>;
 const Board=boards[file];return Board?<Board/>:null;
}
export function hasStudioArt(url:string){const file=url.split('/').pop()||'';return file in vectors||file in boards;}
