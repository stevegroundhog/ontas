import { useEffect, useState } from "react";
import {
  LAUNCH_KIND_META,
  launchesSortedNewestFirst,
  type LaunchEvent,
} from "@/data/launches";
import { fetchLaunchDesk, type LaunchNewsItem } from "@/server/launches";

export function LaunchesPanel() {
  const [calendar] = useState<LaunchEvent[]>(() => launchesSortedNewestFirst());
  const [news, setNews] = useState<LaunchNewsItem[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedOk, setFeedOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      setLoading(true);
      try {
        const data = await fetchLaunchDesk();
        if (cancelled) return;
        setNews(data.news);
        setDisclaimer(data.disclaimer);
        setFetchedAt(data.fetchedAt);
        setFeedOk(data.feedOk);
      } catch {
        if (!cancelled) setFeedOk(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void pull();
    const t = window.setInterval(pull, 180_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Missile & space calendar
        </div>
        <div className="mt-0.5 text-sm font-bold text-bright">
          Public tests, NOTAM-style windows, open launch news
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          {loading ? "Refreshing open news…" : feedOk ? `Live mesh OK · ${news.length} headlines` : "News mesh limited — calendar still available"}
          {fetchedAt ? ` · ${new Date(fetchedAt).toISOString().slice(11, 19)}Z` : ""}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="border-b border-border px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Curated public calendar
          </h3>
          <ul className="mt-2 space-y-2">
            {calendar.map((ev) => {
              const meta = LAUNCH_KIND_META[ev.kind];
              return (
                <li
                  key={ev.id}
                  className="rounded-xl border border-border bg-bg/35 px-3 py-2 text-[11px] leading-snug"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tabular font-semibold text-bright">{ev.date}</span>
                    <span
                      className="chip"
                      style={{ borderColor: meta.color, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-muted">{ev.actor}</span>
                  </div>
                  <div className="mt-1 font-semibold text-fg">{ev.name}</div>
                  <p className="mt-1 text-muted">{ev.summary}</p>
                  {ev.location && (
                    <div className="mt-1 text-[10px] text-dim">Location: {ev.location}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Open news mesh (missile / launch)
          </h3>
          <ul className="mt-2 space-y-2">
            {news.length === 0 && (
              <li className="text-[11px] text-muted">No headlines loaded yet.</li>
            )}
            {news.map((n) => (
              <li key={n.id}>
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-border/80 bg-bg/30 px-3 py-2 text-[11px] leading-snug text-sky-200 hover:border-sky-500/40 hover:bg-sky-500/10"
                >
                  <div className="font-semibold text-fg">{n.title}</div>
                  <div className="mt-0.5 text-[10px] text-muted">
                    {n.source}
                    {n.publishedAt ? ` · ${n.publishedAt}` : ""}
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {disclaimer && (
            <p className="mt-3 text-[10px] leading-relaxed text-dim">{disclaimer}</p>
          )}
        </section>
      </div>
    </div>
  );
}
