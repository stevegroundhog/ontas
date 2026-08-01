import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ARMED_CONFLICTS,
  CONFLICT_INTENSITY_META,
  CONFLICT_TYPE_LABEL,
  sortConflictsByIntensity,
  type ArmedConflict,
  type ConflictRegion,
} from "@/data/conflicts";
import { formatRelative } from "@/data/threat-news";
import {
  fetchConflictReports,
  type ConflictReport,
} from "@/server/conflicts";
import { formatNum } from "@/lib/utils";

interface ConflictsPanelProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  now: number;
}

const REGIONS: (ConflictRegion | "all")[] = [
  "all",
  "Europe",
  "Middle East",
  "Africa",
  "Asia",
  "Americas",
];

function formatToll(c: ArmedConflict): string {
  if (c.fatalitiesHigh <= 0 && c.fatalitiesLow <= 0) {
    return "No continuous combat toll (tension phase)";
  }
  if (c.fatalitiesLow === c.fatalitiesHigh) return `~${formatNum(c.fatalitiesLow)}`;
  return `${formatNum(c.fatalitiesLow)}–${formatNum(c.fatalitiesHigh)}`;
}

export function ConflictsPanel({ selectedId, onSelect, now }: ConflictsPanelProps) {
  const [region, setRegion] = useState<ConflictRegion | "all">("all");
  const [q, setQ] = useState("");
  const [reports, setReports] = useState<ConflictReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [health, setHealth] = useState<{ name: string; ok: boolean; count: number }[]>([]);
  const [pulse, setPulse] = useState("Select a conflict for live reports");
  const [expanded, setExpanded] = useState<string | null>(null);

  const list = useMemo(() => {
    let items = sortConflictsByIntensity(ARMED_CONFLICTS);
    if (region !== "all") items = items.filter((c) => c.region === region);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.shortName.toLowerCase().includes(s) ||
          c.countries.some((x) => x.toLowerCase().includes(s)) ||
          c.parties.some((p) => p.toLowerCase().includes(s)) ||
          c.keywords.some((k) => k.includes(s)),
      );
    }
    return items;
  }, [region, q]);

  const selected = useMemo(
    () => ARMED_CONFLICTS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  const load = useCallback(async (id: string | null) => {
    setLoading(true);
    setPulse(id ? "Pulling live reports…" : "Scanning global conflict feeds…");
    try {
      const data = await fetchConflictReports({ data: { conflictId: id } });
      setReports(data.reports);
      setFetchedAt(data.fetchedAt);
      setHealth(data.feedHealth);
      setPulse(
        data.reports.length
          ? `${data.reports.length} reports · open sources`
          : "No matching wire items right now",
      );
    } catch {
      setPulse("Feed error — try again");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(selectedId);
    const t = window.setInterval(() => void load(selectedId), 120_000);
    return () => clearInterval(t);
  }, [selectedId, load]);

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose-400">
          Global conflicts
        </div>
        <div className="mt-0.5 text-sm font-bold text-bright">
          Select any major war or conflict · live open reports
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Neutral registry with open fatality ranges (contested) + multi-source wires. Not
          propaganda — open original articles.
        </p>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter: Ukraine, Sudan, Gaza, Sahel…"
          className="mt-2 w-full rounded-xl border border-border bg-black/30 px-3 py-2 text-sm text-bright outline-none placeholder:text-dim focus:border-rose-400/60"
          aria-label="Filter conflicts"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`soft-btn ${region === r ? "active" : ""}`}
              onClick={() => setRegion(r)}
            >
              {r === "all" ? "All regions" : r}
            </button>
          ))}
          <button
            type="button"
            className={`soft-btn ${selectedId == null ? "active" : ""}`}
            onClick={() => onSelect(null)}
          >
            All live
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-border lg:border-b-0 lg:border-r">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {list.length} conflicts
          </div>
          <ul>
            {list.map((c) => {
              const meta = CONFLICT_INTENSITY_META[c.intensity];
              const active = selectedId === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(active ? null : c.id)}
                    className={`flex w-full items-start gap-2 border-b border-border/50 px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-rose-500/15" : "hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: meta.color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-bright">
                        {c.shortName}
                      </span>
                      <span className="block truncate text-[11px] text-muted">{c.name}</span>
                      <span className="mt-0.5 flex flex-wrap gap-1">
                        <span
                          className="chip"
                          style={{ borderColor: meta.color, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="chip tabular text-[10px]">{formatToll(c)}</span>
                        {c.nuclearRisk !== "none" && (
                          <span className="chip border-amber-400/50 text-amber-300">
                            nuclear: {c.nuclearRisk}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden">
          {selected ? (
            <ConflictDetail conflict={selected} />
          ) : (
            <div className="border-b border-border px-3 py-2 text-xs text-muted">
              Showing cross-conflict live items. Select a conflict for focused coverage.
            </div>
          )}

          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div className="min-w-0 truncate text-[11px] text-muted">
              {loading ? "Loading…" : pulse}
              {fetchedAt ? ` · ${formatRelative(fetchedAt, now)}` : ""}
            </div>
            <button
              type="button"
              className="soft-btn shrink-0"
              onClick={() => void load(selectedId)}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {health.length > 0 && (
            <div className="flex flex-wrap gap-1 border-b border-border px-3 py-1.5">
              {health.slice(0, 6).map((h) => (
                <span
                  key={h.name}
                  className="chip text-[10px]"
                  style={{
                    borderColor: h.ok ? "#34d399" : "#64748b",
                    color: h.ok ? "#6ee7b7" : "#94a3b8",
                  }}
                  title={h.name}
                >
                  {h.ok ? "●" : "○"} {h.name.length > 22 ? `${h.name.slice(0, 20)}…` : h.name}
                </span>
              ))}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {reports.length === 0 ? (
              <div className="p-4 text-sm text-muted">
                {loading
                  ? "Fetching factual reports…"
                  : "No live items matched. Try refresh or another conflict."}
              </div>
            ) : (
              <ul>
                {reports.map((r) => (
                  <li key={r.id} className="border-b border-border/40">
                    <button
                      type="button"
                      className="w-full px-3 py-2.5 text-left hover:bg-white/5"
                      onClick={() => setExpanded((e) => (e === r.id ? null : r.id))}
                    >
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
                        <span className="chip">{r.sourceKind.toUpperCase()}</span>
                        <span className="chip">{r.conflictName}</span>
                        <span className="tabular">{formatRelative(r.publishedAt, now)}</span>
                        <span className="ml-auto truncate">{r.source}</span>
                      </div>
                      <div className="mt-1 text-sm font-medium leading-snug text-bright">
                        {r.title}
                      </div>
                    </button>
                    {expanded === r.id && (
                      <div className="space-y-2 px-3 pb-3 text-xs text-muted">
                        {r.summary && <p className="leading-relaxed">{r.summary}</p>}
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sky-300 underline"
                        >
                          Open original source
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConflictDetail({ conflict }: { conflict: ArmedConflict }) {
  const meta = CONFLICT_INTENSITY_META[conflict.intensity];
  return (
    <div className="border-b border-border px-3 py-3 text-xs leading-relaxed">
      <div className="text-sm font-bold text-bright">{conflict.name}</div>
      <p className="mt-1 text-fg/90">{conflict.summary}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="chip" style={{ borderColor: meta.color, color: meta.color }}>
          {meta.label}
        </span>
        <span className="chip">{CONFLICT_TYPE_LABEL[conflict.type]}</span>
        <span className="chip">{conflict.region}</span>
        <span className="chip">{conflict.status}</span>
        <span className="chip">since {conflict.startYear}</span>
      </div>
      <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-rose-300">
          Open fatality range (contested)
        </div>
        <div className="mt-0.5 text-lg font-bold tabular text-bright">{formatToll(conflict)}</div>
        <div className="text-[10px] text-muted">As of {conflict.fatalitiesAsOf}</div>
        <p className="mt-1 text-[11px] text-fg/90">{conflict.fatalitiesNote}</p>
        <p className="mt-1 text-[10px] text-dim">Sources: {conflict.fatalitiesSource}</p>
      </div>
      <div className="mt-2 text-[10px] text-muted">Parties: {conflict.parties.join(" · ")}</div>
      <div className="mt-1 flex flex-wrap gap-2">
        {conflict.sources.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-sky-300 underline-offset-2 hover:underline"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
