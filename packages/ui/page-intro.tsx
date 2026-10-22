import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <header className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {eyebrow ? (
        <p className="text-sm font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>
      {children ? <div className="text-lg leading-8 text-muted">{children}</div> : null}
    </header>
  );
}
