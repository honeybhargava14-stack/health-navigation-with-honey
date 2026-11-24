"use client";

import { ChatBubble, Button, TextArea } from "@health/ui";
import { useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function HoneyChat({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError("");
    const userMessage: Message = { id: `local-${Date.now()}`, role: "user", content: text };
    setMessages((current) => [...current, userMessage]);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Honey could not reply just now.");
        setPending(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      const assistantId = `assistant-${Date.now()}`;
      setMessages((current) => [...current, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        const snapshot = assistant;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: snapshot } : message,
          ),
        );
      }
    } catch {
      setError("Honey could not reply just now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto rounded-3xl border border-border bg-card p-4">
        {messages.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            Hi, I am Honey. Tell me how you are feeling, what you want to log, or what visit you are
            preparing for. I can help fill fields gently. I do not diagnose.
          </p>
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} role={message.role}>
              {message.content || (pending ? "…" : "")}
            </ChatBubble>
          ))
        )}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <TextArea
        label="Talk with Honey"
        name="message"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="I have been tired and my head hurts…"
        rows={3}
      />
      <Button type="button" onClick={send} disabled={pending || !input.trim()}>
        {pending ? "Honey is listening..." : "Send"}
      </Button>
    </div>
  );
}
