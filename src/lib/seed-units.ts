import { estimateSubPositions, HOME_PORTS, SSBN_FLEET } from "@/data/naval-deployments";
import {
  CATEGORY_META,
  NATION_COLORS,
  type MaritimeUnit,
} from "@/data/maritime-units";
import { nationById } from "@/data/nuclear-forces";

/** Client-side SSBN unit seed so naval panel is never empty before AIS fetch */
export function seedSsbnUnits(now = Date.now()): MaritimeUnit[] {
  const subs = estimateSubPositions(now);
  const fleetById = new Map(SSBN_FLEET.map((b) => [b.id, b]));
  return subs.map((s) => {
    const n = nationById(s.nationId);
    const boat = fleetById.get(s.id);
    const phase = boat?.phase ?? 0;
    return {
      id: s.id,
      name: s.name,
      className: s.className,
      category: "ssbn" as const,
      nationId: s.nationId,
      nationLabel: n?.short ?? s.nationId.toUpperCase(),
      lat: s.lat,
      lon: s.lon,
      heading: s.heading,
      speedKn: s.status === "patrol" ? 10 + phase * 6 : 0,
      status: s.status,
      missiles: s.missiles,
      homePort: HOME_PORTS.find((p) => p.id === s.homePortId)?.name,
      trackSource: "osint-estimate" as const,
      updatedAt: now,
      color: NATION_COLORS[s.nationId] ?? CATEGORY_META.ssbn.color,
      note: "Submerged SSBNs do not broadcast AIS — open-source patrol zone estimate",
    };
  });
}
