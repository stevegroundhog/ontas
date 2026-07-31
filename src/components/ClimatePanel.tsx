import {
  climateBrief,
  DATA_AS_OF,
  GLOBAL_DEPLOYED_STRATEGIC,
  GLOBAL_MILITARY_STOCKPILE,
  GLOBAL_TOTAL_INVENTORY,
} from "@/data/nuclear-forces";
import { formatNum } from "@/lib/utils";

export function ClimatePanel() {
  return (
    <div className="crt-panel overflow-hidden">
      <div className="border-b border-border px-3 py-2">
        <div className="text-[10px] tracking-[0.25em] text-muted">GLOBAL POLITICAL / STRATEGIC CLIMATE</div>
        <div className="text-xs text-bright">DATA WINDOW: {DATA_AS_OF}</div>
      </div>

      <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
        {[
          ["GLOBAL INVENTORY", GLOBAL_TOTAL_INVENTORY],
          ["MIL STOCKPILE", GLOBAL_MILITARY_STOCKPILE],
          ["DEPLOYED STRAT", GLOBAL_DEPLOYED_STRATEGIC],
        ].map(([label, val]) => (
          <div key={label as string} className="bg-panel px-2 py-2 text-center sm:px-3">
            <div className="text-[8px] tracking-wider text-muted sm:text-[9px]">{label}</div>
            <div className="text-base tabular text-fg crt-glow sm:text-lg">
              {formatNum(val as number)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2">
        {climateBrief.map((b) => (
          <div key={b.title} className="border border-border/80 bg-bg/30 px-2 py-2">
            <div className="text-[9px] tracking-widest text-muted">{b.title}</div>
            <p className="mt-1 text-[10px] leading-relaxed text-fg/90 sm:text-[11px]">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-3 py-2 text-[9px] leading-relaxed text-muted">
        EDUCATIONAL VISUALIZATION ONLY. FIGURES ARE OPEN-SOURCE ESTIMATES (FAS, SIPRI, ARMS CONTROL
        ASSOCIATION, BULLETIN OF THE ATOMIC SCIENTISTS). NOT OFFICIAL GOVERNMENT DATA. NOT A
        TARGETING SYSTEM.
      </div>
    </div>
  );
}
