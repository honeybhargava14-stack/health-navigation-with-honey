import { DeleteAccountForm, SignOutButton } from "@/components/account-actions";
import { PushSettings } from "@/components/push-settings";
import { SoftHoneyNudge } from "@/components/soft-honey-nudge";
import { SymptomManager } from "@/components/symptom-manager";
import { TreatmentManager } from "@/components/treatment-manager";
import { getProfile, getSymptoms, getTreatments, requireUser } from "@/lib/data";
import { buttonClass, Card } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading settings...</p>}>
      <SettingsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SettingsContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, { supabase, user }] = await Promise.all([searchParams, requireUser()]);
  const [profile, symptoms, treatments] = await Promise.all([
    getProfile(supabase, user.id),
    getSymptoms(supabase, user.id, false),
    getTreatments(supabase, user.id),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-3xl font-semibold">Settings</h1>
      <p className="text-sm leading-6 text-muted">
        {profile?.display_name ? `Signed in as ${profile.display_name}.` : "Your calm control room."}
      </p>
      {saved === "symptom" ? (
        <p className="rounded-2xl bg-accent px-4 py-3 text-sm" role="status">
          Symptom saved.
        </p>
      ) : null}
      <SoftHoneyNudge show={saved === "symptom"} />
      <Card title="Symptoms you track">
        <SymptomManager symptoms={symptoms.filter((symptom) => symptom.active)} />
      </Card>
      <Card title="Treatments">
        <TreatmentManager treatments={treatments} />
      </Card>
      <Card title="Gentle reminders">
        <p className="mb-4 text-sm leading-6 text-muted">
          Honey already nudges you in the app. Browser reminders are optional.
        </p>
        <PushSettings enabled={profile?.push_enabled ?? false} />
      </Card>
      <Card title="Export">
        <p className="mb-4 text-sm leading-6 text-muted">
          Download your daily logs as a CSV file. Progress can be printed from the Progress page.
        </p>
        <Link href="/api/export" className={buttonClass("secondary")}>
          Download CSV
        </Link>
      </Card>
      <Card title="Session">
        <SignOutButton />
      </Card>
      <Card title="Delete data">
        <DeleteAccountForm />
      </Card>
    </div>
  );
}
