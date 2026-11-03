"use client";

import { useState } from "react";
import Link from "next/link";
import { generateExamQuestions } from "@/lib/ai";
import { courses } from "@/lib/mock-data";
import {
  getApiKeySetting,
  getCourseCpmks,
  getMaterials,
  getProfile,
  saveAttempt,
} from "@/lib/storage";
import type {
  ApiKeySetting,
  AssessmentScope,
  Attempt,
  AttemptAnswer,
  CPMKItem,
  MaterialItem,
  Question,
  StudyProfile,
} from "@/lib/types";

type Phase = "config" | "loading" | "quiz" | "result";

export default function LatihanPage() {
  const [phase, setPhase] = useState<Phase>("config");

  // Config state
  const [selectedCourseId, setSelectedCourseId] = useState("eko-bisnis");
  const [examType, setExamType] = useState<"uts" | "uas">("uts");
  const [sessionFrom, setSessionFrom] = useState(1);
  const [sessionTo, setSessionTo] = useState(7);
  const [format, setFormat] = useState<"multiple-choice" | "essay">("multiple-choice");
  const [questionCount, setQuestionCount] = useState(4);
  const [style, setStyle] = useState<"interest" | "campus" | "neutral">("interest");
  const [blueprintText, setBlueprintText] = useState("");

  // Running state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [generationWarning, setGenerationWarning] = useState<string | null>(null);
  const [completedAttempt, setCompletedAttempt] = useState<Attempt | null>(null);

  // App context initialized safely from local storage / defaults
  const [profile] = useState<StudyProfile>(() => getProfile());
  const [apiKeySetting] = useState<ApiKeySetting>(() => getApiKeySetting());
  const [cpmks, setCpmks] = useState<CPMKItem[]>(() => getCourseCpmks("eko-bisnis"));
  const [materials, setMaterials] = useState<MaterialItem[]>(() => getMaterials("eko-bisnis"));

  function handleCourseChange(courseId: string) {
    setSelectedCourseId(courseId);
    setCpmks(getCourseCpmks(courseId));
    setMaterials(getMaterials(courseId));
  }

  function handleExamTypeChange(type: "uts" | "uas") {
    setExamType(type);
    if (type === "uts") {
      setSessionFrom(1);
      setSessionTo(7);
    } else {
      setSessionFrom(8);
      setSessionTo(14);
    }
  }

  const activeCpmks = cpmks.filter((c) =>
    c.sessions.some((s) => s >= sessionFrom && s <= sessionTo)
  );

  async function handleStartGeneration(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !apiKeySetting) return;

    if (sessionFrom > sessionTo) {
      alert("Sesi awal harus lebih kecil atau sama dengan sesi akhir.");
      return;
    }

    setPhase("loading");
    setGenerationWarning(null);

    const scope: AssessmentScope = {
      courseId: selectedCourseId,
      type: examType,
      sessionFrom,
      sessionTo,
      blueprintText: blueprintText.trim() || undefined,
      cpmkCodes: activeCpmks.map((c) => c.code),
    };

    const res = await generateExamQuestions(
      {
        scope,
        cpmks: activeCpmks,
        materials,
        profile,
        style,
        format,
        count: questionCount,
      },
      apiKeySetting
    );

    if (res.questions.length === 0) {
      alert("Gagal merumuskan soal. Silakan coba kembali atau periksa koneksi.");
      setPhase("config");
      return;
    }

    setQuestions(res.questions);
    if (res.warning) {
      setGenerationWarning(res.warning);
    }
    setUserAnswers({});
    setPhase("quiz");
  }

  function handleSelectOption(qId: string, optionId: string) {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionId }));
  }

  function handleSetEssayAnswer(qId: string, text: string) {
    setUserAnswers((prev) => ({ ...prev, [qId]: text }));
  }

  function handleSubmitQuiz() {
    const totalPossiblePoints = questions.reduce((sum, q) => sum + q.rubricPoints, 0);
    let totalEarned = 0;
    const cpmkAccumulator: Record<string, { awarded: number; max: number }> = {};

    const attemptAnswers: AttemptAnswer[] = questions.map((q) => {
      const response = userAnswers[q.id] || "";
      let awarded = 0;
      let isCorrect: boolean | undefined = undefined;

      if (q.format === "multiple-choice") {
        isCorrect = response === q.correctOptionId;
        awarded = isCorrect ? q.rubricPoints : 0;
      } else {
        // ponytail: deterministic essay length scoring fallback pending AI rubric evaluation
        const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount >= 20) {
          awarded = q.rubricPoints;
        } else if (wordCount >= 10) {
          awarded = Math.round(q.rubricPoints * 0.6);
        } else {
          awarded = Math.round(q.rubricPoints * 0.3);
        }
      }

      totalEarned += awarded;

      if (!cpmkAccumulator[q.cpmkCode]) {
        cpmkAccumulator[q.cpmkCode] = { awarded: 0, max: 0 };
      }
      cpmkAccumulator[q.cpmkCode].awarded += awarded;
      cpmkAccumulator[q.cpmkCode].max += q.rubricPoints;

      return {
        questionId: q.id,
        cpmkCode: q.cpmkCode,
        response,
        isCorrect,
        awardedPoints: awarded,
        maxPoints: q.rubricPoints,
        feedback: q.explanation,
        evaluatedBy: q.format === "multiple-choice" ? "auto-key" : "self",
      };
    });

    const finalScore = Math.round((totalEarned / (totalPossiblePoints || 1)) * 100);

    const cpmkBreakdown: Record<string, { awarded: number; max: number; percentage: number }> = {};
    for (const [code, stat] of Object.entries(cpmkAccumulator)) {
      cpmkBreakdown[code] = {
        awarded: stat.awarded,
        max: stat.max,
        percentage: Math.round((stat.awarded / (stat.max || 1)) * 100),
      };
    }

    const currentCourse = courses.find((c) => c.id === selectedCourseId);

    const attempt: Attempt = {
      id: `att-${Date.now()}`,
      questionSetId: `qs-${Date.now()}`,
      courseId: selectedCourseId,
      courseName: currentCourse ? currentCourse.name : selectedCourseId,
      examType,
      format,
      answers: attemptAnswers,
      totalScore: finalScore,
      submittedAt: new Date().toISOString(),
      cpmkBreakdown,
    };

    saveAttempt(attempt);
    setCompletedAttempt(attempt);
    setPhase("result");
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
          Persiapan Ujian Mandiri
        </p>
        <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
          Latihan Soal & Prediksi UTS/UAS
        </h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">
          Generate potensi soal latihan berdasarkan kurikulum resmi, transkrip perkuliahan, dan rubrik penilaian CPMK Satu University.
        </p>
      </header>

      {/* PHASE 1: CONFIGURATION */}
      {phase === "config" && (
        <form onSubmit={handleStartGeneration} className="flex flex-col gap-6">
          <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
            <h2 className="font-display text-h3 font-bold">1. Parameter Ujian</h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="course-select-exam" className="block text-small font-semibold">
                  Mata Kuliah
                </label>
                <select
                  id="course-select-exam"
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} · {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-small font-semibold">Jenis Ujian</label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleExamTypeChange("uts")}
                    className={`flex-1 min-h-11 rounded-control border text-small font-semibold transition-colors ${
                      examType === "uts"
                        ? "border-sky-deep bg-sky-soft text-sky-deep"
                        : "border-outline bg-white text-ink-muted"
                    }`}
                  >
                    UTS (Sesi 1–7)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExamTypeChange("uas")}
                    className={`flex-1 min-h-11 rounded-control border text-small font-semibold transition-colors ${
                      examType === "uas"
                        ? "border-sky-deep bg-sky-soft text-sky-deep"
                        : "border-outline bg-white text-ink-muted"
                    }`}
                  >
                    UAS (Sesi 8–14)
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="session-range" className="block text-small font-semibold">
                  Rentang Sesi Perkuliahan
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={sessionFrom}
                    onChange={(e) => setSessionFrom(Number(e.target.value))}
                    className="min-h-11 w-24 rounded-input border border-outline bg-surface px-3 text-center text-small focus:border-sky focus:bg-white"
                  />
                  <span className="text-caption text-ink-muted">sampai sesi</span>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={sessionTo}
                    onChange={(e) => setSessionTo(Number(e.target.value))}
                    className="min-h-11 w-24 rounded-input border border-outline bg-surface px-3 text-center text-small focus:border-sky focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="format-select" className="block text-small font-semibold">
                  Bentuk & Jumlah Soal
                </label>
                <div className="mt-2 flex gap-3">
                  <select
                    id="format-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as "multiple-choice" | "essay")}
                    className="flex-1 min-h-11 rounded-input border border-outline bg-surface px-3 text-small focus:border-sky focus:bg-white"
                  >
                    <option value="multiple-choice">Pilihan Ganda (PG)</option>
                    <option value="essay">Esai Analitis</option>
                  </select>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-28 min-h-11 rounded-input border border-outline bg-surface px-3 text-small focus:border-sky focus:bg-white"
                  >
                    <option value={3}>3 Soal</option>
                    <option value={4}>4 Soal</option>
                    <option value={5}>5 Soal</option>
                    <option value={8}>8 Soal</option>
                    <option value={10}>10 Soal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CPMK Coverage Preview */}
            <div className="mt-6 rounded-input bg-surface-sunken p-4 border border-outline">
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                CPMK yang tercakup dalam sesi {sessionFrom}–{sessionTo}:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeCpmks.length > 0 ? (
                  activeCpmks.map((c) => (
                    <span key={c.id} className="rounded-pill bg-white px-3 py-1 text-caption border border-outline">
                      <strong className="text-sky-deep">{c.code}:</strong> {c.title}
                    </span>
                  ))
                ) : (
                  <span className="text-caption text-coral">
                    Tidak ada CPMK yang terhubung langsung pada rentang sesi ini.
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
            <h2 className="font-display text-h3 font-bold">2. Gaya Personalisasi Soal</h2>
            <p className="mt-1 text-small text-ink-muted">
              Pilih bagaimana soal mengemas studi kasus agar relevan dan menarik dipelajari.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setStyle("interest")}
                className={`flex flex-col text-left rounded-card border p-4 transition-colors ${
                  style === "interest"
                    ? "border-sky-deep bg-sky-soft/30 text-ink"
                    : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                }`}
              >
                <span className="font-semibold text-small">Minat & Hobi Pribadi</span>
                <span className="mt-1 text-caption text-ink-muted">
                  Mengaitkan soal dengan minat profilmu ({profile?.interests?.join(", ") || "Hobi"}).
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStyle("campus")}
                className={`flex flex-col text-left rounded-card border p-4 transition-colors ${
                  style === "campus"
                    ? "border-sky-deep bg-sky-soft/30 text-ink"
                    : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                }`}
              >
                <span className="font-semibold text-small">Lingkungan Kampus SU</span>
                <span className="mt-1 text-caption text-ink-muted">
                  Studi kasus kafe kampus, koperasi mahasiswa, dan kegiatan bisnis intra-kampus.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStyle("neutral")}
                className={`flex flex-col text-left rounded-card border p-4 transition-colors ${
                  style === "neutral"
                    ? "border-sky-deep bg-sky-soft/30 text-ink"
                    : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                }`}
              >
                <span className="font-semibold text-small">Netral Akademik</span>
                <span className="mt-1 text-caption text-ink-muted">
                  Format formal baku mirip lembar ujian resmi dosen tanpa studi kasus informal.
                </span>
              </button>
            </div>

            <div className="mt-6">
              <label htmlFor="blueprint-input" className="block text-small font-semibold">
                Kisi-kisi Tambahan Dosen (Opsional)
              </label>
              <textarea
                id="blueprint-input"
                rows={2}
                value={blueprintText}
                onChange={(e) => setBlueprintText(e.target.value)}
                placeholder="Jika dosen memberikan kisi-kisi atau penekanan bab tertentu, tempel di sini..."
                className="mt-2 w-full rounded-input border border-outline bg-surface px-4 py-2.5 text-small focus:border-sky focus:bg-white"
              />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-outline pt-6">
              <span className="text-caption text-ink-muted">
                {apiKeySetting?.status === "ok"
                  ? `Menggunakan AI ${apiKeySetting.provider} (${apiKeySetting.model})`
                  : "Menggunakan bank soal kurikulum SU (mode lokal)"}
              </span>
              <button
                type="submit"
                className="min-h-11 rounded-control bg-sky-deep px-6 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
              >
                Buat {questionCount} soal latihan
              </button>
            </div>
          </section>
        </form>
      )}

      {/* PHASE 2: LOADING */}
      {phase === "loading" && (
        <div className="rounded-card border border-outline bg-white p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-soft border-t-sky-deep" />
          <h2 className="mt-4 font-display text-h3 font-bold">Menyusun Soal Latihan</h2>
          <p className="mt-2 text-small text-ink-muted max-w-md mx-auto">
            Menganalisis indikator CPMK, materi perkuliahan, dan konteks personalisasi. Biasanya memerlukan 5–15 detik...
          </p>
        </div>
      )}

      {/* PHASE 3: TAKING QUIZ */}
      {phase === "quiz" && (
        <div className="flex flex-col gap-6">
          {generationWarning && (
            <div className="rounded-card border border-sun-deep/30 bg-sun/10 px-5 py-3 text-small text-ink">
              {generationWarning}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-small font-semibold text-ink-muted">
              Total {questions.length} Soal · Format {format === "multiple-choice" ? "Pilihan Ganda" : "Esai"}
            </span>
            <button
              type="button"
              onClick={() => {
                if (confirm("Yakin ingin membatalkan latihan ini?")) {
                  setPhase("config");
                }
              }}
              className="text-caption text-coral hover:underline"
            >
              Batalkan latihan
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {questions.map((q, idx) => (
              <article key={q.id} className="rounded-card border border-outline bg-white p-6">
                <div className="flex items-center justify-between border-b border-outline pb-3">
                  <span className="font-display text-small font-bold text-sky-deep">
                    Soal {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-pill bg-sky-soft px-2.5 py-0.5 font-mono text-caption font-semibold text-sky-deep">
                      {q.cpmkCode}
                    </span>
                    <span className="text-caption text-ink-muted font-mono">
                      Bobot {q.rubricPoints} poin
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-small text-ink leading-relaxed font-medium">
                  {q.prompt}
                </p>

                {/* Multiple Choice Options */}
                {q.format === "multiple-choice" && q.options && (
                  <div className="mt-5 flex flex-col gap-2.5">
                    {q.options.map((opt) => {
                      const isSelected = userAnswers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`flex items-start gap-3 rounded-control border p-3.5 text-left text-small transition-colors ${
                            isSelected
                              ? "border-sky-deep bg-sky-soft/40 text-ink font-semibold"
                              : "border-outline bg-surface hover:border-outline-strong text-ink-muted"
                          }`}
                        >
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-pill font-mono text-caption ${
                              isSelected
                                ? "bg-sky-deep text-white font-bold"
                                : "bg-white text-ink-muted border border-outline"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="mt-0.5 leading-snug">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Essay Answer Input */}
                {q.format === "essay" && (
                  <div className="mt-4">
                    <label htmlFor={`essay-${q.id}`} className="block text-caption font-semibold uppercase text-ink-muted">
                      Jawaban Analisis Kamu
                    </label>
                    <textarea
                      id={`essay-${q.id}`}
                      rows={5}
                      value={userAnswers[q.id] || ""}
                      onChange={(e) => handleSetEssayAnswer(q.id, e.target.value)}
                      placeholder="Uraikan jawaban dan argumen ekonomimu berdasarkan konsep terkait..."
                      className="mt-2 w-full rounded-input border border-outline bg-surface p-4 text-small focus:border-sky focus:bg-white"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSubmitQuiz}
              className="min-h-11 rounded-control bg-sky-deep px-8 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
            >
              Kumpulkan & Nilai Jawaban
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: RESULT & FEEDBACK */}
      {phase === "result" && completedAttempt && (
        <div className="flex flex-col gap-8">
          <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-outline pb-5">
              <div>
                <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
                  Hasil Evaluasi · {completedAttempt.courseName}
                </p>
                <h2 className="mt-1 font-display text-h3 font-bold">
                  Skor Latihan: {completedAttempt.totalScore}/100
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhase("config")}
                  className="min-h-11 rounded-control bg-sky-deep px-5 text-small font-semibold text-white hover:bg-sky"
                >
                  Latihan Baru
                </button>
                <Link
                  href="/riwayat"
                  className="flex min-h-11 items-center rounded-control border border-outline bg-white px-5 text-small font-semibold text-ink-muted hover:bg-surface"
                >
                  Lihat Riwayat
                </Link>
              </div>
            </div>

            {/* Breakdown per CPMK */}
            <div className="mt-6">
              <h3 className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                Penguasaan per CPMK pada Sesi Ini
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(completedAttempt.cpmkBreakdown).map(([cCode, stat]) => (
                  <div key={cCode} className="rounded-input border border-outline bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-small">{cCode}</span>
                      <span
                        className={`font-mono text-small font-bold ${
                          stat.percentage >= 80
                            ? "text-leaf-deep"
                            : stat.percentage >= 50
                            ? "text-sun-deep"
                            : "text-coral"
                        }`}
                      >
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-surface-sunken">
                      <div
                        className={`h-full rounded-pill ${
                          stat.percentage >= 80 ? "bg-leaf" : stat.percentage >= 50 ? "bg-sun" : "bg-coral"
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pembahasan Soal */}
          <section className="flex flex-col gap-4">
            <h3 className="font-display text-h4 font-bold">Pembahasan & Catatan Perbaikan</h3>
            {questions.map((q, idx) => {
              const ans = completedAttempt.answers.find((a) => a.questionId === q.id);
              const isCorrect = ans?.isCorrect;

              return (
                <div key={q.id} className="rounded-card border border-outline bg-white p-6">
                  <div className="flex items-center justify-between border-b border-outline pb-3">
                    <span className="font-display text-small font-bold">Soal {idx + 1}</span>
                    <span
                      className={`rounded-pill px-3 py-0.5 text-caption font-semibold ${
                        isCorrect
                          ? "bg-leaf-soft text-leaf-deep"
                          : q.format === "essay"
                          ? "bg-sky-soft text-sky-deep"
                          : "bg-coral-soft text-coral"
                      }`}
                    >
                      {isCorrect
                        ? "Benar (+25 poin)"
                        : q.format === "essay"
                        ? `Evaluasi Esai (+${ans?.awardedPoints} poin)`
                        : "Kurang Tepat (0 poin)"}
                    </span>
                  </div>

                  <p className="mt-3 text-small text-ink">{q.prompt}</p>

                  <div className="mt-4 rounded-input bg-surface p-4 text-small border border-outline">
                    <p className="text-caption font-semibold text-ink-muted uppercase">
                      Jawaban Kamu:
                    </p>
                    <p className="mt-1 font-medium">
                      {q.format === "multiple-choice"
                        ? `Opsi ${ans?.response || "Tidak dijawab"}: ${
                            q.options?.find((o) => o.id === ans?.response)?.text || "-"
                          }`
                        : ans?.response || "Tidak diisi"}
                    </p>

                    {q.format === "multiple-choice" && !isCorrect && (
                      <p className="mt-3 text-caption font-semibold text-leaf-deep uppercase">
                        Kunci Jawaban yang Tepat: Opsi {q.correctOptionId} (
                        {q.options?.find((o) => o.id === q.correctOptionId)?.text})
                      </p>
                    )}
                  </div>

                  <div className="mt-3 rounded-input bg-sky-soft/20 p-4 text-small border border-sky-deep/20">
                    <p className="text-caption font-semibold text-sky-deep uppercase">
                      Pembahasan & Penjelasan Konsep:
                    </p>
                    <p className="mt-1 text-ink-muted leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </div>
  );
}