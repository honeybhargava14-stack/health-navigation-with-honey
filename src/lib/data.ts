import { createClient } from "@/lib/supabase/server";
import type { CheckInRecord } from "@/lib/patterns";
import { addDays } from "@/lib/dates";
import { connection } from "next/server";
import { redirect } from "next/navigation";

export type AppClient = Awaited<ReturnType<typeof createClient>>;

export type TreatmentOption = {
  id: string;
  name: string;
};

export type Investigation = {
  healthQuestion: string;
  symptomLabel: string;
  duration: string;
  goal: string;
  startedOn: string;
};

type TreatmentLink = {
  treatments: { name: string } | { name: string }[] | null;
};

const checkInSelect = `
  logged_on,
  severity,
  sleep_hours,
  stress,
  lifestyle_note,
  check_in_treatments (
    treatments ( name )
  )
`;

export async function requireUser() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, user };
}

export async function getProfile(supabase: AppClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, onboarding_complete")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getInvestigation(
  supabase: AppClient,
  userId: string,
): Promise<Investigation | null> {
  const { data, error } = await supabase
    .from("investigations")
    .select("health_question, symptom_label, duration, goal, started_on")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    healthQuestion: data.health_question,
    symptomLabel: data.symptom_label,
    duration: data.duration,
    goal: data.goal,
    startedOn: data.started_on,
  };
}

export async function getTreatments(supabase: AppClient, userId: string): Promise<TreatmentOption[]> {
  const { data, error } = await supabase
    .from("treatments")
    .select("id, name")
    .eq("user_id", userId)
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCheckIns(
  supabase: AppClient,
  userId: string,
  fromDate?: string,
): Promise<CheckInRecord[]> {
  let query = supabase
    .from("check_ins")
    .select(checkInSelect)
    .eq("user_id", userId)
    .order("logged_on", { ascending: true });

  if (fromDate) query = query.gte("logged_on", fromDate);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapCheckIn);
}

export async function getTodayCheckIn(supabase: AppClient, userId: string, loggedOn: string) {
  const { data, error } = await supabase
    .from("check_ins")
    .select(checkInSelect)
    .eq("user_id", userId)
    .eq("logged_on", loggedOn)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapCheckIn(data) : null;
}

export function windowStart(today: string) {
  return addDays(today, -13);
}

function treatmentNames(links: TreatmentLink[] | null) {
  return (links ?? []).flatMap((link) => {
    if (!link.treatments) return [];
    return Array.isArray(link.treatments)
      ? link.treatments.map((item) => item.name)
      : [link.treatments.name];
  });
}

function mapCheckIn(row: {
  logged_on: string;
  severity: number;
  sleep_hours: number | string;
  stress: number;
  lifestyle_note: string | null;
  check_in_treatments: TreatmentLink[] | null;
}): CheckInRecord {
  return {
    loggedOn: row.logged_on,
    severity: row.severity,
    sleepHours: Number(row.sleep_hours),
    stress: row.stress,
    lifestyleNote: row.lifestyle_note ?? "",
    treatments: treatmentNames(row.check_in_treatments),
  };
}
