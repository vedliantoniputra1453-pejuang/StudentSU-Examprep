# human-copywriter.md

Voice and tone guide for every word the student reads: buttons, labels, empty states, errors, AI output framing, journal prompts. Copy is part of the product, not decoration painted on at the end.

## 1. Principles

- **Specific.** Name the course, the CPMK, the session, the number. "Sesi 3 · Manajemen Keuangan" beats "your material".
- **Calm.** The student is under deadline. Do not add urgency, excitement, or pressure that is not real.
- **Honest.** Say what the app does, what it does not know, and what it cannot do. Never promise grades.
- **No hype.** If a sentence would fit a landing page, it does not fit inside the app.
- **Second person, lowercase-friendly.** Address the student as **kamu**. Never "Anda", never "pengguna".
- **Bahasa Indonesia by default**, casual-professional register: the way a helpful senior explains something, not the way a brochure talks.

## 2. Who you are writing for

**Mahasiswa sibuk (18–23).** Managing 5–7 courses, part-time work, group projects. Skims. Needs to know in two seconds: what is this, what do I do, how long will it take.

**Mahasiswa cemas menjelang UTS.** Opens the app at 23:00, two days before the exam, already behind. Needs orientation, not motivation. Never imply they should have started earlier. Never celebrate a low score.

**Mahasiswa yang tidak percaya AI.** Has seen hallucinated answers. Needs to see the source material, the CPMK mapping, and a plain statement of what the model did. Show, don't assert.

## 3. Tone by situation

| Situation | Tone | Rule |
|---|---|---|
| Onboarding | Welcoming, brief | One question per screen. No tour, no confetti. |
| Dashboard | Matter-of-fact | Report state. Do not editorialize about it. |
| Upload / input | Instructive | Say accepted formats, limits, and what happens to the file. |
| Generating | Neutral, bounded | Say what is happening and roughly how long. No "thinking..." theatre. |
| Question result | Direct, useful | Lead with what to fix, not with the score. |
| Error | Plain, blameless | What failed, why, what to do. Never apologize three times. |
| Journal | Quiet, non-judgmental | No prompts that demand positivity. |
| Ticket | Practical | Ask for reproduction steps, not for gratitude. |

## 4. Before → after

Use these as the register. Left column is what to avoid.

| Surface | Before (slop) | After |
|---|---|---|
| Primary button | "Yuk Mulai Belajar! 🚀" | "Mulai latihan" |
| Secondary button | "Unlock Your Potential" | "Lihat CPMK" |
| Generate | "Buat Soal Ajaib dengan AI ✨" | "Buat 10 soal" |
| Empty state (no material) | "Belum ada apa-apa nih! Yuk upload dulu~" | "Belum ada materi. Upload PPT, PDF, atau transkrip Zoom untuk mata kuliah ini." |
| Empty state (history) | "No history yet! Start your journey!" | "Belum ada latihan. Riwayat muncul setelah kamu menyelesaikan satu set soal." |
| Error (API key missing) | "Oops! Something went wrong 😅" | "API key belum diisi. Buka Pengaturan, tempel key Gemini atau OpenAI, lalu coba lagi." |
| Error (bad key) | "Invalid credentials!" | "Provider menolak key ini. Cek apakah key masih aktif dan sesuai provider yang dipilih." |
| Error (file too large) | "File too big!" | "File 18 MB, batasnya 10 MB. Kompres atau pilih file lain." |
| Loading | "AI is thinking... magic in progress ✨" | "Menyusun soal dari CPMK dan materimu. Biasanya 10–20 detik." |
| Result header | "Amazing job! You're a star! ⭐" | "6 dari 10 benar. Yang perlu diulang: CPMK 3 dan CPMK 5." |
| Result detail | "Don't worry, you'll get it next time!" | "Soal 4 salah karena biaya variabel dihitung per unit, bukan total. Lihat pembahasan." |
| Career insight | "This skill will change your life!" | "Analisis varians dipakai tim finance untuk menjelaskan selisih budget ke manajemen." |
| Journal prompt | "How are you feeling today? Be positive! 🌈" | "Gimana perasaanmu hari ini?" |
| Journal save | "Yay! Saved! 🎉" | "Catatan tersimpan." |
| Confirmation (delete) | "Are you sure?! This cannot be undone!!" | "Hapus catatan ini? Tindakan ini tidak bisa dibatalkan." |
| Settings saved | "Awesome! You're all set!" | "Key tersimpan di browser ini saja." |

## 5. Terminology

Use these exact terms. Do not invent synonyms; students already know them.

| Use | Not |
|---|---|
| UTS, UAS | "ujian tengah semester" in UI labels, "midterm", "final" |
| CPMK | "kompetensi", "learning outcome", "skill" (as a label) |
| Rubrik penilaian | "rubric", "kriteria nilai" |
| Sesi / pertemuan | "week", "chapter", "modul" |
| Materi | "konten", "resource", "file" (when it means the study material) |
| Latihan | "kuis", "try out", "practice" in UI copy |
| Buat soal | "generate", "create questions", "AI-generate" |
| Mata kuliah | "course" in UI copy, "subject" |
| Pemahaman | "proficiency", "mastery score" |
| Nilai | "skor" is fine for a question set; "nilai" for a grade |

Rules:
- First mention of an abbreviation is fine bare: "CPMK" is known to SU students.
- Never write "AI-generated" inside the question itself. Frame it once at the set level: "Soal dibuat dari materimu oleh Gemini. Periksa ulang sebelum dipakai belajar."
- "Latihan" is not "ujian". Never imply practice scores are real grades.

## 6. Numbers, dates, time

- Locale **id-ID**. Decimal comma, thousands dot: `1.250`, `3,5`.
- Dates: `3 Nov 2026`. In full context: `Senin, 3 November 2026`.
- Times: 24-hour, `21.30`. Never AM/PM.
- Durations: `10–20 detik`, `4 menit`. En dash for ranges, no space around it.
- Percentages: `78%` (no space). Scores: `6/10`, not `6 dari 10 soal benar` twice in one screen.
- Counts of things: spell out one to nine in prose ("tiga soal"), digits in data UI ("3 soal").
- Currency, if ever shown: `Rp1.500.000`.
- Never fake a relative time ("baru saja") for older data. Show the date.

## 7. Banned

- **"Oops", "Yay", "Whoops", "Uh oh", "Ta-da"** — infantile and insincere.
- **Double or triple exclamation marks.** One is already a lot; prefer zero.
- **Emoji anywhere in the UI**, including toasts and empty states.
- **AI jargon:** "prompt engineering", "LLM", "token", "embedding", "hallucination" in student-facing copy. Say "model" or name the provider.
- **Hype vocabulary:** unlock, unleash, supercharge, seamless, effortless, revolutionise, elevate, game-changer, "next level".
- **Grade promises:** "dijamin lulus", "pasti dapat A", "tingkatkan nilaimu 2x".
- **Fake urgency:** "hanya hari ini", countdowns to nothing, "jangan sampai ketinggalan".
- **Blaming the student:** "kamu salah input", "seharusnya kamu...".
- **Gendered or familiar address** beyond "kamu": no "bro", "gaes", "sis".

## 8. Copy checklist before merge

- [ ] Read aloud. Would a person say this to a classmate without embarrassment?
- [ ] Every sentence names something specific or does real work. Delete anything that survives only because it sounds nice.
- [ ] No banned word from section 7 or `skills/anti-slop.md`.
- [ ] Errors say what happened, why, and the next action — in that order.
- [ ] Buttons are verbs describing the outcome ("Buat 10 soal"), not moods ("Ayo semangat").
- [ ] Empty states give one action, not a pep talk.
- [ ] Numbers and dates follow id-ID.
- [ ] "kamu" throughout; no mixing with "Anda".
- [ ] Every claim about AI is followed by what it cannot guarantee.
- [ ] Screens with no data say so plainly instead of showing zeros as if they were results.
