import type { ReactNode } from "react";
import { formatRelative } from "@/data/threat-news";
import type {
  DataSourceStatus,
  OfficialItem,
  SeismicEvent,
} from "@/server/threat-intel";

interface IntelPanelProps {
  seismic: SeismicEvent[];
  official: OfficialItem[];
  sources: DataSourceStatus[];
  fetchedAt: string | null;
  now: number;
  disclaimer: string;
}

export function IntelPanel({
  seismic,
  official,
  sources,
  fetchedAt,
  now,
  disclaimer,
}: IntelPanelProps) {
  const watch = seismic.filter((e) => e.nuclearRelevance !== "background");
  const ok = sources.filter((s) => s.status === "ok").length;

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
          Live intel fusion
        </div>
        <div className="text-sm font-bold text-bright">
          USGS · UN · DoD · IAEA · news mesh · OSINT DEFCON
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted">
          <span className="chip" style={{ borderColor: "#34d399", color: "#6ee7b7" }}>
            {ok}/{sources.length} sources OK
          </span>
          {fetchedAt && <span className="tabular">updated {formatRelative(fetchedAt, now)}</span>}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title="Legal public sources">
          <ul className="space-y-1.5 px-3 pb-2">
            {sources.map((s) => (
              <li key={s.id} className="rounded-lg border border-border/60 px-2.5 py-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-fg">{s.name}</span>
                  <StatusDot status={s.status} />
                </div>
                <div className="mt-0.5 text-[11px] text-muted">{s.detail}</div>
                <div className="text-[10px] text-dim">{s.legal}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={`Seismic watch · USGS (${watch.length} near zones)`}>
          {watch.length === 0 ? (
            <div className="px-3 pb-2 text-xs text-muted">
              No M2.5+ events inside nuclear watch radii (24h). Most quakes are ordinary geology.
            </div>
          ) : (
            <ul>
              {watch.slice(0, 12).map((e) => (
                <li key={e.id} className="border-b border-border/40 px-3 py-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <span
                      className={
                        e.nuclearRelevance === "elevated" ? "font-semibold text-warn" : "text-fg"
                      }
                    >
                      M{e.mag.toFixed(1)} · {e.place}
                    </span>
                    <span className="shrink-0 text-muted tabular">
                      {formatRelative(e.time, now)}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted">
                    {e.watchHits.map((h) => h.zoneName).join(" · ")} · {e.depthKm.toFixed(0)} km
                  </div>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-300 hover:underline"
                  >
                    USGS event
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="px-3 pb-2 text-[10px] text-dim">
            Background M≥5:{" "}
            {seismic.filter((e) => e.nuclearRelevance === "background" && e.mag >= 5).length}
          </div>
        </Section>

        <Section title={`Official / institutional wires (${official.length})`}>
          {official.length === 0 ? (
            <div className="px-3 pb-2 text-xs text-muted">No items yet — feeds may be slow.</div>
          ) : (
            <ul>
              {official.slice(0, 20).map((item) => (
                <li key={item.id} className="border-b border-border/40 px-3 py-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
                    <span className="chip">{item.source}</span>
                    <span className="tabular">{formatRelative(item.publishedAt, now)}</span>
                  </div>
                  <div className="mt-0.5 font-medium text-bright">{item.title}</div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-300 hover:underline"
                    >
                      Open
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="border-t border-border px-3 py-2 text-[10px] leading-relaxed text-muted">
        {disclaimer}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border/60">
      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
        {title}
      </div>
      {children}
    </section>
  );
}

function StatusDot({ status }: { status: DataSourceStatus["status"] }) {
  const color = status === "ok" ? "#34d399" : status === "degraded" ? "#fbbf24" : "#f87171";
  const label = status === "ok" ? "OK" : status === "degraded" ? "LIMITED" : "DOWN";
  return (
    <span className="chip text-[10px]" style={{ borderColor: color, color }}>
      {label}
    </span>
  );
}
