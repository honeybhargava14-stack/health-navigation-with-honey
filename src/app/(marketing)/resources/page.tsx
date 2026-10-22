import { ResourcesLibrary } from "@/components/resources-library";
import { resources } from "@/content/resources";
import { EditorialSection, PageIntro } from "@health/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A library of sample drafts on living with chronic illness, preparing for appointments, and organizing health information. These articles do not diagnose or give medical advice.",
};

export default function ResourcesPage() {
  return (
    <main className="pb-16">
      <EditorialSection className="pt-16">
        <PageIntro eyebrow="Resources" title="A library you can grow with.">
          <p>
            These first pieces are sample drafts. They are here to show how the library can hold
            practical writing without pretending to be a medical textbook. Nothing here diagnoses,
            treats, or explains a specific condition.
          </p>
        </PageIntro>
      </EditorialSection>
      <EditorialSection className="pt-0">
        <ResourcesLibrary articles={resources} />
      </EditorialSection>
    </main>
  );
}
