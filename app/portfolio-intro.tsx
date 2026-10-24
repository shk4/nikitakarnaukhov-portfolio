import { MediaImage } from "./media-image";
import { Experience } from "./experience";
import { typography } from "./typography-tree";

/** The main portfolio introduces the person and their work before the cases. */
export function PortfolioIntro() {
  return typography(
    <section className="portfolio-intro" id="about" aria-labelledby="intro-title">
      <div className="portfolio-intro__main">
        <div className="portfolio-intro__copy">
          <p className="portfolio-intro__identity">Никита Карнаухов <span>Product Designer</span></p>
          <h1 id="intro-title">Делаю сложные<br />B2B-продукты<br /><span>понятными.</span></h1>
          <p className="portfolio-intro__lead">В Mindbox развивал email-конструктор, персонализацию и дизайн-систему. От исследований и сценариев до запуска и оценки результата.</p>
          <div className="portfolio-intro__actions">
            <a className="portfolio-intro__resume" href="/resume/nikita-karnaukhov.pdf" target="_blank" rel="noopener noreferrer">Резюме · PDF <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <aside className="portfolio-intro__profile" aria-label="Профиль и основной опыт">
          <div className="portfolio-intro__portrait-row">
            <MediaImage className="portfolio-intro__portrait" src="/media/avatar-2026.png" alt="Никита Карнаухов" width="88" height="88" />
            <p className="portfolio-intro__tenure"><strong>9+ лет</strong><span>в продуктовой<br />разработке</span></p>
          </div>
          <div className="portfolio-intro__career">
            <p className="portfolio-intro__career-label">Последний опыт</p>
            <p className="portfolio-intro__company"><span>Mindbox</span><span>2019–2025</span></p>
            <dl className="portfolio-intro__roles">
              <div><dt>Product Designer</dt><dd>3 года</dd></div>
              <div><dt>Product Manager / Owner</dt><dd>3,5 года</dd></div>
            </dl>
          </div>
          <p className="portfolio-intro__perspective">Опыт продакта помогает видеть задачу целиком: что нужно людям, зачем это бизнесу и как проверить результат.</p>
          <p className="portfolio-intro__location">Самара · Готов к переезду</p>
        </aside>
      </div>

      <details className="portfolio-intro__history">
        <summary>
          <span className="portfolio-intro__history-copy">
            <span className="portfolio-intro__history-title">Подробнее об опыте</span>
            <span className="portfolio-intro__history-hint">Компании, роли и задачи</span>
          </span>
          <span className="portfolio-intro__history-action" aria-hidden="true">
            <span className="portfolio-intro__history-expand">Развернуть</span>
            <span className="portfolio-intro__history-collapse">Свернуть</span>
            <span className="portfolio-intro__history-mark"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </span>
        </summary>
        <Experience />
      </details>
    </section>
  );
}
