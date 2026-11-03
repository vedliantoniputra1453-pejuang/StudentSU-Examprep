import type { CpmkGap } from "@/lib/types";

function tone(mastery: number) {
  if (mastery >= 80) return "bg-leaf";
  if (mastery >= 40) return "bg-sun";
  return "bg-coral";
}

export default function GapList({ gaps }: { gaps: CpmkGap[] }) {
  return (
    <section className="rounded-card border border-outline bg-white p-6">
      <h2 className="font-display text-h4 font-bold">Yang belum kuat</h2>
      <p className="mt-1 text-small text-ink-muted">Di bawah 80% pada latihan terakhir. Urut dari yang paling lemah.</p>

      <ul className="mt-5 flex flex-col gap-5">
        {gaps.map((gap) => (
          <li key={gap.code}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-caption font-medium uppercase tracking-wide text-ink-muted">{gap.code}</p>
              <p className="font-mono text-caption text-ink-muted tabular-nums">{gap.mastery}%</p>
            </div>
            <p className="mt-1 text-small font-semibold leading-snug">{gap.label}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-surface-sunken">
              <div className={`h-full rounded-pill ${tone(gap.mastery)}`} style={{ width: `${gap.mastery}%` }} />
            </div>
            <p className="mt-2 text-small text-ink-muted">{gap.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}