"use client";

import { useEffect, useState } from "react";
import { journalKey, readJournal, writeJournal } from "@/lib/storage";

const moods = ["Berat", "Biasa", "Tenang", "Fokus", "Semangat"] as const;

type Status = "idle" | "saved" | "failed";

export default function JournalCard() {
  const [mood, setMood] = useState<string>("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const storageKey = journalKey();

  useEffect(() => {
    const draft = readJournal(storageKey);
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is not readable during SSR, so the draft can only load after mount.
      setMood(draft.mood);
      setNote(draft.note);
    }
  }, [storageKey]);

  function save() {
    const ok = writeJournal(storageKey, { mood, note });
    setStatus(ok ? "saved" : "failed");
  }

  return (
    <section className="flex h-full flex-col rounded-card border border-outline bg-white p-6">
      <h2 className="font-display text-h4 font-bold">Jurnal hari ini</h2>
      <p className="mt-1 text-small text-ink-muted">Gimana perasaanmu hari ini?</p>

      <fieldset className="mt-4">
        <legend className="sr-only">Pilih mood hari ini</legend>
        <div className="flex flex-wrap gap-2">
          {moods.map((option) => {
            const active = mood === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setMood(option);
                  setStatus("idle");
                }}
                className={`min-h-11 rounded-pill border px-4 text-small transition-colors duration-200 ${
                  active
                    ? "border-sky-deep bg-sky-soft font-semibold text-sky-deep"
                    : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label htmlFor="journal-note" className="mt-5 text-small font-semibold">
        Catatan
      </label>
      <textarea
        id="journal-note"
        value={note}
        onChange={(event) => {
          setNote(event.target.value);
          setStatus("idle");
        }}
        rows={4}
        placeholder="Mau tulis apa? Tidak ada yang membaca ini kecuali kamu."
        className="mt-2 w-full resize-none rounded-input border border-outline bg-surface px-4 py-3 text-small text-ink placeholder:text-ink-muted focus:border-sky focus:bg-white"
      />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={save}
          className="min-h-11 rounded-control bg-sky-deep px-5 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
        >
          Simpan catatan
        </button>
        <p role="status" aria-live="polite" className="text-caption text-ink-muted">
          {status === "saved" ? "Catatan tersimpan di browser ini." : null}
          {status === "failed" ? "Gagal menyimpan. Penyimpanan browser mungkin penuh atau diblokir." : null}
        </p>
      </div>
    </section>
  );
}