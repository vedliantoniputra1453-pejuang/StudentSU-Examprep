"use client";

import { useState } from "react";
import { getJournalEntries, saveJournalEntry } from "@/lib/storage";
import type { JournalEntry } from "@/lib/types";

const moodList: Array<{ id: JournalEntry["mood"]; label: string; desc: string }> = [
  { id: "berat", label: "Berat", desc: "Materi terasa padat atau sedang kelelahan" },
  { id: "biasa", label: "Biasa", desc: "Berjalan normal seperti hari kuliah biasa" },
  { id: "tenang", label: "Tenang", desc: "Mampu mengontrol waktu dan ritme belajar" },
  { id: "fokus", label: "Fokus", desc: "Sedang dalam konsentrasi tinggi menyelesaikan topik" },
  { id: "semangat", label: "Semangat", desc: "Termotivasi dan siap menghadapi ujian" },
];

export default function JurnalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getJournalEntries());
  const [selectedMood, setSelectedMood] = useState<JournalEntry["mood"]>("tenang");
  const [note, setNote] = useState("");
  const [hope, setHope] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: todayStr,
      mood: selectedMood,
      note: note.trim(),
      hope: hope.trim() || undefined,
    };

    saveJournalEntry(newEntry);
    setEntries(getJournalEntries());
    setNote("");
    setHope("");
    setSaveStatus("Refleksi belajar hari ini tersimpan di browser perangkatmu.");
    setTimeout(() => setSaveStatus(null), 3000);
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
          Kesehatan Mental & Refleksi
        </p>
        <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
          Jurnal Belajar Mahasiswa
        </h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">
          Ruang pribadi untuk mencatat suasana hati, kelelahan, dan harapan selama persiapan UTS/UAS. Tidak ada yang membaca tulisan ini kecuali kamu.
        </p>
      </header>

      {saveStatus && (
        <div role="status" className="rounded-card border border-leaf-deep/20 bg-leaf-soft px-5 py-3 text-small text-leaf-deep">
          {saveStatus}
        </div>
      )}

      {/* Formulir Refleksi */}
      <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
        <h2 className="font-display text-h3 font-bold">Tulis Refleksi Hari Ini</h2>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-6">
          <div>
            <label className="block text-small font-semibold">
              Bagaimana suasana hatimu saat belajar hari ini?
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {moodList.map((m) => {
                const active = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedMood(m.id)}
                    className={`flex flex-col rounded-card border p-4 text-left transition-colors duration-200 ${
                      active
                        ? "border-sky-deep bg-sky-soft/40 font-semibold text-sky-deep"
                        : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                    }`}
                  >
                    <span className="text-small font-bold">{m.label}</span>
                    <span className="mt-1 text-caption text-ink-muted leading-tight font-normal">
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="journal-note-full" className="block text-small font-semibold">
              Curahan Pikiran & Catatan Kendala
            </label>
            <textarea
              id="journal-note-full"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ceritakan apa yang membuatmu bingung, materi yang melelahkan, atau progress kecil yang kamu syukuri hari ini..."
              className="mt-2 w-full rounded-input border border-outline bg-surface p-4 text-small focus:border-sky focus:bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="journal-hope-input" className="block text-small font-semibold">
              Harapan & Target Sesi Belajar Berikutnya (Opsional)
            </label>
            <input
              id="journal-hope-input"
              type="text"
              value={hope}
              onChange={(e) => setHope(e.target.value)}
              placeholder="Contoh: Besok mau mengulang rumus MC dan ATC sampai benar-benar paham."
              className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="min-h-11 rounded-control bg-sky-deep px-6 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
            >
              Simpan refleksi jurnal
            </button>
          </div>
        </form>
      </section>

      {/* Riwayat Refleksi */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-h4 font-bold">Catatan Refleksi Sebelumnya</h2>

        {entries.length === 0 ? (
          <div className="rounded-card border border-outline bg-surface p-8 text-center text-small text-ink-muted">
            Belum ada catatan jurnal yang tersimpan.
          </div>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="rounded-card border border-outline bg-white p-6">
              <div className="flex items-center justify-between border-b border-outline pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-pill bg-sky-soft px-3 py-0.5 text-caption font-semibold uppercase text-sky-deep">
                    Mood: {entry.mood}
                  </span>
                  <span className="font-mono text-caption text-ink-muted">
                    {new Date(entry.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-small text-ink leading-relaxed">
                {entry.note}
              </p>

              {entry.hope && (
                <div className="mt-3 rounded-input bg-surface-sunken p-3 text-caption border border-outline">
                  <strong className="text-ink">Harapan:</strong>{" "}
                  <span className="text-ink-muted">{entry.hope}</span>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}