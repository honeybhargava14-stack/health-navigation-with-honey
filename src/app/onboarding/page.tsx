import { SITE_NAME } from "@/lib/site";
import { SignOutButton } from "@/components/account-actions";
import { OnboardingForm } from "@/components/onboarding-form";
import { getProfile, requireUser } from "@/lib/data";
import { BackToWebsite, Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Welcome" };

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">{SITE_NAME}</p>
          <h1 className="font-serif mt-2 text-3xl font-semibold">A soft place to begin</h1>
        </div>
        <BackToWebsite />
      </div>
      <SafetyNotice />
      <Suspense fallback={<p className="text-sm text-muted">Loading your account...</p>}>
        <OnboardingContent />
      </Suspense>
    </main>
  );
}

async function OnboardingContent() {
  const { supabase, user } = await requireUser();
  const profile = await getProfile(supabase, user.id);

  return (
    <Card>
      <OnboardingForm displayName={profile?.display_name ?? ""} />
      <div className="mt-4">
        <SignOutButton />
      </div>
    </Card>
  );
}
