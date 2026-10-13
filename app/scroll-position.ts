import type Lenis from "lenis";

let activeScroll: Lenis | undefined;

export function registerScrollEngine(engine: Lenis | undefined) {
  activeScroll = engine;
  return () => { if (activeScroll === engine) activeScroll = undefined; };
}

// Reset the native position and Lenis's pending motion together. A native
// scrollTo alone can be overwritten by the next frame of an old wheel gesture.
export function resetPageScroll() {
  const engine = activeScroll;
  const resume = engine && !engine.isStopped;
  engine?.stop();
  engine?.resize();
  engine?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  if (resume) engine.start();
}
