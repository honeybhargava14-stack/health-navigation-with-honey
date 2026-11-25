"use client";

import { detectPainIntent } from "@/lib/pain-intent";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SNOOZE_KEY = "honey-pain-invite-snooze";

type PainIntentContextValue = {
  inviteOpen: boolean;
  chatOpen: boolean;
  reportText: (text: string) => void;
  acceptInvite: () => void;
  dismissInvite: () => void;
  closeChat: () => void;
  openChat: () => void;
};

const PainIntentContext = createContext<PainIntentContextValue | null>(null);

function isSnoozed() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SNOOZE_KEY) === "1";
  } catch {
    return false;
  }
}

function setSnoozed() {
  try {
    sessionStorage.setItem(SNOOZE_KEY, "1");
  } catch {
    // Ignore storage failures (private mode quotas, etc.).
  }
}

export function PainIntentProvider({ children }: { children: ReactNode }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenRef = useRef(false);
  chatOpenRef.current = chatOpen;

  const reportText = useCallback((text: string) => {
    if (!detectPainIntent(text)) return;
    if (isSnoozed()) return;
    if (chatOpenRef.current) return;
    setInviteOpen(true);
  }, []);

  const acceptInvite = useCallback(() => {
    setInviteOpen(false);
    setChatOpen(true);
  }, []);

  const dismissInvite = useCallback(() => {
    setInviteOpen(false);
    setSnoozed();
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const openChat = useCallback(() => {
    setInviteOpen(false);
    setChatOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      inviteOpen,
      chatOpen,
      reportText,
      acceptInvite,
      dismissInvite,
      closeChat,
      openChat,
    }),
    [inviteOpen, chatOpen, reportText, acceptInvite, dismissInvite, closeChat, openChat],
  );

  return <PainIntentContext.Provider value={value}>{children}</PainIntentContext.Provider>;
}

export function usePainIntent() {
  return useContext(PainIntentContext);
}

/** Safe no-op when the provider is not mounted. */
export function useReportPainText() {
  const ctx = useContext(PainIntentContext);
  return ctx?.reportText ?? (() => {});
}
