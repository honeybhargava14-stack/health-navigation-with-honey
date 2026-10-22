"use client";

import { Button } from "@health/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-4 px-5 py-10">
      <h1 className="font-serif text-3xl font-semibold">Something went wrong</h1>
      <p className="text-sm leading-6 text-muted">{error.message}</p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
