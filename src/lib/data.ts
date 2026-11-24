import { createClient } from "@/lib/supabase/server";
import { rangeStart, type DailyLogSummary } from "@/lib/summaries";
import type { ProgressRange } from "@/lib/constants";
import { connection } from "next/server";
import { redirect } from "next/navigation";

export type AppClient = Awaited<ReturnType<typeof createClient>>;

export type Profile = {
  display_name: string;
  onboarding_complete: boolean;
  app_goal: string;
  app_goal_note: string;
  diagnosed_status: string;
  diagnosis_stage: string;
  streak_count: number;
  last_check_in_on: string | null;
  push_enabled: boolean;
};

export type Symptom = {
  id: string;
  label: string;
  category: string;
  duration: string;
  body_area: string;
  notes: string;
  active: boolean;
};

export type TreatmentOption = {
  id: string;
  name: string;
};

export type DailyLog = {
  id: string;
  loggedOn: string;
  sleepHours: number;
  stress: number;
  mood: number;
  energy: number;
  overallNote: string;
  rawSpeechTranscript: string;
  symptomEntries: { symptomId: string; severity: number; note: string }[];
  treatmentIds: string[];
};

export type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  startsAt: string;
  reason: string;
  notes: string;
  nextVisitAt: string | null;
};

export type AppointmentAttachment = {
  id: string;
  appointmentId: string;
  kind: "pdf" | "image" | "text" | "link";
  title: string;
  storagePath: string;
  url: string;
  bodyText: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

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
    .select(
      "display_name, onboarding_complete, app_goal, app_goal_note, diagnosed_status, diagnosis_stage, streak_count, last_check_in_on, push_enabled",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Profile | null;
}

export async function getSymptoms(supabase: AppClient, userId: string, activeOnly = true) {
  let query = supabase
    .from("symptoms")
    .select("id, label, category, duration, body_area, notes, active")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (activeOnly) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Symptom[];
}

export async function getTreatments(supabase: AppClient, userId: string) {
  const { data, error } = await supabase
    .from("treatments")
    .select("id, name")
    .eq("user_id", userId)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as TreatmentOption[];
}

export async function getDailyLogForDate(supabase: AppClient, userId: string, loggedOn: string) {
  const { data, error } = await supabase
    .from("daily_logs")
    .select(
      `
      id,
      logged_on,
      sleep_hours,
      stress,
      mood,
      energy,
      overall_note,
      raw_speech_transcript,
      symptom_entries ( symptom_id, severity, note ),
      daily_log_treatments ( treatment_id )
    `,
    )
    .eq("user_id", userId)
    .eq("logged_on", loggedOn)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return mapDailyLog(data);
}

export async function getDailyLogsInRange(
  supabase: AppClient,
  userId: string,
  range: ProgressRange,
  today: string,
) {
  const start = rangeStart(range, today);
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
      symptom_entries ( severity )
    `,
    )
    .eq("user_id", userId)
    .gte("logged_on", start)
    .lte("logged_on", today)
    .order("logged_on", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const severities = (row.symptom_entries as { severity: number }[] | null)?.map((e) => e.severity) ?? [];
    const avg =
      severities.length === 0
        ? null
        : Math.round((severities.reduce((a, b) => a + b, 0) / severities.length) * 10) / 10;
    return {
      loggedOn: row.logged_on,
      sleepHours: Number(row.sleep_hours),
      stress: row.stress,
      mood: row.mood,
      energy: row.energy,
      overallNote: row.overall_note,
      avgSymptomSeverity: avg,
    } satisfies DailyLogSummary;
  });
}

export async function getAppointments(supabase: AppClient, userId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("id, doctor_name, specialty, clinic, starts_at, reason, notes, next_visit_at")
    .eq("user_id", userId)
    .order("starts_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    doctorName: row.doctor_name,
    specialty: row.specialty,
    clinic: row.clinic,
    startsAt: row.starts_at,
    reason: row.reason,
    notes: row.notes,
    nextVisitAt: row.next_visit_at,
  })) as Appointment[];
}

export async function getAppointment(supabase: AppClient, userId: string, appointmentId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("id, doctor_name, specialty, clinic, starts_at, reason, notes, next_visit_at")
    .eq("user_id", userId)
    .eq("id", appointmentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: data.id,
    doctorName: data.doctor_name,
    specialty: data.specialty,
    clinic: data.clinic,
    startsAt: data.starts_at,
    reason: data.reason,
    notes: data.notes,
    nextVisitAt: data.next_visit_at,
  } satisfies Appointment;
}

export async function getAttachments(supabase: AppClient, userId: string, appointmentId: string) {
  const { data, error } = await supabase
    .from("appointment_attachments")
    .select("id, appointment_id, kind, title, storage_path, url, body_text")
    .eq("user_id", userId)
    .eq("appointment_id", appointmentId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    appointmentId: row.appointment_id,
    kind: row.kind,
    title: row.title,
    storagePath: row.storage_path,
    url: row.url,
    bodyText: row.body_text,
  })) as AppointmentAttachment[];
}

export async function getChatMessages(supabase: AppClient, userId: string, limit = 40) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data ?? []).reverse() as { id: string; role: ChatMessage["role"]; content: string; created_at: string }[]).map(
    (row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: row.created_at,
    }),
  );
}

function mapDailyLog(data: {
  id: string;
  logged_on: string;
  sleep_hours: number;
  stress: number;
  mood: number;
  energy: number;
  overall_note: string;
  raw_speech_transcript: string;
  symptom_entries: { symptom_id: string; severity: number; note: string }[] | null;
  daily_log_treatments: { treatment_id: string }[] | null;
}): DailyLog {
  return {
    id: data.id,
    loggedOn: data.logged_on,
    sleepHours: Number(data.sleep_hours),
    stress: data.stress,
    mood: data.mood,
    energy: data.energy,
    overallNote: data.overall_note,
    rawSpeechTranscript: data.raw_speech_transcript,
    symptomEntries: (data.symptom_entries ?? []).map((entry) => ({
      symptomId: entry.symptom_id,
      severity: entry.severity,
      note: entry.note,
    })),
    treatmentIds: (data.daily_log_treatments ?? []).map((row) => row.treatment_id),
  };
}
