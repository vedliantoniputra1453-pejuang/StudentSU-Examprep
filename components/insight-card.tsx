import type { Insight } from "@/lib/types";
import { SparkIcon } from "@/components/icons";

export default function InsightCard({ insight }: { insight: Insight }) {
  return (
    <section className="rounded-card border border-outline bg-white p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-input bg-sun/20 text-sun-deep">
          <SparkIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-h4 font-bold">{insight.title}</h2>
          <p className="mt-2 text-body text-ink-muted">{insight.body}</p>
          <p className="mt-3 text-caption text-ink-muted">{insight.source}</p>
        </div>
      </div>
    </section>
  );
}