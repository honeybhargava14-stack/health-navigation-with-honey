import { ContactForm } from "@/components/contact-form";
import { EditorialSection, PageIntro } from "@health/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "A contact form for Health Navigation with Honey. The form is not connected yet and will not send a message.",
};

export default function ContactPage() {
  return (
    <main className="pb-16">
      <EditorialSection className="pt-16">
        <PageIntro eyebrow="Contact" title="I would like to hear from you, when this form can actually send.">
          <p>
            You can fill in the fields below to see how contact will work. Submitting does not
            deliver a message yet. Nothing is emailed, stored, or forwarded.
          </p>
        </PageIntro>
      </EditorialSection>
      <EditorialSection className="pt-0">
        <ContactForm />
      </EditorialSection>
    </main>
  );
}
