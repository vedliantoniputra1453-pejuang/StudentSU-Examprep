const JOURNAL_PREFIX = "sus.journal.";

export function journalKey(date = new Date()) {
  return `${JOURNAL_PREFIX}${date.toISOString().slice(0, 10)}`;
}

export type JournalDraft = { mood: string; note: string };

export function readJournal(key: string): JournalDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as JournalDraft).mood !== "string" ||
      typeof (parsed as JournalDraft).note !== "string"
    ) {
      return null;
    }
    return parsed as JournalDraft;
  } catch {
    return null;
  }
}

export function writeJournal(key: string, draft: JournalDraft) {
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}