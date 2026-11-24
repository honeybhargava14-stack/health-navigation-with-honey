import { HONEY_MODEL, HONEY_SYSTEM } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { generateObject } from "ai";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  transcript: z.string().min(1).max(4000),
  symptoms: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        category: z.string(),
      }),
    )
    .max(20),
});

export async function POST(request: Request) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json(
      { error: "AI is not configured yet. Your words are still yours to edit by hand." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Could not read that speech note." }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: HONEY_MODEL,
      system: HONEY_SYSTEM,
      prompt: `Turn this spoken health note into a short gentle summary the person can keep in their daily log.
Also suggest which of their tracked symptoms seem mentioned, with a severity 0-10 if clear, else omit severity.
Transcript: ${parsed.data.transcript}
Tracked symptoms: ${JSON.stringify(parsed.data.symptoms)}`,
      schema: z.object({
        summary: z.string(),
        symptomHints: z.array(
          z.object({
            symptomId: z.string(),
            severity: z.number().min(0).max(10).optional(),
            note: z.string().optional(),
          }),
        ),
      }),
    });

    return NextResponse.json(object);
  } catch {
    return NextResponse.json(
      { error: "Honey could not sort that just now. You can still save your words." },
      { status: 500 },
    );
  }
}
