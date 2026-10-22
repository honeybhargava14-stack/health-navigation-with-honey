import type { ReactNode } from "react";
import { ImageFrame } from "./image-frame";

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  actions: ReactNode;
  image: { src: string; alt: string };
};

export function Hero({ eyebrow, title, description, actions, image }: HeroProps) {
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
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <p className="text-sm font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="max-w-xl text-lg leading-8 text-muted">{description}</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
        </div>
        <ImageFrame
          src={image.src}
          alt={image.alt}
          priority
          className="aspect-[4/5] min-h-80 md:aspect-[5/6]"
        />
      </div>
    </section>
  );
}
