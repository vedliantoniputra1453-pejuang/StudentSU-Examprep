"use client";

import { useState } from "react";
import { courses } from "@/lib/mock-data";
import { addMaterial, getCourseCpmks, getMaterials, removeMaterial } from "@/lib/storage";
import type { CPMKItem, MaterialItem } from "@/lib/types";

export default function MateriPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("eko-bisnis");
  const [cpmks, setCpmks] = useState<CPMKItem[]>(() => getCourseCpmks("eko-bisnis"));
  const [materials, setMaterials] = useState<MaterialItem[]>(() => getMaterials("eko-bisnis"));
  const [activeTab, setActiveTab] = useState<"cpmk" | "materials">("cpmk");

  // Form add material
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSession, setNewSession] = useState<number>(1);
  const [newKind, setNewKind] = useState<MaterialItem["kind"]>("transcript");
  const [newText, setNewText] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSelectCourse(courseId: string) {
    setSelectedCourseId(courseId);
    setCpmks(getCourseCpmks(courseId));
    setMaterials(getMaterials(courseId));
  }

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  function handleCreateMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    const item: MaterialItem = {
      id: `mat-${Date.now()}`,
      courseId: selectedCourseId,
      sessionId: Number(newSession),
      kind: newKind,
      title: newTitle.trim(),
      text: newText.trim(),
      charCount: newText.trim().length,
      createdAt: new Date().toISOString(),
    };

    addMaterial(item);
    setMaterials(getMaterials(selectedCourseId));
    setIsAddingMaterial(false);
    setNewTitle("");
    setNewText("");
    setMessage("Materi berhasil ditambahkan ke sesi " + newSession);
    setTimeout(() => setMessage(null), 3000);
  }

  function handleDeleteMaterial(id: string) {
    removeMaterial(id);
    setMaterials(getMaterials(selectedCourseId));
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
          Kurikulum & Bahan Ajar
        </p>
        <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
          Materi & CPMK Kuliah
        </h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">
          Pusat benchmark materi pembelajaran (transkrip Zoom, resume slide, buku teks) dan parameter Capaian Pembelajaran Mata Kuliah (CPMK) beserta rubrik penilaiannya.
        </p>
      </header>

      {message && (
        <div role="status" className="rounded-card border border-leaf-deep/20 bg-leaf-soft px-5 py-3 text-small text-leaf-deep">
          {message}
        </div>
      )}

      {/* Selector Mata Kuliah */}
      <section className="rounded-card border border-outline bg-white p-5">
        <label htmlFor="course-select" className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
          Pilih Mata Kuliah
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {courses.map((c) => {
            const isSelected = c.id === selectedCourseId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCourse(c.id)}
                className={`flex min-h-11 items-center gap-2 rounded-control border px-4 text-small transition-colors duration-200 ${
                  isSelected
                    ? "border-sky-deep bg-sky-soft font-semibold text-sky-deep"
                    : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                }`}
              >
                <span>{c.code} · {c.name}</span>
              </button>
            );
          })}
        </div>

        {currentCourse.textbook && (
          <p className="mt-4 border-t border-outline pt-3 text-caption text-ink-muted">
            <span className="font-semibold">Buku Referensi:</span> {currentCourse.textbook}
          </p>
        )}
      </section>

      {/* Tabs */}
      <div className="flex border-b border-outline">
        <button
          type="button"
          onClick={() => setActiveTab("cpmk")}
          className={`min-h-11 border-b-2 px-6 text-small font-semibold transition-colors duration-200 ${
            activeTab === "cpmk"
              ? "border-sky-deep text-sky-deep"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Daftar CPMK & Rubrik Penilaian ({cpmks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("materials")}
          className={`min-h-11 border-b-2 px-6 text-small font-semibold transition-colors duration-200 ${
            activeTab === "materials"
              ? "border-sky-deep text-sky-deep"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Bahan Ajar & Transkrip ({materials.length})
        </button>
      </div>

      {/* Tab Content: CPMK */}
      {activeTab === "cpmk" && (
        <div className="flex flex-col gap-6">
          {cpmks.length === 0 ? (
            <div className="rounded-card border border-outline bg-surface p-8 text-center text-small text-ink-muted">
              Belum ada CPMK untuk mata kuliah ini.
            </div>
          ) : (
            cpmks.map((cpmk) => (
              <article key={cpmk.id} className="rounded-card border border-outline bg-white p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-outline pb-4">
                  <div>
                    <span className="rounded-pill bg-sky-soft px-3 py-1 font-mono text-caption font-bold text-sky-deep">
                      {cpmk.code}
                    </span>
                    <h2 className="mt-2 font-display text-h4 font-bold">{cpmk.title}</h2>
                  </div>
                  <span className="text-caption text-ink-muted">
                    Cakupan Sesi: {cpmk.sessions.join(", ")}
                  </span>
                </div>

                <p className="mt-4 text-small text-ink-muted leading-relaxed">
                  {cpmk.description}
                </p>

                {/* Rubrik Penilaian */}
                {cpmk.criteria.length > 0 && (
                  <div className="mt-6 border-t border-outline pt-4">
                    <h3 className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                      Indikator Rubrik Penilaian
                    </h3>
                    <div className="mt-3 flex flex-col gap-4">
                      {cpmk.criteria.map((crit, idx) => (
                        <div key={idx} className="rounded-input border border-outline bg-surface p-4">
                          <div className="flex items-center justify-between text-small font-semibold">
                            <span>{crit.indicator}</span>
                            <span className="font-mono text-caption text-sky-deep">Bobot {crit.weight}%</span>
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {crit.levels.map((lvl) => (
                              <div key={lvl.label} className="rounded-input bg-white p-2.5 text-caption border border-outline">
                                <div className="flex items-center justify-between font-semibold">
                                  <span className={lvl.label === "Excellent" ? "text-leaf-deep" : lvl.label === "Poor" ? "text-coral" : "text-ink"}>
                                    {lvl.label}
                                  </span>
                                  <span className="font-mono text-ink-muted">{lvl.scoreRange}</span>
                                </div>
                                <p className="mt-1 text-ink-muted leading-normal">{lvl.descriptor}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Materials */}
      {activeTab === "materials" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-small text-ink-muted">
              Materi ini dianalisis oleh AI untuk merumuskan soal berbasis konteks nyata perkuliahan.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingMaterial(!isAddingMaterial)}
              className="min-h-11 rounded-control bg-sky-deep px-5 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky"
            >
              {isAddingMaterial ? "Tutup formulir" : "+ Tambah materi manual"}
            </button>
          </div>

          {/* Form Tambah Materi */}
          {isAddingMaterial && (
            <form onSubmit={handleCreateMaterial} className="rounded-card border border-sky-deep/30 bg-sky-soft/20 p-6">
              <h2 className="font-display text-h4 font-bold">Input Materi / Transkrip Baru</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label htmlFor="material-title" className="block text-small font-semibold">Judul Materi</label>
                  <input
                    id="material-title"
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Transkrip Zoom Sesi 3 - Elastisitas Permintaan"
                    className="mt-1 min-h-11 w-full rounded-input border border-outline bg-white px-4 text-small focus:border-sky"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="material-session" className="block text-small font-semibold">Sesi Perkuliahan</label>
                  <input
                    id="material-session"
                    type="number"
                    min={1}
                    max={16}
                    value={newSession}
                    onChange={(e) => setNewSession(Number(e.target.value))}
                    className="mt-1 min-h-11 w-full rounded-input border border-outline bg-white px-4 text-small focus:border-sky"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="material-kind" className="block text-small font-semibold">Jenis Bahan</label>
                <select
                  id="material-kind"
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value as MaterialItem["kind"])}
                  className="mt-1 min-h-11 w-full rounded-input border border-outline bg-white px-4 text-small focus:border-sky"
                >
                  <option value="transcript">Transkrip Kuliah / Zoom</option>
                  <option value="slides">Ringkasan Slide / PPT</option>
                  <option value="pdf">Catatan Bacaan / PDF</option>
                  <option value="book">Kutipan Buku Teks</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="material-text" className="block text-small font-semibold">Teks Materi / Transkrip</label>
                <textarea
                  id="material-text"
                  rows={6}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Tempel teks transkrip pembicaraan dosen atau ringkasan poin PPT di sini..."
                  className="mt-1 w-full rounded-input border border-outline bg-white px-4 py-3 text-small focus:border-sky"
                  required
                />
                <p className="mt-1 text-caption text-ink-muted">
                  Panjang karakter: {newText.length} (~{Math.round(newText.length / 4)} estimasi token).
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="min-h-11 rounded-control bg-sky-deep px-5 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky"
                >
                  Simpan materi
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingMaterial(false)}
                  className="min-h-11 rounded-control border border-outline bg-white px-4 text-small font-semibold text-ink-muted hover:bg-surface"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* List Materi */}
          <div className="grid grid-cols-1 gap-4">
            {materials.map((mat) => (
              <div key={mat.id} className="rounded-card border border-outline bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-pill bg-surface-sunken px-2.5 py-0.5 text-caption font-semibold uppercase text-ink-muted">
                        Sesi {mat.sessionId} · {mat.kind}
                      </span>
                    </div>
                    <h3 className="mt-2 text-small font-bold">{mat.title}</h3>
                  </div>
                  {mat.kind !== "default" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMaterial(mat.id)}
                      className="text-caption font-medium text-coral hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <p className="mt-3 line-clamp-3 text-caption text-ink-muted leading-relaxed">
                  {mat.text}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-outline pt-2 text-caption text-ink-muted">
                  <span>{mat.charCount} karakter</span>
                  <span>{new Date(mat.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}