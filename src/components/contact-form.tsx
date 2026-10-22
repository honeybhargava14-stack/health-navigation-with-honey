"use client";

import { Button, TextArea, TextField } from "@health/ui";
import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4" noValidate>
      <TextField label="Name" name="name" autoComplete="name" required />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextArea
        label="Message"
        name="message"
        rows={6}
        required
        hint="This form is a design placeholder. It does not email me yet."
      />
      <Button type="submit" fullWidth={false}>
        Send message
      </Button>
      {submitted ? (
        <p className="rounded-2xl border border-border bg-sage-soft px-4 py-3 text-sm leading-6" role="status">
          This contact form is not connected yet. Nothing was sent.
        </p>
      ) : null}
    </form>
  );
}
