"use server";

import { DURATION_OPTIONS } from "@/lib/constants";
import type { ActionState } from "@/lib/action-state";
import { isAcceptableLogDate, todayLocal } from "@/lib/dates";
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

  redirect(profile?.onboarding_complete ? "/dashboard" : "/onboarding");
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
  const parsed = readInvestigation(formData);
  if ("error" in parsed) return parsed;

  const displayName = String(formData.get("display_name") || "").trim().slice(0, 80);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const saved = await saveInvestigation(supabase, user.id, parsed);
  if (saved.error) return saved;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, onboarding_complete: true })
    .eq("id", user.id);

  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function updateInvestigation(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = readInvestigation(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const saved = await saveInvestigation(supabase, user.id, parsed);
  if (saved.error) return saved;
  redirect("/settings?saved=investigation");
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

export async function saveCheckIn(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const loggedOn = String(formData.get("logged_on") || "");
  const severity = Number(formData.get("severity"));
  const stress = Number(formData.get("stress"));
  const sleepHours = Math.round(Number(formData.get("sleep_hours")) * 10) / 10;
  const lifestyleNote = String(formData.get("lifestyle_note") || "").trim().slice(0, 500);
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
  if (!Number.isInteger(severity) || severity < 0 || severity > 10) {
    return { error: "Severity must be a whole number from 0 to 10." };
  }
  if (!Number.isInteger(stress) || stress < 0 || stress > 10) {
    return { error: "Stress must be a whole number from 0 to 10." };
  }
  if (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24) {
    return { error: "Sleep must be between 0 and 24 hours." };
  }
  if (newTreatment.length === 1) {
    return { error: "Treatment names need at least 2 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: checkIn, error } = await supabase
    .from("check_ins")
    .upsert(
      {
        user_id: user.id,
        logged_on: loggedOn,
        severity,
        sleep_hours: sleepHours,
        stress,
        lifestyle_note: lifestyleNote,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,logged_on" },
    )
    .select("id")
    .single();

  if (error || !checkIn) return { error: error?.message ?? "Could not save today's check-in." };

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
      if (treatmentError || !created) return { error: treatmentError?.message ?? "Could not add that treatment." };
      selectedIds.push(created.id);
    }
  }

  const uniqueIds = [...new Set(selectedIds)];
  const { error: clearError } = await supabase
    .from("check_in_treatments")
    .delete()
    .eq("check_in_id", checkIn.id);
  if (clearError) return { error: clearError.message };

  if (uniqueIds.length > 0) {
    const { error: linkError } = await supabase.from("check_in_treatments").insert(
      uniqueIds.map((treatmentId) => ({
        check_in_id: checkIn.id,
        treatment_id: treatmentId,
      })),
    );
    if (linkError) return { error: linkError.message };
  }

  redirect("/dashboard?saved=1");
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
  const { error: checkInError } = await supabase.from("check_ins").delete().eq("user_id", userId);
  if (checkInError) return { error: checkInError.message };
  const { error: treatmentError } = await supabase.from("treatments").delete().eq("user_id", userId);
  if (treatmentError) return { error: treatmentError.message };
  const { error: investigationError } = await supabase
    .from("investigations")
    .delete()
    .eq("user_id", userId);
  if (investigationError) return { error: investigationError.message };
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
  if (profileError) return { error: profileError.message };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { error: "Account data was removed, but the login could not be deleted. Add SUPABASE_SERVICE_ROLE_KEY to .env.local." };
  }

  const admin = createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: adminError } = await admin.auth.admin.deleteUser(userId);
  if (adminError) return { error: adminError.message };

  await supabase.auth.signOut();
  redirect("/");
}

type InvestigationInput = {
  healthQuestion: string;
  symptomLabel: string;
  duration: string;
  goal: string;
};

function readInvestigation(formData: FormData): InvestigationInput | ActionState {
  const healthQuestion = String(formData.get("health_question") || "").trim();
  const symptomLabel = String(formData.get("symptom_label") || "").trim();
  const duration = String(formData.get("duration") || "").trim();
  const goal = String(formData.get("goal") || "").trim();

  if (healthQuestion.length < 10 || healthQuestion.length > 300) {
    return { error: "Describe your health question in 10 to 300 characters." };
  }
  if (symptomLabel.length < 2 || symptomLabel.length > 80) {
    return { error: "Name the symptom in 2 to 80 characters." };
  }
  if (!(DURATION_OPTIONS as readonly string[]).includes(duration)) {
    return { error: "Choose how long this has been happening." };
  }
  if (goal.length < 10 || goal.length > 300) {
    return { error: "Describe what you hope to learn in 10 to 300 characters." };
  }

  return { healthQuestion, symptomLabel, duration, goal };
}

async function saveInvestigation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  input: InvestigationInput,
) {
  const payload = {
    user_id: userId,
    health_question: input.healthQuestion,
    symptom_label: input.symptomLabel,
    duration: input.duration,
    goal: input.goal,
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: existingError } = await supabase
    .from("investigations")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) return { error: existingError.message };

  if (existing) {
    const { error } = await supabase.from("investigations").update(payload).eq("id", existing.id);
    return { error: error?.message ?? "" };
  }

  const { error } = await supabase.from("investigations").insert({
    ...payload,
    started_on: todayLocal(),
  });
  return { error: error?.message ?? "" };
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
