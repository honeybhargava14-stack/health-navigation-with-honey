"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { buttonClass } from "./button";

type FloatingPanelProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
};

export function FloatingPanel({
  open,
  title,
  children,
  footer,
  onClose,
  className = "",
}: FloatingPanelProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className={`fixed right-3 bottom-[5.5rem] z-40 flex max-h-[min(70vh,32rem)] w-[min(100%-1.5rem,22rem)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 id={titleId} className="font-serif text-lg font-semibold text-foreground">
          {title}
        </h2>
        <button
          ref={closeRef}
          type="button"
          className={buttonClass("ghost", "min-h-10 px-3 text-sm", false)}
          onClick={onClose}
          aria-label="Close panel"
        >
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
      {footer ? <div className="border-t border-border px-4 py-3">{footer}</div> : null}
    </div>
  );
}
