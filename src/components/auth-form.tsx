"use client";

import { signIn, signUp } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { Button, FormError, TextField } from "@health/ui";
import Link from "next/link";
import { useActionState } from "react";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.error} />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-primary">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.error} />
      <TextField label="Name" name="display_name" autoComplete="name" placeholder="Optional" />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="At least 8 characters."
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
