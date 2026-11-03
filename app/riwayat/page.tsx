"use client";

import { useState } from "react";
import Link from "next/link";
import { insight } from "@/lib/mock-data";
import { deleteAttempt, getAttempts } from "@/lib/storage";
import type { Attempt } from "@/lib/types";

export default function RiwayatPage() {
  const [attempts, setAttempts] = useState<Attempt[]>(() => getAttempts());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (confirm("Hapus catatan latihan ini dari riwayat?")) {
      deleteAttempt(id);
      setAttempts(getAttempts());
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
            Progres Belajar
          </p>
          <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
            Riwayat Latihan
          </h1>
          <p className="mt-2 max-w-2xl text-body text-ink-muted">
            Pantau catatan hasil latihan, evaluasi pencapaian per CPMK, dan pemahaman relevansi praktisnya di industri profesional.
          </p>
        </div>
        <Link
          href="/latihan"
          className="inline-flex min-h-11 items-center rounded-control bg-sky-deep px-5 text-small font-semibold text-white hover:bg-sky"
        >
          + Mulai Latihan Baru
        </Link>
      </header>

      {/* Insight Dunia Kerja */}
      <section className="rounded-card border border-outline bg-white p-6">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-input bg-sun/20 text-sun-deep">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
            </svg>
          </span>
          <div>
            <h2 className="font-display text-h4 font-bold">{insight.title}</h2>
            <p className="mt-2 text-body text-ink-muted leading-relaxed">{insight.body}</p>
            <p className="mt-3 text-caption text-ink-muted">{insight.source}</p>
          </div>
        </div>
      </section>

      {/* Daftar Attempt */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-h4 font-bold">Daftar Sesi Latihan Selesai</h2>

        {attempts.length === 0 ? (
          <div className="rounded-card border border-outline bg-surface p-12 text-center">
            <p className="text-small font-semibold text-ink">Belum ada riwayat latihan</p>
            <p className="mt-1 text-caption text-ink-muted">
              Selesaikan minimal 1 set soal di menu Latihan Soal untuk memantau progres dan tren skormu.
            </p>
            <div className="mt-5">
              <Link
                href="/latihan"
                className="inline-flex min-h-11 items-center rounded-control bg-sky-deep px-5 text-small font-semibold text-white hover:bg-sky"
              >
                Mulai latihan sekarang
              </Link>
            </div>
          </div>
        ) : (
          attempts.map((att) => {
            const isExpanded = expandedId === att.id;
            return (
              <article key={att.id} className="rounded-card border border-outline bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-pill bg-sky-soft px-3 py-0.5 text-caption font-semibold uppercase text-sky-deep">
                        {att.examType.toUpperCase()} · {att.format === "multiple-choice" ? "Pilihan Ganda" : "Esai"}
                      </span>
                      <span className="text-caption text-ink-muted font-mono">
                        {new Date(att.submittedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-h4 font-bold">{att.courseName}</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-caption uppercase tracking-wide text-ink-muted">Skor Akhir</p>
                      <p
                        className={`font-display text-h3 font-extrabold tabular-nums ${
                          att.totalScore >= 80
                            ? "text-leaf-deep"
                            : att.totalScore >= 50
                            ? "text-sun-deep"
                            : "text-coral"
                        }`}
                      >
                        {att.totalScore}/100
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : att.id)}
                      className="min-h-11 rounded-control border border-outline bg-surface px-4 text-small font-medium text-ink-muted hover:text-ink"
                    >
                      {isExpanded ? "Tutup detail" : "Lihat detail"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(att.id)}
                      className="text-caption font-medium text-coral hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {/* CPMK Breakdown badges */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-outline pt-3">
                  {Object.entries(att.cpmkBreakdown || {}).map(([code, stat]) => (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 rounded-pill bg-surface-sunken px-3 py-1 text-caption"
                    >
                      <strong className="text-ink">{code}:</strong>
                      <span
                        className={`font-mono font-semibold ${
                          stat.percentage >= 80
                            ? "text-leaf-deep"
                            : stat.percentage >= 50
                            ? "text-sun-deep"
                            : "text-coral"
                        }`}
                      >
                        {stat.percentage}%
                      </span>
                    </span>
                  ))}
                </div>

                {/* Expanded Answer List */}
                {isExpanded && (
                  <div className="mt-6 flex flex-col gap-4 border-t border-outline pt-5">
                    <h4 className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                      Rincian Jawaban & Pembahasan
                    </h4>
                    {att.answers.map((ans, idx) => (
                      <div key={idx} className="rounded-input border border-outline bg-surface p-4 text-small">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Soal {idx + 1} ({ans.cpmkCode})</span>
                          <span className={ans.isCorrect ? "text-leaf-deep" : "text-coral"}>
                            {ans.isCorrect ? "Benar" : `+${ans.awardedPoints} poin`}
                          </span>
                        </div>
                        <p className="mt-2 text-caption text-ink-muted">
                          <strong>Jawaban:</strong> {ans.response || "(kosong)"}
                        </p>
                        <p className="mt-2 text-caption text-sky-deep leading-relaxed">
                          <strong>Catatan:</strong> {ans.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}