import { AUTHOR_NAME, SITE_NAME } from "@/lib/site";
import { buttonClass, Card, CtaSection, EditorialSection, ImageFrame, PageIntro } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Me",
  description: `A personal introduction from ${AUTHOR_NAME}, and why ${SITE_NAME} exists.`,
};

const values = [
  {
    title: "Empathy",
    body: "People are more than a chart. I want this space to treat lived experience with care.",
  },
  {
    title: "Dignity",
    body: "Being unwell, unsure, or still searching for language should never mean being talked down to.",
  },
  {
    title: "Accessibility",
    body: "The writing, the layout, and the tool should be usable without extra decoding work.",
  },
  {
    title: "Curiosity",
    body: "Questions are allowed. You can want to understand more without needing a finished answer today.",
  },
  {
    title: "Transparency",
    body: "I will say what this site can do, and just as clearly what it cannot.",
  },
  {
    title: "Evidence-informed thinking",
    body: "Personal notes can support a conversation. They are not a substitute for clinical evaluation, and I will not dress correlation up as proof.",
  },
];

export default function AboutPage() {
  return (
    <main className="pb-16">
      <EditorialSection className="pt-16">
        <PageIntro eyebrow="About me" title={`Hello, I am ${AUTHOR_NAME}.`}>
          <p>
            This page is where I am collecting a sincere account of why I care about health
            navigation. Some of the personal details are still placeholders, because I will not
            invent a medical history to make this look finished.
          </p>
        </PageIntro>
      </EditorialSection>

      <EditorialSection className="pt-0">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <figure>
            <ImageFrame
              src="/images/plants.jpg"
              alt="A small cactus in a terracotta pot. A personal photograph will replace this later."
              className="aspect-[4/5]"
            />
            <figcaption className="mt-3 text-sm text-muted">
              Photo coming soon. This still life is a stand-in until I add a portrait of my own.
            </figcaption>
          </figure>
          <div className="space-y-5 text-lg leading-8 text-muted">
            <p>
              I have been navigating chronic pain and the kind of healthcare uncertainty that makes
              ordinary weeks feel harder to plan. I have sat with symptoms that were easy to feel
              and hard to explain. I have tried to decide what was worth mentioning in a short
              visit, and what could wait.
            </p>
            <p>[Personal medical history placeholder: specific events, diagnoses, and outcomes go here, in my own words, when I am ready to share them.]</p>
            <p>
              The emotional part was not separate from the practical part. I wanted to be believed.
              I also wanted a way to keep track of what was happening so I was not reconstructing
              everything from memory in the hallway.
            </p>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection
        className="bg-sage-soft/60"
        eyebrow="How this started"
        title="Health navigation felt like a problem worth sitting with."
      >
        <div className="max-w-3xl space-y-5 text-lg leading-8 text-muted">
          <p>
            Trying to understand symptoms, find answers, and communicate with healthcare
            professionals taught me how much work patients are asked to do with very little
            structure. Notes live in different places. Questions disappear. Patterns, if they exist,
            are easy to lose.
          </p>
          <p>
            I do not think a website can fix healthcare. I do think people deserve a calmer place
            to organize their experiences, notice what they recorded, ask better questions, and
            feel a little more prepared when they walk into a conversation about their health.
          </p>
        </div>
      </EditorialSection>

      <EditorialSection eyebrow="Mission" title="What I am trying to offer.">
        <p className="max-w-3xl text-lg leading-8 text-muted">
          My mission is to help people organize their experiences, understand patterns in their
          own notes, ask better questions, and feel more prepared when navigating healthcare. I am
          not here to diagnose, to treat, or to guide anyone through a health emergency.
        </p>
      </EditorialSection>

      <EditorialSection eyebrow="Values" title="What I want this work to be known for.">
        <div className="grid gap-5 md:grid-cols-2">
          {values.map((value) => (
            <Card key={value.title} title={value.title} className="h-full p-6">
              <p className="text-sm leading-6 text-muted">{value.body}</p>
            </Card>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection eyebrow="What I hope to build" title="This is a foundation, not a finished system.">
        <div className="max-w-3xl space-y-5 text-lg leading-8 text-muted">
          <p>
            I hope to grow the resource library with more practical writing, add my own
            photographs, and keep improving the health navigation tool so it stays small, honest,
            and useful. I want future pieces to include better ways to prepare for visits, keep
            records together, and reflect on living with ongoing symptoms without turning those
            reflections into medical claims.
          </p>
          <p>
            If you are here looking for emergency guidance, please stop and contact a nearby
            healthcare provider or emergency services. If you are here looking for a quieter
            starting point, I am glad you found this page.
          </p>
        </div>
        <div className="mt-10">
          <CtaSection
            title="Whenever you are ready"
            actions={
              <>
                <Link href="/resources" className={buttonClass("secondary", "", false)}>
                  Explore resources
                </Link>
                <Link href="/health-navigation" className={buttonClass("primary", "", false)}>
                  Explore the tool
                </Link>
              </>
            }
          >
            <p>
              You can browse the sample library, or open the health navigation tool and see whether
              a simple personal log would help you prepare for a conversation.
            </p>
          </CtaSection>
        </div>
      </EditorialSection>
    </main>
  );
}
