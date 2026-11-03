import type { SetupStep } from "@/lib/types";

export default function SetupSteps({ steps }: { steps: SetupStep[] }) {
  const done = steps.filter((step) => step.done).length;

  return (
    <section className="rounded-card border border-outline bg-surface p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-h4 font-bold">Langkah berikutnya</h2>
        <p className="font-mono text-caption text-ink-muted tabular-nums">
          {done}/{steps.length}
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-pill border ${
                step.done ? "border-leaf bg-leaf text-white" : "border-outline-strong bg-white text-transparent"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <div>
              <p className="text-small font-semibold leading-snug">{step.label}</p>
              <p className="text-caption text-ink-muted">{step.detail}</p>
            </div>
            <span className="sr-only">{step.done ? "sudah" : "belum"} selesai</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-outline pt-3 text-caption text-ink-muted">
        Unggah materi dan pengaturan API key belum tersedia di versi lokal ini.
      </p>
    </section>
  );
}