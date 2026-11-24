import { HONEY_MODEL, HONEY_SYSTEM } from "@/lib/ai";
import { todayLocal } from "@/lib/dates";
import { formatHoneyError } from "@/lib/honey-errors";
import { buildHoneyFallbackReply, isGatewayBillingError } from "@/lib/honey-fallback";
import { suggestSpecialtiesForCategory } from "@/lib/specialty-map";
import { createClient } from "@/lib/supabase/server";
import { generateText, isStepCount, tool } from "ai";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

async function saveAssistantReply(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  reply: string,
) {
  await supabase.from("chat_messages").insert({
    user_id: userId,
    role: "assistant",
    content: reply,
  });
}

export async function POST(request: Request) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = (await request.json()) as { message?: string };
  const message = String(body.message || "").trim().slice(0, 2000);
  if (!message) return NextResponse.json({ error: "Say a little something first." }, { status: 400 });

  await supabase.from("chat_messages").insert({
    user_id: user.id,
    role: "user",
    content: message,
  });

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  const messages = ((history ?? []).reverse() as { role: string; content: string }[])
    .filter((row) => row.role === "user" || row.role === "assistant")
    .map((row) => ({
      role: row.role as "user" | "assistant",
      content: row.content,
    }));

  if (!process.env.AI_GATEWAY_API_KEY) {
    const fallback = buildHoneyFallbackReply(message, messages);
    await saveAssistantReply(supabase, user.id, fallback);
    return NextResponse.json({ text: fallback, mode: "fallback" });
  }

  try {
    const { text } = await generateText({
      model: HONEY_MODEL,
      system: `${HONEY_SYSTEM}
You can use tools to save a daily note, add a symptom, draft an appointment, or look up curated specialty suggestions.
Confirm gently what you saved. Today is ${todayLocal()}.`,
      messages,
      stopWhen: isStepCount(5),
      tools: {
        saveDailyNote: tool({
          description:
            "Save or update today's overall check-in note and optional mood/stress/energy/sleep.",
          inputSchema: z.object({
            overallNote: z.string().max(1000),
            mood: z.number().min(0).max(10).optional(),
            stress: z.number().min(0).max(10).optional(),
            energy: z.number().min(0).max(10).optional(),
            sleepHours: z.number().min(0).max(24).optional(),
          }),
          execute: async ({ overallNote, mood, stress, energy, sleepHours }) => {
            const loggedOn = todayLocal();
            const { data, error } = await supabase
              .from("daily_logs")
              .upsert(
                {
                  user_id: user.id,
                  logged_on: loggedOn,
                  overall_note: overallNote,
                  mood: mood ?? 5,
                  stress: stress ?? 3,
                  energy: energy ?? 5,
                  sleep_hours: sleepHours ?? 7,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id,logged_on" },
              )
              .select("id")
              .single();
            if (error) return { ok: false, error: error.message };
            return { ok: true, dailyLogId: data.id, loggedOn };
          },
        }),
        addSymptom: tool({
          description: "Add a symptom the person wants to track.",
          inputSchema: z.object({
            label: z.string().min(2).max(80),
            category: z.string(),
            duration: z.string().optional(),
            bodyArea: z.string().optional(),
            notes: z.string().optional(),
          }),
          execute: async ({ label, category, duration, bodyArea, notes }) => {
            const { data, error } = await supabase
              .from("symptoms")
              .insert({
                user_id: user.id,
                label,
                category,
                duration: duration ?? "",
                body_area: bodyArea ?? "",
                notes: notes ?? "",
              })
              .select("id, label")
              .single();
            if (error) return { ok: false, error: error.message };
            return { ok: true, symptom: data };
          },
        }),
        draftAppointment: tool({
          description: "Create an appointment draft with doctor details.",
          inputSchema: z.object({
            doctorName: z.string().min(2),
            specialty: z.string().optional(),
            clinic: z.string().optional(),
            startsAt: z.string(),
            reason: z.string().optional(),
            notes: z.string().optional(),
          }),
          execute: async ({ doctorName, specialty, clinic, startsAt, reason, notes }) => {
            const starts = new Date(startsAt);
            if (Number.isNaN(starts.getTime())) return { ok: false, error: "Invalid date" };
            const { data, error } = await supabase
              .from("appointments")
              .insert({
                user_id: user.id,
                doctor_name: doctorName,
                specialty: specialty ?? "",
                clinic: clinic ?? "",
                starts_at: starts.toISOString(),
                reason: reason ?? "",
                notes: notes ?? "",
              })
              .select("id, doctor_name, starts_at")
              .single();
            if (error) return { ok: false, error: error.message };
            return { ok: true, appointment: data };
          },
        }),
        suggestSpecialty: tool({
          description: "Return curated specialty suggestions for a symptom category.",
          inputSchema: z.object({ category: z.string() }),
          execute: async ({ category }) => suggestSpecialtiesForCategory(category),
        }),
      },
    });

    const reply = text.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Honey paused without a reply. Please try again." },
        { status: 502 },
      );
    }

    await saveAssistantReply(supabase, user.id, reply);
    return NextResponse.json({ text: reply });
  } catch (error) {
    console.error("Honey chat failed:", error);

    // Keep Honey responsive when AI Gateway billing is locked.
    if (isGatewayBillingError(error) || !process.env.AI_GATEWAY_API_KEY) {
      const fallback = buildHoneyFallbackReply(message, messages);
      await saveAssistantReply(supabase, user.id, fallback);
      return NextResponse.json({
        text: fallback,
        mode: "fallback",
      });
    }

    return NextResponse.json({ error: formatHoneyError(error) }, { status: 503 });
  }
}
