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
  climate: "arctic" | "cold" | "temperate" | "hot" | "tropical" | "arid";
  settlement: "city" | "town" | "village" | "rural" | "unknown";
  items: SurvivalItem[];
  actions: string[];
  climateFocus: string[];
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

/** Latitude + rough longitude heuristics for arid belts */
function climateBand(lat: number, lon: number): SurvivalProfile["climate"] {
  const a = Math.abs(lat);
  // Sahara / Arabia / Central Asia / SW US / Australia arid-ish bands (educational)
  const aridBelt =
    (a >= 15 && a <= 35 && ((lon > -20 && lon < 60) || (lon > 60 && lon < 110))) ||
    (lat >= 25 && lat <= 40 && lon >= -120 && lon <= -100) ||
    (lat >= -35 && lat <= -18 && lon >= 115 && lon <= 150);
  if (a >= 66) return "arctic";
  if (a >= 50) return "cold";
  if (aridBelt && a >= 18 && a <= 38) return "arid";
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

function climateKit(climate: SurvivalProfile["climate"]): { items: SurvivalItem[]; focus: string[] } {
  const items: SurvivalItem[] = [];
  const focus: string[] = [];

  if (climate === "arctic" || climate === "cold") {
    focus.push(
      "Cold kills faster than hunger — heat, dry layers, and CO-safe plans dominate.",
      "Pipes freeze; store water where it will not ice solid.",
      "Short daylight: prioritize light + radio batteries.",
    );
    items.push(
      {
        id: "warm-layers",
        name: "Insulating layers + wool/synthetic base (not cotton)",
        category: "climate",
        priority: 1,
        reason: "Wet cotton loses insulation; hypothermia risk without power",
      },
      {
        id: "sleep-cold",
        name: "Cold-rated sleeping bag / blanket system (0°F / −18°C or lower)",
        category: "climate",
        priority: 1,
        reason: "Shelter without building heat is life-threatening in cold bands",
      },
      {
        id: "heat-plan",
        name: "Indoor-safe heat plan + CO detector (never charcoal/generator indoors)",
        category: "climate",
        priority: 1,
        reason: "Blackout heating is a leading CO-poisoning cause",
      },
      {
        id: "water-freeze",
        name: "Water stored off exterior walls + melt plan (pot + fuel)",
        category: "water",
        priority: 1,
        qtyHint: "Extra margin if freezing expected",
        reason: "Stored water can freeze and rupture containers",
      },
      {
        id: "boots-gloves",
        name: "Insulated waterproof boots, gloves, hat, eye protection",
        category: "climate",
        priority: 2,
        reason: "Frostbite risk during outdoor movement / debris work",
      },
    );
  }

  if (climate === "hot" || climate === "tropical" || climate === "arid") {
    focus.push(
      "Heat injury and dehydration dominate after power loss.",
      "Water margin beats almost every other comfort item.",
    );
    items.push(
      {
        id: "water-heat",
        name: "Extra sealed water (heat raises need 1.5–2×)",
        category: "water",
        priority: 1,
        qtyHint: "6+ L / person / day in extreme heat × 7–14 days",
        reason: "Cooling fails; sweat losses climb without A/C",
      },
      {
        id: "electrolytes",
        name: "Oral rehydration / electrolyte packets",
        category: "climate",
        priority: 1,
        reason: "Heat exhaustion risk during shelter or evacuation",
      },
      {
        id: "shade",
        name: "Shade tarp, wide hat, cooling cloths",
        category: "climate",
        priority: 1,
        reason: "Passive cooling when electricity is gone",
      },
      {
        id: "sun-med",
        name: "Sunscreen, lip balm, basic burn care",
        category: "medical",
        priority: 2,
        reason: "Extended outdoor exposure during infrastructure failure",
      },
    );
  }

  if (climate === "tropical") {
    focus.push("Humidity + storms: mold, insects, and flood water contamination.");
    items.push(
      {
        id: "mosquito",
        name: "Mosquito nets + repellent",
        category: "climate",
        priority: 1,
        reason: "Vector disease risk rises when sanitation fails",
      },
      {
        id: "dry-bags",
        name: "Dry bags for documents, radio, meds",
        category: "docs",
        priority: 1,
        reason: "Flood / heavy rain common in tropical bands",
      },
      {
        id: "bleach-trop",
        name: "Unscented bleach for water/surface disinfection",
        category: "water",
        priority: 2,
        reason: "Flood-contaminated water and mold-prone interiors",
      },
    );
  }

  if (climate === "arid") {
    focus.push(
      "Arid zones: water is the critical path; dust storms degrade air quality.",
      "Diurnal swing — nights can still be cold; keep one warm layer.",
    );
    items.push(
      {
        id: "dust-mask",
        name: "Dust/particulate masks (N95) + eye goggles",
        category: "climate",
        priority: 1,
        reason: "Dust storms + fallout dust both demand filtration",
      },
      {
        id: "water-arid",
        name: "Maximum practical water cache + desert still only as last resort",
        category: "water",
        priority: 1,
        qtyHint: "Prioritize volume over variety of other supplies",
        reason: "Resupply distances and evaporation risk",
      },
      {
        id: "night-warm",
        name: "Light insulating layer for cold desert nights",
        category: "climate",
        priority: 2,
        reason: "Large day/night temperature swings",
      },
    );
  }

  if (climate === "temperate") {
    focus.push(
      "Four-season readiness: plan for both heat waves and cold snaps.",
      "Standard FEMA-style kit plus nuclear shelter basics is the baseline.",
    );
    items.push(
      {
        id: "season-flex",
        name: "Seasonal clothing swap bag (hot + cold options)",
        category: "climate",
        priority: 2,
        reason: "Temperate crises can hit either extreme",
      },
      {
        id: "rain-gear",
        name: "Waterproof shell + spare socks",
        category: "climate",
        priority: 2,
        reason: "Wet clothing accelerates hypothermia even in mild cold",
      },
    );
  }

  return { items, focus };
}

function baseKit(settlement: SurvivalProfile["settlement"], climate: SurvivalProfile["climate"]): SurvivalItem[] {
  const waterQty =
    climate === "hot" || climate === "tropical" || climate === "arid"
      ? "6 L / person / day × 7–14 days"
      : settlement === "city"
        ? "4 L / person / day × 7–14 days"
        : "4 L / person / day × 14 days";

  const items: SurvivalItem[] = [
    {
      id: "water",
      name: "Drinking water (sealed)",
      category: "water",
      priority: 1,
      qtyHint: waterQty,
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
  const climate = climateBand(place.lat, place.lon);
  const climatePack = climateKit(climate);

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
    `Climate band: ${climate} (drives kit priorities)`,
    `Nearest mapped strategic site: ${nearestTargets[0]?.name ?? "n/a"} (~${minTargetKm} km)`,
  ];
  if (nearWatch) factors.push("Inside / near a nuclear-relevant watch zone");
  if (place.country) factors.push(`Country: ${place.country}`);

  const items = [
    ...baseKit(settlement, climate),
    ...climatePack.items,
    ...nuclearItems(minTargetKm, nearWatch),
  ].sort((a, b) => a.priority - b.priority);

  const seen = new Set<string>();
  const unique = items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });

  const actions = [
    `Climate focus (${climate}): ${climatePack.focus[0] ?? "Match kit to local seasons."}`,
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
  if (climate === "cold" || climate === "arctic") {
    actions.push("Test CO detector and never burn charcoal indoors for heat.");
  }
  if (climate === "hot" || climate === "arid" || climate === "tropical") {
    actions.push("Pre-stage water in multiple locations; heat multiplies daily need.");
  }

  const summary =
    riskBand === "high"
      ? `${place.name} scores high on this educational proximity model. Climate band: ${climate}. Prioritize climate-matched water/heat-cool, shelter, medical, and official alerts.`
      : riskBand === "elevated"
        ? `${place.name} has elevated educational risk factors (${climate} climate). Keep a solid 7–14 day climate-tuned kit and shelter/evacuate plan.`
        : riskBand === "moderate"
          ? `${place.name} is moderate on this model (${climate}). Standard emergency kit + climate add-ons + basic nuclear shelter knowledge.`
          : `${place.name} is relatively lower on strategic proximity (${climate}). Maintain a normal climate-aware emergency kit and alert plan.`;

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
    climateFocus: climatePack.focus,
    disclaimer:
      "Educational readiness guidance only — not an official warning, medical advice, or prediction of attack. Climate bands are latitude/region heuristics, not forecasts. Follow your national civil-defense / FEMA / local emergency management instructions.",
  };
}
