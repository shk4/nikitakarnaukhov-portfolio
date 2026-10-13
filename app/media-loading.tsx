"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const surfaces = ".media-clip, .studio-project-media, .case-hero-image, .remaining-cover";
const svgRequests = new Map<string, Promise<void>>();

function waitForRaster(image: HTMLImageElement, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener("load", loaded);
      image.removeEventListener("error", failed);
      signal.removeEventListener("abort", aborted);
    };
    const loaded = () => {
      cleanup();
      const decoded = image.decode ? image.decode() : Promise.resolve();
      decoded.catch(() => {}).then(resolve);
    };
    const failed = () => { cleanup(); reject(new Error("Image unavailable")); };
    const aborted = () => { cleanup(); reject(new Error("Image tracking cancelled")); };
    image.addEventListener("load", loaded, { once: true });
    image.addEventListener("error", failed, { once: true });
    signal.addEventListener("abort", aborted, { once: true });
    if (signal.aborted) aborted();
    else if (image.complete) image.naturalWidth > 0 ? loaded() : failed();
  });
}

// SVG images have no `complete` property. A shared cache probe also covers load
// events that happened before hydration; it reuses the browser's image request.
function waitForSvg(url: string): Promise<void> {
  const cached = svgRequests.get(url);
  if (cached) return cached;
  const request = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => image.decode().catch(() => {}).then(resolve);
    image.onerror = () => reject(new Error("Image unavailable"));
    image.src = url;
  });
  svgRequests.set(url, request);
  request.catch(() => svgRequests.delete(url));
  return request;
}

export function MediaLoading() {
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    let frame = 0;
    const abort = new AbortController();
    const tracked = new WeakMap<HTMLElement, string>();
    document.documentElement.dataset.mediaLoadingEnabled = "";

    const scan = () => {
      frame = 0;
      document.querySelectorAll<HTMLElement>(surfaces).forEach(surface => {
        const images = Array.from(surface.querySelectorAll<HTMLImageElement | SVGImageElement>("img, image"));
        if (!images.length) return;
        const urls = images.map(image => image instanceof HTMLImageElement
          ? image.currentSrc || image.src
          : image.getAttribute("href") || image.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "");
        const signature = urls.join("\n");
        if (tracked.get(surface) === signature) return;
        tracked.set(surface, signature);
        surface.dataset.mediaState = "loading";
        const requests = images.map((image, index) => image instanceof HTMLImageElement
          ? waitForRaster(image, abort.signal)
          : urls[index] ? waitForSvg(urls[index]) : Promise.resolve());
        Promise.allSettled(requests).then(results => {
          if (!active || !surface.isConnected || tracked.get(surface) !== signature) return;
          // Stop the skeleton on errors too, leaving the image's alt text visible.
          surface.dataset.mediaState = results.some(result => result.status === "rejected") ? "error" : "ready";
        });
      });
    };

    scan();
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "srcset", "href", "xlink:href"] });
    return () => { active = false; abort.abort(); observer.disconnect(); cancelAnimationFrame(frame); };
  }, [pathname]);

  return null;
}
