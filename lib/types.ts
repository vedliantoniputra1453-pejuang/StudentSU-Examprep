export type Major = "Manajemen" | "Akuntansi";

export type StudyProfile = {
  name: string;
  major: Major;
  semester: number;
  examLabel: string;
  daysToExam: number;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  sessionDone: number;
  sessionTotal: number;
  nextTopic: string;
  accent: "sky" | "leaf" | "berry" | "sun";
};

/** One spoke of the knowledge radar. Scores are 0-100. */
export type SkillAxis = {
  label: string;
  you: number;
  cohort: number;
};

export type CpmkGap = {
  code: string;
  label: string;
  mastery: number;
  note: string;
};

export type StatCardData = {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone: "sky" | "leaf" | "sun" | "berry";
};

export type SetupStep = {
  label: string;
  detail: string;
  done: boolean;
};

export type Insight = {
  title: string;
  body: string;
  source: string;
};
