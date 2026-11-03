import type {
  ApiKeySetting,
  Attempt,
  CPMKItem,
  JournalEntry,
  MaterialItem,
  StudyProfile,
  Ticket,
} from "@/lib/types";
import { defaultCpmks, defaultMaterials, profile as defaultProfile } from "@/lib/mock-data";

const NS = "sus.";
export const STORAGE_KEYS = {
  profile: `${NS}profile`,
  apiKey: `${NS}apikey`,
  materials: `${NS}materials`,
  cpmks: `${NS}cpmks`,
  attempts: `${NS}attempts`,
  journals: `${NS}journals`,
  tickets: `${NS}tickets`,
  quarantine: `${NS}quarantine`,
} as const;

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // ponytail: quarantine corrupt JSON to preserve bad data for debug while keeping the app alive
    try {
      const corrupt = window.localStorage.getItem(key);
      if (corrupt) {
        window.localStorage.setItem(`${STORAGE_KEYS.quarantine}.${Date.now()}`, corrupt);
      }
    } catch {
      // quota or security error
    }
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Profile
export function getProfile(): StudyProfile {
  return safeGet<StudyProfile>(STORAGE_KEYS.profile, defaultProfile);
}

export function saveProfile(profile: StudyProfile): boolean {
  return safeSet(STORAGE_KEYS.profile, profile);
}

// API Key (BYOK)
export function getApiKeySetting(): ApiKeySetting {
  return safeGet<ApiKeySetting>(STORAGE_KEYS.apiKey, {
    provider: "gemini",
    key: "",
    model: "gemini-1.5-flash",
    status: "unset",
    lastCheckedAt: null,
  });
}

export function saveApiKeySetting(setting: ApiKeySetting): boolean {
  return safeSet(STORAGE_KEYS.apiKey, setting);
}

export function clearApiKeySetting(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.apiKey);
    return true;
  } catch {
    return false;
  }
}

// Materials
export function getMaterials(courseId?: string): MaterialItem[] {
  const all = safeGet<MaterialItem[]>(STORAGE_KEYS.materials, defaultMaterials);
  return courseId ? all.filter((m) => m.courseId === courseId) : all;
}

export function addMaterial(material: MaterialItem): boolean {
  const all = getMaterials();
  return safeSet(STORAGE_KEYS.materials, [material, ...all]);
}

export function removeMaterial(id: string): boolean {
  const all = getMaterials();
  return safeSet(STORAGE_KEYS.materials, all.filter((m) => m.id !== id));
}

// CPMK
export function getCourseCpmks(courseId: string): CPMKItem[] {
  const store = safeGet<Record<string, CPMKItem[]>>(STORAGE_KEYS.cpmks, defaultCpmks);
  return store[courseId] || defaultCpmks[courseId] || [];
}

export function saveCourseCpmks(courseId: string, items: CPMKItem[]): boolean {
  const store = safeGet<Record<string, CPMKItem[]>>(STORAGE_KEYS.cpmks, defaultCpmks);
  store[courseId] = items;
  return safeSet(STORAGE_KEYS.cpmks, store);
}

// Attempts & Practice History
export function getAttempts(): Attempt[] {
  return safeGet<Attempt[]>(STORAGE_KEYS.attempts, []);
}

export function saveAttempt(attempt: Attempt): boolean {
  const all = getAttempts();
  return safeSet(STORAGE_KEYS.attempts, [attempt, ...all]);
}

export function deleteAttempt(id: string): boolean {
  const all = getAttempts();
  return safeSet(STORAGE_KEYS.attempts, all.filter((a) => a.id !== id));
}

// Journals
export function getJournalEntries(): JournalEntry[] {
  return safeGet<JournalEntry[]>(STORAGE_KEYS.journals, []);
}

export function saveJournalEntry(entry: JournalEntry): boolean {
  const all = getJournalEntries();
  const existingIndex = all.findIndex((e) => e.id === entry.id || e.date === entry.date);
  if (existingIndex >= 0) {
    all[existingIndex] = entry;
    return safeSet(STORAGE_KEYS.journals, all);
  }
  return safeSet(STORAGE_KEYS.journals, [entry, ...all]);
}

// Single-day helper for legacy journal card compatibility
export function journalKey(date = new Date()) {
  return `${NS}journal.${date.toISOString().slice(0, 10)}`;
}

export type JournalDraft = { mood: string; note: string };

export function readJournal(key: string): JournalDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { mood?: string; note?: string };
    if (!parsed || typeof parsed.mood !== "string" || typeof parsed.note !== "string") {
      return null;
    }
    return { mood: parsed.mood, note: parsed.note };
  } catch {
    return null;
  }
}

export function writeJournal(key: string, draft: JournalDraft): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
    // also sync to journals list
    const date = key.replace(`${NS}journal.`, "");
    const moodVal = (draft.mood.toLowerCase() || "biasa") as JournalEntry["mood"];
    saveJournalEntry({
      id: `j-${date}`,
      date,
      mood: ["semangat", "tenang", "biasa", "berat", "fokus"].includes(moodVal) ? moodVal : "biasa",
      note: draft.note,
    });
    return true;
  } catch {
    return false;
  }
}

// Tickets
export function getTickets(): Ticket[] {
  return safeGet<Ticket[]>(STORAGE_KEYS.tickets, []);
}

export function saveTicket(ticket: Ticket): boolean {
  const all = getTickets();
  return safeSet(STORAGE_KEYS.tickets, [ticket, ...all]);
}