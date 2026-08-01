import { formatNum } from "@/lib/utils";
import type { NuclearNation } from "@/data/nuclear-forces";
import { stockpileShare } from "@/data/nuclear-forces";
import { geoForNation } from "@/data/geography";

export function NationPanel({ nation }: { nation: NuclearNation | null }) {
  if (!nation) {
    return (
      <div className="crt-panel flex h-full flex-col justify-center p-4 text-sm text-muted">
        <p className="tracking-wide">SELECT A NATION ON THE MAP</p>
        <p className="mt-2 text-xs">CLICK TERRITORY BORDERS, FORCE NODES, OR TABLE ROWS</p>
      </div>
    );
  }

  const share = stockpileShare(nation);
  const geo = geoForNation(nation.id);

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm tracking-widest text-bright crt-glow sm:text-base">
            {nation.name}
          </h2>
          <span className="text-xs text-muted tabular">{nation.short}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-[10px] tracking-wide text-muted">
          <span>TRIAD: {nation.triad ? "YES" : "NO"}</span>
          <span>·</span>
          <span>THREAT IDX: {nation.threatLevel}/5</span>
          {geo && (
            <>
              <span>·</span>
              <span>
                GEO {geo.label.lat.toFixed(1)}N {Math.abs(geo.label.lon).toFixed(1)}
                {geo.label.lon >= 0 ? "E" : "W"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
        {[
          ["DEPLOYED STRAT", nation.deployedStrategic],
          ["DEPLOYED NS", nation.deployedNonstrategic],
          ["RESERVE", nation.reserve],
          ["MIL STOCKPILE", nation.militaryStockpile],
        ].map(([label, val]) => (
          <div key={label as string} className="bg-panel px-3 py-2">
            <div className="text-[9px] tracking-wider text-muted">{label}</div>
            <div className="text-lg tabular text-fg crt-glow">{formatNum(val as number)}</div>
          </div>
        ))}
      </div>

      <div className="border-b border-border px-3 py-2">
        <div className="flex justify-between text-[10px] text-muted">
          <span>TOTAL INVENTORY</span>
          <span className="tabular text-fg">{formatNum(nation.totalInventory)}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-sm bg-dim">
          <div
            className="h-full bg-fg transition-[width] duration-500"
            style={{ width: `${Math.max(2, Math.min(100, share))}%` }}
          />
        </div>
        <div className="mt-1 text-[9px] text-muted tabular">
          {share.toFixed(1)}% OF GLOBAL INVENTORY
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs leading-relaxed">
        <Section title="DOCTRINE" body={nation.doctrine} />
        <Section title="NUCLEAR STRATEGY" body={nation.strategy} accent />
        <Section title="POSTURE" body={nation.posture} />
        <Section title="STRATEGIC CLIMATE" body={nation.climateNote} />

        {geo?.sites && geo.sites.length > 0 && (
          <div className="mb-2">
            <div className="text-[10px] tracking-widest text-muted">STRATEGIC GEOGRAPHY</div>
            <ul className="mt-1 space-y-1">
              {geo.sites.map((s) => (
                <li
                  key={s.name}
                  className="flex flex-wrap items-baseline justify-between gap-1 border border-border/60 bg-bg/30 px-2 py-1 text-[10px]"
                >
                  <span className="text-fg">
                    <span className="text-muted">
                      {s.kind === "silo"
                        ? "SILO"
                        : s.kind === "ssbn"
                          ? "SSBN"
                          : s.kind === "test"
                            ? "TEST"
                            : s.kind === "c2"
                              ? "C2"
                              : "BASE"}
                    </span>{" "}
                    {s.name}
                  </span>
                  <span className="tabular text-muted">
                    {s.lat.toFixed(1)}°, {s.lon.toFixed(1)}°
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 text-[10px] tracking-widest text-muted">DELIVERY SYSTEMS</div>
        <ul className="mt-1 space-y-2">
          {nation.systems.map((s) => (
            <li key={s.name} className="border border-border/80 bg-bg/40 px-2 py-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <span className="text-fg">{s.name}</span>
                <span className="text-[9px] text-muted">
                  {s.type}
                  {s.mirv ? " · MIRV" : ""}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap gap-2 text-[9px] text-muted tabular">
                <span>
                  RANGE: {s.rangeKm > 0 ? `${formatNum(s.rangeKm)} km` : "N/A (gravity)"}
                </span>
                <span>STATUS: {s.status.toUpperCase()}</span>
              </div>
              <p className="mt-1 text-[10px] leading-snug text-muted">{s.notes}</p>
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
      <div className={`text-[10px] tracking-widest ${accent ? "text-sky-400" : "text-muted"}`}>
        {title}
      </div>
      <p className="mt-0.5 text-[11px] leading-relaxed text-fg/90">{body}</p>
    </div>
  );
}
