import { HOME_PORTS } from "@/data/naval-deployments";
import { NATION_BORDERS } from "@/data/geography";
import { nations } from "@/data/nuclear-forces";
import { haversineKm, WATCH_ZONES } from "@/data/watch-zones";
import type { PlaceHit } from "@/server/geocode";

export type RiskBand = "low" | "moderate" | "elevated" | "high";

export type SurvivalItem = {
  id: string;
  name: string;
  category: "water" | "food" | "shelter" | "medical" | "comms" | "nuclear" | "tools" | "docs" | "climate";
  priority: 1 | 2 | 3;
  reason: string;
  qtyHint?: string;
};

export type SurvivalProfile = {
  place: PlaceHit;
  riskBand: RiskBand;
  riskScore: number;
  riskColor: string;
  summary: string;
  factors: string[];
  nearestTargets: { name: string; kind: string; distanceKm: number }[];
  climate: "arctic" | "cold" | "temperate" | "hot" | "tropical";
  settlement: "city" | "town" | "village" | "rural" | "unknown";
  items: SurvivalItem[];
  actions: string[];
  disclaimer: string;
};

function settlementType(place: PlaceHit): SurvivalProfile["settlement"] {
  const k = `${place.kind} ${place.displayName}`.toLowerCase();
  if (/city|municipality|borough/.test(k) || place.importance > 0.55) return "city";
  if (/town|suburb/.test(k) || place.importance > 0.35) return "town";
  if (/village|hamlet|locality/.test(k)) return "village";
  if (/isolated|farm|rural/.test(k)) return "rural";
  return place.importance > 0.4 ? "town" : "unknown";
}

function climateBand(lat: number): SurvivalProfile["climate"] {
  const a = Math.abs(lat);
  if (a >= 66) return "arctic";
  if (a >= 50) return "cold";
  if (a <= 15) return "tropical";
  if (a <= 30) return "hot";
  return "temperate";
}

function collectTargets() {
  const targets: { name: string; kind: string; lat: number; lon: number }[] = [];
  for (const n of nations) {
    targets.push({ name: `${n.short} C2 / capital area`, kind: "c2", lat: n.lat, lon: n.lon });
  }
  for (const g of NATION_BORDERS) {
    for (const s of g.sites ?? []) {
      targets.push({ name: s.name, kind: s.kind, lat: s.lat, lon: s.lon });
    }
  }
  for (const p of HOME_PORTS) {
    targets.push({ name: p.name, kind: "ssbn-base", lat: p.lat, lon: p.lon });
  }
  for (const z of WATCH_ZONES) {
    targets.push({ name: z.name, kind: z.kind, lat: z.lat, lon: z.lon });
  }
  return targets;
}

const ALL_TARGETS = collectTargets();

function baseKit(settlement: SurvivalProfile["settlement"], climate: SurvivalProfile["climate"]): SurvivalItem[] {
  const items: SurvivalItem[] = [
    {
      id: "water",
      name: "Drinking water (sealed)",
      category: "water",
      priority: 1,
      qtyHint: settlement === "city" ? "4 L / person / day × 7–14 days" : "4 L / person / day × 14 days",
      reason: "Utilities fail first after blast, EMP-like disruption, or infrastructure damage",
    },
    {
      id: "water-filter",
      name: "Portable water filter + purification tabs",
      category: "water",
      priority: 1,
      reason: "Backup when stored water runs out",
    },
    {
      id: "food",
      name: "Non-perishable calorie food",
      category: "food",
      priority: 1,
      qtyHint: "2,000+ kcal / person / day × 7–14 days",
      reason: "Stores and supply chains may close during crisis",
    },
    {
      id: "radio",
      name: "Battery / hand-crank NOAA or AM/FM radio",
      category: "comms",
      priority: 1,
      reason: "Official alerts (EAS/WEA) and news when phones/networks fail",
    },
    {
      id: "light",
      name: "Flashlights + spare batteries / headlamps",
      category: "tools",
      priority: 1,
      reason: "Power outages; avoid open flames indoors during sheltering",
    },
    {
      id: "firstaid",
      name: "First-aid kit + personal medications (14+ days)",
      category: "medical",
      priority: 1,
      reason: "Emergency rooms overload; pharmacies may close",
    },
    {
      id: "docs",
      name: "IDs, cash, copies of critical documents (waterproof pouch)",
      category: "docs",
      priority: 1,
      reason: "Evacuation, medical access, and family reunification",
    },
    {
      id: "whistle",
      name: "Whistle, multi-tool, duct tape, work gloves",
      category: "tools",
      priority: 2,
      reason: "Signaling, light debris, and shelter sealing",
    },
    {
      id: "hygiene",
      name: "Hygiene kit, trash bags, bleach (unscented)",
      category: "tools",
      priority: 2,
      reason: "Sanitation when water service is limited",
    },
  ];

  if (settlement === "city") {
    items.push({
      id: "go-bag",
      name: "Go-bag (ready to evacuate in 5 minutes)",
      category: "tools",
      priority: 1,
      reason: "Dense urban areas may order rapid evacuation or shelter-in-place",
    });
    items.push({
      id: "n95",
      name: "N95 / P100 respirators (fitted)",
      category: "nuclear",
      priority: 1,
      qtyHint: "Several per person",
      reason: "Dust, smoke, and fallout particulates after explosions or fires",
    });
  }

  if (settlement === "village" || settlement === "rural") {
    items.push({
      id: "fuel",
      name: "Safe fuel for cooking/heating + carbon monoxide detector",
      category: "tools",
      priority: 2,
      reason: "Rural power and fuel logistics are slower to restore",
    });
  }

  if (climate === "arctic" || climate === "cold") {
    items.push(
      {
        id: "warm",
        name: "Cold-weather layers, sleeping bags (0°F / −18°C rated)",
        category: "climate",
        priority: 1,
        reason: "Shelter without heat is life-threatening in cold climates",
      },
      {
        id: "heat-safe",
        name: "Indoor-safe heat plan (never charcoal indoors)",
        category: "climate",
        priority: 1,
        reason: "CO poisoning risk during blackouts",
      },
    );
  }
  if (climate === "hot" || climate === "tropical") {
    items.push({
      id: "cool",
      name: "Electrolyte packets, shade tarp, extra water margin",
      category: "climate",
      priority: 1,
      reason: "Heat injury risk rises without power for cooling",
    });
  }

  return items;
}

function nuclearItems(minTargetKm: number, nearWatch: boolean): SurvivalItem[] {
  const items: SurvivalItem[] = [
    {
      id: "shelter-plan",
      name: "Shelter-in-place plan (interior room, few windows)",
      category: "shelter",
      priority: 1,
      reason: "Fallout is most dangerous in the first 24–48 hours; thick walls + distance help",
    },
    {
      id: "plastic-tape",
      name: "Plastic sheeting + tape for sealing one room",
      category: "shelter",
      priority: 2,
      reason: "Reduces dust/fallout infiltration while sheltering",
    },
    {
      id: "clothes-change",
      name: "Spare sealed clothes + zip bags for contaminated outer layers",
      category: "nuclear",
      priority: 2,
      reason: "Remove outer clothing to cut external contamination if exposed outdoors",
    },
  ];

  if (minTargetKm < 80 || nearWatch) {
    items.push({
      id: "ki",
      name: "Potassium iodide (KI) — only if public health directs",
      category: "nuclear",
      priority: 2,
      reason: "Near potential nuclear targets / fallout corridors; use only on official instruction",
    });
    items.push({
      id: "dosimeter",
      name: "Optional personal radiation detector (if available)",
      category: "nuclear",
      priority: 3,
      reason: "Helps time outdoor movement after fallout; not required for basic readiness",
    });
  }

  if (minTargetKm < 25) {
    items.push({
      id: "evacuation-route",
      name: "Two printed evacuation routes away from blast / downwind areas",
      category: "docs",
      priority: 1,
      reason: "Very close to strategic sites — know how to leave before roads clog",
    });
  }

  return items;
}

export function buildSurvivalProfile(place: PlaceHit): SurvivalProfile {
  const settlement = settlementType(place);
  const climate = climateBand(place.lat);

  const nearestTargets = ALL_TARGETS.map((t) => ({
    name: t.name,
    kind: t.kind,
    distanceKm: Math.round(haversineKm(place.lat, place.lon, t.lat, t.lon)),
  }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6);

  const minTargetKm = nearestTargets[0]?.distanceKm ?? 9999;
  const nearWatch = WATCH_ZONES.some(
    (z) => haversineKm(place.lat, place.lon, z.lat, z.lon) <= z.radiusKm * 1.5,
  );

  // Risk score 0–100 (educational heuristic)
  let risk = 10;
  if (minTargetKm < 15) risk += 45;
  else if (minTargetKm < 50) risk += 30;
  else if (minTargetKm < 150) risk += 18;
  else if (minTargetKm < 400) risk += 8;

  if (settlement === "city") risk += 12;
  if (settlement === "town") risk += 6;
  if (nearWatch) risk += 10;
  if (nearestTargets.some((t) => t.kind === "silo" && t.distanceKm < 100)) risk += 12;
  if (nearestTargets.some((t) => t.kind === "ssbn-base" && t.distanceKm < 80)) risk += 8;

  // Nuclear-weapon states' major cities tend higher baseline strategic interest
  const nuclearCountries = new Set(["US", "RU", "CN", "FR", "GB", "IN", "PK", "IL", "KP"]);
  if (place.countryCode && nuclearCountries.has(place.countryCode)) risk += 6;

  risk = Math.min(100, risk);

  let riskBand: RiskBand = "low";
  if (risk >= 70) riskBand = "high";
  else if (risk >= 45) riskBand = "elevated";
  else if (risk >= 25) riskBand = "moderate";

  const riskColor =
    riskBand === "high"
      ? "#f87171"
      : riskBand === "elevated"
        ? "#fb923c"
        : riskBand === "moderate"
          ? "#fbbf24"
          : "#34d399";

  const factors: string[] = [
    `Settlement type: ${settlement}`,
    `Climate band: ${climate}`,
    `Nearest mapped strategic site: ${nearestTargets[0]?.name ?? "n/a"} (~${minTargetKm} km)`,
  ];
  if (nearWatch) factors.push("Inside / near a nuclear-relevant watch zone");
  if (place.country) factors.push(`Country: ${place.country}`);

  const items = [
    ...baseKit(settlement, climate),
    ...nuclearItems(minTargetKm, nearWatch),
  ].sort((a, b) => a.priority - b.priority);

  // de-dupe by id
  const seen = new Set<string>();
  const unique = items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });

  const actions = [
    "Learn local public-alert channels (phone WEA, radio, sirens).",
    "Pick an interior shelter room and practice sealing it once.",
    "Store water/food where you can reach them in the dark.",
    "If advised to shelter: go in, stay in, tune in — wait for official “all clear”.",
    "Only take potassium iodide if public health officials say so.",
  ];
  if (minTargetKm < 50) {
    actions.unshift(
      "Because you are relatively close to a mapped strategic site, prioritize early warning + a ready go-bag.",
    );
  }
  if (settlement === "city") {
    actions.push("Have a family meeting point outside your neighborhood if phones fail.");
  }

  const summary =
    riskBand === "high"
      ? `${place.name} scores high on this educational proximity model (near strategic geography and/or dense urban). Prioritize shelter, water, medical, and official-alert readiness.`
      : riskBand === "elevated"
        ? `${place.name} has elevated educational risk factors. Keep a solid 7–14 day kit and a clear shelter / evacuate plan.`
        : riskBand === "moderate"
          ? `${place.name} is moderate on this model. A standard emergency kit plus basic nuclear shelter knowledge is appropriate.`
          : `${place.name} is relatively lower on this strategic-proximity model. Maintain a normal emergency kit and alert plan.`;

  return {
    place,
    riskBand,
    riskScore: risk,
    riskColor,
    summary,
    factors,
    nearestTargets,
    climate,
    settlement,
    items: unique,
    actions,
    disclaimer:
      "Educational readiness guidance only — not an official warning, medical advice, or prediction of attack. Follow your national civil-defense / FEMA / local emergency management instructions. Risk scores use open geographic proximity heuristics, not classified targeting data.",
  };
}
