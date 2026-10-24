"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resetPageScroll } from "./scroll-position";

// Fast routes never show the overlay; slower ones reveal as soon as committed.
const SHOW_LOADER_AFTER_MS = 140;
const EXIT_DURATION_MS = 100;

const titles: Record<string,string> = {
  "/": "Избранные проекты",
  "/cases/email-builder-settings": "Конструктор рассылок",
  "/cases/email-personalization": "Персонализация",
  "/cases/image-gallery": "Галерея изображений",
  "/cases/campaigns-redesign": "Кампании",
  "/cases/design-system": "Дизайн-система",
};

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const loader = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const departure = useRef<Animation | null>(null);
  const prefetched = useRef(new Set<string>());
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!pending.current || pathname !== new URL(pending.current, location.href).pathname) return;
    const openAtTop = !new URL(pending.current, location.href).hash;
    pending.current = null;
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = null;
    if (fallback.current) clearTimeout(fallback.current);
    fallback.current = null;
    departure.current?.cancel();
    let scrollFrame = 0;
    if (openAtTop) {
      resetPageScroll();
      // RSC commits and layout effects can settle on the following paint.
      scrollFrame = requestAnimationFrame(() => { resetPageScroll(); });
    }
    const panel = loader.current!;
    if (panel.style.visibility !== "visible") return () => cancelAnimationFrame(scrollFrame);
    const main = document.querySelector("main");
    const revealPage = () => {
      revealTimer.current = null;
      const opacity = getComputedStyle(panel).opacity;
      panel.getAnimations().forEach(animation => animation.cancel());
      panel.dataset.state="ready";
      panel.style.pointerEvents="none";
      const reveal = panel.animate([{opacity},{opacity:0}], {duration:EXIT_DURATION_MS,easing:"ease-out",fill:"forwards"});
      main?.animate([{opacity:.95},{opacity:1}],{duration:150,easing:"cubic-bezier(.22,1,.36,1)",fill:"backwards"});
      reveal.finished.then(() => {panel.style.visibility="hidden"; panel.style.pointerEvents="none"; reveal.cancel();}).catch(()=>{});
    };
    revealPage();
    return () => {cancelAnimationFrame(scrollFrame);if(revealTimer.current)clearTimeout(revealTimer.current);};
  }, [pathname]);

  useEffect(() => {
    function internalLink(event: Event) {
      const target = event.target;
      const a = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!a || a.target && a.target !== "_self" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !(url.pathname in titles) || url.pathname === location.pathname) return;
      return url;
    }
    const prefetchUrl = (url: URL) => {
      const href = url.pathname + url.search;
      if (prefetched.current.has(href)) return;
      prefetched.current.add(href);
      router.prefetch(href);
    };
    const prefetch = (event: Event) => {const url=internalLink(event);if(url) prefetchUrl(url);};
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || reduced()) return;
      const url = internalLink(event);
      if (!url) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = url.href;
      if (revealTimer.current) clearTimeout(revealTimer.current);
      revealTimer.current = null;
      const panel=loader.current!;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      title.current!.textContent=link?.dataset.transitionTitle || titles[url.pathname];
      caption.current!.textContent=link?.dataset.transitionCaption || "Портфолио / Выбранный проект";
      panel.getAnimations().forEach(a=>a.cancel());
      panel.style.visibility="hidden";
      const showLoader = () => {
      revealTimer.current = null;
      panel.dataset.state="loading";
      panel.style.visibility="visible";panel.style.pointerEvents="auto";
      panel.getAnimations().forEach(a=>a.cancel());
      panel.animate([{opacity:0},{opacity:1}],{duration:130,easing:"ease-out",fill:"forwards"});
      departure.current=document.querySelector("main")?.animate([{opacity:1},{opacity:.15}],{duration:160,easing:"ease-out",fill:"forwards"}) || null;
      };
      revealTimer.current = setTimeout(showLoader, SHOW_LOADER_AFTER_MS);
      fallback.current=setTimeout(()=>location.assign(url.href),6000);
      // Fetch and navigation start on the click, without waiting for the animation.
      router.push(url.pathname+url.search+url.hash, { scroll: Boolean(url.hash) });
    };
    const restore = () => {pending.current=null;if(fallback.current)clearTimeout(fallback.current);fallback.current=null;if(revealTimer.current)clearTimeout(revealTimer.current);revealTimer.current=null;departure.current?.cancel();const panel=loader.current;if(panel){panel.getAnimations().forEach(a=>a.cancel());panel.style.visibility="hidden";panel.style.pointerEvents="none";}};
    document.addEventListener("click",navigate);
    document.addEventListener("pointerover",prefetch,{passive:true});
    document.addEventListener("focusin",prefetch);
    document.addEventListener("pointerdown",prefetch,{passive:true});
    window.addEventListener("pageshow",restore);
    return () => {document.removeEventListener("click",navigate);document.removeEventListener("pointerover",prefetch);document.removeEventListener("focusin",prefetch);document.removeEventListener("pointerdown",prefetch);window.removeEventListener("pageshow",restore);if(fallback.current) clearTimeout(fallback.current);if(revealTimer.current)clearTimeout(revealTimer.current);};
  }, [router]);


  return <div ref={loader} className="retro-loader type-system" aria-hidden="true"><div className="retro-loader__screen"><div ref={caption} className="retro-loader__caption">Портфолио / Выбранный проект</div><div className="retro-loader__title"><span ref={title}/></div><div className="retro-loader__bar"><div className="retro-loader__bar-fill"/></div><div className="retro-loader__status"><span className="retro-loader__loading">Открываю проект<span className="retro-loader__caret">_</span></span><span className="retro-loader__ready">Готово</span><span>↵</span></div></div></div>;
}
