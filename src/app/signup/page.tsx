import { SITE_NAME } from "@/lib/site";
import { SignupForm } from "@/components/auth-form";
import { BackToWebsite, Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <BackToWebsite />
      <div>
        <p className="text-sm font-medium text-primary">{SITE_NAME}</p>
        <h1 className="font-serif mt-2 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Your log is stored with your account and is visible only to you.
        </p>
      </div>
      <SafetyNotice />
      <Card>
        <SignupForm />
      </Card>
    </main>
  );
}
