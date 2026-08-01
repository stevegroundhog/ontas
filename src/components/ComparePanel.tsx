import { useMemo } from "react";
import { nations, type DeliveryLeg, type NuclearNation } from "@/data/nuclear-forces";
import { formatNum } from "@/lib/utils";

const LEGS: DeliveryLeg[] = ["ICBM", "SLBM", "IRBM/MRBM", "Bomber", "Cruise", "Tactical"];

function Metric({
  label,
  a,
  b,
  format,
}: {
  label: string;
  a: string | number;
  b: string | number;
  format?: (n: number) => string;
}) {
  const fa = typeof a === "number" && format ? format(a) : String(a);
  const fb = typeof b === "number" && format ? format(b) : String(b);
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-border/50 py-2 text-xs">
      <div className="tabular font-semibold text-sky-200">{fa}</div>
      <div className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className="tabular text-right font-semibold text-violet-200">{fb}</div>
    </div>
  );
}

function hasLeg(n: NuclearNation, leg: DeliveryLeg): boolean {
  return n.systems.some((s) => s.type === leg);
}

export function ComparePanel({
  leftId,
  rightId,
  onChangeLeft,
  onChangeRight,
}: {
  leftId: string;
  rightId: string;
  onChangeLeft: (id: string) => void;
  onChangeRight: (id: string) => void;
}) {
  const left = useMemo(() => nations.find((n) => n.id === leftId) ?? nations[0]!, [leftId]);
  const right = useMemo(() => nations.find((n) => n.id === rightId) ?? nations[1]!, [rightId]);

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-violet-400">Compare</div>
        <div className="mt-0.5 text-sm font-bold text-bright">
          Two nuclear-armed states side-by-side
        </div>
        <p className="mt-1 text-[11px] text-muted">
          Open estimates only (FAS/SIPRI-class). Not official inventories.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-[10px] font-semibold uppercase text-muted">
            Left
            <select
              className="mt-1 w-full rounded-lg border border-border bg-bg px-2 py-2 text-xs text-fg"
              value={left.id}
              onChange={(e) => onChangeLeft(e.target.value)}
            >
              {nations.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.short} — {n.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[10px] font-semibold uppercase text-muted">
            Right
            <select
              className="mt-1 w-full rounded-lg border border-border bg-bg px-2 py-2 text-xs text-fg"
              value={right.id}
              onChange={(e) => onChangeRight(e.target.value)}
            >
              {nations.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.short} — {n.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="text-sky-300">{left.short}</div>
          <div className="text-muted">vs</div>
          <div className="text-violet-300">{right.short}</div>
        </div>

        <Metric
          label="Total inventory"
          a={left.totalInventory}
          b={right.totalInventory}
          format={formatNum}
        />
        <Metric
          label="Military stockpile"
          a={left.militaryStockpile}
          b={right.militaryStockpile}
          format={formatNum}
        />
        <Metric
          label="Deployed strategic"
          a={left.deployedStrategic}
          b={right.deployedStrategic}
          format={formatNum}
        />
        <Metric
          label="Deployed non-strat"
          a={left.deployedNonstrategic}
          b={right.deployedNonstrategic}
          format={formatNum}
        />
        <Metric label="Reserve / other" a={left.reserve} b={right.reserve} format={formatNum} />
        <Metric label="Triad" a={left.triad ? "Yes" : "No"} b={right.triad ? "Yes" : "No"} />
        <Metric label="Threat idx (ed.)" a={`${left.threatLevel}/5`} b={`${right.threatLevel}/5`} />

        <div className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
          Delivery legs present
        </div>
        <div className="mt-2 space-y-1">
          {LEGS.map((leg) => (
            <div key={leg} className="grid grid-cols-3 items-center gap-2 text-[11px]">
              <div className={hasLeg(left, leg) ? "font-semibold text-ok" : "text-dim"}>
                {hasLeg(left, leg) ? "Yes" : "—"}
              </div>
              <div className="text-center text-muted">{leg}</div>
              <div
                className={`text-right ${hasLeg(right, leg) ? "font-semibold text-ok" : "text-dim"}`}
              >
                {hasLeg(right, leg) ? "Yes" : "—"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <DoctrineCard
            title={left.short}
            doctrine={left.doctrine}
            strategy={left.strategy}
            posture={left.posture}
            systems={left.systems.map((s) => s.name)}
          />
          <DoctrineCard
            title={right.short}
            doctrine={right.doctrine}
            strategy={right.strategy}
            posture={right.posture}
            systems={right.systems.map((s) => s.name)}
          />
        </div>
      </div>
    </div>
  );
}

function DoctrineCard({
  title,
  doctrine,
  strategy,
  posture,
  systems,
}: {
  title: string;
  doctrine: string;
  strategy: string;
  posture: string;
  systems: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-3 text-[11px] leading-relaxed">
      <div className="text-xs font-bold text-bright">{title}</div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
        Doctrine
      </div>
      <p className="text-fg/90">{doctrine}</p>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
        Strategy
      </div>
      <p className="text-fg/90">{strategy}</p>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
        Posture
      </div>
      <p className="text-fg/90">{posture}</p>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
        Key systems
      </div>
      <ul className="mt-1 list-inside list-disc text-muted">
        {systems.slice(0, 5).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
