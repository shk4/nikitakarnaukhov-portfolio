import { typography } from "./typography-tree";
import { ProjectCover } from "./project-cover";
import { portfolioCases } from "./notion-content";
import { projectArt, type ProjectSlug } from "./project-art";
import { SiteFooter } from "./site-chrome";
import { Experience } from "./experience";
import { ScrollStatement } from "./design-motion";
import { StudyAccents } from "./study-accents";
import type { StudyId } from "./study-config";
import { PageAccents, MixHeroAccents } from "./mix-accents";


const projectSummaries: Record<ProjectSlug, {description: string; result: string}> = {
  "email-builder-settings": {description: "Собрал разрозненные настройки блоков в единую систему с понятной вложенностью.", result: "14 крупных клиентов полностью перешли на новый конструктор."},
  "email-personalization": {description: "Перенёс работу с клиентскими и товарными данными из HTML в интерфейс.", result: "113 клиентов запускают большую часть рассылок в новом инструменте."},
  "image-gallery": {description: "Объединил загрузку, хранение, поиск и повторное использование изображений.", result: "Закрыты обращения 16 клиентов."},
  "campaigns-redesign": {description: "Вынес создание рассылки на первый экран, упростил поиск и работу с папками.", result: "Заложена основа нового визуального языка Mindbox."},
  "design-system": {description: "Обновил базовые контролы и описал состояния на основе реальных сценариев.", result: "7 групп компонентов с правилами использования и настройками в Figma."},
};

export function HomeView({variant:requestedVariant}:{variant?:StudyId}) {
  const variant=requestedVariant??'11';
  const basePath=requestedVariant?`/studies/${variant}`:'';
  const order = portfolioCases;
  return typography(<main className={`studio-home study-home study-${variant}${variant === '10' || variant === '11' ? ' study-07 type-system' : variant === '07' ? ' type-system' : ''}`} id="top">
    <PageAccents variant={variant}/>
    <section className="hierarchy-hero" aria-labelledby="hero-title">
      {Number(variant)>5?<MixHeroAccents variant={variant}/>:<StudyAccents variant={variant}/>}
      <div className="hierarchy-hero-copy">
        <h1 id="hero-title"><span>Сложное.</span><span>Понятно.</span></h1>
      </div>
      <aside className="hierarchy-profile" aria-label="О дизайнере">
        <img className="hierarchy-portrait" src="/media/avatar-2026.png" alt="Никита Карнаухов" width="128" height="128"/>
        <p className="hierarchy-specialty">Проектирую продукты, которыми удобно пользоваться каждый день.</p>
        <div className="hierarchy-profile-facts">
          <p className="hierarchy-experience"><strong>8+ лет</strong> в продуктовой разработке</p>
          <p className="hierarchy-location">Самара · <strong>Готов к переезду</strong></p>
        </div>
      </aside>
    </section>
    <section className="hierarchy-work" id="work" aria-labelledby="work-title">
      <div className="hierarchy-work-heading"><h2 id="work-title">Избранные проекты <span className="work-count">05</span></h2></div>
      <div className="hierarchy-projects">
        {order.map((item,i)=> { const art=projectArt[item.slug as ProjectSlug]; const summary=projectSummaries[item.slug as ProjectSlug]; return <a className="hierarchy-project" href={`${basePath}/cases/${item.slug}`} key={item.slug}>
          <div className={`studio-project-media tone-${art.tone}`}><ProjectCover slug={item.slug as ProjectSlug} variant={variant} priority={i<2}/></div>
          <div className="hierarchy-project-copy">
            <div className="hierarchy-project-title"><h3>{art.short}</h3><span aria-hidden="true">↗</span></div>
            <p className="hierarchy-project-description">{summary.description}</p>
            <p className="hierarchy-project-result"><span>Результат</span>{summary.result}</p>
          </div>
        </a>; })}
      </div>
    </section>
    <section className="studio-about" id="about"><div className="studio-section-heading"><h2>Опыт</h2></div><div className="studio-about-grid"><div className="about-number"><span>8+</span><p>лет в продуктовой<br/>разработке</p></div><div><ScrollStatement>Я был по обе стороны продуктовых решений – как Product Manager и как Product Designer. Поэтому думаю о бизнесе, исследую поведение людей и довожу интерфейсы до запуска.</ScrollStatement><div className="about-copy"><p>Мои сильные стороны — сложные продуктовые интерфейсы, исследования, приоритизация и управление командой.</p><p>Работаю удалённо из Самары. Рассматриваю переезд. Открыт к обсуждению продуктовых задач.</p></div></div></div><Experience /></section>
    <SiteFooter />
  </main>);
}

export default function Home(){ return <HomeView/>; }
