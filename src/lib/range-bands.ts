import type { NuclearNation } from "@/data/nuclear-forces";

export type RangeBand = {
  id: string;
  rKm: number;
  color: string;
  label: string;
  shortLabel: string;
  width: number;
  dash?: string;
};

/** Open-estimate max range per delivery leg for map rings + callouts. */
export function bandsForNation(n: NuclearNation, focus: boolean): RangeBand[] {
  const maxOf = (types: string[]) => {
    const vals = n.systems
      .filter((s) => types.includes(s.type) && s.rangeKm > 0)
      .map((s) => s.rangeKm);
    return vals.length ? Math.max(...vals) : 0;
  };

  const icbm = maxOf(["ICBM"]);
  const slbm = maxOf(["SLBM"]);
  const bomber = maxOf(["Bomber"]);
  const theater = maxOf(["IRBM/MRBM", "Cruise", "Tactical"]);

  const rings: RangeBand[] = [];
  if (icbm > 0) {
    rings.push({
      id: "icbm",
      rKm: icbm,
      color: "#f472b6",
      shortLabel: "ICBM",
      label: `ICBM ${icbm.toLocaleString("en-US")} km`,
      width: focus ? 2.9 : 1.35,
    });
  }
  if (slbm > 0) {
    rings.push({
      id: "slbm",
      rKm: slbm,
      color: "#c084fc",
      shortLabel: "SLBM",
      label: `SLBM ${slbm.toLocaleString("en-US")} km`,
      width: focus ? 2.5 : 1.2,
      dash: Math.abs(slbm - icbm) < 400 ? "5 3" : undefined,
    });
  }
  if (bomber > 0) {
    rings.push({
      id: "bomber",
      rKm: bomber,
      color: "#22d3ee",
      shortLabel: "Bomber",
      label: `Bomber ${bomber.toLocaleString("en-US")} km`,
      width: focus ? 2.1 : 1.05,
      dash: "7 4",
    });
  }
  if (theater > 0) {
    rings.push({
      id: "theater",
      rKm: theater,
      color: "#fbbf24",
      shortLabel: "Theater",
      label: `Theater ${theater.toLocaleString("en-US")} km`,
      width: focus ? 1.9 : 1,
      dash: "3 3",
    });
  }

  // Largest first so smaller rings paint on top
  rings.sort((a, b) => b.rKm - a.rKm);
  return rings;
}
