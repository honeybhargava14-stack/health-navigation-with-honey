import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section className={`rounded-3xl border border-border bg-card p-5 shadow-sm ${className}`}>
      {title ? (
        <h2 className="font-serif mb-3 text-lg font-semibold text-foreground">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
