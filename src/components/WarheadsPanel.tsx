import { ArsenalPanel } from "./ArsenalPanel";
import { ForceTable } from "./ForceTable";
import { nations } from "@/data/nuclear-forces";

/** Warheads & yields: ranking table + open kt/Mt catalog together */
export function WarheadsPanel({
  nationId,
  onSelectNation,
}: {
  nationId: string | null;
  onSelectNation: (id: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="max-h-[220px] shrink-0 overflow-hidden">
        <ForceTable
          nations={nations}
          selectedId={nationId}
          onSelect={onSelectNation}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <ArsenalPanel nationId={nationId} onSelectNation={onSelectNation} yieldsOnly />
      </div>
    </div>
  );
}
