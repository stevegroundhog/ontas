import { TREATY_STATUS_META, treatiesSortedNewestFirst } from "@/data/treaties";

export function TreatiesPanel() {
  const items = treatiesSortedNewestFirst();

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Arms control
        </div>
        <div className="mt-0.5 text-sm font-bold text-bright">
          Treaty & nuclear-order timeline
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Public historical milestones. New START expired Feb 2026 — no US–Russia strategic ceilings.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <ol className="relative space-y-0 border-l border-border pl-4">
          {items.map((ev) => {
            const st = TREATY_STATUS_META[ev.status];
            return (
              <li key={ev.id} className="relative pb-4">
                <span
                  className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-bg"
                  style={{ background: st.color }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tabular text-sm font-bold text-bright">{ev.year}</span>
                  {ev.month ? (
                    <span className="text-[10px] text-muted">M{ev.month}</span>
                  ) : null}
                  <span className="chip" style={{ borderColor: st.color, color: st.color }}>
                    {st.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-dim">{ev.category}</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-fg">{ev.title}</div>
                <div className="text-[10px] text-muted">{ev.parties}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-fg/85">{ev.summary}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-[10px] leading-relaxed text-dim">
          Educational timeline only. Treaty status can change with withdrawals, suspensions, and
          unratified instruments (e.g. CTBT). Always check primary legal texts for obligations.
        </p>
      </div>
    </div>
  );
}
