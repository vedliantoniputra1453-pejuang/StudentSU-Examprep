import type {
  Course,
  CpmkGap,
  Insight,
  SetupStep,
  SkillAxis,
  StatCardData,
  StudyProfile,
} from "@/lib/types";

/**
 * Sample data for the local dashboard. Nothing here is fetched or generated yet;
 * it mirrors the shape the AI layer will fill in later (see PRD.md F8, F9).
 */
export const profile: StudyProfile = {
  name: "Vedli",
  major: "Manajemen",
  semester: 3,
  examLabel: "UTS 15 Desember 2026",
  daysToExam: 42,
};

export const stats: StatCardData[] = [
  { label: "Level pengetahuan", value: "62", unit: "/100", hint: "Rata-rata 12 CPMK aktif", tone: "sky" },
  { label: "CPMK dikuasai", value: "7", unit: "/12", hint: "Ambang kuasai 80%", tone: "leaf" },
  { label: "Latihan selesai", value: "8", unit: "sesi", hint: "3 dalam 7 hari terakhir", tone: "berry" },
  { label: "Jurnal terisi", value: "4", unit: "entri", hint: "Terakhir 2 hari lalu", tone: "sun" },
];

export const courses: Course[] = [
  {
    id: "eko-bisnis",
    code: "MGT201",
    name: "Ekonomi Bisnis",
    sessionDone: 5,
    sessionTotal: 14,
    nextTopic: "Sesi 6 · Struktur pasar",
    accent: "sky",
  },
  {
    id: "akm",
    code: "AKT210",
    name: "Akuntansi Manajemen",
    sessionDone: 3,
    sessionTotal: 14,
    nextTopic: "Sesi 4 · Biaya relevan",
    accent: "leaf",
  },
  {
    id: "man-keu",
    code: "MGT215",
    name: "Manajemen Keuangan",
    sessionDone: 4,
    sessionTotal: 14,
    nextTopic: "Sesi 5 · Nilai waktu uang",
    accent: "berry",
  },
];

/** Ten spokes, tuned to Ekonomi Bisnis CPMK 1-4 and CPL 4/6. */
export const skillAxes: SkillAxis[] = [
  { label: "Penawaran", you: 78, cohort: 70 },
  { label: "Permintaan", you: 84, cohort: 74 },
  { label: "Elastisitas", you: 61, cohort: 66 },
  { label: "Perilaku konsumen", you: 72, cohort: 68 },
  { label: "Biaya produksi", you: 55, cohort: 63 },
  { label: "Struktur pasar", you: 42, cohort: 60 },
  { label: "Analisis investasi", you: 36, cohort: 58 },
  { label: "Kebijakan makro", you: 64, cohort: 67 },
  { label: "Perdagangan internasional", you: 70, cohort: 65 },
  { label: "Etika dan hukum bisnis", you: 81, cohort: 72 },
];

export const cpmkGaps: CpmkGap[] = [
  {
    code: "CPMK 2",
    label: "Maksimalisasi keuntungan pada pasar kompetitif dan non-kompetitif",
    mastery: 38,
    note: "Sering tertukar antara biaya tetap dan biaya variabel saat menghitung laba.",
  },
  {
    code: "CPMK 3",
    label: "Strategi pertumbuhan bisnis dan intervensi pemerintah",
    mastery: 46,
    note: "Belum yakin kapan intervensi harga disebut sebagai price ceiling atau price floor.",
  },
  {
    code: "CPMK 1",
    label: "Elastisitas harga dan perilaku konsumen",
    mastery: 64,
    note: "Rumus elastisitas sudah benar, arah kesimpulannya masih terbalik.",
  },
];

export const setupSteps: SetupStep[] = [
  { label: "Unggah materi sesi 1-5", detail: "PPT dan transkrip Zoom Ekonomi Bisnis", done: true },
  { label: "Tetapkan CPMK dan rubrik", detail: "4 CPMK, rubrik penilaian UTS", done: true },
  { label: "Hubungkan API key", detail: "Dipakai untuk membuat soal latihan", done: false },
];

export const insight: Insight = {
  title: "Elastisitas bukan cuma soal ujian",
  body:
    "Tim pricing memakai elastisitas harga untuk memutuskan kapan diskon menambah omzet dan kapan justru memotong margin. Kalau kamu bisa menjelaskan arah elastisitas dengan tepat, kamu sudah melakukan satu bagian kecil dari pekerjaan itu.",
  source: "Terhubung ke CPMK 1 · Ekonomi Bisnis",
};