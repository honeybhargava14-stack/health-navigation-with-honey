"use client";

import { savePushSubscription, setPushEnabled } from "@/lib/actions";
import { Button } from "@health/ui";
import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export function PushSettings({ enabled }: { enabled: boolean }) {
  const [status, setStatus] = useState(enabled ? "on" : "off");
  const [message, setMessage] = useState("");

  async function enablePush() {
    setMessage("");
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Push is not supported in this browser. In-app reminders still work.");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Push keys are not configured yet. In-app reminders still work.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Permission was not granted. You can still use the gentle in-app nudge.");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      setMessage("Could not create a push subscription.");
      return;
    }

    const result = await savePushSubscription({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    });
    if (result.error) {
      setMessage(result.error);
      return;
    }
    setStatus("on");
    setMessage("Honey can send a soft browser reminder when you miss a day.");
  }

  async function disablePush() {
    await setPushEnabled(false);
    setStatus("off");
    setMessage("Browser reminders are off. In-app nudges remain.");
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-6 text-muted">
        Status: {status === "on" ? "Browser reminders on" : "Browser reminders off"}
      </p>
      {status === "on" ? (
        <Button type="button" variant="secondary" onClick={disablePush}>
          Turn off browser reminders
        </Button>
      ) : (
        <Button type="button" onClick={enablePush}>
          Turn on browser reminders
        </Button>
      )}
      {message ? <p className="text-sm leading-6 text-muted">{message}</p> : null}
    </div>
  );
}
