"use client";

import { Button, ChatLauncher } from "@health/ui";
import { usePathname } from "next/navigation";
import { usePainIntent } from "./pain-intent-context";

export function HoneyInvite() {
  const ctx = usePainIntent();
  const pathname = usePathname();
  const onHoneyPage = pathname === "/honey" || pathname.startsWith("/honey/");
  if (!ctx?.inviteOpen || ctx.chatOpen || onHoneyPage) return null;

  return (
    <ChatLauncher
      label="Sounds like you are in pain"
      detail="Would you like to talk with Honey? It is optional, and you can stop anytime."
      role="status"
      actions={
        <>
          <Button type="button" onClick={ctx.acceptInvite}>
            Talk with Honey
          </Button>
          <Button type="button" variant="ghost" onClick={ctx.dismissInvite}>
            Not now
          </Button>
        </>
      }
    />
  );
}
