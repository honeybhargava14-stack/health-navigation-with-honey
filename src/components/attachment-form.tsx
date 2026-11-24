"use client";

import { addAppointmentAttachment } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { Button, FormError, TextArea, TextField } from "@health/ui";
import { useActionState, useState } from "react";

export function AttachmentForm({ appointmentId }: { appointmentId: string }) {
  const [kind, setKind] = useState("text");
  const [state, action, pending] = useActionState(addAppointmentAttachment, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4" encType="multipart/form-data">
      <FormError message={state.error} />
      <input type="hidden" name="appointment_id" value={appointmentId} />
      <label className="flex flex-col gap-2 text-sm font-medium">
        Report type
        <select
          name="kind"
          value={kind}
          onChange={(event) => setKind(event.target.value)}
          className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base"
        >
          <option value="text">Text note</option>
          <option value="link">Link</option>
          <option value="pdf">PDF upload</option>
          <option value="image">Image upload</option>
        </select>
      </label>
      <TextField label="Title" name="title" placeholder="Lab results, referral letter…" />
      {kind === "link" ? <TextField label="URL" name="url" placeholder="https://" /> : null}
      {kind === "text" ? <TextArea label="Note" name="body_text" /> : null}
      {kind === "pdf" || kind === "image" ? (
        <label className="flex flex-col gap-2 text-sm font-medium">
          File
          <input
            type="file"
            name="file"
            accept={kind === "pdf" ? "application/pdf" : "image/*"}
            className="text-sm"
          />
        </label>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add report"}
      </Button>
    </form>
  );
}
