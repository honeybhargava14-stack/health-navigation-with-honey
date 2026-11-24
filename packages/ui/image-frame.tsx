"use client";

import Image from "next/image";
import { useState } from "react";

type ImageFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** Extra classes for the img (e.g. object-top for portraits). */
  imageClassName?: string;
  /** cover fills and may crop; contain shows the full image inside a frame. */
  fit?: "cover" | "contain";
  /**
   * natural: show the original photo at its own aspect ratio with no crop.
   * framed: fill a sized box (default).
   */
  mode?: "framed" | "natural";
  /** Required for natural mode so Next Image can size the original photo. */
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

export function ImageFrame({
  src,
  alt,
  className = "",
  imageClassName = "",
  fit = "cover",
  mode = "framed",
  width,
  height,
  priority = false,
  sizes = "(min-width: 1024px) 42vw, 100vw",
}: ImageFrameProps) {
  const [failed, setFailed] = useState(false);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  if (mode === "natural") {
    const naturalWidth = width ?? 1200;
    const naturalHeight = height ?? 1600;

    return (
      <div className={`overflow-hidden rounded-3xl bg-accent shadow-sm ${className}`}>
        {failed ? (
          <div
            className="min-h-80 w-full bg-sage-soft"
            role="img"
            aria-label={alt}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={naturalWidth}
            height={naturalHeight}
            priority={priority}
            sizes={sizes}
            className={`h-auto w-full ${imageClassName}`}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-accent shadow-sm ${className}`}>
      {failed ? (
        <div className="absolute inset-0 bg-sage-soft" role="img" aria-label={alt} />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`${fitClass} ${imageClassName}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
