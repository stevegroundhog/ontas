import { useMemo, useState } from "react";
import {
  NUCLEAR_AIRCRAFT,
  WARHEAD_YIELDS,
  aircraftForNation,
  formatYield,
  yieldsForNation,
} from "@/data/arsenal-detail";
import { nations } from "@/data/nuclear-forces";
import { formatNum } from "@/lib/utils";
import { PanelFrame } from "./AppNav";

type Mode = "yields" | "aircraft";

export function ArsenalPanel({
  nationId,
  onSelectNation,
}: {
  nationId: string | null;
  onSelectNation: (id: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("yields");
  const [filter, setFilter] = useState<string>(nationId ?? "all");

  const yieldRows = useMemo(() => {
    const list = filter === "all" ? WARHEAD_YIELDS : yieldsForNation(filter);
    return list;
  }, [filter]);

  const airRows = useMemo(() => {
    const list = filter === "all" ? NUCLEAR_AIRCRAFT : aircraftForNation(filter);
    return list;
  }, [filter]);

  return (
    <PanelFrame
      title="Warhead yields & nuclear-capable aircraft"
      subtitle="Open estimates (kt / Mt). Not official yields. Educational comparison only."
      actions={
        <>
          <button
            type="button"
            className={`soft-btn ${mode === "yields" ? "active" : ""}`}
            onClick={() => setMode("yields")}
          >
            Yields (kt/Mt)
          </button>
          <button
            type="button"
            className={`soft-btn ${mode === "aircraft" ? "active" : ""}`}
            onClick={() => setMode("aircraft")}
          >
            Aircraft
          </button>
        </>
      }
    >
      <div className="space-y-3 p-4">
        <label className="block text-[10px] font-semibold uppercase tracking-wide text-muted">
          Filter by nation
          <select
            className="mt-1 w-full max-w-md rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              if (e.target.value !== "all") onSelectNation(e.target.value);
            }}
          >
            <option value="all">All nuclear-armed states</option>
            {nations.map((n) => (
              <option key={n.id} value={n.id}>
                {n.short} — {n.name}
              </option>
            ))}
          </select>
        </label>

        {mode === "yields" ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-black/30 text-[10px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Nation</th>
                  <th className="px-3 py-2">Warhead / family</th>
                  <th className="px-3 py-2">Delivery</th>
                  <th className="px-3 py-2">Yield (open est.)</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {yieldRows.map((w) => {
                  const n = nations.find((x) => x.id === w.nationId);
                  return (
                    <tr key={w.id} className="hover:bg-white/5">
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="font-semibold text-sky-300 hover:underline"
                          onClick={() => onSelectNation(w.nationId)}
                        >
                          {n?.short ?? w.nationId}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-bright">{w.name}</td>
                      <td className="px-3 py-2 text-muted">{w.delivery}</td>
                      <td className="px-3 py-2 font-mono font-bold text-amber-200">
                        {formatYield(w)}
                      </td>
                      <td className="px-3 py-2 text-muted">{w.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="border-t border-border px-3 py-2 text-[10px] text-dim">
              {yieldRows.length} entries · 1 kt = 1,000 tons TNT equivalent · 1 Mt = 1,000 kt. Ranges
              reflect open uncertainty, not precise loadings.
            </p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {airRows.map((a) => {
              const n = nations.find((x) => x.id === a.nationId);
              return (
                <article
                  key={a.id}
                  className="rounded-xl border border-border bg-bg/40 px-3 py-3 text-[11px] leading-relaxed"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="text-xs font-bold text-sky-300 hover:underline"
                      onClick={() => onSelectNation(a.nationId)}
                    >
                      {n?.short}
                    </button>
                    <span className="chip">{a.role}</span>
                    <span className="chip">{a.status}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-bright">{a.name}</h3>
                  <p className="mt-1 text-muted">
                    Weapons: <span className="text-fg/90">{a.weapons}</span>
                  </p>
                  <p className="text-muted">
                    Range:{" "}
                    <span className="tabular text-fg/90">
                      {a.rangeKm != null ? `${formatNum(a.rangeKm)} km` : "not public"}
                    </span>
                  </p>
                  <p className="mt-1 text-dim">{a.notes}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PanelFrame>
  );
}
