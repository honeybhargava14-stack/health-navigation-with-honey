import { HONEY_MODEL, HONEY_SYSTEM } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { generateObject } from "ai";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  appointmentId: z.string(),
  doctorName: z.string(),
  specialty: z.string(),
  reason: z.string(),
  symptoms: z.array(z.object({ label: z.string(), category: z.string() })),
  recentNotes: z.array(z.string()),
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
      { error: "AI is not configured yet. Try writing a few questions by hand." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing visit details." }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: HONEY_MODEL,
      system: HONEY_SYSTEM,
      prompt: `Suggest 5 to 8 gentle, practical questions a person might ask their clinician.
These are preparation aids only, not medical advice.
Doctor: ${parsed.data.doctorName}
Specialty: ${parsed.data.specialty || "not specified"}
Reason: ${parsed.data.reason || "not specified"}
Symptoms: ${JSON.stringify(parsed.data.symptoms)}
Recent notes: ${JSON.stringify(parsed.data.recentNotes)}
Also write one short advisory paragraph reminding them this is prep only and urgent symptoms need real care.`,
      schema: z.object({
        questions: z.array(z.string()).min(3).max(10),
        advisory: z.string(),
      }),
    });

    return NextResponse.json(object);
  } catch {
    return NextResponse.json({ error: "Could not prepare questions right now." }, { status: 500 });
  }
}
