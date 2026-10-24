import { typography } from "./typography-tree";
import { ProjectCover } from "./project-cover";
import { portfolioCases } from "./notion-content";
import { projectArt, type ProjectSlug } from "./project-art";
import { SiteFooter } from "./site-chrome";
import { PageAccents } from "./mix-accents";
import { PortfolioIntro } from "./portfolio-intro";


const projectSummaries: Record<ProjectSlug, {description: string; result: string}> = {
  "email-builder-settings": {description: "Собрал разрозненные настройки блоков в единую систему с понятной вложенностью.", result: "14 крупных клиентов полностью перешли на новый конструктор."},
  "email-personalization": {description: "Перенёс работу с клиентскими и товарными данными из HTML в интерфейс.", result: "113 клиентов запускают большую часть рассылок в новом инструменте."},
  "image-gallery": {description: "Объединил загрузку, хранение, поиск и повторное использование изображений.", result: "Закрыты обращения 16 клиентов."},
  "campaigns-redesign": {description: "Вынес создание рассылки на первый экран, упростил поиск и работу с папками.", result: "Заложена основа нового визуального языка Mindbox."},
  "design-system": {description: "Обновил базовые контролы и описал состояния на основе реальных сценариев.", result: "7 групп компонентов с правилами использования и настройками в Figma."},
};

export default function Home() {
  return typography(<main className="studio-home study-home study-11 study-07 type-system portfolio-home" id="top">
    <PageAccents />
    <PortfolioIntro />
    <section className="hierarchy-work" id="work" aria-labelledby="work-title">
      <div className="hierarchy-work-heading"><h2 id="work-title">Избранные проекты <span className="work-count">05</span></h2></div>
      <div className="hierarchy-projects">
        {portfolioCases.map((item,i)=> { const art=projectArt[item.slug as ProjectSlug]; const summary=projectSummaries[item.slug as ProjectSlug]; return <a className="hierarchy-project" href={`/cases/${item.slug}`} key={item.slug}>
          <div className={`studio-project-media tone-${art.tone}`}><ProjectCover slug={item.slug as ProjectSlug} priority={i===0}/></div>
          <div className="hierarchy-project-copy">
            <div className="hierarchy-project-title"><h3>{art.short}</h3><span aria-hidden="true">↗</span></div>
            <p className="hierarchy-project-description">{summary.description}</p>
            <p className="hierarchy-project-result"><span>Результат</span>{summary.result}</p>
          </div>
        </a>; })}
      </div>
    </section>
    <SiteFooter />
  </main>);
}
