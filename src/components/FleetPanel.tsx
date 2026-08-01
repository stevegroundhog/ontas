import { aircraftForNation, NUCLEAR_AIRCRAFT } from "@/data/arsenal-detail";
import { nations } from "@/data/nuclear-forces";
import type { MaritimeUnit } from "@/data/maritime-units";
import type { SubPosition } from "@/data/naval-deployments";
import type { AisContact } from "@/server/maritime";
import { formatNum } from "@/lib/utils";
import { NavalPanel } from "./NavalPanel";
import { PanelFrame } from "./AppNav";

export function FleetPanel({
  units,
  subs,
  ais,
  aisSource,
  fetchedAt,
  selectedSubId,
  onSelectSub,
  now,
  nationId,
  onSelectNation,
}: {
  units: MaritimeUnit[];
  subs: SubPosition[];
  ais: AisContact[];
  aisSource: string;
  fetchedAt: string | null;
  selectedSubId: string | null;
  onSelectSub: (id: string | null) => void;
  now: number;
  nationId: string | null;
  onSelectNation: (id: string) => void;
}) {
  const air =
    nationId && nationId !== "all"
      ? aircraftForNation(nationId)
      : NUCLEAR_AIRCRAFT;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="min-h-0 flex-[1.2] overflow-hidden">
        <NavalPanel
          units={units}
          subs={subs}
          ais={ais}
          aisSource={aisSource}
          fetchedAt={fetchedAt}
          selectedSubId={selectedSubId}
          onSelectSub={onSelectSub}
          now={now}
        />
      </div>
      <PanelFrame
        title="Nuclear-capable aircraft"
        subtitle="Open assessments of strategic bombers and dual-capable fighters — with ships & subs above."
        actions={
          <select
            className="soft-btn bg-bg text-xs"
            value={nationId ?? "all"}
            onChange={(e) => {
              if (e.target.value !== "all") onSelectNation(e.target.value);
            }}
          >
            <option value="all">All nations</option>
            {nations.map((n) => (
              <option key={n.id} value={n.id}>
                {n.short}
              </option>
            ))}
          </select>
        }
      >
        <div className="grid gap-2 p-3 sm:grid-cols-2">
          {air.map((a) => {
            const n = nations.find((x) => x.id === a.nationId);
            return (
              <article
                key={a.id}
                className="rounded-xl border border-border bg-bg/40 px-3 py-2.5 text-[11px] leading-relaxed"
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
                <p className="mt-0.5 text-muted">
                  {a.weapons}
                  {a.rangeKm != null ? ` · ${formatNum(a.rangeKm)} km` : ""}
                </p>
                <p className="mt-1 text-dim">{a.notes}</p>
              </article>
            );
          })}
        </div>
      </PanelFrame>
    </div>
  );
}
