/** Keep a muted decorative video running, with bounded retries and a manual fallback. */
export function startAnimationPlayback(
  video: HTMLVideoElement,
  showControls: (show: boolean) => void,
  environment = { document, window, IntersectionObserver },
) {
  const { document: page, window: browser, IntersectionObserver: Observer } = environment;
  let active = true;
  let pending = false;
  let manual = false;
  let interruptions = 0;
  let retry: number | undefined;
  let watchdog: number | undefined;
  const bounds = video.getBoundingClientRect();
  let visible = bounds.bottom > -200 && bounds.top < browser.innerHeight + 200;
  const shouldPlay = () => active && visible && page.visibilityState !== "hidden";

  video.defaultMuted = true;
  video.muted = true;

  const clearTimers = () => {
    browser.clearTimeout(retry);
    browser.clearTimeout(watchdog);
    retry = watchdog = undefined;
  };
  const offerControls = () => {
    if (!shouldPlay()) return;
    manual = true;
    clearTimers();
    showControls(true);
  };
  const watchForPlayback = () => {
    if (!shouldPlay() || manual || watchdog !== undefined) return;
    // A play promise may stay pending while a browser waits for media data.
    watchdog = browser.setTimeout(offerControls, 8000);
  };
  const retryPlayback = () => {
    if (!shouldPlay() || manual || retry !== undefined) return;
    if (interruptions >= 2) { offerControls(); return; }
    interruptions += 1;
    retry = browser.setTimeout(() => { retry = undefined; resume(); }, 250);
  };
  const resume = () => {
    if (!active) return;
    if (!shouldPlay()) {
      clearTimers();
      if (!video.paused) video.pause();
      return;
    }
    if (manual || pending) return;
    if (!video.paused && !video.ended) {
      if (video.readyState < 3) watchForPlayback();
      return;
    }
    pending = true;
    watchForPlayback();
    void video.play().catch((error: unknown) => {
      if (!active) return;
      // Browser suspension can abort play without another intersection event.
      if (error instanceof Error && error.name === "AbortError") retryPlayback();
      else offerControls();
    }).finally(() => { pending = false; });
  };
  const onPlaying = () => {
    if (!active) return;
    if (!shouldPlay()) { video.pause(); return; }
    manual = false;
    interruptions = 0;
    clearTimers();
    showControls(false);
  };
  const observer = new Observer(([entry]) => {
    visible = entry.isIntersecting;
    resume();
  }, { rootMargin: "200px 0px" });
  observer.observe(video);
  const figure = video.closest("figure");
  video.addEventListener("loadeddata", resume);
  video.addEventListener("canplay", resume);
  video.addEventListener("playing", onPlaying);
  video.addEventListener("pause", retryPlayback);
  video.addEventListener("ended", resume);
  video.addEventListener("waiting", watchForPlayback);
  video.addEventListener("stalled", watchForPlayback);
  video.addEventListener("error", offerControls);
  figure?.addEventListener("transitionend", resume);
  page.addEventListener("visibilitychange", resume);
  browser.addEventListener("pageshow", resume);
  resume();

  return () => {
    active = false;
    clearTimers();
    observer.disconnect();
    video.removeEventListener("loadeddata", resume);
    video.removeEventListener("canplay", resume);
    video.removeEventListener("playing", onPlaying);
    video.removeEventListener("pause", retryPlayback);
    video.removeEventListener("ended", resume);
    video.removeEventListener("waiting", watchForPlayback);
    video.removeEventListener("stalled", watchForPlayback);
    video.removeEventListener("error", offerControls);
    figure?.removeEventListener("transitionend", resume);
    page.removeEventListener("visibilitychange", resume);
    browser.removeEventListener("pageshow", resume);
    video.pause();
  };
}
