import { SITE_NAME } from "@/lib/site";
import { EditorialSection, PageIntro } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles the personal health log you choose to record.`,
};

export default function PrivacyPage() {
  return (
    <main className="pb-16">
      <EditorialSection className="pt-16">
        <PageIntro eyebrow="Privacy" title="A conservative account of what this site actually does.">
          <p>
            This draft describes the current product. It is not legal advice. I will update it if
            the way data is stored or used changes.
          </p>
        </PageIntro>
      </EditorialSection>
      <EditorialSection className="pt-0">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 text-base leading-7 text-muted">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Who this is for</h2>
            <p className="mt-3">
              {SITE_NAME} is a personal website and a signed-in health log. It is not a hospital,
              clinic, or medical device. It does not diagnose, treat, or handle health emergencies.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-semibold text-foreground">What I collect</h2>
            <p className="mt-3">
              If you create an account, the tool stores the information you choose to enter: an
              email address, an optional display name, onboarding answers, symptoms you track,
              daily logs (mood, energy, sleep, stress, notes, treatments), appointments and
              reports you add, optional chat messages with Honey, and whether you finished
              onboarding.
            </p>
            <p className="mt-3">
              The public pages do not require an account. The contact form on this website is not
              connected yet, so it does not collect or send messages.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Where it is stored</h2>
            <p className="mt-3">
              Account and log data are stored in Supabase, a hosted database and authentication
              service used by this app. Access is limited by row-level security so that a signed-in
              person can see only their own records.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-semibold text-foreground">How it is used</h2>
            <p className="mt-3">
              Your log is used to show progress charts, support visit prep, and power Honey chat
              helpers. Patterns in your notes are correlations. They are not proof of cause, and
              they are not a diagnosis. AI features use Vercel AI Gateway and are framed as
              non-diagnostic support only.
            </p>
            <p className="mt-3">
              I do not sell this information. This site does not currently use the log to send
              marketing messages.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Export and deletion</h2>
            <p className="mt-3">
              You can download your daily logs as a CSV file from Settings. You can also delete
              your account, which permanently removes your symptoms, logs, appointments, chat,
              treatments, and login. That action cannot be undone.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Questions</h2>
            <p className="mt-3">
              If you have a privacy question, use the{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                contact page
              </Link>
              . The form is not sending messages yet, so please treat that page as a placeholder
              until a working address is connected.
            </p>
          </section>
        </div>
      </EditorialSection>
    </main>
  );
}
