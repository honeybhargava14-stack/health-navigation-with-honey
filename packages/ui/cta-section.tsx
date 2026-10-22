import type { ReactNode } from "react";

type CtaSectionProps = {
  title: string;
  children: ReactNode;
  actions: ReactNode;
  className?: string;
};

export function CtaSection({ title, children, actions, className = "" }: CtaSectionProps) {
  return (
    <section
      className={`rounded-3xl border border-border bg-card px-6 py-10 shadow-sm md:px-10 ${className}`}
    >
      <h2 className="font-serif text-3xl leading-tight font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 max-w-2xl text-base leading-7 text-muted">{children}</div>
      <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
    </section>
  );
}
