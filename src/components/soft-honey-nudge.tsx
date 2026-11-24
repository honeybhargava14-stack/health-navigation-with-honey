"use client";

import {
  clearPainContinueHere,
  HONEY_PAIN_HREF,
  hasPainContinueHere,
} from "@/lib/pain-guidance";
import { buttonClass } from "@health/ui";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

type SoftHoneyNudgeProps = {
  /** When true, show immediately if the person chose "Continue here first". */
  show?: boolean;
  className?: string;
};

function subscribe() {
  return () => {};
}

function getContinueHereSnapshot() {
  return hasPainContinueHere();
}

function getServerSnapshot() {
  return false;
}

export function SoftHoneyNudge({ show = false, className = "" }: SoftHoneyNudgeProps) {
  const continueHere = useSyncExternalStore(
    subscribe,
    getContinueHereSnapshot,
    getServerSnapshot,
  );
  const [dismissed, setDismissed] = useState(false);

  if (!show || !continueHere || dismissed) return null;

  return (
    <aside
      className={`rounded-2xl border border-border bg-sage-soft/70 px-4 py-3 text-sm leading-6 text-foreground ${className}`}
      role="status"
    >
      <p>
        Whenever you feel ready, Honey is nearby if talking through the pain would feel gentler than
        holding it alone.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Link
          href={HONEY_PAIN_HREF}
          className={buttonClass("primary", "", false)}
          onClick={() => clearPainContinueHere()}
        >
          Talk to Honey
        </Link>
        <button
          type="button"
          className={buttonClass("ghost", "", false)}
          onClick={() => {
            clearPainContinueHere();
            setDismissed(true);
          }}
        >
          Maybe later
        </button>
      </div>
    </aside>
  );
}
