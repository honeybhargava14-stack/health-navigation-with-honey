import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { NextResponse } from "next/server";

type TreatmentLink = {
  treatments: { name: string } | { name: string }[] | null;
};

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
    .from("check_ins")
    .select(
      `
      logged_on,
      severity,
      sleep_hours,
      stress,
      lifestyle_note,
      check_in_treatments (
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
    "date,severity,sleep_hours,stress,lifestyle_note,treatments",
    ...(data ?? []).map((row) =>
      [
        row.logged_on,
        String(row.severity),
        String(row.sleep_hours),
        String(row.stress),
        csvEscape(row.lifestyle_note ?? ""),
        csvEscape(names(row.check_in_treatments).join("; ")),
      ].join(","),
    ),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="health-intelligence-log.csv"',
    },
  });
}

function names(links: TreatmentLink[] | null) {
  return (links ?? []).flatMap((link) => {
    if (!link.treatments) return [];
    return Array.isArray(link.treatments)
      ? link.treatments.map((item) => item.name)
      : [link.treatments.name];
  });
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
