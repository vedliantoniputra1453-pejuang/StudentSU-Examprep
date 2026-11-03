"use client";

import { useState } from "react";
import { getProfile, getTickets, saveTicket } from "@/lib/storage";
import type { StudyProfile, Ticket, TicketType } from "@/lib/types";

export default function TiketPage() {
  const [tickets, setTickets] = useState<Ticket[]>(() => getTickets());
  const [profile] = useState<StudyProfile>(() => getProfile());

  const [type, setType] = useState<TicketType>("feedback");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState<Ticket | null>(null);
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticketId = `SU-${todayStr}-${randomSuffix}`;

    const newTicket: Ticket = {
      id: ticketId,
      type,
      title: title.trim(),
      description: description.trim(),
      context: {
        major: profile ? profile.major : "Umum",
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent.slice(0, 100) : "Browser",
        version: "v0.1.0-local",
      },
      createdAt: new Date().toISOString(),
      status: "open",
    };

    saveTicket(newTicket);
    setTickets(getTickets());
    setLastSubmittedTicket(newTicket);
    setTitle("");
    setDescription("");
  }

  function getFormattedTicket(ticket: Ticket): string {
    return `[TICKET ${ticket.id}] ${ticket.title}
Jenis: ${ticket.type}
Program Studi: ${ticket.context.major}
Versi: ${ticket.context.version}
Waktu: ${ticket.createdAt}

Deskripsi Masukan:
${ticket.description}
`;
  }

  function handleCopy(ticket: Ticket) {
    const text = getFormattedTicket(ticket);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function getGitHubIssueUrl(ticket: Ticket): string {
    const issueTitle = encodeURIComponent(`[${ticket.type.toUpperCase()}] ${ticket.title}`);
    const issueBody = encodeURIComponent(getFormattedTicket(ticket));
    return `https://github.com/vedliantoniputra1453-pejuang/StudentSU-Examprep/issues/new?title=${issueTitle}&body=${issueBody}`;
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
          Pusat Aspirasi & Bantuan
        </p>
        <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
          Tiket Bantuan & Masukan Developer
        </h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">
          Kirim laporan kendala teknis atau usulan penambahan fitur. Tiketmu dapat disalin atau langsung dibuka sebagai issue di repositori GitHub StudentSU.
        </p>
      </header>

      {/* Sukses banner */}
      {lastSubmittedTicket && (
        <section className="rounded-card border border-leaf-deep/20 bg-leaf-soft p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="font-mono text-caption font-bold text-leaf-deep">
                ID Tiket: {lastSubmittedTicket.id}
              </span>
              <h2 className="mt-1 font-display text-h4 font-bold text-ink">
                Tiket berhasil dibuat dan tersimpan
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCopy(lastSubmittedTicket)}
                className="min-h-11 rounded-control bg-white px-4 text-small font-semibold text-leaf-deep border border-leaf-deep/30 hover:bg-leaf-soft"
              >
                {copied ? "Format tersalin!" : "Salin format tiket"}
              </button>
              <a
                href={getGitHubIssueUrl(lastSubmittedTicket)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center rounded-control bg-sky-deep px-5 text-small font-semibold text-white hover:bg-sky"
              >
                Buka issue di GitHub
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Form Buat Tiket */}
      <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
        <h2 className="font-display text-h3 font-bold">Kirim Masukan atau Laporan</h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div>
            <label className="block text-small font-semibold">Jenis Tiket</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {(
                [
                  { id: "feedback", label: "Saran & Masukan" },
                  { id: "feature", label: "Permintaan Fitur Baru" },
                  { id: "bug", label: "Laporan Kendala / Bug" },
                ] as const
              ).map((t) => {
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setType(t.id)}
                    className={`min-h-11 rounded-pill border px-4 text-small transition-colors ${
                      active
                        ? "border-sky-deep bg-sky-soft font-semibold text-sky-deep"
                        : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="ticket-title" className="block text-small font-semibold">
              Judul Masukan
            </label>
            <input
              id="ticket-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Perlu opsi unduh soal latihan ke format PDF untuk dicetak"
              className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="ticket-desc" className="block text-small font-semibold">
              Rincian Informasi & Langkah Masalah
            </label>
            <textarea
              id="ticket-desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kebutuhanmu atau langkah-langkah yang menyebabkan kendala tersebut muncul..."
              className="mt-2 w-full rounded-input border border-outline bg-surface p-4 text-small focus:border-sky focus:bg-white"
              required
            />
          </div>

          <div className="rounded-input bg-surface-sunken p-3 text-caption text-ink-muted border border-outline">
            Konteks aman yang otomatis disertakan: Jurusan ({profile?.major || "Manajemen"}), versi sistem (v0.1.0-local). Catatan jurnal dan API key tidak pernah disertakan.
          </div>

          <div>
            <button
              type="submit"
              className="min-h-11 rounded-control bg-sky-deep px-6 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
            >
              Simpan tiket
            </button>
          </div>
        </form>
      </section>

      {/* Daftar Tiket */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-h4 font-bold">Daftar Tiket Tersimpan ({tickets.length})</h2>

        {tickets.length === 0 ? (
          <div className="rounded-card border border-outline bg-surface p-8 text-center text-small text-ink-muted">
            Belum ada tiket yang diajukan.
          </div>
        ) : (
          tickets.map((t) => (
            <article key={t.id} className="rounded-card border border-outline bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-outline pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-caption font-bold text-sky-deep">{t.id}</span>
                    <span className="rounded-pill bg-surface-sunken px-2.5 py-0.5 text-caption font-semibold uppercase text-ink-muted">
                      {t.type}
                    </span>
                  </div>
                  <h3 className="mt-2 text-small font-bold">{t.title}</h3>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(t)}
                    className="min-h-11 rounded-control border border-outline bg-surface px-4 text-caption font-semibold text-ink-muted hover:text-ink"
                  >
                    Salin
                  </button>
                  <a
                    href={getGitHubIssueUrl(t)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center rounded-control bg-sky-soft px-4 text-caption font-semibold text-sky-deep hover:bg-sky-bright/20"
                  >
                    GitHub Issue
                  </a>
                </div>
              </div>

              <p className="mt-3 text-caption text-ink-muted leading-relaxed whitespace-pre-wrap">
                {t.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-caption text-ink-muted border-t border-outline pt-2">
                <span>Program Studi: {t.context.major}</span>
                <span>{new Date(t.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}