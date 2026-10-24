"use client";
import { MediaImage } from "./media-image";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Kept outside animated route containers so Safari can composite it independently. */
export function SiteNav() {
  const contact = useRef<HTMLDivElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (contact.current && !contact.current.contains(e.target as Node)) setContactOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && contactOpen) {
        setContactOpen(false);
        contact.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [contactOpen]);
  const header = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const node = header.current;
    if (!node) return;
    // Native anchor navigation needs exactly the space occupied by the header.
    // Observe font, breakpoint and safe-area changes without intercepting scroll.
    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height", `${node.getBoundingClientRect().height}px`,
      );
    };
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const path = usePathname();
  const casePage = path.includes('/cases/');
  const home = '/';
  return <><header ref={header} className="site-nav type-system">
    <a className="brand" href={home} data-transition-title="Никита Карнаухов" data-transition-caption="Портфолио" aria-label="Никита Карнаухов – главная"><MediaImage src="/media/nikita-logo.svg" alt="Никита Карнаухов" width="124" height="52" /></a>
    <nav aria-label="Основная навигация">
      <a href={casePage ? `${home}#work` : "#work"}>Проекты <sup>05</sup></a>
      <a href={casePage ? `${home}#about` : "#about"}>Обо мне</a>
      <div className={`contact-picker${contactOpen ? " is-open" : ""}`} ref={contact} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setContactOpen(false); }}>
        <div className="contact-surface">
        <button type="button" className="contact-link" aria-expanded={contactOpen} aria-controls="contact-options" onClick={() => setContactOpen(open => !open)}>Связаться <span aria-hidden="true"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="m2.5 3.75 2.5 2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></button>
        {contactOpen && <div id="contact-options" className="contact-options" onClick={() => { if (contact.current) setContactOpen(false); }}>
          <a href="https://t.me/nikita_shk" target="_blank" rel="noopener noreferrer"><span className="contact-channel">Telegram</span><span className="contact-address">@nikita_shk</span></a>
          <a href="mailto:karnauhovnikita@gmail.com"><span className="contact-channel">Почта</span><span className="contact-address">karnauhovnikita@gmail.com</span></a>
        </div>}
        </div>
      </div>
    </nav>
  </header></>;
}
