import { useMemo, useState } from "react";
import {
  TERROR_INCIDENT_KIND_META,
  TERROR_NUCLEAR_BOTTOM_LINE,
  TERROR_NUCLEAR_HISTORY,
  type TerrorIncidentKind,
} from "@/data/terror-nuclear-history";
import { PanelFrame } from "./AppNav";

export function TerrorHistoryPanel() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<TerrorIncidentKind | "all">("all");
  const [onlyBeyond, setOnlyBeyond] = useState(false);

  const list = useMemo(() => {
    return TERROR_NUCLEAR_HISTORY.filter((i) => {
      if (kind !== "all" && i.kind !== kind) return false;
      if (onlyBeyond && !i.beyondRhetoric) return false;
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return (
        i.group.toLowerCase().includes(s) ||
        (i.aka?.toLowerCase().includes(s) ?? false) ||
        i.summary.toLowerCase().includes(s) ||
        i.region.toLowerCase().includes(s)
      );
    });
  }, [q, kind, onlyBeyond]);

  return (
    <PanelFrame
      title="Terrorism: nuclear threats & attempts (public record)"
      subtitle="Historical open-source cases. No group is confirmed to possess nuclear weapons."
    >
      <div className="space-y-3 p-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-fg/90">
          {TERROR_NUCLEAR_BOTTOM_LINE}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-[10px] font-semibold uppercase text-muted">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Group, region…"
              className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-sky-500/50"
            />
          </label>
          <label className="text-[10px] font-semibold uppercase text-muted">
            Type
            <select
              className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg sm:w-48"
              value={kind}
              onChange={(e) => setKind(e.target.value as TerrorIncidentKind | "all")}
            >
              <option value="all">All types</option>
              {Object.entries(TERROR_INCIDENT_KIND_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={onlyBeyond}
              onChange={(e) => setOnlyBeyond(e.target.checked)}
            />
            Beyond rhetoric only
          </label>
        </div>

        <p className="text-[11px] text-muted">{list.length} records shown</p>

        <ul className="space-y-2">
          {list.map((i) => {
            const meta = TERROR_INCIDENT_KIND_META[i.kind];
            return (
              <li
                key={i.id}
                className="rounded-xl border border-border bg-bg/40 px-3 py-3 text-[11px] leading-relaxed"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-bright">{i.group}</h3>
                  {i.aka ? <span className="chip">{i.aka}</span> : null}
                  <span className="chip" style={{ borderColor: meta.color, color: meta.color }}>
                    {meta.label}
                  </span>
                  {i.beyondRhetoric ? (
                    <span className="chip border-sky-400/40 text-sky-300">substantive steps</span>
                  ) : (
                    <span className="chip">mostly rhetoric</span>
                  )}
                </div>
                <div className="mt-1 text-[10px] text-muted">
                  {i.years} · {i.region}
                </div>
                <p className="mt-2 text-fg/90">{i.summary}</p>
                <p className="mt-2">
                  <span className="font-semibold text-muted">Outcome: </span>
                  {i.outcome}
                </p>
                <p className="mt-1 text-[10px] text-dim">Sources: {i.publicSources}</p>
              </li>
            );
          })}
        </ul>

        <p className="text-[10px] leading-relaxed text-dim">
          Educational compilation only. Not a tip line. Report credible threats to local authorities.
          This list emphasizes widely cited open cases and is not a complete archive of every hoax.
        </p>
      </div>
    </PanelFrame>
  );
}
