"use client";

import { useEffect } from "react";

type ClickPhase = "press" | "release";

const clickSources: Record<ClickPhase, string> = {
  press: "/audio/mouse-click-down.mp3",
  release: "/audio/mouse-click-up.mp3",
};

const CLICK_VOLUME = 0.55;

export function SiteEffects() {
  useEffect(() => {
    const makeAudioPool = (source: string) =>
      Array.from({ length: 4 }, () => {
        const audio = new Audio(source);
        audio.preload = "auto";
        audio.volume = CLICK_VOLUME;
        audio.load();
        return audio;
      });

    const audioPools: Record<ClickPhase, HTMLAudioElement[]> = {
      press: makeAudioPool(clickSources.press),
      release: makeAudioPool(clickSources.release),
    };
    const audioIndices: Record<ClickPhase, number> = { press: 0, release: 0 };

    const makeClick = (phase: ClickPhase) => {
      const pool = audioPools[phase];
      const audio = pool[audioIndices[phase]];
      audioIndices[phase] = (audioIndices[phase] + 1) % pool.length;
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      makeClick("press");
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      makeClick("release");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      makeClick("press");
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      makeClick("release");
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      Object.values(audioPools)
        .flat()
        .forEach((audio) => {
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
        });
    };
  }, []);

  return null;
}
