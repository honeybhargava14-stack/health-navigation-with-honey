import { AppointmentForm } from "@/components/appointment-form";
import { AttachmentForm } from "@/components/attachment-form";
import { deleteAppointment } from "@/lib/actions";
import { formatDate } from "@/lib/dates";
import {
  getAppointment,
  getAppointments,
  getAttachments,
  requireUser,
} from "@/lib/data";
import { buttonClass, Card, MonthCalendar, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Care" };

export default function CarePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; month?: string; saved?: string; new?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading care...</p>}>
      <CareContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CareContent({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; month?: string; saved?: string; new?: string }>;
}) {
  const [params, { supabase, user }] = await Promise.all([searchParams, requireUser()]);
  const appointments = await getAppointments(supabase, user.id);
  const now = new Date();
  const [yearStr, monthStr] = (params.month ?? "").split("-");
  const year = Number(yearStr) || now.getFullYear();
  const month = Number(monthStr) ? Number(monthStr) - 1 : now.getMonth();

  const markedDates = appointments.map((appointment) => appointment.startsAt.slice(0, 10));
  const selected = params.id
    ? await getAppointment(supabase, user.id, params.id)
    : null;
  const attachments = selected
    ? await getAttachments(supabase, user.id, selected.id)
    : [];

  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);
  const prevHref = `/care?month=${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
  const nextHref = `/care?month=${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Care calendar</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Keep visits, doctors, and reports in one calm place.
        </p>
      </div>
      {params.saved === "1" ? (
        <p className="rounded-2xl bg-accent px-4 py-3 text-sm" role="status">
          Appointment saved.
        </p>
      ) : null}
      <SafetyNotice />
      <div className="flex items-center justify-between gap-3">
        <Link href={prevHref} className="text-sm text-primary">
          Previous
        </Link>
        <Link href={nextHref} className="text-sm text-primary">
          Next
        </Link>
      </div>
      <MonthCalendar
        year={year}
        month={month}
        markedDates={markedDates}
        selectedDate={selected?.startsAt.slice(0, 10)}
      />
      <Card title="Upcoming and recent">
        {appointments.length === 0 ? (
          <p className="text-sm leading-6 text-muted">No appointments yet. Add one when you are ready.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <Link
                  href={`/care?id=${appointment.id}&month=${appointment.startsAt.slice(0, 7)}`}
                  className="block rounded-2xl border border-border px-4 py-3 hover:bg-accent/50"
                >
                  <p className="font-medium text-foreground">{appointment.doctorName}</p>
                  <p className="text-sm text-muted">
                    {formatDate(appointment.startsAt.slice(0, 10))}
                    {appointment.specialty ? ` · ${appointment.specialty}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {selected ? (
        <Card title={selected.doctorName}>
          <p className="text-sm leading-6 text-muted">
            {formatDate(selected.startsAt.slice(0, 10))}
            {selected.clinic ? ` · ${selected.clinic}` : ""}
          </p>
          {selected.reason ? <p className="mt-2 text-sm leading-6">{selected.reason}</p> : null}
          <div className="mt-4 flex flex-col gap-2">
            <Link href={`/care/visit-prep?id=${selected.id}`} className={buttonClass("secondary")}>
              Prep questions for this visit
            </Link>
            <form action={deleteAppointment}>
              <input type="hidden" name="appointment_id" value={selected.id} />
              <button type="submit" className={buttonClass("ghost")}>
                Remove appointment
              </button>
            </form>
          </div>
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium">Edit details</h3>
            <AppointmentForm appointment={selected} />
          </div>
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium">Reports</h3>
            {attachments.length === 0 ? (
              <p className="mb-3 text-sm text-muted">No reports yet.</p>
            ) : (
              <ul className="mb-4 flex flex-col gap-2">
                {attachments.map((attachment) => (
                  <li key={attachment.id} className="rounded-2xl bg-accent/50 px-3 py-2 text-sm">
                    <span className="font-medium">{attachment.title || attachment.kind}</span>
                    {attachment.url ? (
                      <>
                        {" · "}
                        <a href={attachment.url} className="text-primary underline-offset-2 hover:underline">
                          Open link
                        </a>
                      </>
                    ) : null}
                    {attachment.bodyText ? (
                      <p className="mt-1 text-muted">{attachment.bodyText}</p>
                    ) : null}
                    {attachment.storagePath ? (
                      <p className="mt-1 text-xs text-muted">File saved securely in your account.</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <AttachmentForm appointmentId={selected.id} />
          </div>
        </Card>
      ) : null}

      <Card title={params.new === "1" || !selected ? "Add an appointment" : "Add another"}>
        <AppointmentForm />
      </Card>
    </div>
  );
}
