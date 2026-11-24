"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { buttonClass } from "./button";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
};

export function Modal({ open, title, children, onClose, actions }: ModalProps) {
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
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/35"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lg"
      >
        <h2 id={titleId} className="font-serif text-2xl font-semibold text-foreground">
          {title}
        </h2>
        <div className="mt-3 text-sm leading-6 text-muted">{children}</div>
        <div className="mt-6 flex flex-col gap-3">
          {actions}
          <button
            ref={closeRef}
            type="button"
            className={buttonClass("ghost", "", true)}
            onClick={onClose}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
