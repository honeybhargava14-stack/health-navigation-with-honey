import { LoginForm } from "@/components/auth-form";
import { Card } from "@health/ui";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <div>
        <p className="text-sm font-medium text-primary">Health Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
      </div>
      <Card>
        <LoginForm />
      </Card>
    </main>
  );
}
