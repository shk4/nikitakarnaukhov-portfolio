"use client";

import { useEffect, useRef, useState } from "react";

/** Resume the case video after scrolling, navigation and browser suspension. */
export function SettingsSystemAnimation({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsControls, setNeedsControls] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let active = true;
    let pending = false;
    let retryQueued = false;
    const bounds = video.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;

    // Set the DOM properties as well as the markup before requesting playback.
    video.defaultMuted = true;
    video.muted = true;

    const resume = () => {
      if (!active) return;
      if (!visible || document.visibilityState === "hidden") {
        video.pause();
        return;
      }
      if (pending) { retryQueued = true; return; }
      if (!video.paused) return;
      pending = true;
      video.play().catch((error: unknown) => {
        // Scrolling away can abort an in-flight play request; retry on re-entry.
        if (active && !(error instanceof DOMException && error.name === "AbortError")) {
          setNeedsControls(true);
        }
      }).finally(() => {
        pending = false;
        if (retryQueued) { retryQueued = false; resume(); }
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    observer.observe(video);
    video.addEventListener("loadeddata", resume);
    video.addEventListener("canplay", resume);
    const figure = video.closest("figure");
    figure?.addEventListener("transitionend", resume);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    resume();

    return () => {
      active = false;
      observer.disconnect();
      video.removeEventListener("loadeddata", resume);
      video.removeEventListener("canplay", resume);
      figure?.removeEventListener("transitionend", resume);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      video.pause();
    };
  }, []);

  return <video
    ref={ref}
    src="/media/settings-islands-studio-2k.mp4?v=playback-2"
    poster="/media/settings-islands-studio-poster.png?v=gray-1"
    autoPlay muted loop playsInline preload="metadata"
    controls={needsControls} disablePictureInPicture
    width={2560} height={1200} aria-label={label}
    onPlay={() => setNeedsControls(false)}
    onError={() => setNeedsControls(true)}
  />;
}
