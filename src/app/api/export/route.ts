import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("daily_logs")
    .select(
      `
      logged_on,
      sleep_hours,
      stress,
      mood,
      energy,
      overall_note,
      symptom_entries (
        severity,
        note,
        symptoms ( label )
      ),
      daily_log_treatments (
        treatments ( name )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("logged_on", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const lines = [
    "date,mood,energy,sleep_hours,stress,overall_note,symptoms,treatments",
    ...(data ?? []).map((row) => {
      const symptoms =
        (
          row.symptom_entries as
            | { severity: number; note: string; symptoms: { label: string } | { label: string }[] | null }[]
            | null
        )?.map((entry) => {
          const label = Array.isArray(entry.symptoms)
            ? entry.symptoms[0]?.label
            : entry.symptoms?.label;
          return `${label ?? "symptom"}:${entry.severity}`;
        }) ?? [];
      const treatments =
        (
          row.daily_log_treatments as
            | { treatments: { name: string } | { name: string }[] | null }[]
            | null
        )?.map((link) => {
          const treatment = link.treatments;
          return Array.isArray(treatment) ? treatment[0]?.name : treatment?.name;
        }).filter(Boolean) ?? [];

      return [
        row.logged_on,
        String(row.mood),
        String(row.energy),
        String(row.sleep_hours),
        String(row.stress),
        csvEscape(row.overall_note ?? ""),
        csvEscape(symptoms.join("; ")),
        csvEscape(treatments.join("; ")),
      ].join(",");
    }),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="honey-health-log.csv"',
    },
  });
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
