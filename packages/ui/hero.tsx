import type { ReactNode } from "react";
import { ImageFrame } from "./image-frame";

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  actions: ReactNode;
  /** Optional content below actions (e.g. name and designation). */
  footer?: ReactNode;
  image: {
    src: string;
    alt: string;
    imageClassName?: string;
    fit?: "cover" | "contain";
    frameClassName?: string;
  };
};

export function Hero({ eyebrow, title, description, actions, footer, image }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-sage-soft/80 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -right-10 h-64 w-64 rounded-full bg-rose/20 blur-2xl"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] md:gap-12 md:py-24 lg:max-w-7xl">
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <p className="text-sm font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="max-w-xl text-lg leading-8 text-muted">{description}</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
          {footer ? <div className="mt-1">{footer}</div> : null}
        </div>
        <ImageFrame
          src={image.src}
          alt={image.alt}
          imageClassName={image.imageClassName}
          fit={image.fit}
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className={
            image.frameClassName ?? "aspect-[4/5] min-h-80 md:aspect-[5/6]"
          }
        />
      </div>
    </section>
  );
}
