import { CheckInForm } from "@/components/check-in-form";
import { formatDate, todayLocal } from "@/lib/dates";
import { getInvestigation, getTodayCheckIn, getTreatments, requireUser } from "@/lib/data";
import { Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Check-in" };

export default function CheckInPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading the check-in...</p>}>
      <CheckInContent />
    </Suspense>
  );
}

async function CheckInContent() {
  const { supabase, user } = await requireUser();
  const today = todayLocal();
  const [investigation, todayCheckIn, treatments] = await Promise.all([
    getInvestigation(supabase, user.id),
    getTodayCheckIn(supabase, user.id, today),
    getTreatments(supabase, user.id),
  ]);
  const taken = new Set(todayCheckIn?.treatments ?? []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-semibold">Today</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {formatDate(today)}
          {investigation ? `, ${investigation.symptomLabel}` : ""}
        </p>
      </div>
      <SafetyNotice />
      <Card>
        <CheckInForm
          loggedOn={today}
          severity={todayCheckIn?.severity ?? 5}
          sleepHours={todayCheckIn?.sleepHours ?? 7}
          stress={todayCheckIn?.stress ?? 5}
          lifestyleNote={todayCheckIn?.lifestyleNote ?? ""}
          treatments={treatments.map((treatment) => ({
            ...treatment,
            taken: taken.has(treatment.name),
          }))}
        />
      </Card>
    </div>
  );
}
