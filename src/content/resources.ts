import { AUTHOR_NAME } from "@/lib/site";

export const RESOURCE_CATEGORIES = [
  "Living With Chronic Illness",
  "Understanding Your Symptoms",
  "Preparing for Doctor Appointments",
  "Symptom Tracking and Patterns",
  "Health Records and Reports",
  "Healthcare Decision-Making",
  "Emotional Wellbeing and Self-Advocacy",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export type ResourceArticle = {
  slug: string;
  title: string;
  category: ResourceCategory;
  excerpt: string;
  publishedOn: string;
  readingMinutes: number;
  image: { src: string; alt: string };
  paragraphs: string[];
  isDraft: true;
  author: typeof AUTHOR_NAME;
};

const images = {
  journal: {
    src: "/images/journal.jpg",
    alt: "Open notebook with a fountain pen and a pair of glasses on a wooden table",
  },
  plants: {
    src: "/images/plants.jpg",
    alt: "Small cactus in a terracotta pot against a pale pink background",
  },
  window: {
    src: "/images/window-light.jpg",
    alt: "Quiet bedroom with daylight coming through two windows",
  },
  room: {
    src: "/images/quiet-room.jpg",
    alt: "Calm sitting room with a plant, sofa, and dresser",
  },
  flowers: {
    src: "/images/flowers.jpg",
    alt: "Yellow wildflowers against a clear blue sky",
  },
  linen: {
    src: "/images/linen.jpg",
    alt: "Bedside table with a warm lamp next to folded linen bedding",
  },
};

export const resources: ResourceArticle[] = [
  {
    slug: "naming-the-day-to-day-load",
    title: "Naming the day-to-day load",
    category: "Living With Chronic Illness",
    excerpt:
      "Living with ongoing symptoms often includes work that other people never see. Naming that load can make it easier to talk about.",
    publishedOn: "2026-03-04",
    readingMinutes: 5,
    image: images.linen,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice, and it is not a description of any one diagnosis.",
      "When I try to explain an ordinary day with ongoing symptoms, I often start with the visible parts: a rest, a missed plan, a follow-up message. The quieter parts take longer to name. There is the energy spent deciding whether a change is worth mentioning. There is the time spent keeping notes in case someone asks later. There is the effort of looking well enough to be taken seriously, and unwell enough to be believed.",
      "None of that means a person is dramatic. It means the work of staying oriented inside a body that keeps changing can be tiring even on a quieter day.",
      "If you want a starting place, try writing down the hidden tasks from one ordinary day. Not a complete inventory. Just the things you did to keep going that nobody else would have seen. You can keep that list for yourself, or bring two or three items to an appointment if they help explain what you need.",
      "You do not have to make the list tidy. You also do not have to prove that your day was hard enough. The point is to give your experience a shape you can return to.",
    ],
  },
  {
    slug: "you-do-not-need-a-clear-story-yet",
    title: "You do not need a clear story yet",
    category: "Living With Chronic Illness",
    excerpt:
      "Healthcare conversations often ask for a neat timeline. Real life is usually messier, and that is still worth documenting.",
    publishedOn: "2026-03-18",
    readingMinutes: 4,
    image: images.room,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice.",
      "I used to wait until I had a clean explanation before I wrote anything down. I wanted a beginning, a cause, and a sentence that would make sense to someone else. Waiting for that sentence meant I lost days that later became hard to reconstruct.",
      "A useful record can be incomplete. It can say \"worse after lunch,\" or \"sleep was short,\" or \"I do not know what changed.\" Those lines are still information. They are also kinder than forcing a story that is not ready.",
      "If you feel pressure to arrive with a finished narrative, it may help to prepare two versions: a short one for a brief visit, and a longer one you keep for yourself. The short one can be three facts and one question. The longer one can stay messy.",
      "You are allowed to say you are still figuring it out. Uncertainty is not the same as having nothing to offer.",
    ],
  },
  {
    slug: "describing-what-you-feel-without-forcing-a-conclusion",
    title: "Describing what you feel without forcing a conclusion",
    category: "Understanding Your Symptoms",
    excerpt:
      "Words like sharp, heavy, or foggy can be more useful than a guess about why something is happening.",
    publishedOn: "2026-04-02",
    readingMinutes: 5,
    image: images.journal,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not a symptom checker, and it does not explain what a sensation means.",
      "When something hurts or feels off, the first instinct is often to name the cause. I have done that too. The trouble is that a guessed cause can hide the details a clinician might actually need: where it is, when it changes, what it interrupts, and how strong it feels today compared with last week.",
      "A simpler approach is to describe. Location. Timing. What you can and cannot do. What you tried, if anything, and what you noticed afterward. If you do not know, write that down as well.",
      "You can keep a few ordinary words nearby so you are not searching for language in the moment: dull, pulsing, tight, burning, foggy, drained, unsettled. Use the ones that feel honest. Skip the ones that feel theatrical if they do not fit.",
      "Description is not a diagnosis. It is a way of keeping your experience from disappearing between visits.",
    ],
  },
  {
    slug: "what-i-do-not-know-can-still-be-recorded",
    title: "What I do not know can still be recorded",
    category: "Understanding Your Symptoms",
    excerpt:
      "Blank spaces in a health record are not failures. They can show where the picture is still incomplete.",
    publishedOn: "2026-04-16",
    readingMinutes: 4,
    image: images.plants,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice.",
      "There were days I left a note blank because I thought an empty field would look careless. I later realized the blank was the point. I did not know whether sleep, food, weather, or nothing in particular had anything to do with how I felt. Pretending I knew would have been less accurate.",
      "A record can include \"unsure,\" \"did not notice,\" or \"skipped today.\" Those lines help later, when you look back and try to see whether a pattern is actually there or whether you are filling gaps with memory.",
      "If you track one question over time, you do not have to track everything else. One honest column is often more usable than a spreadsheet you abandon.",
      "Not knowing is allowed. It does not make you a less reliable witness to your own body.",
    ],
  },
  {
    slug: "a-short-list-for-a-brief-visit",
    title: "A short list that fits a brief visit",
    category: "Preparing for Doctor Appointments",
    excerpt:
      "Most visits are shorter than the story you want to tell. A small list can keep the important parts from getting lost.",
    publishedOn: "2026-05-01",
    readingMinutes: 5,
    image: images.journal,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not a script for every appointment, and it does not replace professional medical advice.",
      "I have walked into rooms with a full notebook and walked out realizing I never asked the one question I cared about. Time moves quickly. The first story that comes out is not always the most useful one.",
      "Before a visit, I now try to write three things: what has changed, what I need from this conversation, and the questions I do not want to forget. If there is a timeline, I keep it to a few dated points rather than a complete autobiography.",
      "You can hand the list over, read it aloud, or keep it as a prompt. If the visit goes in another direction, the list still helps you notice what was not covered so you can ask about a follow-up.",
      "A short list is not a demand that every concern be solved in one sitting. It is a way of treating your time, and the clinician's time, with a little more care.",
    ],
  },
  {
    slug: "bringing-a-timeline-instead-of-starting-from-zero",
    title: "Bringing a timeline instead of starting from zero",
    category: "Preparing for Doctor Appointments",
    excerpt:
      "Repeating your history from scratch is exhausting. A simple timeline can keep the conversation from restarting at the beginning.",
    publishedOn: "2026-05-14",
    readingMinutes: 4,
    image: images.window,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice.",
      "Telling the same history again can feel like erasing the work you already did. I used to start from childhood, or from the first scare, because I thought that was what a thorough patient did. Often the room only needed the last few weeks, plus one or two older facts.",
      "A timeline can be a page with dates and short lines: when something started, when it changed, what was tried, what is still unanswered. It does not need perfect memory. Approximate months are still better than a foggy retelling.",
      "If you have reports, keep a separate list of what you are bringing and what you still need. You do not have to interpret the reports. You can simply say they exist.",
      "Starting from zero is sometimes required. When it is not, a timeline can make the visit feel less like an audition and more like a continuation.",
    ],
  },
  {
    slug: "what-a-personal-log-can-and-cannot-show",
    title: "What a personal log can and cannot show",
    category: "Symptom Tracking and Patterns",
    excerpt:
      "A log can help you notice coincidences in your own notes. It cannot prove cause, and it cannot diagnose.",
    publishedOn: "2026-06-03",
    readingMinutes: 5,
    image: images.plants,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It does not claim that tracking will explain every symptom.",
      "I started logging because I wanted the feeling of chaos to sit still long enough to look at. Some days the notes made a conversation easier. Some days they only showed that I was tired of guessing.",
      "A personal log can show what you recorded: severity, sleep, stress, a treatment you tried, a note about the day. If two things rise together, that is a coincidence in your notes. It might be useful to mention. It is not proof that one caused the other.",
      "A log also cannot see what you did not write, and it cannot speak for lab work, imaging, or a clinician's exam. It is one source, from one person, over a short window.",
      "Used gently, tracking is a way to arrive with examples instead of a blank stare. Used as a hunt for certainty, it can become another way to blame yourself. The first use is the one I care about.",
    ],
  },
  {
    slug: "choosing-one-question-to-follow",
    title: "Choosing one question to follow for a while",
    category: "Symptom Tracking and Patterns",
    excerpt:
      "You do not need to measure your whole life. One recurring question is often enough to start.",
    publishedOn: "2026-06-18",
    readingMinutes: 4,
    image: images.flowers,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice.",
      "The first tracking template I saw asked for everything: food, weather, mood, movement, medications, and more. I filled it for three days and then avoided it. The page had become another job.",
      "A smaller question is easier to keep. What keeps coming back. How intense it was today. Whether sleep was short. Whether stress was high. Whether you tried something you already use. That is already a lot of information if you return to it.",
      "You can change the question later. You can also stop. A log is a tool, not a personality test, and it is not a requirement for being taken seriously.",
      "If you do keep going, look at the notes with a clinician rather than treating the chart as a verdict. Patterns in a short personal log are starting points for conversation, not answers.",
    ],
  },
  {
    slug: "keeping-notes-and-papers-in-one-place",
    title: "Keeping notes and papers in one place",
    category: "Health Records and Reports",
    excerpt:
      "Records scatter quickly: portals, email, paper, photos of printouts. One folder, even a simple one, can reduce the scramble.",
    publishedOn: "2026-07-02",
    readingMinutes: 4,
    image: images.journal,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not a guide to interpreting medical reports.",
      "I have looked for a result on my phone in a waiting room and found four versions of the same visit, none of them labeled in a way I understood. The information existed. I could not reach it in time.",
      "A simple system is enough: one folder for visit notes, one for reports, one for questions, and a running list of upcoming appointments. Paper or digital both work if you can actually open them when you need them.",
      "You do not have to organize years of history before the next visit. Start with what you need this month. Add older papers when you have energy, not as a test of worthiness.",
      "Keeping records is not the same as understanding them. If a report is confusing, that is a reasonable thing to ask about. You are not required to become your own analyst.",
    ],
  },
  {
    slug: "preparing-a-summary-you-can-hand-over",
    title: "Preparing a summary you can hand over",
    category: "Health Records and Reports",
    excerpt:
      "A one-page summary can help a visit stay focused. It should stay factual, limited, and easy to scan.",
    publishedOn: "2026-07-16",
    readingMinutes: 5,
    image: images.window,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It does not replace clinical records or professional advice.",
      "A summary is not a novel. I aim for one page: the main question, a short timeline, current symptoms in ordinary language, what I have already tried, and the questions I hope to ask. If I have a 14-day log, I attach that separately rather than squeezing it into the page.",
      "Write what you observed, not what you fear it means. \"Worse in the evening\" is a fact you can stand behind. \"I think it is definitely X\" is a conclusion that may not belong on the page.",
      "Leave room for the clinician's reading. A summary is an offering, not a demand that the visit follow your outline.",
      "If you use the health navigation tool on this site, treat its report the same way: a record of what you logged, with limits stated clearly, to support a conversation rather than to replace one.",
    ],
  },
  {
    slug: "questions-that-slow-a-rushed-choice",
    title: "Questions that slow a rushed choice",
    category: "Healthcare Decision-Making",
    excerpt:
      "Some decisions feel urgent because the room is moving quickly. A few questions can create enough space to think.",
    publishedOn: "2026-08-04",
    readingMinutes: 5,
    image: images.room,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not a recommendation for or against any treatment, test, or procedure.",
      "I have nodded along in a conversation and only understood the choice after I was in the parking lot. Speed can feel like competence. It can also skip the part where you get to ask what happens if you wait, what the alternatives are, and what the plan is if this does not help.",
      "Useful questions are often plain. What are we trying to learn. What could change if we do this. What are the likely next steps either way. How will we know it is working. What should I watch for that means I should call.",
      "You can write the answers down in the room. You can also ask for the plan in writing. Needing time is not the same as refusing care.",
      "This is not a suggestion to delay emergency care. If you think you need urgent help, contact a nearby healthcare provider or emergency services. For non-urgent choices, slowing down can be a form of self-respect.",
    ],
  },
  {
    slug: "second-opinions-and-living-with-uncertainty",
    title: "Second opinions and living with uncertainty",
    category: "Healthcare Decision-Making",
    excerpt:
      "Wanting another perspective is not disloyalty. Some questions remain open even after careful care.",
    publishedOn: "2026-08-20",
    readingMinutes: 4,
    image: images.flowers,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice, and it does not tell you when a second opinion is needed.",
      "Uncertainty is uncomfortable. I wanted someone to close the case. Sometimes a second conversation helped me understand the first one. Sometimes it added another layer of maybe. Both outcomes taught me something about the limits of a single visit.",
      "Asking for another perspective can be as simple as \"I would like time to think\" or \"Can you help me understand what another clinician might say.\" You do not have to frame it as a conflict.",
      "It is also possible that two thoughtful people will not fully agree, or that the honest answer is that more time is needed. That is frustrating. It is still information.",
      "Living with an unfinished picture does not mean you stop asking questions. It means you do not have to pretend the picture is complete in order to keep caring for yourself.",
    ],
  },
  {
    slug: "being-taken-seriously-without-becoming-adversarial",
    title: "Being taken seriously without becoming adversarial",
    category: "Emotional Wellbeing and Self-Advocacy",
    excerpt:
      "Self-advocacy can be calm, specific, and firm. It does not have to turn the visit into a fight.",
    publishedOn: "2026-09-03",
    readingMinutes: 5,
    image: images.linen,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not a guide to every clinical relationship.",
      "I have left appointments feeling small, and I have also left them feeling like I had to armor up. Neither state helped me hear what was said. What helped more was arriving with a few facts, one or two questions, and a willingness to repeat them if they were missed.",
      "Calm does not mean agreeing with everything. It can mean \"I would like that written down,\" or \"I am still concerned about X,\" or \"Can we talk about what we will do if this continues.\" Specific language is harder to wave away than a general sense of not being heard.",
      "If you need support in the room, bringing a trusted person, or asking to record the plan, can be reasonable where it is allowed. You should not have to perform gratitude in order to receive care.",
      "Advocacy is allowed to be tired. You can ask for dignity without turning yourself into a courtroom. You also do not have to do this perfectly to deserve a careful response.",
    ],
  },
  {
    slug: "resting-is-not-giving-up",
    title: "Resting is not giving up",
    category: "Emotional Wellbeing and Self-Advocacy",
    excerpt:
      "Stopping for a day, or for a season, can be part of staying in your life. Rest does not have to be earned by productivity.",
    publishedOn: "2026-09-17",
    readingMinutes: 4,
    image: images.room,
    isDraft: true,
    author: AUTHOR_NAME,
    paragraphs: [
      "This is a sample draft. It is not medical advice, and it is not a prescription for rest as treatment.",
      "There is a quiet shame that shows up when a body needs more recovery than a calendar wants to allow. I have treated rest like a debt I had to repay with usefulness. That bargain rarely worked.",
      "Rest can be a nap, a cancelled plan, a slower morning, or a decision not to track anything today. It can also be asking for help with the practical parts of care so that the whole job is not yours.",
      "You can still want answers while taking a break from hunting them. Curiosity and rest can exist in the same week.",
      "If you need urgent care, rest is not a substitute for contacting a nearby healthcare provider or emergency services. For the long middle of a health journey, though, pausing does not mean you have stopped caring about your life.",
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((article) => article.slug === slug);
}

export function formatResourceDate(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00.000Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function resourcesByCategory(category?: ResourceCategory) {
  if (!category) return resources;
  return resources.filter((article) => article.category === category);
}
