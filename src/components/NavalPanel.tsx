import { CATEGORY_META, type MaritimeUnit } from "@/data/maritime-units";
import type { AisContact } from "@/server/maritime";
import type { SubPosition } from "@/data/naval-deployments";
import { HOME_PORTS } from "@/data/naval-deployments";
import { formatRelative } from "@/data/threat-news";

interface NavalPanelProps {
  units: MaritimeUnit[];
  subs: SubPosition[];
  ais: AisContact[];
  aisSource: string;
  fetchedAt: string | null;
  selectedSubId: string | null;
  onSelectSub: (id: string | null) => void;
  now: number;
}

export function NavalPanel({
  units,
  ais,
  aisSource,
  fetchedAt,
  selectedSubId,
  onSelectSub,
  now,
}: NavalPanelProps) {
  const ssbns = units.filter((u) => u.category === "ssbn");
  const live = units.filter((u) => u.trackSource === "ais-live");
  const patrol = ssbns.filter((s) => s.status === "patrol").length;

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent" style={{ color: "#a78bfa" }}>
          Maritime units
        </div>
        <div className="mt-1 text-sm font-bold text-bright">
          {patrol} SSBN on patrol · {live.length} live AIS military/surface
        </div>
        {fetchedAt && (
          <div className="mt-1 text-xs text-muted">
            Updated {formatRelative(fetchedAt, now)} · {aisSource}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border px-3 py-2">
        {Object.entries(CATEGORY_META)
          .filter(([k]) => ["ssbn", "surface", "support", "tender", "merchant"].includes(k))
          .map(([k, meta]) => (
            <span
              key={k}
              className="chip"
              style={{ borderColor: meta.color, color: meta.color }}
              title={meta.description}
            >
              {meta.short}
            </span>
          ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Strategic SSBNs (OSINT estimates)
        </div>
        <ul>
          {ssbns.map((u) => {
            const selected = selectedSubId === u.id;
            return (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => onSelectSub(selected ? null : u.id)}
                  className={`flex w-full items-start gap-3 border-b border-border/60 px-4 py-2.5 text-left transition-colors ${
                    selected ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ background: u.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-bright">{u.name}</span>
                    <span className="text-xs text-muted">
                      {u.nationLabel} · {u.className} · {u.status}
                      {u.missiles ? ` · ${u.missiles}` : ""}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-dim">
                      {u.trackSource === "osint-estimate" ? "EST track" : "LIVE AIS"} ·{" "}
                      {u.speedKn.toFixed(0)} kn · {u.lat.toFixed(1)}°, {u.lon.toFixed(1)}°
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Home ports
        </div>
        <ul className="px-4 pb-2">
          {HOME_PORTS.map((p) => (
            <li key={p.id} className="flex justify-between py-1 text-xs text-muted">
              <span>{p.name}</span>
              <span className="tabular text-dim">
                {p.lat.toFixed(1)}° {p.lon.toFixed(1)}°
              </span>
            </li>
          ))}
        </ul>

        {live.length > 0 && (
          <>
            <div className="border-t border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Live AIS units (Baltic)
            </div>
            <ul>
              {live.slice(0, 16).map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-2 border-b border-border/40 px-4 py-2 text-xs"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: u.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-fg">{u.name}</span>
                  <span className="chip" style={{ borderColor: u.color, color: u.color }}>
                    {CATEGORY_META[u.category].short}
                  </span>
                  <span className="tabular text-muted">{u.speedKn.toFixed(0)} kn</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="border-t border-border px-4 py-2 text-[11px] leading-relaxed text-muted">
        <strong className="text-fg">SSBN</strong> = ballistic missile submarine (strategic). Tracks
        are open-source estimates while submerged. <strong className="text-fg">AIS</strong> = live
        surface contacts ({ais.length} raw).
      </div>
    </div>
  );
}
