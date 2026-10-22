import { DeleteAccountForm, SignOutButton } from "@/components/account-actions";
import { InvestigationForm } from "@/components/investigation-form";
import { TreatmentManager } from "@/components/treatment-manager";
import { getInvestigation, getTreatments, requireUser } from "@/lib/data";
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
  const [investigation, treatments] = await Promise.all([
    getInvestigation(supabase, user.id),
    getTreatments(supabase, user.id),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-3xl font-semibold">Settings</h1>
      {saved === "investigation" ? (
        <p className="rounded-2xl bg-accent px-4 py-3 text-sm" role="status">
          Investigation saved.
        </p>
      ) : null}
      <Card title="Investigation">
        <InvestigationForm mode="settings" investigation={investigation} />
      </Card>
      <Card title="Treatments">
        <TreatmentManager treatments={treatments} />
      </Card>
      <Card title="Export">
        <p className="mb-4 text-sm leading-6 text-muted">
          Download every check-in as a CSV file. The 14-day report can be saved as a PDF from the
          report page.
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
