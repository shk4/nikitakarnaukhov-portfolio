"use client";
import { MediaImage } from "./media-image";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import columns from "./island-columns.json";

/** Compositor-driven layers: no video buffering, play promises or frame timers. */
export function SettingsSystemAnimation({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let intersects = false;
    const update = () => setVisible(intersects && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  return <div ref={root} className="settings-islands" data-running={visible && !paused}>
    <div className="settings-islands__scene" role="img" aria-label={label}>
      {columns.map((column, i) => <div className="settings-islands__column" key={column.src}>
        <div className="settings-islands__track" style={{ "--duration": `${42 + i * 3}s`, "--delay": `${-i * 7}s`, animationDirection: i % 2 ? "reverse" : "normal" } as CSSProperties}>
          {[0, 1].map(copy => <MediaImage key={copy} src={column.src} width={column.width} height={column.height} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />)}
        </div>
      </div>)}
    </div>
    <button type="button" className="settings-islands__pause" aria-pressed={paused} aria-label={paused ? "Продолжить анимацию" : "Приостановить анимацию"} onClick={() => setPaused(value => !value)}>{paused ? "Продолжить" : "Пауза"}</button>
  </div>;
}
