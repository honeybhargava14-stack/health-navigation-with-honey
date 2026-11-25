"use client";

import type { ReactNode } from "react";
import { HoneyFloatingChat } from "./honey-floating-chat";
import { HoneyInvite } from "./honey-invite";
import { PainIntentProvider } from "./pain-intent-context";

const ENABLED = process.env.NEXT_PUBLIC_HONEY_WIDGET_V2 === "1";

export function isHoneyWidgetV2Enabled() {
  return ENABLED;
}

export function HoneyAssistantV2({ children }: { children?: ReactNode }) {
  if (!ENABLED) return <>{children}</>;

  return (
    <PainIntentProvider>
      {children}
      <HoneyInvite />
      <HoneyFloatingChat />
    </PainIntentProvider>
  );
}
