"use client";

import Image from "next/image";
import { useState } from "react";

type ImageFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ImageFrame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 42vw, 100vw",
}: ImageFrameProps) {
  const [failed, setFailed] = useState(false);

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
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
