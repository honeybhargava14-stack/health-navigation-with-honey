"use client";

import Image from "next/image";
import { useState } from "react";

type ImageFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** Extra classes for the img (e.g. object-top for portraits). */
  imageClassName?: string;
  /** cover fills and may crop; contain shows the full image. */
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
};

export function ImageFrame({
  src,
  alt,
  className = "",
  imageClassName = "",
  fit = "cover",
  priority = false,
  sizes = "(min-width: 1024px) 42vw, 100vw",
}: ImageFrameProps) {
  const [failed, setFailed] = useState(false);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

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
