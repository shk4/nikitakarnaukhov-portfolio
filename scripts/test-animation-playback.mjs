import assert from "node:assert/strict";
import test from "node:test";
import { startAnimationPlayback } from "../app/animation-playback.ts";

const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
function fixture() {
  const page = new EventTarget();
  page.visibilityState = "visible";
  const browser = new EventTarget();
  browser.innerHeight = 800;
  let now = 0;
  let nextId = 0;
  const timers = new Map();
  browser.setTimeout = (fn, delay) => {
    const id = ++nextId;
    timers.set(id, { fn, at: now + delay });
    return id;
  };
  browser.clearTimeout = id => timers.delete(id);
  const tick = async ms => {
    const end = now + ms;
    while (true) {
      const next = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at;
      timers.delete(next[0]);
      next[1].fn();
      await flush();
    }
    now = end;
  };
  let intersection;
  class Observer {
    constructor(callback) { intersection = callback; }
    observe() {}
    disconnect() { intersection = () => {}; }
  }
  const video = new EventTarget();
  video.paused = true;
  video.ended = false;
  video.getBoundingClientRect = () => ({ top: 100, bottom: 500 });
  video.closest = () => null;
  video.playCalls = 0;
  video.playing = () => {
    video.paused = false;
    video.dispatchEvent(new Event("playing"));
  };
  video.playBehavior = () => { video.playing(); return Promise.resolve(); };
  video.play = () => { video.playCalls++; return video.playBehavior(); };
  video.pause = () => {
    if (!video.paused) {
      video.paused = true;
      video.dispatchEvent(new Event("pause"));
    }
  };
  const controls = [];
  return {
    video, controls, tick, timers,
    start: () => startAnimationPlayback(video, show => controls.push(show), { document: page, window: browser, IntersectionObserver: Observer }),
    intersect: visible => intersection([{ isIntersecting: visible }]),
    visibility: state => { page.visibilityState = state; page.dispatchEvent(new Event("visibilitychange")); },
  };
}

test("an interrupted play retries without another scroll or media event", async () => {
  const f = fixture();
  f.video.playBehavior = () => f.video.playCalls === 1
    ? Promise.reject(new DOMException("Interrupted", "AbortError"))
    : (f.video.playing(), Promise.resolve());
  const stop = f.start();
  await flush();
  await f.tick(250);
  assert.equal(f.video.playCalls, 2);
  assert.equal(f.video.paused, false);
  assert(!f.controls.includes(true));
  stop();
});

test("a browser pause resumes while the animation remains visible", async () => {
  const f = fixture();
  const stop = f.start();
  await flush();
  f.video.pause();
  await f.tick(250);
  assert.equal(f.video.playCalls, 2);
  assert.equal(f.video.paused, false);
  stop();
});

test("leaving and re-entering during a pending play does not strand playback", async () => {
  const f = fixture();
  let rejectPlay;
  f.video.playBehavior = () => {
    f.video.paused = false;
    return new Promise((_, reject) => { rejectPlay = reject; });
  };
  const stop = f.start();
  f.intersect(false);
  f.intersect(true);
  rejectPlay(new DOMException("Interrupted", "AbortError"));
  f.video.playBehavior = () => { f.video.playing(); return Promise.resolve(); };
  await flush();
  await f.tick(250);
  assert.equal(f.video.playCalls, 2);
  assert.equal(f.video.paused, false);
  stop();
});

test("offscreen and hidden pages stay paused, then resume on return", async () => {
  const f = fixture();
  const stop = f.start();
  await flush();
  f.intersect(false);
  await f.tick(10000);
  assert.equal(f.video.playCalls, 1);
  f.intersect(true);
  await flush();
  assert.equal(f.video.playCalls, 2);
  f.visibility("hidden");
  await f.tick(10000);
  assert.equal(f.video.playCalls, 2);
  f.visibility("visible");
  await flush();
  assert.equal(f.video.playCalls, 3);
  stop();
});

test("policy rejection offers controls until frames actually start playing", async () => {
  const f = fixture();
  f.video.playBehavior = () => Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  const stop = f.start();
  await flush();
  assert.equal(f.controls.at(-1), true);
  f.video.dispatchEvent(new Event("play"));
  await f.tick(10000);
  assert.equal(f.controls.at(-1), true);
  assert.equal(f.video.playCalls, 1);
  f.video.playing();
  assert.equal(f.controls.at(-1), false);
  stop();
});

test("repeated interruptions stop retrying and leave a manual fallback", async () => {
  const f = fixture();
  f.video.playBehavior = () => Promise.reject(new DOMException("Interrupted", "AbortError"));
  const stop = f.start();
  await flush();
  await f.tick(10000);
  assert.equal(f.video.playCalls, 3);
  assert.equal(f.controls.at(-1), true);
  assert.equal(f.timers.size, 0);
  stop();
});

test("a pending load exposes controls; unmount cancels all recovery work", async () => {
  const f = fixture();
  f.video.playBehavior = () => new Promise(() => {});
  const stop = f.start();
  await f.tick(8000);
  assert.equal(f.controls.at(-1), true);
  stop();
  f.video.dispatchEvent(new Event("canplay"));
  f.video.dispatchEvent(new Event("pause"));
  await f.tick(10000);
  assert.equal(f.video.playCalls, 1);
  assert.equal(f.timers.size, 0);
});
