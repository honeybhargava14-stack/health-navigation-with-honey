"use client";

import {
  clearPainContinueHere,
  HONEY_PAIN_HREF,
  markPainContinueHere,
  markPainSoftNudge,
  PAIN_POPUP,
} from "@/lib/pain-guidance";
import { mentionsPain, PAIN_MENTION_EVENT } from "@/lib/pain-mention";
import { buttonClass, Modal } from "@health/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SUPPRESS_KEY = "honey-pain-prompt-until";
const SUPPRESS_MS = 5 * 60 * 1000;

function isSuppressed() {
  if (typeof window === "undefined") return false;
  const until = Number(window.sessionStorage.getItem(SUPPRESS_KEY) || 0);
  return Number.isFinite(until) && until > Date.now();
}

function suppressForCooldown() {
  window.sessionStorage.setItem(SUPPRESS_KEY, String(Date.now() + SUPPRESS_MS));
}

export function PainConsultPrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const openPrompt = useCallback(() => {
    if (pathname?.startsWith("/honey")) return;
    if (isSuppressed()) return;
    setOpen(true);
    suppressForCooldown();
  }, [pathname]);

  const closePrompt = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    function consider(value: string, target: EventTarget | null) {
      if (!mentionsPain(value)) return;
      if (
        target instanceof Element &&
        target.closest("[data-suppress-pain-prompt]")
      ) {
        return;
      }
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        openPrompt();
      }, 180);
    }

    function onFieldEvent(event: Event) {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        )
      ) {
        return;
      }
      consider(target.value, target);
    }

    function onCustomEvent() {
      openPrompt();
    }

    document.addEventListener("input", onFieldEvent, true);
    document.addEventListener("change", onFieldEvent, true);
    window.addEventListener(PAIN_MENTION_EVENT, onCustomEvent);

    return () => {
      document.removeEventListener("input", onFieldEvent, true);
      document.removeEventListener("change", onFieldEvent, true);
      window.removeEventListener(PAIN_MENTION_EVENT, onCustomEvent);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [openPrompt]);

  return (
    <Modal
      open={open}
      title={PAIN_POPUP.title}
      onClose={closePrompt}
      actions={
        <>
          <Link
            href={HONEY_PAIN_HREF}
            className={buttonClass("primary", "", true)}
            onClick={() => {
              clearPainContinueHere();
              closePrompt();
            }}
          >
            {PAIN_POPUP.talkCta}
          </Link>
          <button
            type="button"
            className={buttonClass("secondary", "", true)}
            onClick={() => {
              markPainContinueHere();
              markPainSoftNudge();
              closePrompt();
            }}
          >
            {PAIN_POPUP.continueCta}
          </button>
        </>
      }
    >
      <p>{PAIN_POPUP.body}</p>
    </Modal>
  );
}
