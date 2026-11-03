import type { Course } from "@/lib/types";
import { BookIcon } from "@/components/icons";

const accent = {
  sky: "bg-sky",
  leaf: "bg-leaf",
  berry: "bg-berry",
  sun: "bg-sun",
} as const;

export default function CourseProgress({ courses }: { courses: Course[] }) {
  return (
    <section className="rounded-card border border-outline bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-h4 font-bold">Mata kuliah semester ini</h2>
        <p className="text-caption text-ink-muted">3 dari 6 terdaftar</p>
      </div>

      <ul className="mt-5 flex flex-col divide-y divide-outline">
        {courses.map((course) => {
          const percent = Math.round((course.sessionDone / course.sessionTotal) * 100);
          return (
            <li key={course.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-input bg-surface-sunken text-ink-muted">
                    <BookIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-small font-semibold leading-snug">{course.name}</p>
                    <p className="text-caption text-ink-muted">
                      {course.code} · {course.nextTopic}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-mono text-caption text-ink-muted tabular-nums">
                  {course.sessionDone}/{course.sessionTotal}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 w-full overflow-hidden rounded-pill bg-sky-soft" role="presentation">
                  <div
                    className={`h-full rounded-pill ${accent[course.accent]}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="sr-only">
                  {course.name}: sesi {course.sessionDone} dari {course.sessionTotal} selesai
                </span>
                <span className="w-10 shrink-0 text-right font-mono text-caption text-ink-muted tabular-nums">{percent}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}