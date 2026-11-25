"use client";

import type { ReactNode } from "react";
import { HoneyFloatingChat } from "./honey-floating-chat";
import { HoneyInvite } from "./honey-invite";
import { PainIntentProvider } from "./pain-intent-context";

/** App-shell Honey: pain invite + floating chat dock (alongside the /honey page). */
export function HoneyAssistant({ children }: { children?: ReactNode }) {
  return (
    <PainIntentProvider>
      {children}
      <HoneyInvite />
      <HoneyFloatingChat />
    </PainIntentProvider>
  );
}
