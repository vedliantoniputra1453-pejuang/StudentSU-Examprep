import type { Metadata } from "next";
import CourseProgress from "@/components/course-progress";
import GapList from "@/components/gap-list";
import InsightCard from "@/components/insight-card";
import JournalCard from "@/components/journal-card";
import SetupSteps from "@/components/setup-steps";
import SkillRadar from "@/components/skill-radar";
import StatCard from "@/components/stat-card";
import { ClockIcon } from "@/components/icons";
import { courses, cpmkGaps, insight, profile, setupSteps, skillAxes, stats } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const ranked = [...skillAxes].sort((a, b) => b.you - a.you);
  const strongest = ranked.slice(0, 2);
  const weakest = ranked.slice(-2).reverse();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">
            Semester {profile.semester} · {profile.major}
          </p>
          <h1 className="mt-2 font-display text-h2 font-extrabold tracking-tight lg:text-h1">
            Selamat datang kembali, {profile.name}
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            Fokus ulang CPMK 2 dan 3 sebelum UTS. Latihan terakhir menyisakan dua topik di bawah 50%.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-outline bg-white px-4 text-small text-ink-muted">
            <ClockIcon className="h-4 w-4" />
            {profile.examLabel} · {profile.daysToExam} hari lagi
          </span>
          <span className="inline-flex min-h-11 items-center rounded-pill bg-sun/20 px-4 text-small font-medium text-ink">
            Data contoh
          </span>
        </div>
      </header>

      <section aria-label="Ringkasan belajar" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} data={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <section className="rounded-card border border-outline bg-white p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-h4 font-bold">Peta pemahaman</h2>
            <p className="text-caption text-ink-muted">Ekonomi Bisnis · 10 topik</p>
          </div>
          <p className="mt-1 text-small text-ink-muted">Skor per topik dari latihan terakhir, dibandingkan rata-rata angkatan.</p>

          <div className="mt-4 px-1">
            <SkillRadar axes={skillAxes} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-5 border-t border-outline pt-4 text-caption text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-sm border-2 border-sky bg-sky/20" />
              Kamu
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-sm border-2 border-dashed border-outline-strong" />
              Rata-rata angkatan
            </span>
            <span className="ml-auto">Skor disimpan di perangkat ini</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-outline pt-4 sm:grid-cols-2">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Paling kuat</p>
              <ul className="mt-2 flex flex-col gap-1">
                {strongest.map((axis) => (
                  <li key={axis.label} className="flex items-baseline justify-between gap-2 text-small">
                    <span>{axis.label}</span>
                    <span className="font-mono tabular-nums text-leaf-deep">{axis.you}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Perlu diulang</p>
              <ul className="mt-2 flex flex-col gap-1">
                {weakest.map((axis) => (
                  <li key={axis.label} className="flex items-baseline justify-between gap-2 text-small">
                    <span>{axis.label}</span>
                    <span className="font-mono tabular-nums text-coral">{axis.you}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <GapList gaps={cpmkGaps} />
          <SetupSteps steps={setupSteps} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CourseProgress courses={courses} />
        <JournalCard />
      </div>

      <InsightCard insight={insight} />
    </div>
  );
}