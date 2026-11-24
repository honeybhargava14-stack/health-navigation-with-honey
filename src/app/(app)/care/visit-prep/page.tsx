import { VisitPrepClient } from "@/components/visit-prep-client";
import {
  getAppointment,
  getDailyLogsInRange,
  getSymptoms,
  requireUser,
} from "@/lib/data";
import { suggestSpecialtiesForCategories } from "@/lib/specialty-map";
import { Card, DisclaimerNotice, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { todayLocal } from "@/lib/dates";

export const metadata: Metadata = { title: "Visit prep" };

export default function VisitPrepPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Preparing gentle questions...</p>}>
      <VisitPrepContent searchParams={searchParams} />
    </Suspense>
  );
}

async function VisitPrepContent({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const [{ id }, { supabase, user }] = await Promise.all([searchParams, requireUser()]);
  if (!id) redirect("/care");

  const appointment = await getAppointment(supabase, user.id, id);
  if (!appointment) redirect("/care");

  const [symptoms, logs] = await Promise.all([
    getSymptoms(supabase, user.id),
    getDailyLogsInRange(supabase, user.id, "week", todayLocal()),
  ]);

  const hints = suggestSpecialtiesForCategories(symptoms.map((s) => s.category));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link href={`/care?id=${appointment.id}`} className="text-sm text-primary">
          Back to care
        </Link>
        <h1 className="font-serif mt-2 text-3xl font-semibold">Prep for your visit</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Soft questions you might ask {appointment.doctorName}. These are prep aids only.
        </p>
      </div>
      <SafetyNotice />
      <DisclaimerNotice />
      <Card title="Specialty suggestions from your symptoms">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted">
          {hints.map((hint) => (
            <li key={hint.specialties.join("-")}>
              <span className="font-medium text-foreground">{hint.specialties.join(" · ")}</span>
              <br />
              {hint.blurb}
            </li>
          ))}
        </ul>
      </Card>
      <VisitPrepClient
        appointmentId={appointment.id}
        doctorName={appointment.doctorName}
        specialty={appointment.specialty}
        reason={appointment.reason}
        symptoms={symptoms.map((s) => ({ label: s.label, category: s.category }))}
        recentNotes={logs.map((log) => log.overallNote).filter(Boolean).slice(-5)}
      />
    </div>
  );
}
