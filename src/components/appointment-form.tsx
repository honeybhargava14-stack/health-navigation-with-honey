"use client";

import { saveAppointment } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { DOCTOR_SPECIALTY_OPTIONS } from "@/lib/constants";
import type { Appointment } from "@/lib/data";
import { Button, FormError, SelectField, TextArea, TextField } from "@health/ui";
import { useActionState } from "react";

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AppointmentForm({ appointment }: { appointment?: Appointment | null }) {
  const [state, action, pending] = useActionState(saveAppointment, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.error} />
      {appointment ? <input type="hidden" name="appointment_id" value={appointment.id} /> : null}
      <TextField
        label="Doctor's name"
        name="doctor_name"
        required
        defaultValue={appointment?.doctorName}
        placeholder="Dr. Rivera"
      />
      <SelectField
        label="Specialty"
        name="specialty"
        options={DOCTOR_SPECIALTY_OPTIONS}
        defaultValue={appointment?.specialty}
      />
      <TextField label="Clinic or place" name="clinic" defaultValue={appointment?.clinic} />
      <TextField
        label="Visit date and time"
        name="starts_at"
        type="datetime-local"
        required
        defaultValue={toLocalInput(appointment?.startsAt)}
      />
      <TextArea
        label="Reason for the visit"
        name="reason"
        defaultValue={appointment?.reason}
        placeholder="Follow-up, new symptoms, review labs…"
      />
      <TextArea label="Notes" name="notes" defaultValue={appointment?.notes} />
      <TextField
        label="Next visit (optional)"
        name="next_visit_at"
        type="datetime-local"
        defaultValue={toLocalInput(appointment?.nextVisitAt)}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : appointment ? "Update appointment" : "Save appointment"}
      </Button>
    </form>
  );
}
