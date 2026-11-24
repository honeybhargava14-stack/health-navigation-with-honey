"use server";

import {
  APP_GOAL_OPTIONS,
  BODY_AREA_OPTIONS,
  DIAGNOSIS_STAGE_OPTIONS,
  DURATION_OPTIONS,
  SYMPTOM_CATEGORY_OPTIONS,
  DOCTOR_SPECIALTY_OPTIONS,
} from "@/lib/constants";
import type { ActionState } from "@/lib/action-state";
import { isAcceptableLogDate, todayLocal } from "@/lib/dates";
import { nextStreak } from "@/lib/summaries";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { redirect } from "next/navigation";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function signUp(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await connection();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const displayName = String(formData.get("display_name") || "").trim().slice(0, 80);

  if (!email.includes("@") || email.length > 200) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Use at least 8 characters for your password." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  if (admin) {
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (createError) {
      if (/already (been )?registered|already exists/i.test(createError.message)) {
        return { error: "An account with that email already exists. Sign in instead." };
      }
      return { error: createError.message };
    }
    const { data: started, error: startError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (startError || !started.session) {
      return {
        error: "Your account was created. Sign in with the same email and password to continue.",
      };
    }
    redirect("/onboarding");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) return { error: error.message };
  if (!data.session) {
    return {
      error: "Your account was created. Sign in with the same email and password to continue.",
    };
  }

  redirect("/onboarding");
}

export async function signIn(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = await createClient();
  let { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (!data.session && isUnconfirmedEmailError(error?.code, error?.message)) {
    const userId = await findUserIdByEmail(email);
    if (userId) {
      const retry = await confirmEmailAndSignIn(supabase, userId, email, password);
      if (retry) {
        data = retry;
        error = null;
      }
    }
  }

  if (error || !data.user) return { error: "Email or password is incorrect." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", data.user.id)
    .maybeSingle();

  redirect(profile?.onboarding_complete ? "/today" : "/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function completeOnboarding(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const displayName = String(formData.get("display_name") || "").trim().slice(0, 80);
  const appGoal = String(formData.get("app_goal") || "").trim();
  const appGoalNote = String(formData.get("app_goal_note") || "").trim().slice(0, 400);
  const diagnosedStatus = String(formData.get("diagnosed_status") || "").trim();
  const diagnosisStage = String(formData.get("diagnosis_stage") || "").trim();

  if (!(APP_GOAL_OPTIONS as readonly string[]).includes(appGoal)) {
    return { error: "Choose what brings you here." };
  }
  if (!["yes", "no", "unsure"].includes(diagnosedStatus)) {
    return { error: "Tell us whether you have already been diagnosed." };
  }
  if (diagnosedStatus === "yes") {
    if (!(DIAGNOSIS_STAGE_OPTIONS as readonly string[]).includes(diagnosisStage)) {
      return { error: "Choose where you are in that journey." };
    }
  }

  const symptomPayloads = parseOnboardingSymptoms(formData);
  if ("error" in symptomPayloads) return symptomPayloads;
  if (symptomPayloads.length === 0) {
    return { error: "Add at least one symptom so Honey knows what to listen for." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      app_goal: appGoal,
      app_goal_note: appGoalNote,
      diagnosed_status: diagnosedStatus,
      diagnosis_stage: diagnosedStatus === "yes" ? diagnosisStage : "",
      onboarding_complete: true,
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  const { error: symptomError } = await supabase.from("symptoms").insert(
    symptomPayloads.map((symptom) => ({
      user_id: user.id,
      label: symptom.label,
      category: symptom.category,
      duration: symptom.duration,
      body_area: symptom.bodyArea,
      notes: symptom.notes,
    })),
  );
  if (symptomError) return { error: symptomError.message };

  redirect("/today");
}

export async function saveDailyLog(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const loggedOn = String(formData.get("logged_on") || "");
  const sleepHours = Math.round(Number(formData.get("sleep_hours")) * 10) / 10;
  const stress = Number(formData.get("stress"));
  const mood = Number(formData.get("mood"));
  const energy = Number(formData.get("energy"));
  const overallNote = String(formData.get("overall_note") || "").trim().slice(0, 1000);
  const speech = String(formData.get("raw_speech_transcript") || "").trim().slice(0, 4000);
  const newTreatment = String(formData.get("new_treatment") || "").trim().slice(0, 80);
  const selectedIds = [
    ...new Set(
      formData
        .getAll("treatment_id")
        .map(String)
        .filter((id) => UUID_PATTERN.test(id)),
    ),
  ];

  if (!isAcceptableLogDate(loggedOn)) {
    return { error: "You can save a check-in for today only." };
  }
  if (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24) {
    return { error: "Sleep must be between 0 and 24 hours." };
  }
  for (const [label, value] of [
    ["Stress", stress],
    ["Mood", mood],
    ["Energy", energy],
  ] as const) {
    if (!Number.isInteger(value) || value < 0 || value > 10) {
      return { error: `${label} must be a whole number from 0 to 10.` };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: log, error } = await supabase
    .from("daily_logs")
    .upsert(
      {
        user_id: user.id,
        logged_on: loggedOn,
        sleep_hours: sleepHours,
        stress,
        mood,
        energy,
        overall_note: overallNote,
        raw_speech_transcript: speech,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,logged_on" },
    )
    .select("id")
    .single();

  if (error || !log) return { error: error?.message ?? "Could not save today's check-in." };

  const symptomIds = formData.getAll("symptom_id").map(String).filter((id) => UUID_PATTERN.test(id));
  const entries = symptomIds.map((symptomId) => {
    const severity = Number(formData.get(`severity_${symptomId}`));
    const note = String(formData.get(`note_${symptomId}`) || "").trim().slice(0, 300);
    return { symptomId, severity, note };
  });

  for (const entry of entries) {
    if (!Number.isInteger(entry.severity) || entry.severity < 0 || entry.severity > 10) {
      return { error: "Each symptom severity must be a whole number from 0 to 10." };
    }
  }

  await supabase.from("symptom_entries").delete().eq("daily_log_id", log.id);
  if (entries.length > 0) {
    const { error: entryError } = await supabase.from("symptom_entries").insert(
      entries.map((entry) => ({
        daily_log_id: log.id,
        symptom_id: entry.symptomId,
        severity: entry.severity,
        note: entry.note,
      })),
    );
    if (entryError) return { error: entryError.message };
  }

  if (newTreatment.length === 1) {
    return { error: "Treatment names need at least 2 characters." };
  }

  if (newTreatment) {
    const existing = await findTreatmentId(supabase, user.id, newTreatment);
    if (existing.error) return { error: existing.error };
    if (existing.id) {
      selectedIds.push(existing.id);
    } else {
      const { data: created, error: treatmentError } = await supabase
        .from("treatments")
        .insert({ user_id: user.id, name: newTreatment })
        .select("id")
        .single();
      if (treatmentError || !created) {
        return { error: treatmentError?.message ?? "Could not add that treatment." };
      }
      selectedIds.push(created.id);
    }
  }

  const uniqueIds = [...new Set(selectedIds)];
  await supabase.from("daily_log_treatments").delete().eq("daily_log_id", log.id);
  if (uniqueIds.length > 0) {
    const { error: linkError } = await supabase.from("daily_log_treatments").insert(
      uniqueIds.map((treatmentId) => ({
        daily_log_id: log.id,
        treatment_id: treatmentId,
      })),
    );
    if (linkError) return { error: linkError.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_count, last_check_in_on")
    .eq("id", user.id)
    .maybeSingle();

  const streak = nextStreak(
    profile?.last_check_in_on ?? null,
    profile?.streak_count ?? 0,
    loggedOn,
  );

  await supabase
    .from("profiles")
    .update({
      streak_count: streak.streak,
      last_check_in_on: streak.lastCheckInOn,
    })
    .eq("id", user.id);

  redirect("/today?saved=1");
}

export async function addSymptom(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const label = String(formData.get("label") || "").trim().slice(0, 80);
  const category = String(formData.get("category") || "").trim();
  const duration = String(formData.get("duration") || "").trim();
  const bodyArea = String(formData.get("body_area") || "").trim();
  const notes = String(formData.get("notes") || "").trim().slice(0, 400);

  if (label.length < 2) return { error: "Name the symptom in at least 2 characters." };
  if (!(SYMPTOM_CATEGORY_OPTIONS as readonly string[]).includes(category)) {
    return { error: "Choose a symptom category." };
  }
  if (duration && !(DURATION_OPTIONS as readonly string[]).includes(duration)) {
    return { error: "Choose how long this has been happening." };
  }
  if (bodyArea && !(BODY_AREA_OPTIONS as readonly string[]).includes(bodyArea)) {
    return { error: "Choose a body area." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("symptoms").insert({
    user_id: user.id,
    label,
    category,
    duration,
    body_area: bodyArea,
    notes,
  });
  if (error) return { error: error.message };
  redirect("/settings?saved=symptom");
}

export async function deactivateSymptom(formData: FormData) {
  const symptomId = String(formData.get("symptom_id") || "");
  if (!UUID_PATTERN.test(symptomId)) redirect("/settings");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("symptoms")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", symptomId)
    .eq("user_id", user.id);
  redirect("/settings");
}

export async function addTreatment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  if (name.length < 2) return { error: "Enter a treatment name with at least 2 characters." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const existing = await findTreatmentId(supabase, user.id, name);
  if (existing.error) return { error: existing.error };
  if (existing.id) return { error: "That treatment is already on your list." };

  const { error } = await supabase.from("treatments").insert({ user_id: user.id, name });
  if (error) return { error: error.message };
  redirect("/settings");
}

export async function removeTreatment(formData: FormData) {
  const treatmentId = String(formData.get("treatment_id") || "");
  if (!UUID_PATTERN.test(treatmentId)) redirect("/settings");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("treatments").delete().eq("id", treatmentId).eq("user_id", user.id);
  redirect("/settings");
}

export async function saveAppointment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const appointmentId = String(formData.get("appointment_id") || "");
  const doctorName = String(formData.get("doctor_name") || "").trim().slice(0, 120);
  const specialty = String(formData.get("specialty") || "").trim();
  const clinic = String(formData.get("clinic") || "").trim().slice(0, 160);
  const startsAt = String(formData.get("starts_at") || "").trim();
  const reason = String(formData.get("reason") || "").trim().slice(0, 400);
  const notes = String(formData.get("notes") || "").trim().slice(0, 1000);
  const nextVisitAt = String(formData.get("next_visit_at") || "").trim();

  if (doctorName.length < 2) return { error: "Enter the doctor's name." };
  if (specialty && !(DOCTOR_SPECIALTY_OPTIONS as readonly string[]).includes(specialty)) {
    return { error: "Choose a specialty." };
  }
  if (!startsAt) return { error: "Choose a date and time for the visit." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const payload = {
    user_id: user.id,
    doctor_name: doctorName,
    specialty,
    clinic,
    starts_at: new Date(startsAt).toISOString(),
    reason,
    notes,
    next_visit_at: nextVisitAt ? new Date(nextVisitAt).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (appointmentId && UUID_PATTERN.test(appointmentId)) {
    const { error } = await supabase
      .from("appointments")
      .update(payload)
      .eq("id", appointmentId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
    redirect(`/care?saved=1&id=${appointmentId}`);
  }

  const { data, error } = await supabase.from("appointments").insert(payload).select("id").single();
  if (error || !data) return { error: error?.message ?? "Could not save that appointment." };
  redirect(`/care?saved=1&id=${data.id}`);
}

export async function deleteAppointment(formData: FormData) {
  const appointmentId = String(formData.get("appointment_id") || "");
  if (!UUID_PATTERN.test(appointmentId)) redirect("/care");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("appointments").delete().eq("id", appointmentId).eq("user_id", user.id);
  redirect("/care");
}

export async function addAppointmentAttachment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const appointmentId = String(formData.get("appointment_id") || "");
  const kind = String(formData.get("kind") || "").trim();
  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const url = String(formData.get("url") || "").trim().slice(0, 500);
  const bodyText = String(formData.get("body_text") || "").trim().slice(0, 4000);
  const file = formData.get("file");

  if (!UUID_PATTERN.test(appointmentId)) return { error: "Missing appointment." };
  if (!["pdf", "image", "text", "link"].includes(kind)) {
    return { error: "Choose a report type." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let storagePath = "";
  if ((kind === "pdf" || kind === "image") && file instanceof File && file.size > 0) {
    if (file.size > 8 * 1024 * 1024) return { error: "Keep uploads under 8 MB." };
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    storagePath = `${user.id}/${appointmentId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("care-reports")
      .upload(storagePath, file, { upsert: false });
    if (uploadError) return { error: uploadError.message };
  } else if (kind === "link" && !url) {
    return { error: "Add a link." };
  } else if (kind === "text" && !bodyText) {
    return { error: "Add a short note." };
  }

  const { error } = await supabase.from("appointment_attachments").insert({
    appointment_id: appointmentId,
    user_id: user.id,
    kind,
    title: title || "Report",
    storage_path: storagePath,
    url,
    body_text: bodyText,
  });
  if (error) return { error: error.message };
  redirect(`/care?id=${appointmentId}`);
}

export async function setPushEnabled(enabled: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("profiles").update({ push_enabled: enabled }).eq("id", user.id);
}

export async function savePushSubscription(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "user_id,endpoint" },
  );
  if (error) return { error: error.message };

  await supabase.from("profiles").update({ push_enabled: true }).eq("id", user.id);
  return { error: "" };
}

export async function deleteAccount(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (String(formData.get("confirm") || "") !== "DELETE") {
    return { error: "Type DELETE to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userId = user.id;
  await supabase.from("push_subscriptions").delete().eq("user_id", userId);
  await supabase.from("chat_messages").delete().eq("user_id", userId);
  await supabase.from("appointment_attachments").delete().eq("user_id", userId);
  await supabase.from("appointments").delete().eq("user_id", userId);
  await supabase.from("daily_logs").delete().eq("user_id", userId);
  await supabase.from("symptoms").delete().eq("user_id", userId);
  await supabase.from("treatments").delete().eq("user_id", userId);
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
  if (profileError) return { error: profileError.message };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      error:
        "Account data was removed, but the login could not be deleted. Add SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    };
  }

  const admin = createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: adminError } = await admin.auth.admin.deleteUser(userId);
  if (adminError) return { error: adminError.message };

  await supabase.auth.signOut();
  redirect("/");
}

function parseOnboardingSymptoms(formData: FormData) {
  const count = Number(formData.get("symptom_count") || "0");
  if (!Number.isInteger(count) || count < 0 || count > 12) {
    return { error: "Something went wrong with your symptom list." };
  }

  const payloads: {
    label: string;
    category: string;
    duration: string;
    bodyArea: string;
    notes: string;
  }[] = [];

  for (let index = 0; index < count; index += 1) {
    const label = String(formData.get(`symptom_label_${index}`) || "").trim().slice(0, 80);
    const category = String(formData.get(`symptom_category_${index}`) || "").trim();
    const duration = String(formData.get(`symptom_duration_${index}`) || "").trim();
    const bodyArea = String(formData.get(`symptom_body_area_${index}`) || "").trim();
    const notes = String(formData.get(`symptom_notes_${index}`) || "").trim().slice(0, 300);
    if (!label && !category) continue;
    if (label.length < 2) return { error: "Each symptom needs a short name." };
    if (!(SYMPTOM_CATEGORY_OPTIONS as readonly string[]).includes(category)) {
      return { error: "Choose a category for each symptom." };
    }
    if (!(DURATION_OPTIONS as readonly string[]).includes(duration)) {
      return { error: "Choose how long each symptom has been happening." };
    }
    if (!(BODY_AREA_OPTIONS as readonly string[]).includes(bodyArea)) {
      return { error: "Choose a body area for each symptom." };
    }
    payloads.push({ label, category, duration, bodyArea, notes });
  }

  return payloads;
}

async function findTreatmentId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  name: string,
) {
  const { data, error } = await supabase.from("treatments").select("id, name").eq("user_id", userId);
  if (error) return { error: error.message };
  return {
    id: data?.find((item) => item.name.toLowerCase() === name.toLowerCase())?.id,
  };
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function isUnconfirmedEmailError(code?: string, message?: string) {
  return code === "email_not_confirmed" || /not confirmed/i.test(message ?? "");
}

async function findUserIdByEmail(email: string) {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) return null;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

async function confirmEmailAndSignIn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string,
  password: string,
) {
  const admin = createAdminClient();
  if (!admin) return null;
  const { error: confirmError } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (confirmError) return null;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) return null;
  return data;
}
