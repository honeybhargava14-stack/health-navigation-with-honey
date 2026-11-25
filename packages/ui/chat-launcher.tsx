"use client";

import type { HTMLAttributes, ReactNode } from "react";

type ChatLauncherProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  detail?: ReactNode;
  actions?: ReactNode;
};

export function ChatLauncher({
  label,
  detail,
  actions,
  className = "",
  ...props
}: ChatLauncherProps) {
  return (
    <div
      className={`fixed right-3 bottom-[5.5rem] z-40 flex w-[min(100%-1.5rem,20rem)] flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-lg ${className}`}
      {...props}
    >
      <div>
        <p className="font-serif text-base font-semibold text-foreground">{label}</p>
        {detail ? <div className="mt-1 text-sm leading-6 text-muted">{detail}</div> : null}
      </div>
      {actions ? <div className="flex flex-col gap-2">{actions}</div> : null}
    </div>
  );
}
