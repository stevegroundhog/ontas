import { useMemo } from "react";
import { ARMS_CLOCK, armsClockHeadline } from "@/data/arms-clock";

export function TreatyClock({ now, onOpenTreaties }: { now: number; onOpenTreaties?: () => void }) {
  const head = useMemo(() => armsClockHeadline(now), [now]);

  return (
    <div
      className="rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed"
      style={{ borderColor: `${head.color}66`, background: `${head.color}14` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Arms-control clock
        </span>
        <span className="chip font-semibold" style={{ borderColor: head.color, color: head.color }}>
          {head.title}
        </span>
      </div>
      <p className="mt-1 text-fg">{head.detail}</p>
      <p className="mt-1 text-dim">
        Educational countdown from public treaty dates — not a use-of-force alert.
        {onOpenTreaties && (
          <>
            {" "}
            <button type="button" className="text-sky-300 underline" onClick={onOpenTreaties}>
              Full treaty timeline →
            </button>
          </>
        )}
      </p>
      <ul className="mt-2 space-y-1 border-t border-border/60 pt-2">
        {ARMS_CLOCK.map((e) => (
          <li key={e.id} className="flex flex-wrap gap-x-2 text-[10px] text-muted">
            <span className="tabular text-dim">{e.date}</span>
            <span style={{ color: e.color }}>{e.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
