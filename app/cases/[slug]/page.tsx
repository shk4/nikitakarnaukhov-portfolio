import { VisualCaseCover } from "@/app/visual-case-cover";
import { caseTldr } from "@/app/case-tldr-content";
import { CaseReader } from "@/app/case-reader";
import { typography } from "@/app/typography-tree";
import { ProjectCover } from "@/app/project-cover";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioCase, portfolioCases } from "@/app/notion-content";
import { NotionRenderer, CaseTldrRenderer } from "@/app/notion-renderer";
import { SiteFooter } from "@/app/site-chrome";
import { projectArt, type ProjectSlug } from "@/app/project-art";
import type { StudyId } from "@/app/study-config";
import { PageAccents } from "@/app/mix-accents";
const caseSubtitles: Record<ProjectSlug, string> = {
 "email-builder-settings": "Сложная система. Простые настройки.",
 "email-personalization": "Клиентские данные в письмах — без HTML.",
 "image-gallery": "Всё нужное — под рукой.",
 "campaigns-redesign": "Создание, поиск и порядок — вокруг задач маркетолога.",
 "design-system": "От отдельных компонентов — к общим правилам.",
};
export function generateStaticParams() { return portfolioCases.map(item => ({slug:item.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
 const {slug}=await params; const item=getPortfolioCase(slug);
 return item?{title:`${item.title} — Никита Карнаухов`,description:item.description}:{};
}
export default async function CasePage({params,variant:requestedVariant}:{params:Promise<{slug:string}>;variant?:StudyId}) {
 const variant=requestedVariant??'11';
 const basePath=requestedVariant?`/studies/${variant}`:'';
 const {slug}=await params; const item=getPortfolioCase(slug); if(!item)notFound();
 const art=projectArt[slug as ProjectSlug];
 const remaining=portfolioCases.filter(project=>project.slug!==slug);
 const classes=`visual-case concept-case study-${variant}${variant === '10' || variant === '11' ? ' study-07 type-system' : variant === '07' ? ' type-system' : ''}`;
 const navigation=typography(<a className="case-all-projects" href={`${basePath || "/"}#work`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Все проекты</a>);
 const hero=typography(<header className="project-hero">
   <div className="case-intro"><h1>{art.short}</h1><p className="case-subtitle">{caseSubtitles[slug as ProjectSlug]}</p></div>
   <div className="visual-case-cover"><VisualCaseCover slug={slug as ProjectSlug} interactive/></div>
  </header>);
 const after=typography(<><section className="remaining-projects" aria-labelledby="remaining-title">
   <div className="remaining-heading" data-reveal><h2 id="remaining-title">Другие проекты<span>04</span></h2></div>
   <div className="remaining-grid">{remaining.map(project=>{const info=projectArt[project.slug as ProjectSlug];return <a className="remaining-card" href={`${basePath}/cases/${project.slug}`} key={project.slug} data-reveal>
    <div className="remaining-cover"><ProjectCover slug={project.slug as ProjectSlug} variant={variant}/></div>
    <div className="remaining-caption"><div><h3>{info.short}</h3></div><span className="remaining-arrow" aria-hidden="true">↗</span></div>
   </a>})}</div>
  </section>
  <SiteFooter /></>);
 return <CaseReader key={slug} className={`${classes} motion-case`} accents={<PageAccents variant={variant}/>} navigation={navigation} hero={hero}
  detailed={<NotionRenderer source={item.source.text}/>}
  summary={<CaseTldrRenderer source={item.source.text} content={caseTldr[slug as ProjectSlug]}/>}
  after={after}/>;
}
