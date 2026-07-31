import { formatNum } from "@/lib/utils";
import type { NuclearNation } from "@/data/nuclear-forces";

interface ForceTableProps {
  nations: NuclearNation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ForceTable({ nations, selectedId, onSelect }: ForceTableProps) {
  const sorted = [...nations].sort((a, b) => b.totalInventory - a.totalInventory);

  return (
    <div className="crt-panel overflow-hidden">
      <div className="border-b border-border px-3 py-2 text-[10px] tracking-[0.25em] text-muted">
        WORLD NUCLEAR FORCES — MILITARY STOCKPILE RANKING
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-border text-[9px] tracking-wider text-muted">
              <th className="px-2 py-1.5 font-normal">#</th>
              <th className="px-2 py-1.5 font-normal">STATE</th>
              <th className="px-2 py-1.5 font-normal tabular">DEPLOYED</th>
              <th className="px-2 py-1.5 font-normal tabular">STOCKPILE</th>
              <th className="px-2 py-1.5 font-normal tabular">TOTAL INV</th>
              <th className="px-2 py-1.5 font-normal">ICBM</th>
              <th className="px-2 py-1.5 font-normal">TRIAD</th>
              <th className="px-2 py-1.5 font-normal">THREAT</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((n, i) => {
              const hasIcbm = n.systems.some((s) => s.type === "ICBM");
              const selected = selectedId === n.id;
              return (
                <tr
                  key={n.id}
                  onClick={() => onSelect(n.id)}
                  className={`cursor-pointer border-b border-border/40 transition-colors ${
                    selected ? "bg-fg/15 text-bright" : "hover:bg-fg/5"
                  }`}
                >
                  <td className="px-2 py-1.5 tabular text-muted">{i + 1}</td>
                  <td className="px-2 py-1.5 tracking-wide">{n.short}</td>
                  <td className="px-2 py-1.5 tabular">
                    {formatNum(n.deployedStrategic + n.deployedNonstrategic)}
                  </td>
                  <td className="px-2 py-1.5 tabular">{formatNum(n.militaryStockpile)}</td>
                  <td className="px-2 py-1.5 tabular">{formatNum(n.totalInventory)}</td>
                  <td className="px-2 py-1.5">{hasIcbm ? "YES" : "—"}</td>
                  <td className="px-2 py-1.5">{n.triad ? "Y" : "N"}</td>
                  <td className="px-2 py-1.5">
                    <span
                      className={
                        n.threatLevel >= 4
                          ? "text-danger"
                          : n.threatLevel >= 3
                            ? "text-warn"
                            : "text-muted"
                      }
                    >
                      {"■".repeat(n.threatLevel)}
                      <span className="text-dim">{"■".repeat(5 - n.threatLevel)}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
