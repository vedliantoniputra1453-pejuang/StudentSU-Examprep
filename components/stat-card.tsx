import type { StatCardData } from "@/lib/types";
import { ChartIcon, ClockIcon, PenIcon, TargetIcon } from "@/components/icons";

const tone = {
  sky: "bg-sky-soft text-sky-deep",
  leaf: "bg-leaf-soft text-leaf-deep",
  sun: "bg-sun/20 text-sun-deep",
  berry: "bg-berry/10 text-berry",
} as const;

const icons = {
  sky: ChartIcon,
  leaf: TargetIcon,
  sun: PenIcon,
  berry: ClockIcon,
} as const;

export default function StatCard({ data }: { data: StatCardData }) {
  const Icon = icons[data.tone];

  return (
    <div className="rounded-card border border-outline bg-white p-5 transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <p className="text-small font-medium text-ink-muted">{data.label}</p>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-input ${tone[data.tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 font-display text-score font-extrabold tabular-nums tracking-tight">
        {data.value}
        {data.unit ? <span className="ml-1 text-small font-semibold text-ink-muted">{data.unit}</span> : null}
      </p>
      <p className="mt-2 text-small text-ink-muted">{data.hint}</p>
    </div>
  );
}