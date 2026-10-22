"use client";

import { deleteAccount, signOut } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { Button, FormError, TextField } from "@health/ui";
import { useActionState } from "react";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary">
        Sign out
      </Button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccount, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.error} />
      <p className="text-sm leading-6 text-muted">
        This permanently deletes your investigation, check-ins, treatments, and login. It cannot
        be undone.
      </p>
      <TextField label='Type DELETE to confirm' name="confirm" autoComplete="off" />
      <Button type="submit" variant="danger" disabled={pending}>
        {pending ? "Deleting..." : "Delete my data"}
      </Button>
    </form>
  );
}
