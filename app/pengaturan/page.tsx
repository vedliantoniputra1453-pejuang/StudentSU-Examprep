"use client";

import { useState } from "react";
import { testConnection } from "@/lib/ai";
import {
  clearApiKeySetting,
  getApiKeySetting,
  getProfile,
  saveApiKeySetting,
  saveProfile,
} from "@/lib/storage";
import type { ApiKeySetting, ApiProvider, Major, StudyProfile } from "@/lib/types";

const interestOptions = [
  "Bisnis",
  "Teknologi",
  "Olahraga",
  "Musik",
  "Kuliner",
  "Seni",
  "Gaming",
  "Traveling",
];

export default function PengaturanPage() {
  const [profile, setProfileState] = useState<StudyProfile>(() => getProfile());
  const [apiKeySetting, setApiKeySetting] = useState<ApiKeySetting>(() => getApiKeySetting());
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    saveProfile(profile);
    setSaveStatus("Profil dan preferensi personalisasi berhasil disimpan.");
    setTimeout(() => setSaveStatus(null), 3000);
  }

  async function handleTestKey() {
    if (!apiKeySetting) return;
    setTesting(true);
    setTestResult(null);
    const result = await testConnection(apiKeySetting);
    setTesting(false);
    setTestResult(result);
    if (result.ok) {
      const updated = {
        ...apiKeySetting,
        status: "ok" as const,
        lastCheckedAt: new Date().toISOString(),
      };
      setApiKeySetting(updated);
      saveApiKeySetting(updated);
    }
  }

  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKeySetting) return;
    const trimmed = { ...apiKeySetting, key: apiKeySetting.key.trim() };
    saveApiKeySetting(trimmed);
    setSaveStatus("API key berhasil disimpan di browser lokal.");
    setTimeout(() => setSaveStatus(null), 3000);
  }

  function handleClearKey() {
    clearApiKeySetting();
    const reset: ApiKeySetting = {
      provider: "gemini",
      key: "",
      model: "gemini-1.5-flash",
      status: "unset",
      lastCheckedAt: null,
    };
    setApiKeySetting(reset);
    setTestResult(null);
    setSaveStatus("API key telah dihapus dari perangkat ini.");
    setTimeout(() => setSaveStatus(null), 3000);
  }

  function toggleInterest(interest: string) {
    if (!profile) return;
    const current = profile.interests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    setProfileState({ ...profile, interests: updated });
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
          Konfigurasi
        </p>
        <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
          Pengaturan & API Key
        </h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">
          Kelola profil belajar, konteks personalisasi soal, dan API key AI mandiri (BYOK).
          Seluruh konfigurasi hanya tersimpan di perangkat lokalmu.
        </p>
      </header>

      {saveStatus && (
        <div role="status" className="rounded-card border border-leaf-deep/20 bg-leaf-soft px-5 py-3 text-small text-leaf-deep">
          {saveStatus}
        </div>
      )}

      {/* Bagian 1: API Key BYOK */}
      <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-outline pb-4">
          <div>
            <h2 className="font-display text-h3 font-bold">API Key Mandiri (BYOK)</h2>
            <p className="mt-1 text-small text-ink-muted">
              Gunakan key milikmu untuk membuat soal AI. Panggilan jaringan dilakukan langsung dari browsermu.
            </p>
          </div>
          <span
            className={`rounded-pill px-3 py-1 text-caption font-semibold ${
              apiKeySetting.status === "ok"
                ? "bg-leaf-soft text-leaf-deep"
                : apiKeySetting.key
                ? "bg-sun/20 text-ink"
                : "bg-surface-sunken text-ink-muted"
            }`}
          >
            {apiKeySetting.status === "ok"
              ? "Terhubung"
              : apiKeySetting.key
              ? "Belum diuji"
              : "Belum diisi"}
          </span>
        </div>

        <form onSubmit={handleSaveKey} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="provider-select" className="block text-small font-semibold">
                Penyedia AI (Provider)
              </label>
              <select
                id="provider-select"
                value={apiKeySetting.provider}
                onChange={(e) =>
                  setApiKeySetting({
                    ...apiKeySetting,
                    provider: e.target.value as ApiProvider,
                    model: e.target.value === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini",
                  })
                }
                className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
              >
                <option value="gemini">Google Gemini (Disarankan, kuota gratis luas)</option>
                <option value="openai">OpenAI (GPT-4o mini)</option>
              </select>
            </div>

            <div>
              <label htmlFor="model-select" className="block text-small font-semibold">
                Model AI
              </label>
              <select
                id="model-select"
                value={apiKeySetting.model}
                onChange={(e) => setApiKeySetting({ ...apiKeySetting, model: e.target.value })}
                className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
              >
                {apiKeySetting.provider === "gemini" ? (
                  <>
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Cepat dan efisien)</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Generasi terbaru)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Analisis mendalam)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">gpt-4o-mini (Cepat dan hemat biaya)</option>
                    <option value="gpt-4o">gpt-4o (Standar kualitas tinggi)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="api-key-input" className="block text-small font-semibold">
                API Key
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-caption font-medium text-sky-deep hover:underline"
              >
                {showKey ? "Sembunyikan" : "Tampilkan teks"}
              </button>
            </div>
            <input
              id="api-key-input"
              type={showKey ? "text" : "password"}
              value={apiKeySetting.key}
              onChange={(e) => setApiKeySetting({ ...apiKeySetting, key: e.target.value })}
              placeholder={
                apiKeySetting.provider === "gemini"
                  ? "AIzaSy..."
                  : "sk-proj-..."
              }
              className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 font-mono text-small focus:border-sky focus:bg-white"
            />
            <p className="mt-1 text-caption text-ink-muted">
              Key disimpan aman di localStorage browser ini. Jika dikosongkan, aplikasi otomatis menggunakan bank soal kurikulum SU.
            </p>
          </div>

          {testResult && (
            <div
              className={`rounded-card border px-4 py-3 text-small ${
                testResult.ok
                  ? "border-leaf-deep/20 bg-leaf-soft text-leaf-deep"
                  : "border-coral/20 bg-coral-soft text-coral"
              }`}
            >
              {testResult.message}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="min-h-11 rounded-control bg-sky-deep px-5 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
            >
              Simpan API key
            </button>
            <button
              type="button"
              disabled={testing || !apiKeySetting.key}
              onClick={handleTestKey}
              className="min-h-11 rounded-control border border-outline bg-white px-5 text-small font-semibold text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink disabled:opacity-50"
            >
              {testing ? "Menguji koneksi..." : "Uji koneksi"}
            </button>
            {apiKeySetting.key && (
              <button
                type="button"
                onClick={handleClearKey}
                className="min-h-11 rounded-control border border-coral/30 px-4 text-small font-medium text-coral hover:bg-coral-soft"
              >
                Hapus key
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Bagian 2: Profil & Personalisasi Belajar */}
      <section className="rounded-card border border-outline bg-white p-6 lg:p-8">
        <div className="border-b border-outline pb-4">
          <h2 className="font-display text-h3 font-bold">Profil & Personalisasi Belajar</h2>
          <p className="mt-1 text-small text-ink-muted">
            Personalisasi ini dipakai sebagai konteks saat membuat studi kasus dan soal latihan.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="student-name" className="block text-small font-semibold">
                Nama Panggilan
              </label>
              <input
                id="student-name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfileState({ ...profile, name: e.target.value })}
                className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="student-major" className="block text-small font-semibold">
                Program Studi
              </label>
              <select
                id="student-major"
                value={profile.major}
                onChange={(e) => setProfileState({ ...profile, major: e.target.value as Major })}
                className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
              >
                <option value="Manajemen">S1 Manajemen</option>
                <option value="Akuntansi">S1 Akuntansi</option>
              </select>
            </div>

            <div>
              <label htmlFor="student-semester" className="block text-small font-semibold">
                Semester
              </label>
              <input
                id="student-semester"
                type="number"
                min={1}
                max={8}
                value={profile.semester}
                onChange={(e) => setProfileState({ ...profile, semester: Number(e.target.value) })}
                className="mt-2 min-h-11 w-full rounded-input border border-outline bg-surface px-4 text-small focus:border-sky focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-small font-semibold">
              Minat & Hobi (Pilih yang kamu sukai)
            </label>
            <p className="mt-1 text-caption text-ink-muted">
              Soal ekonomi atau akuntansi akan membawakan analogi dari minat yang kamu pilih.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {interestOptions.map((item) => {
                const active = profile.interests?.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleInterest(item)}
                    className={`min-h-11 rounded-pill border px-4 text-small transition-colors duration-200 ${
                      active
                        ? "border-sky-deep bg-sky-soft font-semibold text-sky-deep"
                        : "border-outline bg-white text-ink-muted hover:border-outline-strong"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="custom-prompt" className="block text-small font-semibold">
              Konteks Personalisasi Tambahan (Bebas)
            </label>
            <textarea
              id="custom-prompt"
              rows={3}
              value={profile.customPrompt || ""}
              onChange={(e) => setProfileState({ ...profile, customPrompt: e.target.value })}
              placeholder="Contoh: Saya sedang merintis usaha kopi susu botolan dan aktif di organisasi basket kampus."
              className="mt-2 w-full rounded-input border border-outline bg-surface px-4 py-3 text-small focus:border-sky focus:bg-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="min-h-11 rounded-control bg-sky-deep px-5 text-small font-semibold text-white transition-colors duration-200 hover:bg-sky active:scale-95"
            >
              Simpan profil
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}