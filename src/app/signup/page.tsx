import { SignupForm } from "@/components/auth-form";
import { Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <div>
        <p className="text-sm font-medium text-primary">Health Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Your log stays in your local Supabase database and is visible only to you.
        </p>
      </div>
      <SafetyNotice />
      <Card>
        <SignupForm />
      </Card>
    </main>
  );
}
