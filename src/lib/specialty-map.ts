import { SYMPTOM_CATEGORY_OPTIONS } from "@/lib/constants";

export type SpecialtySuggestion = {
  specialties: string[];
  blurb: string;
};

const MAP: Record<(typeof SYMPTOM_CATEGORY_OPTIONS)[number], SpecialtySuggestion> = {
  "Headache or migraine": {
    specialties: ["Neurology", "General practitioner / family medicine"],
    blurb: "Headache patterns are often something a neurologist or your primary clinician can help unpack with you.",
  },
  "Fatigue or low energy": {
    specialties: ["General practitioner / family medicine", "Endocrinology"],
    blurb: "Ongoing fatigue is often worth bringing to your primary clinician first; they may involve other specialists if needed.",
  },
  Pain: {
    specialties: ["General practitioner / family medicine", "Rheumatology", "Orthopedics"],
    blurb: "Where the pain lives and how long it has lasted can guide whether primary care, rheumatology, or orthopedics is a helpful next conversation.",
  },
  "Digestive discomfort": {
    specialties: ["Gastroenterology", "General practitioner / family medicine"],
    blurb: "Digestive symptoms are commonly discussed with a gastroenterologist or your primary clinician.",
  },
  "Sleep trouble": {
    specialties: ["General practitioner / family medicine", "Psychiatry / mental health"],
    blurb: "Sleep changes are often a good first topic with your primary clinician; mental health support can also help when stress or mood are involved.",
  },
  "Anxiety or low mood": {
    specialties: ["Psychiatry / mental health", "General practitioner / family medicine"],
    blurb: "You might consider talking with a mental health clinician or your primary clinician about how you have been feeling.",
  },
  "Breathing or chest": {
    specialties: ["Pulmonology", "Cardiology", "General practitioner / family medicine"],
    blurb: "Breathing or chest symptoms deserve timely clinical attention; start with urgent care or your clinician if anything feels sudden or severe.",
  },
  Skin: {
    specialties: ["Dermatology", "General practitioner / family medicine"],
    blurb: "Skin changes are often reviewed by a dermatologist or your primary clinician.",
  },
  "Hormonal or cycle-related": {
    specialties: ["Gynecology / women's health", "Endocrinology", "General practitioner / family medicine"],
    blurb: "Hormonal or cycle-related concerns are often discussed with gynecology, endocrinology, or primary care.",
  },
  "Joint or muscle": {
    specialties: ["Rheumatology", "Orthopedics", "General practitioner / family medicine"],
    blurb: "Joint or muscle symptoms may fit rheumatology or orthopedics; your primary clinician can help you choose a path.",
  },
  Other: {
    specialties: ["General practitioner / family medicine"],
    blurb: "When symptoms do not fit a neat category, a primary clinician is often a gentle, useful starting point.",
  },
};

export function suggestSpecialtiesForCategory(category: string): SpecialtySuggestion {
  if (category in MAP) {
    return MAP[category as keyof typeof MAP];
  }
  return MAP.Other;
}

export function suggestSpecialtiesForCategories(categories: string[]): SpecialtySuggestion[] {
  const seen = new Set<string>();
  const results: SpecialtySuggestion[] = [];
  for (const category of categories) {
    const suggestion = suggestSpecialtiesForCategory(category);
    const key = suggestion.specialties.join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(suggestion);
  }
  if (results.length === 0) results.push(MAP.Other);
  return results;
}
