"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes, type SVGProps } from "react";
import { watchImageLoading, type MediaLoadState } from "./media-load-state";

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function MediaImage(props: ImageProps) {
  // A new source gets its own lifecycle; a late old load cannot clear its skeleton.
  return <ImageWithSkeleton key={`${props.src}|${props.srcSet}`} {...props} />;
}

function ImageWithSkeleton({ className = "", ...props }: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<MediaLoadState>("loading");
  useEffect(() => {
    if (ref.current) return watchImageLoading(ref.current, setState);
  }, []);
  return <img {...props} ref={ref} className={`media-image ${className}`.trim()} data-media-state={state} />;
}

type SvgImageProps = SVGProps<SVGImageElement> & {
  href: string;
  placeholder?: { x: number; y: number; width: number; height: number };
};

export function MediaSvgImage(props: SvgImageProps) {
  return <SvgImageWithSkeleton key={props.href} {...props} />;
}

function SvgImageWithSkeleton({ placeholder, ...props }: SvgImageProps) {
  const [state, setState] = useState<MediaLoadState>("loading");
  useEffect(() => {
    // SVGImageElement has no complete/naturalWidth. A cache-backed image probe
    // catches pre-hydration loads without scanning or observing the document.
    const probe = new Image();
    probe.src = props.href;
    return watchImageLoading(probe, setState);
  }, [props.href]);
  return <g data-media-state={state}>
    {state !== "ready" && <rect className="media-svg-skeleton" x={props.x} y={props.y} width={props.width} height={props.height} {...placeholder} clipPath={props.clipPath} aria-hidden="true" />}
    <image {...props} />
  </g>;
}
