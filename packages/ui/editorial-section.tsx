import type { ReactNode } from "react";

type EditorialSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function EditorialSection({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: EditorialSectionProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-5 py-16 md:py-20 ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
      ) : null}
      {title ? (
        <h2 className="font-serif mb-6 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
