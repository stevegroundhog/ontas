import { useCallback, useEffect, useState } from "react";
import { formatRelative } from "@/data/threat-news";
import { fetchLiveStatus, type LiveSource } from "@/server/live-status";

export function LiveStatusBar({ now }: { now: number }) {
  const [sources, setSources] = useState<LiveSource[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [okCount, setOkCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const pull = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLiveStatus();
      setSources(data.sources);
      setFetchedAt(data.fetchedAt);
      setOkCount(data.okCount);
      setTotal(data.total);
      setNote(data.note);
    } catch {
      /* keep last */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void pull();
    const t = window.setInterval(pull, 120_000);
    return () => clearInterval(t);
  }, [pull]);

  const color = (s: LiveSource["status"]) =>
    s === "ok" ? "#34d399" : s === "degraded" ? "#fbbf24" : "#f87171";

  return (
    <div className="crt-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Live unclassified sources
        </span>
        <span className="chip tabular" style={{ borderColor: "#34d399", color: "#6ee7b7" }}>
          {okCount}/{total} OK
        </span>
        {fetchedAt && (
          <span className="text-[11px] text-muted">
            probed {formatRelative(fetchedAt, now)}
            {loading ? " · refreshing…" : ""}
          </span>
        )}
        <span className="ml-auto text-[11px] text-sky-300">{open ? "Hide" : "Show"} detail</span>
      </button>

      {!open && sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2">
          {sources.map((s) => (
            <span
              key={s.id}
              className="chip"
              style={{ borderColor: color(s.status), color: color(s.status) }}
              title={`${s.name}: ${s.detail}`}
            >
              {s.status === "ok" ? "●" : s.status === "degraded" ? "◐" : "○"}{" "}
              {s.id}
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="border-t border-border">
          <p className="px-4 py-2 text-[11px] leading-relaxed text-muted">{note}</p>
          <ul className="max-h-72 overflow-y-auto">
            {sources.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-0.5 border-b border-border/50 px-4 py-2.5 text-xs sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span style={{ color: color(s.status) }}>
                      {s.status === "ok" ? "●" : s.status === "degraded" ? "◐" : "○"}
                    </span>
                    <span className="font-semibold text-bright">{s.name}</span>
                    <span className="chip text-[10px]">{s.classification}</span>
                    <span className="chip text-[10px]">{s.category}</span>
                  </div>
                  <div className="mt-0.5 text-muted">{s.detail}</div>
                  <div className="text-[10px] text-dim">{s.legal}</div>
                </div>
                <div className="shrink-0 text-[10px] text-muted tabular">
                  {s.latencyMs != null ? `${s.latencyMs} ms` : ""}
                  {s.url && (
                    <>
                      {" · "}
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-300 hover:underline"
                      >
                        source
                      </a>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-end px-4 py-2">
            <button type="button" className="soft-btn" onClick={() => void pull()} disabled={loading}>
              Re-probe now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
