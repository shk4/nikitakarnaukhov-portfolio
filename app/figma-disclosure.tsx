"use client";

import { useState } from "react";

export function FigmaDisclosure({
  embedUrl,
  sourceUrl,
}: {
  embedUrl?: string;
  sourceUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="figma-disclosure"
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="figma-disclosure__summary">
        <span className="figma-disclosure__label">
          <img
            alt=""
            aria-hidden="true"
            height="22"
            src="/media/icon-figma.svg"
            width="22"
          />
          <span>Показать макеты в Figma</span>
        </span>
        <span className="figma-disclosure__toggle" aria-hidden="true" />
      </summary>

      <div className="figma-disclosure__content">
        {isOpen && embedUrl ? (
          <iframe
            src={embedUrl}
            title="Интерактивный макет в Figma"
            loading="lazy"
            allowFullScreen
          />
        ) : isOpen ? (
          <div className="figma-disclosure__fallback">
            Макет можно открыть непосредственно в Figma.
          </div>
        ) : null}

        {sourceUrl && (
          <a href={sourceUrl} rel="noreferrer" target="_blank">
            Открыть в Figma ↗
          </a>
        )}
      </div>
    </details>
  );
}
