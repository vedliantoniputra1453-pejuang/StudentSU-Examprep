export type Major = "Manajemen" | "Akuntansi";

export type StudyProfile = {
  name: string;
  major: Major;
  semester: number;
  examLabel: string;
  daysToExam: number;
  interests?: string[];
  customPrompt?: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  department: "manajemen" | "akuntansi";
  sessionDone: number;
  sessionTotal: number;
  nextTopic: string;
  accent: "sky" | "leaf" | "berry" | "sun";
  textbook?: string;
};

export type RubricLevel = {
  label: "Excellent" | "Good" | "Average" | "Poor";
  scoreRange: string;
  descriptor: string;
};

export type RubricCriterion = {
  indicator: string;
  weight: number;
  levels: RubricLevel[];
};

export type CPMKItem = {
  id: string;
  courseId: string;
  code: string;
  title: string;
  description: string;
  sessions: number[];
  criteria: RubricCriterion[];
};

export type MaterialItem = {
  id: string;
  courseId: string;
  sessionId: number | null;
  kind: "transcript" | "slides" | "pdf" | "book" | "default";
  title: string;
  text: string;
  charCount: number;
  createdAt: string;
};

export type QuestionOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type Question = {
  id: string;
  cpmkCode: string;
  prompt: string;
  format: "multiple-choice" | "essay";
  options?: QuestionOption[];
  correctOptionId?: "A" | "B" | "C" | "D";
  explanation: string;
  rubricPoints: number;
  difficulty: "easy" | "medium" | "hard";
  sourceSessions: number[];
};

export type AssessmentScope = {
  courseId: string;
  type: "uts" | "uas";
  sessionFrom: number;
  sessionTo: number;
  blueprintText?: string;
  cpmkCodes: string[];
};

export type QuestionSet = {
  id: string;
  scope: AssessmentScope;
  style: "interest" | "campus" | "learning-style" | "neutral";
  format: "multiple-choice" | "essay";
  questions: Question[];
  provider: string;
  model: string;
  createdAt: string;
};

export type AttemptAnswer = {
  questionId: string;
  cpmkCode: string;
  response: string;
  isCorrect?: boolean;
  awardedPoints: number;
  maxPoints: number;
  feedback: string;
  evaluatedBy: "auto-key" | "ai" | "self";
};

export type Attempt = {
  id: string;
  questionSetId: string;
  courseId: string;
  courseName: string;
  examType: "uts" | "uas";
  format: "multiple-choice" | "essay";
  answers: AttemptAnswer[];
  totalScore: number;
  submittedAt: string;
  cpmkBreakdown: Record<string, { awarded: number; max: number; percentage: number }>;
};

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

export type JournalEntry = {
  id: string;
  date: string;
  mood: "berat" | "biasa" | "tenang" | "fokus" | "semangat";
  note: string;
  hope?: string;
};

export type TicketType = "bug" | "feedback" | "feature";

export type Ticket = {
  id: string;
  type: TicketType;
  title: string;
  description: string;
  context: {
    major: string;
    userAgent: string;
    version: string;
  };
  createdAt: string;
  status: "open";
};

export type ApiProvider = "gemini" | "openai";

export type ApiKeySetting = {
  provider: ApiProvider;
  key: string;
  model: string;
  status: "unset" | "ok" | "invalid" | "unknown";
  lastCheckedAt: string | null;
  errorMessage?: string;
};
