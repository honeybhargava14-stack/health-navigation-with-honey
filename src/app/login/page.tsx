import { SITE_NAME } from "@/lib/site";
import { LoginForm } from "@/components/auth-form";
import { BackToWebsite, Card } from "@health/ui";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <BackToWebsite />
      <div>
        <p className="text-sm font-medium text-primary">{SITE_NAME}</p>
        <h1 className="font-serif mt-2 text-3xl font-semibold">Sign in</h1>
      </div>
      <Card>
        <LoginForm />
      </Card>
    </main>
  );
}
