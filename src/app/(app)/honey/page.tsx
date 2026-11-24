import { HoneyChat } from "@/components/honey-chat";
import { getChatMessages, requireUser } from "@/lib/data";
import { Card, DisclaimerNotice, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Honey" };

export default function HoneyPage({
  searchParams,
}: {
  searchParams: Promise<{ prefill?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Opening Honey...</p>}>
      <HoneyContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HoneyContent({
  searchParams,
}: {
  searchParams: Promise<{ prefill?: string }>;
}) {
  const [{ prefill }, { supabase, user }] = await Promise.all([searchParams, requireUser()]);
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
      <aside className="rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 text-muted">
        If you are in pain, Honey can guide you gently here and help you prepare for a calmer next
        step. She does not diagnose or treat.
      </aside>
      <Card>
        <HoneyChat
          initialPrefill={typeof prefill === "string" ? prefill : ""}
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
