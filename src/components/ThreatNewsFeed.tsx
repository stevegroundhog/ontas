import { useCallback, useEffect, useMemo, useState } from "react";
import { THREAT_NEWS, formatRelative, type ThreatSeverity } from "@/data/threat-news";
import { NUCLEAR_ISO } from "@/data/country-codes";
import { nationById } from "@/data/nuclear-forces";
import {
  fetchLiveNuclearNews,
  type LiveNewsItem,
} from "@/server/nuclear-news";

interface ThreatNewsFeedProps {
  filterNationId: string | null;
  onSelectNation: (id: string) => void;
  externalItems?: LiveNewsItem[];
  externalFetchedAt?: string | null;
  externalFeedCount?: number;
}

const SEV_STYLE: Record<ThreatSeverity, string> = {
  critical: "border-danger text-danger",
  high: "border-warn text-warn",
  elevated: "border-sky-400/50 text-sky-300",
  info: "border-border text-muted",
};

type DisplayItem = {
  id: string;
  title: string;
  summary: string;
  link?: string;
  publishedAt: string;
  source: string;
  regionLabel: string;
  region: string;
  severity: ThreatSeverity;
  actors: string[];
  category: string;
  live: boolean;
};

function liveToDisplay(it: LiveNewsItem): DisplayItem {
  return {
    id: it.id,
    title: it.title,
    summary: it.summary,
    link: it.link,
    publishedAt: it.publishedAt,
    source: it.source,
    regionLabel: it.regionLabel,
    region: it.region,
    severity: it.severity,
    actors: it.actors,
    category: it.category,
    live: true,
  };
}

function curatedFallback(): DisplayItem[] {
  return THREAT_NEWS.map((n) => ({
    id: `curated-${n.id}`,
    title: n.headline,
    summary: n.summary,
    link: n.sourceUrl,
    publishedAt: n.publishedAt,
    source: n.source,
    regionLabel: n.region,
    region: "ARCHIVE",
    severity: n.severity,
    actors: n.actors,
    category: n.category,
    live: false,
  }));
}

export function ThreatNewsFeed({
  filterNationId,
  onSelectNation,
  externalItems,
  externalFetchedAt,
  externalFeedCount,
}: ThreatNewsFeedProps) {
  const [now, setNow] = useState(() => Date.now());
  const [localItems, setLocalItems] = useState<DisplayItem[]>(() => curatedFallback());
  const [status, setStatus] = useState<"loading" | "live" | "fallback">("loading");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [feedCount, setFeedCount] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [pulse, setPulse] = useState("Connecting to news mesh…");

  const useExternal = Array.isArray(externalItems);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Parent-owned live feed
  useEffect(() => {
    if (!useExternal) return;
    if (externalItems && externalItems.length > 0) {
      setStatus("live");
      setFetchedAt(externalFetchedAt ?? null);
      setFeedCount(externalFeedCount ?? 0);
      setPulse(`Live · ${externalItems.length} items · ${externalFeedCount ?? 0} feeds`);
      return;
    }
    // Empty array: keep waiting briefly, then show archive
    setStatus("loading");
    setPulse("Waiting for live news…");
    const t = window.setTimeout(() => {
      setStatus("fallback");
      setPulse("Live mesh empty — showing archive");
      setLocalItems(curatedFallback());
    }, 12_000);
    return () => clearTimeout(t);
  }, [useExternal, externalItems, externalFetchedAt, externalFeedCount]);

  const load = useCallback(async (silent = false) => {
    if (useExternal) return;
    if (!silent) setStatus((s) => (s === "live" ? s : "loading"));
    setPulse("Scanning world newswires…");
    try {
      const data = await fetchLiveNuclearNews();
      if (data.items.length > 0) {
        setLocalItems(data.items.map(liveToDisplay));
        setFetchedAt(data.fetchedAt);
        setFeedCount(data.feedCount);
        setStatus("live");
        setPulse(`Live · ${data.items.length} items · ${data.feedCount} feeds`);
      } else {
        setLocalItems(curatedFallback());
        setStatus("fallback");
        setPulse("Archive fallback");
      }
    } catch {
      setLocalItems(curatedFallback());
      setStatus("fallback");
      setPulse("Offline — archive mode");
    }
  }, [useExternal]);

  useEffect(() => {
    if (useExternal) return;
    void load();
    const t = window.setInterval(() => void load(true), 90_000);
    return () => clearInterval(t);
  }, [load, useExternal]);

  const items = useMemo(() => {
    if (useExternal && externalItems && externalItems.length > 0) {
      return externalItems.map(liveToDisplay);
    }
    return localItems.length ? localItems : curatedFallback();
  }, [useExternal, externalItems, localItems]);

  const regions = useMemo(() => {
    const set = new Set(items.map((i) => i.region));
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (regionFilter !== "all") list = list.filter((i) => i.region === regionFilter);
    if (filterNationId) {
      const iso = NUCLEAR_ISO[filterNationId];
      const short = nationById(filterNationId)?.name.split(" ")[0]?.toLowerCase() ?? "___";
      list = list.filter(
        (i) =>
          i.actors.includes(filterNationId) ||
          i.region === iso ||
          i.title.toLowerCase().includes(short),
      );
    }
    return list;
  }, [items, category, regionFilter, filterNationId]);

  const criticalCount = filtered.filter(
    (i) => i.severity === "critical" || i.severity === "high",
  ).length;

  return (
    <div className="crt-panel flex h-full min-h-[320px] flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Global nuclear news
            </div>
            <div className="text-xs text-muted">{pulse}</div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span
              className={
                status === "live" ? "text-emerald-400" : status === "loading" ? "text-warn" : "text-muted"
              }
            >
              {status === "live" ? "● LIVE" : status === "loading" ? "○ SYNC" : "◌ ARCHIVE"}
            </span>
            {!useExternal && (
              <button type="button" onClick={() => void load()} className="soft-btn">
                Refresh
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {(["all", "test", "treaty", "posture", "analysis", "exercise"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`soft-btn ${category === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
          {regions.slice(0, 10).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegionFilter(r)}
              className={`soft-btn ${regionFilter === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
          {filterNationId && (
            <button type="button" onClick={() => onSelectNation("")} className="soft-btn">
              Clear {nationById(filterNationId)?.short}
            </button>
          )}
        </div>
        <div className="mt-2 text-[11px] text-muted tabular">
          {filtered.length} shown · {criticalCount} high/crit
          {fetchedAt ? ` · ${formatRelative(fetchedAt, now)}` : ""}
          {feedCount ? ` · ${feedCount} feeds` : ""}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {status === "loading" && items.length === 0 ? (
          <div className="p-4 text-sm text-muted crt-pulse">Syncing news…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted">No matches for this filter</div>
        ) : (
          <ul>
            {filtered.map((item) => (
              <li key={item.id} className="border-b border-border/50">
                <button
                  type="button"
                  onClick={() => setExpanded((e) => (e === item.id ? null : item.id))}
                  className="flex w-full flex-col gap-1 px-4 py-2.5 text-left hover:bg-white/5"
                >
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className={`rounded-full border px-1.5 py-0.5 uppercase ${SEV_STYLE[item.severity]}`}>
                      {item.severity}
                    </span>
                    {item.live && <span className="text-emerald-400">LIVE</span>}
                    <span className="text-muted tabular">{formatRelative(item.publishedAt, now)}</span>
                    <span className="ml-auto text-dim">{item.regionLabel}</span>
                  </div>
                  <div className="text-sm font-medium leading-snug text-bright">{item.title}</div>
                  <div className="text-[11px] text-muted">{item.source}</div>
                </button>
                {expanded === item.id && (
                  <div className="space-y-2 border-t border-border/40 bg-black/20 px-4 py-3 text-sm text-fg/90">
                    <p className="leading-relaxed">{item.summary}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full border border-sky-500/40 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/10"
                      >
                        Open article
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
