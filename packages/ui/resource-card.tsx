import Link from "next/link";
import { ImageFrame } from "./image-frame";

type ResourceCardProps = {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  readingMinutes: number;
  image: { src: string; alt: string };
  isDraft?: boolean;
};

export function ResourceCard({
  href,
  title,
  excerpt,
  category,
  dateLabel,
  readingMinutes,
  image,
  isDraft = false,
}: ResourceCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <Link href={href} className="flex h-full flex-col focus-visible:outline-none">
        <ImageFrame
          src={image.src}
          alt={image.alt}
          className="aspect-[3/2]"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
            <span>{category}</span>
            {isDraft ? (
              <span className="rounded-full bg-accent px-2 py-1 text-[0.7rem] text-muted normal-case">
                Sample draft
              </span>
            ) : null}
          </div>
          <h3 className="font-serif text-2xl leading-snug font-semibold">{title}</h3>
          <p className="flex-1 text-sm leading-6 text-muted">{excerpt}</p>
          <p className="text-xs text-muted">
            {dateLabel} · {readingMinutes} min read
          </p>
        </div>
      </Link>
    </article>
  );
}
