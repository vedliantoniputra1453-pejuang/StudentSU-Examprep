import type { SkillAxis } from "@/lib/types";

const WIDTH = 480;
const HEIGHT = 400;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADIUS = 130;
const RINGS = [0.2, 0.4, 0.6, 0.8, 1];

function polar(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return { x: CENTER_X + Math.cos(angle) * radius, y: CENTER_Y + Math.sin(angle) * radius };
}

function shape(axes: SkillAxis[], key: "you" | "cohort") {
  return axes
    .map((axis, index) => {
      const point = polar(index, axes.length, (axis[key] / 100) * RADIUS);
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");
}

function wrapLabel(label: string, maxChars = 11) {
  const lines: string[] = [];
  let line = "";
  for (const word of label.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function SkillRadar({ axes }: { axes: SkillAxis[] }) {
  const total = axes.length;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Radar pemahaman per topik dibandingkan rata-rata angkatan" className="mx-auto h-auto w-full max-w-120">
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={axes.map((_, index) => {
            const point = polar(index, total, RADIUS * ring);
            return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
          }).join(" ")}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}

      {axes.map((axis, index) => {
        const point = polar(index, total, RADIUS);
        return <line key={axis.label} x1={CENTER_X} y1={CENTER_Y} x2={point.x} y2={point.y} stroke="#e2e8f0" strokeWidth={1} />;
      })}

      <polygon points={shape(axes, "cohort")} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 5" />
      <polygon points={shape(axes, "you")} fill="#3b82f6" fillOpacity={0.18} stroke="#3b82f6" strokeWidth={2.5} />

      {axes.map((axis, index) => {
        const point = polar(index, total, (axis.you / 100) * RADIUS);
        return <circle key={axis.label} cx={point.x} cy={point.y} r={4} fill="#ffffff" stroke="#3b82f6" strokeWidth={2.5} />;
      })}

      {axes.map((axis, index) => {
        const point = polar(index, total, RADIUS + 14);
        const anchor = point.x > CENTER_X + 8 ? "start" : point.x < CENTER_X - 8 ? "end" : "middle";
        const lines = wrapLabel(axis.label);
        const offset = lines.length > 1 ? -((lines.length - 1) * 15) / 2 : 0;
        return (
          <text
            key={axis.label}
            x={point.x}
            y={point.y + offset}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-ink-muted text-caption"
          >
            {lines.map((line, lineIndex) => (
              <tspan key={line} x={point.x} dy={lineIndex === 0 ? 0 : 16}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}