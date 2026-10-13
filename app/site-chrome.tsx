import { typography } from "./typography-tree";
export function SiteFooter() {
  return typography(<footer className="site-footer" id="contact">
    <div className="footer-top"><span className="eyebrow">Есть задача?</span><a href="https://t.me/nikita_shk" className="footer-cta">Давайте обсудим<span aria-hidden="true">↗</span></a></div>
    <div className="footer-contacts" aria-label="Контакты и резюме">
      <a href="https://t.me/nikita_shk" target="_blank" rel="noopener noreferrer">Telegram ↗</a>
      <a href="mailto:karnauhovnikita@gmail.com">Почта ↗</a>
      <a href="/resume/nikita-karnaukhov.pdf" target="_blank" rel="noopener noreferrer">Резюме · PDF ↗</a>
    </div>
    <div className="footer-bottom"><span>Никита Карнаухов</span><div><a href="#top">Наверх ↑</a></div><span>Самара · <strong>Готов к переезду</strong></span></div>
  </footer>);
}
