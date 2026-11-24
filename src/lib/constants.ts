export const APP_GOAL_OPTIONS = [
  "Understand patterns in how I feel",
  "Prepare for doctor appointments",
  "Track after a diagnosis",
  "Support someone I care about",
  "Just need a gentle place to write",
] as const;

export const DIAGNOSED_STATUS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "Not yet" },
  { value: "unsure", label: "Not sure" },
] as const;

export const DIAGNOSIS_STAGE_OPTIONS = [
  "Newly diagnosed",
  "Actively treating",
  "Managing day to day",
  "Monitoring or remission",
  "Something else",
] as const;

export const DURATION_OPTIONS = [
  "A few days",
  "1 to 4 weeks",
  "1 to 6 months",
  "More than 6 months",
  "It comes and goes",
] as const;

export const BODY_AREA_OPTIONS = [
  "Head",
  "Neck or shoulders",
  "Chest",
  "Stomach or gut",
  "Back",
  "Arms or hands",
  "Legs or feet",
  "Whole body",
  "Mood or mind",
  "Other / not sure",
] as const;

export const SYMPTOM_CATEGORY_OPTIONS = [
  "Headache or migraine",
  "Fatigue or low energy",
  "Pain",
  "Digestive discomfort",
  "Sleep trouble",
  "Anxiety or low mood",
  "Breathing or chest",
  "Skin",
  "Hormonal or cycle-related",
  "Joint or muscle",
  "Other",
] as const;

export const DOCTOR_SPECIALTY_OPTIONS = [
  "General practitioner / family medicine",
  "Neurology",
  "Gastroenterology",
  "Cardiology",
  "Pulmonology",
  "Dermatology",
  "Rheumatology",
  "Endocrinology",
  "Psychiatry / mental health",
  "Gynecology / women's health",
  "Orthopedics",
  "Allergy / immunology",
  "Other",
] as const;

export const PROGRESS_RANGES = ["day", "week", "month", "year"] as const;

export type ProgressRange = (typeof PROGRESS_RANGES)[number];

export const LIMITATIONS = [
  "This summary reflects what you logged. It is not a diagnosis and it does not recommend treatment.",
  "Patterns in a short log do not prove that one thing caused another.",
  "Entries are self-reported and may miss days or details.",
  "Honey offers gentle prep and listening only. Your clinician makes care decisions with you.",
];
