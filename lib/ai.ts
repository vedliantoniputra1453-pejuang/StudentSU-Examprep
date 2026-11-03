import type {
  ApiKeySetting,
  AssessmentScope,
  CPMKItem,
  MaterialItem,
  Question,
  StudyProfile,
} from "@/lib/types";
import { curatedQuestions } from "@/lib/mock-data";

export type GenerateOptions = {
  scope: AssessmentScope;
  cpmks: CPMKItem[];
  materials: MaterialItem[];
  profile: StudyProfile;
  style: "interest" | "campus" | "learning-style" | "neutral";
  format: "multiple-choice" | "essay";
  count: number;
};

export type GenerateResult = {
  questions: Question[];
  source: "api" | "curated";
  provider?: string;
  model?: string;
  warning?: string;
};

export async function testConnection(setting: ApiKeySetting): Promise<{ ok: boolean; message: string }> {
  const key = setting.key.trim();
  if (!key) {
    return { ok: false, message: "API key masih kosong." };
  }

  try {
    if (setting.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 400 || res.status === 403) {
          return { ok: false, message: "API key Gemini ditolak atau tidak memiliki akses (HTTP " + res.status + ")." };
        }
        return { ok: false, message: `Provider merespons status ${res.status}.` };
      }
      return { ok: true, message: "Koneksi ke Google Gemini berhasil." };
    } else {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          return { ok: false, message: "API key OpenAI tidak valid (HTTP 401)." };
        }
        return { ok: false, message: `Provider merespons status ${res.status}.` };
      }
      return { ok: true, message: "Koneksi ke OpenAI API berhasil." };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: "Gagal menghubungi server penyedia: " + msg };
  }
}

export async function generateExamQuestions(
  opts: GenerateOptions,
  apiSetting: ApiKeySetting
): Promise<GenerateResult> {
  const key = apiSetting.key.trim();

  // If no key is set or format is not matching, use curated bank
  if (!key || apiSetting.status === "invalid") {
    return getCuratedFallback(opts, "API key belum diatur. Menggunakan bank soal terverifikasi kurikulum SU.");
  }

  const prompt = buildPrompt(opts);

  try {
    let rawText = "";
    if (apiSetting.provider === "gemini") {
      const model = apiSetting.model || "gemini-1.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API mengembalikan status ${response.status}`);
      }
      const data = await response.json();
      rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      const model = apiSetting.model || "gpt-4o-mini";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "Kamu adalah penyusun soal ujian akademik Satu University (SU). Output WAJIB berupa JSON murni sesuai format yang diminta.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API mengembalikan status ${response.status}`);
      }
      const data = await response.json();
      rawText = data?.choices?.[0]?.message?.content || "";
    }

    const validatedQuestions = parseAndValidateQuestions(rawText, opts);
    if (validatedQuestions.length > 0) {
      return {
        questions: validatedQuestions,
        source: "api",
        provider: apiSetting.provider,
        model: apiSetting.model,
      };
    }

    return getCuratedFallback(opts, "Respons model tidak lolos validasi skema. Menggunakan bank soal kurikulum SU.");
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan jaringan.";
    return getCuratedFallback(opts, `Gagal memanggil API (${msg}). Menggunakan bank soal kurikulum SU.`);
  }
}

function buildPrompt(opts: GenerateOptions): string {
  const cpmkSummary = opts.cpmks
    .filter((c) => opts.scope.cpmkCodes.includes(c.code))
    .map(
      (c) =>
        `- ${c.code}: ${c.title} — ${c.description} (Cakupan sesi: ${c.sessions.join(", ")})`
    )
    .join("\n");

  const materialExcerpts = opts.materials
    .filter((m) => m.sessionId === null || (m.sessionId >= opts.scope.sessionFrom && m.sessionId <= opts.scope.sessionTo))
    .map((m) => `[${m.title}]: ${m.text}`)
    .join("\n\n");

  const styleContext =
    opts.style === "interest" && opts.profile.customPrompt
      ? `Gaya personalisasi minat: Gunakan analogi atau studi kasus yang relevan dengan: "${opts.profile.customPrompt}".`
      : opts.style === "campus"
      ? "Gaya personalisasi kampus: Gunakan studi kasus operasional nyata lingkungan kampus Satu University (kafe kampus, koperasi, kepanitiaan festival mahasiswa)."
      : "Gaya netral: Gunakan format soal ujian formal standar akademik.";

  return `
Buat ${opts.count} soal latihan ujian ${opts.scope.type.toUpperCase()} (cakupan sesi ${opts.scope.sessionFrom}-${opts.scope.sessionTo}) dalam format ${opts.format === "multiple-choice" ? "Pilihan Ganda (4 opsi A, B, C, D dengan 1 kunci jawaban)" : "Esai analitis dengan kriteria penilaian"}.

MATA KULIAH: ${opts.scope.courseId}
CPMK YANG DIUJI:
${cpmkSummary || "- CPMK Umum Ekonomi Bisnis"}

MATERI REFERENSI KULIAH:
${materialExcerpts || "Teori ekonomi pasar, penawaran, permintaan, elastisitas, biaya produksi, struktur pasar persaingan sempurna dan tidak sempurna."}

KONTEKS DAN PERSONALISASI:
${styleContext}

ATURAN WAJIB:
1. Tidak boleh mengarang materi di luar lingkup pembelajaran di atas.
2. Setiap soal harus dipetakan ke salah satu kode CPMK yang valid.
3. Bahasa Indonesia baku dan profesional (gunakan istilah teknis yang sesuai seperti elastisitas, biaya marjinal, titik impas).
4. Output HANYA JSON murni dengan format persis seperti ini:

{
  "questions": [
    {
      "id": "q-1",
      "cpmkCode": "CPMK 1",
      "prompt": "Pertanyaan soal...",
      "format": "${opts.format}",
      ${
        opts.format === "multiple-choice"
          ? `"options": [
        { "id": "A", "text": "Pilihan A" },
        { "id": "B", "text": "Pilihan B" },
        { "id": "C", "text": "Pilihan C" },
        { "id": "D", "text": "Pilihan D" }
      ],
      "correctOptionId": "A",`
          : ""
      }
      "explanation": "Penjelasan ilmiah lengkap mengapa jawaban tersebut benar...",
      "rubricPoints": 25,
      "difficulty": "medium",
      "sourceSessions": [${opts.scope.sessionFrom}]
    }
  ]
}
`;
}

function parseAndValidateQuestions(jsonString: string, opts: GenerateOptions): Question[] {
  try {
    let clean = jsonString.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(clean);
    const list = Array.isArray(parsed?.questions) ? parsed.questions : Array.isArray(parsed) ? parsed : [];
    const validQuestions: Question[] = [];

    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      if (!q.prompt || typeof q.prompt !== "string" || q.prompt.length < 15) continue;

      const cpmkCode = q.cpmkCode || opts.scope.cpmkCodes[0] || "CPMK 1";
      const qId = q.id || `gen-${Date.now()}-${i + 1}`;

      if (opts.format === "multiple-choice") {
        if (!Array.isArray(q.options) || q.options.length < 4) continue;
        const correctId = q.correctOptionId || "A";
        validQuestions.push({
          id: qId,
          cpmkCode,
          prompt: q.prompt,
          format: "multiple-choice",
          options: q.options.slice(0, 4),
          correctOptionId: correctId,
          explanation: q.explanation || "Pembahasan belum tersedia.",
          rubricPoints: q.rubricPoints || 25,
          difficulty: q.difficulty || "medium",
          sourceSessions: Array.isArray(q.sourceSessions) ? q.sourceSessions : [opts.scope.sessionFrom],
        });
      } else {
        validQuestions.push({
          id: qId,
          cpmkCode,
          prompt: q.prompt,
          format: "essay",
          explanation: q.explanation || "Kriteria penilaian esai mengikuti rubrik CPMK.",
          rubricPoints: q.rubricPoints || 25,
          difficulty: q.difficulty || "medium",
          sourceSessions: Array.isArray(q.sourceSessions) ? q.sourceSessions : [opts.scope.sessionFrom],
        });
      }
    }

    return validQuestions;
  } catch {
    return [];
  }
}

function getCuratedFallback(opts: GenerateOptions, reason: string): GenerateResult {
  const bank = curatedQuestions["eko-bisnis-uts"] || [];
  const filtered = bank.filter((q) => q.format === opts.format);
  const picked = (filtered.length > 0 ? filtered : bank).slice(0, opts.count);

  return {
    questions: picked,
    source: "curated",
    warning: reason,
  };
}
