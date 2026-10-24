"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function DesignMotion() {
  const path = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        frame = 0;
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
      document.querySelectorAll("[data-reveal], .notion-heading").forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight) el.classList.add("will-reveal");
        observer?.observe(el);
      });
    }
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", update); };
  }, [path]);
  return <div className="reading-progress" aria-hidden="true" />;
}
