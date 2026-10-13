"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollStatement({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let queued = false;
    const paint = () => {
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .87 - r.top) / (innerHeight * .6)));
      const words = el.querySelectorAll<HTMLElement>("span");
      words.forEach((word, i) => { word.style.opacity = String(Math.max(.22, Math.min(1, (p * (words.length + 4) - i) / 2))); });
      queued = false;
    };
    const update = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    paint(); window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <p ref={ref} className="scroll-statement" aria-label={children}>{children.split(" ").map((word, i) => <span aria-hidden="true" key={i}>{word}{" "}</span>)}</p>;
}

export function DesignMotion() {
  const path = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    let queued = false;
    const update = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        queued = false;
      });
    };
    window.addEventListener("scroll", update, {passive:true});
    update();
    let observer: IntersectionObserver | undefined;
    if (!reduced.matches) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }), {threshold:.08, rootMargin:"0px 0px -30px 0px"});
      document.querySelectorAll("[data-reveal], .notion-heading, .notion-figure").forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight) el.classList.add("will-reveal");
        observer?.observe(el);
      });
    }
    return () => { observer?.disconnect(); window.removeEventListener("scroll", update); };
  }, [path]);
  return <div className="reading-progress" aria-hidden="true" />;
}
