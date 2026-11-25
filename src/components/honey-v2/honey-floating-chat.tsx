"use client";

import { Button, ChatBubble, FloatingPanel, TextArea } from "@health/ui";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePainIntent } from "./pain-intent-context";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function HoneyFloatingChat() {
  const ctx = usePainIntent();
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hiddenOnHoneyPage = pathname === "/honey" || pathname.startsWith("/honey/");
  const open = Boolean(ctx?.chatOpen) && !hiddenOnHoneyPage;

  useEffect(() => {
    if (!open || loadedRef.current) return;
    let cancelled = false;
    setLoadingHistory(true);

    void (async () => {
      try {
        const response = await fetch("/api/chat");
        const data = (await response.json().catch(() => ({}))) as {
          messages?: { id: string; role: string; content: string }[];
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error ?? "Could not load your recent chat.");
          return;
        }
        const next = (data.messages ?? [])
          .filter((message) => message.role === "user" || message.role === "assistant")
          .map((message) => ({
            id: message.id,
            role: message.role as "user" | "assistant",
            content: message.content,
          }))
          .filter((message) => message.content.trim().length > 0);
        setMessages(next);
        loadedRef.current = true;
      } catch {
        if (!cancelled) setError("Could not load your recent chat.");
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [open, messages, pending]);

  async function send() {
    const message = input.trim();
    if (!message || pending) return;
    setInput("");
    setError("");
    const userMessage: Message = { id: `local-${Date.now()}`, role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        text?: string;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Honey could not reply just now.");
        return;
      }
      const reply = String(data.text || "").trim();
      if (!reply) {
        setError(data.error ?? "Honey paused without a reply. Please try again.");
        return;
      }
      setMessages((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, role: "assistant", content: reply },
      ]);
    } catch {
      setError("Honey could not reply just now.");
    } finally {
      setPending(false);
    }
  }

  if (!ctx || hiddenOnHoneyPage) return null;

  return (
    <FloatingPanel
      open={open}
      title="Honey"
      onClose={ctx.closeChat}
      footer={
        <div className="flex flex-col gap-2">
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <TextArea
            label="Talk with Honey"
            name="honey-v2-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="I have been sore…"
            rows={2}
          />
          <Button type="button" onClick={send} disabled={pending || !input.trim()}>
            {pending ? "Honey is listening..." : "Send"}
          </Button>
        </div>
      }
    >
      <div ref={scrollRef} className="flex flex-col gap-3">
        {loadingHistory ? (
          <p className="text-sm text-muted">Opening Honey...</p>
        ) : messages.length === 0 && !pending ? (
          <p className="text-sm leading-6 text-muted">
            Hi, I am Honey. Tell me how you are feeling. I do not diagnose. If you are in pain, I can
            ask a couple of gentle questions and share a calm assessment form when you are ready.
          </p>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} role={message.role}>
                {message.content}
              </ChatBubble>
            ))}
            {pending ? <ChatBubble role="assistant">Honey is listening…</ChatBubble> : null}
          </>
        )}
      </div>
    </FloatingPanel>
  );
}
