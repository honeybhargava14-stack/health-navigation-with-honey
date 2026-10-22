import {
  buttonClass,
  Card,
  DisclaimerNotice,
  EditorialSection,
  ImageFrame,
  PageIntro,
} from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health Navigation",
  description:
    "A personal tool for logging one recurring symptom, noticing patterns in your notes, and preparing a 14-day summary for a clinician. It does not diagnose or treat.",
};

const capabilities = [
  {
    title: "Log one recurring symptom",
    body: "Choose a health question and keep a short daily record of severity, sleep, stress, and what you tried.",
  },
  {
    title: "Notice coincidences in your notes",
    body: "After enough days in a 14-day window, the tool can compare groups in what you recorded. Those comparisons are correlations, not proof of cause.",
  },
  {
    title: "Prepare a visit-ready summary",
    body: "Create a 14-day report with observations, limits, and questions you might take to a clinician. You can also export your log as CSV.",
  },
];

export default function HealthNavigationPage() {
  return (
    <main className="pb-16">
      <EditorialSection className="pt-16">
        <PageIntro
          eyebrow="Health navigation tool"
          title="A practical place to organize what you are already living."
        >
          <p>
            This tool is for people who want a calmer way to keep a personal health log. It is
            not a clinic, not a diagnosis engine, and not a place to go in an emergency.
          </p>
        </PageIntro>
      </EditorialSection>

      <EditorialSection className="pt-0">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col gap-5">
            {capabilities.map((item) => (
              <Card key={item.title} title={item.title} className="p-6">
                <p className="text-sm leading-6 text-muted">{item.body}</p>
              </Card>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <ImageFrame
              src="/images/journal.jpg"
              alt="Open notebook with a pen, ready for notes"
              className="aspect-[4/5]"
              priority
            />
            <div className="rounded-3xl border border-dashed border-border bg-card p-6">
              <p className="font-serif text-xl font-semibold">The application lives here</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                The working tool is already built as a separate, signed-in app. This page is the
                doorway. When you open it, you will go to sign in or, if you already have an
                account, to your dashboard.
              </p>
              <Link href="/dashboard" className={`${buttonClass("primary", "mt-5", true)}`}>
                Open the tool
              </Link>
            </div>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection>
        <DisclaimerNotice />
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          Your log is stored in your own account and is visible only to you. You can export it or
          delete your account from Settings. Please read the{" "}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            privacy policy
          </Link>{" "}
          for details.
        </p>
      </EditorialSection>
    </main>
  );
}
