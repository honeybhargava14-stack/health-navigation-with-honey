import { HoneyChat } from "@/components/honey-chat";
import { getChatMessages, requireUser } from "@/lib/data";
import { Card, DisclaimerNotice, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Honey" };

export default function HoneyPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Opening Honey...</p>}>
      <HoneyContent />
    </Suspense>
  );
}

async function HoneyContent() {
  const { supabase, user } = await requireUser();
  const messages = await getChatMessages(supabase, user.id);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Honey</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          A warm listener for anytime. Honey can help fill your check-in or appointment fields.
        </p>
      </div>
      <SafetyNotice />
      <DisclaimerNotice />
      <Card>
        <HoneyChat
          initialMessages={messages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .map((message) => ({
              id: message.id,
              role: message.role as "user" | "assistant",
              content: message.content,
            }))}
        />
      </Card>
    </div>
  );
}
