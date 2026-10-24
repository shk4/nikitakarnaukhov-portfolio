export type MediaLoadState = "loading" | "ready" | "error";

/** Per-element listeners also cover images that finished before hydration. */
export function watchImageLoading(image: HTMLImageElement, update: (state: MediaLoadState) => void) {
  const loaded = () => update("ready");
  const failed = () => update("error");
  image.addEventListener("load", loaded);
  image.addEventListener("error", failed);
  if (image.complete) update(image.naturalWidth > 0 ? "ready" : "error");
  return () => {
    image.removeEventListener("load", loaded);
    image.removeEventListener("error", failed);
  };
}
