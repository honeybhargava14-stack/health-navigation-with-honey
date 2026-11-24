import { DailyLogForm } from "@/components/daily-log-form";
import { SoftHoneyNudge } from "@/components/soft-honey-nudge";
import { todayLocal } from "@/lib/dates";
import {
  getDailyLogForDate,
  getProfile,
  getSymptoms,
  getTreatments,
  requireUser,
} from "@/lib/data";
import { suggestSpecialtiesForCategories } from "@/lib/specialty-map";
import { Card, DisclaimerNotice, SafetyNotice, StreakBadge } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Today" };

export default function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading today...</p>}>
      <TodayContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TodayContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, { supabase, user }] = await Promise.all([searchParams, requireUser()]);
  const today = todayLocal();
  const [profile, symptoms, treatments, log] = await Promise.all([
    getProfile(supabase, user.id),
    getSymptoms(supabase, user.id),
    getTreatments(supabase, user.id),
    getDailyLogForDate(supabase, user.id, today),
  ]);

  const name = profile?.display_name?.trim() || "friend";
  const loggedToday = Boolean(log);
  const specialtyHints = suggestSpecialtiesForCategories(symptoms.map((s) => s.category));

  const symptomSeverities = Object.fromEntries(
    (log?.symptomEntries ?? []).map((entry) => [entry.symptomId, entry.severity]),
  );
  const symptomNotes = Object.fromEntries(
    (log?.symptomEntries ?? []).map((entry) => [entry.symptomId, entry.note]),
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold">How are you today, {name}?</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Take a breath. You can speak or type. Honey is listening.
        </p>
      </div>
      {saved === "1" ? (
        <p className="rounded-2xl bg-accent px-4 py-3 text-sm text-foreground" role="status">
          Thank you for checking in. Your words are safe with you.
        </p>
      ) : null}
      <SoftHoneyNudge show={saved === "1"} />
      {!loggedToday ? (
        <p className="rounded-2xl border border-rose/30 bg-card px-4 py-3 text-sm leading-6 text-foreground">
          A gentle nudge: you have not logged today yet. Whenever you are ready is soon enough.
        </p>
      ) : null}
      <StreakBadge count={profile?.streak_count ?? 0} />
      <SafetyNotice />
      <Card title="Today's check-in">
        <DailyLogForm
          loggedOn={today}
          sleepHours={log?.sleepHours ?? 7}
          stress={log?.stress ?? 3}
          mood={log?.mood ?? 5}
          energy={log?.energy ?? 5}
          overallNote={log?.overallNote ?? ""}
          rawSpeechTranscript={log?.rawSpeechTranscript ?? ""}
          symptoms={symptoms}
          symptomSeverities={symptomSeverities}
          symptomNotes={symptomNotes}
          treatments={treatments.map((treatment) => ({
            ...treatment,
            taken: log?.treatmentIds.includes(treatment.id) ?? false,
          }))}
        />
      </Card>
      <Card title="Someone you might consider talking to">
        <DisclaimerNotice />
        <ul className="mt-3 flex flex-col gap-3">
          {specialtyHints.map((hint) => (
            <li key={hint.specialties.join("-")} className="text-sm leading-6 text-muted">
              <span className="font-medium text-foreground">{hint.specialties.join(" · ")}</span>
              <br />
              {hint.blurb}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Want company while you prepare?{" "}
          <Link href="/honey" className="text-primary underline-offset-2 hover:underline">
            Talk with Honey
          </Link>
        </p>
      </Card>
    </div>
  );
}
