import { formatResourceDate, resources } from "@/content/resources";
import { AUTHOR_NAME, SITE_NAME } from "@/lib/site";
import {
  buttonClass,
  Card,
  CtaSection,
  EditorialSection,
  Hero,
  ResourceCard,
} from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description:
    "Your health journey deserves more clarity, care, and understanding. Explore resources and a personal health navigation tool.",
};

const helpCards = [
  {
    title: "Understand",
    body: "Gather your symptoms, experiences, and unanswered questions, without needing a finished story first.",
  },
  {
    title: "Discover patterns",
    body: "Notice what changes over time, and prepare a short summary you can bring to a clinician. A pattern in your notes is a correlation, not proof of cause.",
  },
  {
    title: "Navigate healthcare",
    body: "Prepare questions, gather what you have already recorded, and walk into conversations with a little more structure.",
  },
];

export default function HomePage() {
  const preview = resources.slice(0, 3);

  return (
    <main>
      <Hero
        eyebrow={SITE_NAME}
        title="Your health journey deserves more clarity, care, and understanding."
        description={
          <>
            <p>
              Navigating health concerns can feel overwhelming. The waiting. The uncertainty. The
              quiet work of trying to be believed.
            </p>
            <p className="mt-4">
              This is a personal space for making sense of your experiences, preparing for
              conversations, and taking small, steady steps toward feeling more informed. You
              deserve to be heard, understood, and supported.
            </p>
          </>
        }
        actions={
          <>
            <Link href="/health-navigation" className={buttonClass("primary", "", false)}>
              Explore Health Navigation
            </Link>
            <Link href="/my-story" className={buttonClass("secondary", "", false)}>
              Read My Story
            </Link>
          </>
        }
        footer={
          <div>
            <p className="font-serif text-xl font-semibold text-foreground">{AUTHOR_NAME}</p>
            <p className="mt-1 text-sm text-muted">Health Navigator &amp; Founder</p>
          </div>
        }
        image={{
          // Personal portrait of Honey Bhargava for the landing hero.
          src: "/images/honey-portrait.jpg",
          alt: `Portrait of ${AUTHOR_NAME}, Health Navigator and Founder`,
          fit: "contain",
          frameClassName:
            "aspect-[9/16] min-h-[32rem] w-full md:min-h-[40rem] lg:min-h-[44rem]",
        }}
      />

      <EditorialSection
        eyebrow="The problem"
        title="Healthcare is easier to describe after the visit than during it."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-lg leading-8 text-muted">
            People often struggle to connect symptoms, notice what changed, prepare for
            appointments, keep records in one place, and know which questions are reasonable to
            ask. None of that means you are failing. It means the system asks you to be organized
            in a moment when you may be tired, scared, or still searching for language.
          </p>
          <p className="text-lg leading-8 text-muted">
            You do not need a perfect timeline to start. You also do not need to wait until
            everything is clear before you write something down. A few honest notes can make the
            next conversation feel less like starting from zero.
          </p>
        </div>
      </EditorialSection>

      <EditorialSection
        className="bg-sage-soft/60"
        eyebrow="Why this exists"
        title="I built this because navigating care with chronic pain is harder than it should be."
      >
        <div className="max-w-3xl space-y-5 text-lg leading-8 text-muted">
          <p>
            I have been living with chronic pain, and with the uncertainty that comes from trying
            to understand symptoms, find language for them, and be taken seriously in short
            appointments. That lived experience is why I care about health navigation.
          </p>
          <p>
            The practical parts and the emotional parts arrived together. I wanted a calmer way to
            keep track of what I was experiencing, and a kinder way to walk into healthcare
            conversations.
          </p>
          <p>
            That is why this site exists. It is a place for my story, for resources I wish I had
            earlier, and for a small tool that helps organize a personal health log.{" "}
            <Link href="/my-story" className="font-medium text-primary hover:underline">
              Read my full story
            </Link>
            .
          </p>
        </div>
      </EditorialSection>

      <EditorialSection eyebrow="How I want to help" title="Three simple ways to begin.">
        <div className="grid gap-5 md:grid-cols-3">
          {helpCards.map((card) => (
            <Card key={card.title} title={card.title} className="h-full p-6">
              <p className="text-sm leading-6 text-muted">{card.body}</p>
            </Card>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection
        eyebrow="Resources"
        title="Guides, checklists, and reflections you can return to."
      >
        <p className="mb-8 max-w-3xl text-lg leading-8 text-muted">
          These first articles are clearly labeled sample drafts. They are here to show the shape
          of the library, not to present medical evidence or tell you what your symptoms mean.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((article) => (
            <ResourceCard
              key={article.slug}
              href={`/resources/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              category={article.category}
              dateLabel={formatResourceDate(article.publishedOn)}
              readingMinutes={article.readingMinutes}
              image={article.image}
              isDraft={article.isDraft}
            />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/resources" className={buttonClass("secondary", "", false)}>
            Browse all resources
          </Link>
        </div>
      </EditorialSection>

      <EditorialSection eyebrow="The tool" title="A quiet place to organize a health journey.">
        <CtaSection
          title="Introducing the health navigation tool"
          actions={
            <Link href="/health-navigation" className={buttonClass("primary", "", false)}>
              Explore the Tool
            </Link>
          }
        >
          <p>
            The web app is a practical companion, not a clinic. You can track several symptoms,
            keep doctor visits and reports in one place, and look at gentle day-to-year summaries
            with Honey. It does not diagnose, treat, or replace professional care.
          </p>
        </CtaSection>
      </EditorialSection>

      <EditorialSection>
        <blockquote className="mx-auto max-w-3xl">
          <p className="font-serif text-2xl leading-snug font-medium md:text-3xl">
            Your experiences matter. You deserve to be taken seriously. You do not need to have
            everything figured out before you seek support.
          </p>
          <footer className="mt-4 text-sm text-muted">A personal note from Honey</footer>
        </blockquote>
      </EditorialSection>
    </main>
  );
}
