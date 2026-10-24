"use client";
import { useEffect, useRef, useState } from "react";
import { startAnimationPlayback } from "./animation-playback";
import { MediaImage } from "./media-image";

type CaseVideoProps = { src: string; poster: string; width: number; height: number; label: string };

export function CaseVideo(props: CaseVideoProps) {
  return <VideoWithPoster key={`${props.src}|${props.poster}`} {...props} />;
}

function VideoWithPoster({ src, poster, width, height, label }: CaseVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [controls, setControls] = useState(false);
  const [firstFrame, setFirstFrame] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoaded(true); observer.disconnect(); }
    }, { rootMargin: "400px 0px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (loaded && ref.current) return startAnimationPlayback(ref.current, setControls);
  }, [loaded]);
  useEffect(() => {
    if (ref.current && ref.current.readyState >= 2) setFirstFrame(true);
  }, [loaded]);
  return <div className="case-video" style={{ aspectRatio: `${width} / ${height}` }} data-first-frame={firstFrame}>
    {!firstFrame && <MediaImage className="case-video__poster" src={poster} width={width} height={height} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
    <video ref={ref} src={loaded ? src : undefined} data-video-src={src} poster={poster} width={width} height={height} aria-label={label} autoPlay={loaded} muted loop playsInline preload={loaded ? "auto" : "none"} controls={controls} disablePictureInPicture onLoadedData={() => setFirstFrame(true)} onPlaying={() => setFirstFrame(true)} />
  </div>;
}
