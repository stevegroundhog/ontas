import { formatNum } from "@/lib/utils";
import type { NuclearNation } from "@/data/nuclear-forces";
import { stockpileShare } from "@/data/nuclear-forces";
import { geoForNation } from "@/data/geography";
import { aircraftForNation, formatYield, yieldsForNation } from "@/data/arsenal-detail";

export function NationPanel({ nation }: { nation: NuclearNation | null }) {
  if (!nation) {
    return (
      <div className="crt-panel flex h-full flex-col justify-center p-4 text-sm text-muted">
        <p className="tracking-wide">Select a nation on the map or force table</p>
      </div>
    );
  }

  const share = stockpileShare(nation);
  const geo = geoForNation(nation.id);
  const yields = yieldsForNation(nation.id);
  const aircraft = aircraftForNation(nation.id);

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-bold tracking-wide text-bright sm:text-base">{nation.name}</h2>
          <span className="text-xs text-muted tabular">{nation.short}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-muted">
          <span>Triad: {nation.triad ? "Yes" : "No"}</span>
          <span>·</span>
          <span>Threat idx {nation.threatLevel}/5</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
        {[
          ["Deployed strat", nation.deployedStrategic],
          ["Deployed NS", nation.deployedNonstrategic],
          ["Reserve", nation.reserve],
          ["Mil stockpile", nation.militaryStockpile],
        ].map(([label, val]) => (
          <div key={label as string} className="bg-panel px-3 py-2">
            <div className="text-[9px] uppercase tracking-wider text-muted">{label}</div>
            <div className="text-lg tabular text-fg">{formatNum(val as number)}</div>
          </div>
        ))}
      </div>

      <div className="border-b border-border px-3 py-2">
        <div className="flex justify-between text-[10px] text-muted">
          <span>Total inventory</span>
          <span className="tabular text-fg">{formatNum(nation.totalInventory)}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-sm bg-dim">
          <div
            className="h-full bg-sky-400 transition-[width] duration-500"
            style={{ width: `${Math.max(2, Math.min(100, share))}%` }}
          />
        </div>
        <div className="mt-1 text-[9px] text-muted tabular">{share.toFixed(1)}% of global</div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs leading-relaxed">
        <Section title="Doctrine" body={nation.doctrine} />
        <Section title="Nuclear strategy" body={nation.strategy} accent />
        <Section title="Posture" body={nation.posture} />

        {yields.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
              Open yield estimates
            </div>
            <ul className="mt-1 space-y-1">
              {yields.map((w) => (
                <li
                  key={w.id}
                  className="flex flex-wrap items-baseline justify-between gap-1 rounded-lg border border-border/70 bg-bg/30 px-2 py-1.5 text-[10px]"
                >
                  <span className="text-fg">{w.name}</span>
                  <span className="font-mono font-bold text-amber-200">{formatYield(w)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {aircraft.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
              Nuclear-capable aircraft
            </div>
            <ul className="mt-1 space-y-1">
              {aircraft.map((a) => (
                <li
                  key={a.id}
                  className="rounded-lg border border-border/70 bg-bg/30 px-2 py-1.5 text-[10px]"
                >
                  <span className="font-semibold text-fg">{a.name}</span>
                  <span className="text-muted"> · {a.weapons}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {geo?.sites && geo.sites.length > 0 && (
          <div className="mb-2">
            <div className="text-[10px] uppercase tracking-wider text-muted">Strategic geography</div>
            <ul className="mt-1 space-y-1">
              {geo.sites.map((s) => (
                <li
                  key={s.name}
                  className="flex justify-between gap-1 border border-border/60 bg-bg/30 px-2 py-1 text-[10px]"
                >
                  <span className="text-fg">
                    <span className="text-muted">{s.kind}</span> {s.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-2 text-[10px] uppercase tracking-wider text-muted">Delivery systems</div>
        <ul className="mt-1 space-y-2">
          {nation.systems.map((s) => (
            <li key={s.name} className="border border-border/80 bg-bg/40 px-2 py-1.5">
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-fg">{s.name}</span>
                <span className="text-[9px] text-muted">
                  {s.type}
                  {s.mirv ? " · MIRV" : ""}
                </span>
              </div>
              <div className="mt-0.5 text-[9px] text-muted tabular">
                Range: {s.rangeKm > 0 ? `${formatNum(s.rangeKm)} km` : "N/A"} · {s.status}
              </div>
              <p className="mt-1 text-[10px] text-muted">{s.notes}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Section({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div className="mb-2">
      <div className={`text-[10px] uppercase tracking-wider ${accent ? "text-sky-400" : "text-muted"}`}>
        {title}
      </div>
      <p className="mt-0.5 text-[11px] leading-relaxed text-fg/90">{body}</p>
    </div>
  );
}
