import { AUTHOR_NAME } from "@/lib/site";
import {
  buttonClass,
  Card,
  CtaSection,
  DisclaimerNotice,
  EditorialSection,
  Hero,
  ImageFrame,
  StatusBadge,
} from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Honey Bhargava | Health Navigator & Chronic Illness Advocate",
  },
  description:
    "Discover Honey Bhargava's health journey and mission to make healthcare easier to navigate through lived experience, health intelligence, and informed decision-making.",
  keywords: [
    "Health Navigator",
    "Health Navigation",
    "Chronic Illness Support",
    "Health Intelligence",
    "Healthcare Navigation",
    "Personal Health Tracking",
  ],
  openGraph: {
    title: "Honey Bhargava | Health Navigator & Chronic Illness Advocate",
    description:
      "Discover Honey Bhargava's health journey and mission to make healthcare easier to navigate through lived experience, health intelligence, and informed decision-making.",
    images: [{ url: "/images/honey-portrait.jpg", alt: `Portrait of ${AUTHOR_NAME}` }],
  },
};

const problemCards = [
  {
    title: "Fragmented Information",
    body: "Medical reports, prescriptions, consultations, and health records live in different places, and somehow you are expected to hold it all together.",
  },
  {
    title: "Diagnostic Uncertainty",
    body: "You are not always sure which questions to ask, or how to sit with conflicting medical opinions without losing yourself in the process.",
  },
  {
    title: "Overwhelming Decisions",
    body: "Treatment options arrive quickly. Next steps feel unclear. The weight of choosing, when you are already tired, can be enormous.",
  },
  {
    title: "Lost Time and Resources",
    body: "Repeated consultations, unnecessary confusion, and the slow work of coordinating care take energy you may not have to spare.",
  },
  {
    title: "Feeling Unheard",
    body: "Living with persistent or unexplained symptoms carries an emotional and practical burden that is easy for others to overlook.",
  },
];

const stages = [
  {
    number: "01",
    title: "Understand",
    body: "Organise symptoms, health history, reports, and unanswered questions, so your healthcare journey starts to feel clearer in your own hands.",
    image: {
      src: "/images/understand-desk.jpg",
      alt: "A health journal, notes, and a pen on a warm wooden desk in soft sunlight",
    },
  },
  {
    number: "02",
    title: "Explore",
    body: "Notice patterns, gather relevant information, and prepare questions you can bring to qualified healthcare professionals.",
    image: {
      src: "/images/explore-workspace.jpg",
      alt: "Someone reviewing health information on a laptop at a calm home workspace",
    },
  },
  {
    number: "03",
    title: "Navigate",
    body: "Build a more structured path for consultations, follow-ups, and informed healthcare decisions, one step at a time.",
    image: {
      src: "/images/navigate-conversation.jpg",
      alt: "Two people in a warm, welcoming conversation about care",
    },
  },
];

const audiences = [
  "People living with chronic pain or long-term health conditions.",
  "People experiencing unexplained or recurring symptoms.",
  "Individuals navigating multiple medical consultations.",
  "People who want to organise their health records.",
  "Individuals preparing for specialist consultations.",
  "People who want to become more informed participants in their healthcare decisions.",
];

const features = [
  {
    title: "Personal Health Tracking",
    body: "Keep a gentle daily record of how you feel, including mood, energy, sleep, and stress.",
    status: "available" as const,
  },
  {
    title: "Symptom Journaling",
    body: "Log multiple symptoms in your own words, so you are not reconstructing everything from memory in the hallway.",
    status: "available" as const,
  },
  {
    title: "Organised Medical Records",
    body: "Store appointments, reports, and attachments in one calmer place before a visit.",
    status: "available" as const,
  },
  {
    title: "Consultation Preparation",
    body: "Gather questions and visit notes, so conversations with clinicians feel more structured and less rushed.",
    status: "available" as const,
  },
  {
    title: "Symptom Pattern Insights",
    body: "Deeper pattern support that helps surface correlations in your notes, without claiming cause.",
    status: "building" as const,
  },
  {
    title: "Health Journey Summaries",
    body: "Richer narrative summaries of your journey that you can revisit, and share with care teams when you are ready.",
    status: "building" as const,
  },
];

const philosophy = [
  "Your symptoms deserve to be taken seriously.",
  "You deserve to understand your healthcare options.",
  "Asking questions is an important part of healthcare.",
  "Medical decisions should be informed, and made with qualified professionals.",
  "Your health journey should not feel like a constant battle to be heard.",
  "Empathy and evidence should go hand in hand.",
];

export default function MyStoryPage() {
  return (
    <main className="pb-16">
      <Hero
        eyebrow="Health Navigation | Lived Experience | Better Healthcare Decisions"
        title="Your health journey deserves more than guesswork."
        description={
          <>
            <p>
              I know what it feels like to live with persistent symptoms, search for answers, visit
              specialists, question diagnoses, and still feel lost.
            </p>
            <p className="mt-4">
              I am building a space to help people navigate their healthcare journeys with greater
              clarity, confidence, and compassion.
            </p>
          </>
        }
        actions={
          <>
            <Link href="/health-navigation" className={buttonClass("primary", "", false)}>
              Explore Health Navigation
            </Link>
            <Link href="#my-story" className={buttonClass("secondary", "", false)}>
              My Story
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
          // Personal portrait of Honey Bhargava. Replace this file to update the hero photo.
          src: "/images/honey-portrait.jpg",
          alt: `Portrait of ${AUTHOR_NAME}, Health Navigator and Founder`,
          fit: "contain",
          frameClassName:
            "aspect-[9/16] min-h-[32rem] w-full md:min-h-[40rem] lg:min-h-[44rem]",
        }}
      />

      <EditorialSection
        id="my-story"
        eyebrow="My story"
        title="I wasn't looking for a business idea. I was looking for answers."
      >
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-5 text-lg leading-8 text-muted">
            <p>
              For years, I have navigated a complicated health journey. Persistent pain. Chronic
              symptoms. Multiple consultations, investigations, and treatments that rarely arrived
              with a clear map.
            </p>
            <p>
              Like many people living with chronic health conditions, I lived inside the
              uncertainty: which specialist to consult, how to interpret conflicting medical
              opinions, what questions to ask, and whether I was making the right decisions at all.
            </p>
            <p>
              Somewhere along the way, I realised something simple, and hard. Healthcare is not
              only about finding a doctor, or receiving a diagnosis.
            </p>
            <p>
              It is also about understanding your symptoms, organising information, asking the
              right questions, and knowing how to take the next step without feeling completely
              alone.
            </p>
            <p>That realisation became the foundation of my work in health navigation.</p>
          </div>
          <ImageFrame
            src="/images/story-journaling.jpg"
            alt="A woman journaling beside a sunlit window in a calm, neutral room"
            className="aspect-[4/5]"
          />
        </div>
      </EditorialSection>

      <EditorialSection
        className="bg-sage-soft/60"
        eyebrow="The problem"
        title="Healthcare can be overwhelming. Finding your way through it shouldn't be."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map((card) => (
            <Card key={card.title} title={card.title} className="h-full p-6">
              <p className="text-sm leading-6 text-muted">{card.body}</p>
            </Card>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection
        eyebrow="What is health navigation?"
        title="Making healthcare easier to understand and navigate."
      >
        <p className="mb-10 max-w-3xl text-lg leading-8 text-muted">
          Health navigation is about helping individuals organise their health information,
          understand their healthcare journey, and prepare to make informed decisions with
          qualified healthcare professionals.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {stages.map((stage) => (
            <article key={stage.number} className="flex flex-col gap-4">
              <ImageFrame
                src={stage.image.src}
                alt={stage.image.alt}
                className="aspect-[4/3]"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
              <p className="text-sm font-medium tracking-wide text-primary uppercase">
                {stage.number}. {stage.title}
              </p>
              <p className="text-sm leading-6 text-muted">{stage.body}</p>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection
        className="bg-accent/50"
        eyebrow="Who I want to help"
        title="You don't have to figure everything out alone."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {audiences.map((item) => (
            <li
              key={item}
              className="rounded-3xl border border-border bg-card px-5 py-4 text-base leading-7 text-muted shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection
        eyebrow="Building towards this vision"
        title="A more thoughtful way to navigate your health."
      >
        <div className="mb-10 max-w-3xl space-y-5 text-lg leading-8 text-muted">
          <p>
            I am working towards building a health intelligence platform that helps individuals
            understand and organise their healthcare journeys.
          </p>
          <p>
            The vision is simple: less confusion, better-informed decisions, and more meaningful
            conversations with healthcare professionals.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex h-full flex-col gap-3 p-6">
              <StatusBadge
                label={feature.status === "available" ? "Available now" : "Building towards"}
                tone={feature.status}
              />
              <h3 className="font-serif text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-6 text-muted">{feature.body}</p>
            </Card>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection eyebrow="About me" title="I'm Honey. And this is personal.">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <figure>
            <ImageFrame
              src="/images/honey-portrait.jpg"
              alt={`Portrait of ${AUTHOR_NAME}`}
              className="aspect-[9/16] min-h-[28rem] w-full md:min-h-[34rem]"
              fit="contain"
              priority={false}
            />
            <figcaption className="mt-3 text-sm text-muted">
              {AUTHOR_NAME}, Health Navigator &amp; Founder
            </figcaption>
          </figure>
          <div className="space-y-5 text-lg leading-8 text-muted">
            <p>
              I am an entrepreneur, a curious learner, and someone who believes that better
              information can change the way we experience healthcare.
            </p>
            <p>
              My own health journey has taught me that living with a chronic condition involves
              much more than managing physical symptoms. It involves uncertainty, emotional
              exhaustion, difficult decisions, financial implications, and the constant effort of
              finding answers.
            </p>
            <p>
              I do not claim to have all the answers. I am learning, researching, questioning, and
              building.
            </p>
            <p>
              I want to bring together lived experience, technology, research, and empathy to make
              healthcare navigation more accessible.
            </p>
            <p>
              Because people deserve to feel heard, informed, and empowered throughout their health
              journeys.
            </p>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection
        className="bg-sage-soft/60"
        eyebrow="My philosophy"
        title="A few things I strongly believe in."
      >
        <ol className="mx-auto max-w-3xl space-y-6">
          {philosophy.map((statement, index) => (
            <li key={statement} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
              <p className="font-serif text-xl leading-snug font-medium text-foreground md:text-2xl">
                <span className="mr-3 text-sm font-sans font-medium tracking-wide text-primary uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {statement}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      <EditorialSection>
        <div className="mb-10 overflow-hidden rounded-3xl">
          <ImageFrame
            src="/images/closing-light.jpg"
            alt="Sunlight through linen curtains in a peaceful room with plants and warm textures"
            className="aspect-[21/9] min-h-48"
            sizes="100vw"
          />
        </div>
        <CtaSection
          title="Let's make your healthcare journey a little less overwhelming."
          actions={
            <>
              <Link href="/health-navigation" className={buttonClass("primary", "", false)}>
                Start Your Health Navigation Journey
              </Link>
              <Link href="#my-story" className={buttonClass("secondary", "", false)}>
                Read My Story
              </Link>
            </>
          }
        >
          <p>
            Whether you are navigating chronic symptoms, trying to organise your health
            information, or simply looking for a more informed approach to healthcare, you are
            welcome here.
          </p>
        </CtaSection>
        <div className="mt-8">
          <DisclaimerNotice />
        </div>
      </EditorialSection>
    </main>
  );
}
