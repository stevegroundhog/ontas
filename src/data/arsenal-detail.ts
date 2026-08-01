/**
 * Open-estimate warhead yields (kt/Mt) and dual-capable aircraft.
 * FAS / Bulletin / ACA-class public ranges — not official yields.
 */

export type YieldUnit = "kt" | "Mt";

export interface WarheadYieldEntry {
  id: string;
  nationId: string;
  name: string;
  delivery: string;
  yieldLow: number;
  yieldHigh: number;
  unit: YieldUnit;
  status: "deployed" | "reserve" | "retired-ref" | "estimated" | "deploying";
  notes: string;
}

export interface NuclearAircraft {
  id: string;
  nationId: string;
  name: string;
  role: "strategic-bomber" | "dual-capable-fighter" | "patrol" | "estimated";
  rangeKm: number | null;
  weapons: string;
  status: "operational" | "developing" | "estimated" | "retiring";
  notes: string;
}

export const WARHEAD_YIELDS: WarheadYieldEntry[] = [
  {
    id: "us-w87",
    nationId: "us",
    name: "W87 / W87-1 family",
    delivery: "Minuteman III / Sentinel (planned)",
    yieldLow: 300,
    yieldHigh: 475,
    unit: "kt",
    status: "deployed",
    notes: "Open estimates ~300 kt class; life-extension / Sentinel pairing discussed publicly.",
  },
  {
    id: "us-w78",
    nationId: "us",
    name: "W78",
    delivery: "Minuteman III (legacy)",
    yieldLow: 335,
    yieldHigh: 350,
    unit: "kt",
    status: "deployed",
    notes: "Often cited ~335 kt; being phased with force modernization.",
  },
  {
    id: "us-w76",
    nationId: "us",
    name: "W76-1 / W76-2",
    delivery: "Trident II D5 SLBM",
    yieldLow: 5,
    yieldHigh: 100,
    unit: "kt",
    status: "deployed",
    notes: "W76-1 ~90–100 kt class; W76-2 low-yield variant openly acknowledged (~5–7 kt class estimates).",
  },
  {
    id: "us-w88",
    nationId: "us",
    name: "W88",
    delivery: "Trident II D5 SLBM",
    yieldLow: 455,
    yieldHigh: 475,
    unit: "kt",
    status: "deployed",
    notes: "High-yield SLBM warhead; open figures ~455–475 kt.",
  },
  {
    id: "us-b61",
    nationId: "us",
    name: "B61-12 / B61-13",
    delivery: "Dual-capable aircraft / NATO sharing",
    yieldLow: 0.3,
    yieldHigh: 50,
    unit: "kt",
    status: "deployed",
    notes: "Variable-yield gravity bomb family; open bands from sub-kiloton options to tens of kt.",
  },
  {
    id: "us-w80",
    nationId: "us",
    name: "W80 (ALCM / LRSO path)",
    delivery: "Air-launched cruise missiles",
    yieldLow: 5,
    yieldHigh: 150,
    unit: "kt",
    status: "deployed",
    notes: "Cruise-missile warhead family; open variable-yield estimates.",
  },
  {
    id: "ru-yars",
    nationId: "ru",
    name: "Yars / Topol-class RV yields",
    delivery: "RS-24 Yars / Topol-M ICBM",
    yieldLow: 100,
    yieldHigh: 300,
    unit: "kt",
    status: "deployed",
    notes: "MIRV warheads commonly estimated in low–mid hundreds of kt each in open literature.",
  },
  {
    id: "ru-sarmat",
    nationId: "ru",
    name: "Sarmat payload (per RV, open est.)",
    delivery: "RS-28 Sarmat ICBM",
    yieldLow: 100,
    yieldHigh: 500,
    unit: "kt",
    status: "deploying",
    notes: "Heavy ICBM; per-warhead figures uncertain; aggregate yield potentially multi-megaton class with many RVs.",
  },
  {
    id: "ru-bulava",
    nationId: "ru",
    name: "Bulava SLBM warheads",
    delivery: "RSM-56 Bulava",
    yieldLow: 100,
    yieldHigh: 150,
    unit: "kt",
    status: "deployed",
    notes: "Open estimates often ~100–150 kt per warhead class.",
  },
  {
    id: "ru-tnw",
    nationId: "ru",
    name: "Non-strategic / tactical yields",
    delivery: "Dual-capable missiles, gravity, naval",
    yieldLow: 1,
    yieldHigh: 100,
    unit: "kt",
    status: "reserve",
    notes: "Wide band; many systems assessed sub-100 kt. Exact loadings not public.",
  },
  {
    id: "cn-df41",
    nationId: "cn",
    name: "DF-41 MIRV class",
    delivery: "DF-41 ICBM",
    yieldLow: 200,
    yieldHigh: 300,
    unit: "kt",
    status: "estimated",
    notes: "Per-RV yields uncertain; hundreds of kt often assumed in open models.",
  },
  {
    id: "cn-df5",
    nationId: "cn",
    name: "DF-5 silo ICBM warheads",
    delivery: "DF-5B/C",
    yieldLow: 1,
    yieldHigh: 5,
    unit: "Mt",
    status: "estimated",
    notes: "Older single large-yield designs historically multi-megaton; modern loads may be MIRVed lower yields.",
  },
  {
    id: "cn-jl",
    nationId: "cn",
    name: "JL-2 / JL-3 SLBM warheads",
    delivery: "Type 094 SSBN",
    yieldLow: 200,
    yieldHigh: 300,
    unit: "kt",
    status: "estimated",
    notes: "Open estimates sparse; mid-hundreds kt class often used in models.",
  },
  {
    id: "fr-tn75",
    nationId: "fr",
    name: "TN75 / TNO class",
    delivery: "M51 SLBM",
    yieldLow: 100,
    yieldHigh: 150,
    unit: "kt",
    status: "deployed",
    notes: "French open figures historically ~100 kt class warheads on SLBMs.",
  },
  {
    id: "fr-asmp",
    nationId: "fr",
    name: "ASMP-A warhead",
    delivery: "Air-launched cruise (Rafale)",
    yieldLow: 100,
    yieldHigh: 300,
    unit: "kt",
    status: "deployed",
    notes: "Tactical aerospace warhead; open estimates often ~100–300 kt.",
  },
  {
    id: "uk-holbrook",
    nationId: "uk",
    name: "UK Trident warhead",
    delivery: "Trident II D5 (UK)",
    yieldLow: 80,
    yieldHigh: 100,
    unit: "kt",
    status: "deployed",
    notes: "Common open estimate ~100 kt class; lower options discussed in policy literature.",
  },
  {
    id: "in-agni",
    nationId: "in",
    name: "Indian strategic warheads (open band)",
    delivery: "Agni family / aircraft / SLBM",
    yieldLow: 12,
    yieldHigh: 150,
    unit: "kt",
    status: "estimated",
    notes: "Boosted fission / thermonuclear claims debated; many open models use tens of kt.",
  },
  {
    id: "pk-warheads",
    nationId: "pk",
    name: "Pakistani warheads (open band)",
    delivery: "Shaheen / Babur / aircraft / Nasr",
    yieldLow: 5,
    yieldHigh: 40,
    unit: "kt",
    status: "estimated",
    notes: "Typically assessed as fission weapons in low tens of kt; tactical systems lower.",
  },
  {
    id: "il-warheads",
    nationId: "il",
    name: "Israeli warheads (undeclared, open est.)",
    delivery: "Jericho / aircraft / possible sea-based",
    yieldLow: 20,
    yieldHigh: 200,
    unit: "kt",
    status: "estimated",
    notes: "Opacity; open literature spans tens to low hundreds of kt.",
  },
  {
    id: "kp-warheads",
    nationId: "kp",
    name: "DPRK warheads (open band)",
    delivery: "Hwasong ICBM/IRBM / tactical claims",
    yieldLow: 10,
    yieldHigh: 250,
    unit: "kt",
    status: "estimated",
    notes: "Test yields vary; some tests estimated tens of kt to >100 kt thermonuclear-class claims.",
  },
];

export const NUCLEAR_AIRCRAFT: NuclearAircraft[] = [
  {
    id: "us-b52",
    nationId: "us",
    name: "B-52H Stratofortress",
    role: "strategic-bomber",
    rangeKm: 14000,
    weapons: "ALCM / gravity (nuclear-certified historically)",
    status: "operational",
    notes: "Long-range standoff cruise primary modern nuclear role.",
  },
  {
    id: "us-b2",
    nationId: "us",
    name: "B-2A Spirit",
    role: "strategic-bomber",
    rangeKm: 11000,
    weapons: "B61 family gravity bombs",
    status: "operational",
    notes: "Stealth penetrating bomber.",
  },
  {
    id: "us-b21",
    nationId: "us",
    name: "B-21 Raider",
    role: "strategic-bomber",
    rangeKm: null,
    weapons: "Nuclear and conventional (planned)",
    status: "developing",
    notes: "Entering force; details classified; dual-capable strategic role.",
  },
  {
    id: "us-f35",
    nationId: "us",
    name: "F-35A (dual-capable)",
    role: "dual-capable-fighter",
    rangeKm: 2200,
    weapons: "B61-12",
    status: "operational",
    notes: "NATO nuclear mission path; several allies acquiring DCA F-35A.",
  },
  {
    id: "us-f16-dca",
    nationId: "us",
    name: "F-16C/D (NATO DCA)",
    role: "dual-capable-fighter",
    rangeKm: 3000,
    weapons: "B61 family",
    status: "operational",
    notes: "Legacy dual-capable fighter at NATO nuclear-sharing bases.",
  },
  {
    id: "ru-tu160",
    nationId: "ru",
    name: "Tu-160 Blackjack",
    role: "strategic-bomber",
    rangeKm: 12000,
    weapons: "Kh-55/102 class nuclear cruise",
    status: "operational",
    notes: "Supersonic strategic bomber; production resumed in open reporting.",
  },
  {
    id: "ru-tu95",
    nationId: "ru",
    name: "Tu-95MS Bear",
    role: "strategic-bomber",
    rangeKm: 15000,
    weapons: "Nuclear cruise missiles",
    status: "operational",
    notes: "Turboprop long-range bomber still central to Russian air leg.",
  },
  {
    id: "ru-tu22m",
    nationId: "ru",
    name: "Tu-22M3 Backfire",
    role: "strategic-bomber",
    rangeKm: 6800,
    weapons: "Dual-capable cruise / bombs (assessed)",
    status: "operational",
    notes: "Intermediate strategic/theater bomber.",
  },
  {
    id: "ru-mig31",
    nationId: "ru",
    name: "MiG-31K (Kinzhal dual-capable claims)",
    role: "dual-capable-fighter",
    rangeKm: 3000,
    weapons: "Kh-47M2 Kinzhal (dual-capable assessed)",
    status: "operational",
    notes: "Air-launched ballistic/hypersonic dual-capable claims in open sources.",
  },
  {
    id: "cn-h6",
    nationId: "cn",
    name: "H-6N / H-6 variants",
    role: "strategic-bomber",
    rangeKm: 8000,
    weapons: "Air-launched ballistic/cruise nuclear-capable assessed",
    status: "operational",
    notes: "Main Chinese air leg until H-20 matures.",
  },
  {
    id: "cn-h20",
    nationId: "cn",
    name: "H-20 (future stealth bomber)",
    role: "strategic-bomber",
    rangeKm: null,
    weapons: "Nuclear-capable strategic (expected)",
    status: "developing",
    notes: "Not publicly fielded; widely expected dual-capable stealth bomber.",
  },
  {
    id: "fr-rafale",
    nationId: "fr",
    name: "Rafale B/C (ASMP-A)",
    role: "dual-capable-fighter",
    rangeKm: 3700,
    weapons: "ASMP-A nuclear cruise",
    status: "operational",
    notes: "French airborne nuclear component.",
  },
  {
    id: "uk-f35a",
    nationId: "uk",
    name: "F-35A (possible future dual-capable path)",
    role: "dual-capable-fighter",
    rangeKm: 2200,
    weapons: "Potential B61-class if nuclear sharing path chosen",
    status: "developing",
    notes: "UK traditionally sea-only; open debate on dual-capable aircraft options.",
  },
  {
    id: "in-mirage",
    nationId: "in",
    name: "Mirage 2000 / Rafale / Jaguar (nuclear delivery assessed)",
    role: "dual-capable-fighter",
    rangeKm: 3000,
    weapons: "Gravity nuclear bombs (assessed)",
    status: "operational",
    notes: "Air leg of Indian triad; specifics not fully public.",
  },
  {
    id: "pk-f16",
    nationId: "pk",
    name: "F-16 / Mirage dual-capable assessed",
    role: "dual-capable-fighter",
    rangeKm: 3000,
    weapons: "Gravity nuclear (assessed)",
    status: "estimated",
    notes: "Open assessments of dual-capable fighter-bombers.",
  },
  {
    id: "il-f15-f35",
    nationId: "il",
    name: "F-15 / F-16 / F-35 (estimated dual-capable)",
    role: "estimated",
    rangeKm: 3500,
    weapons: "Estimated gravity nuclear",
    status: "estimated",
    notes: "Undeclared arsenal; aircraft leg widely assessed in open literature.",
  },
  {
    id: "kp-air",
    nationId: "kp",
    name: "DPRK aircraft (limited dual-capable claims)",
    role: "estimated",
    rangeKm: 1500,
    weapons: "Possible gravity (uncertain)",
    status: "estimated",
    notes: "Missile force dominates; air delivery least credible leg in open analysis.",
  },
];

export function formatYield(e: WarheadYieldEntry): string {
  if (e.yieldLow === e.yieldHigh) {
    return e.unit === "Mt" ? `${e.yieldLow} Mt` : `${e.yieldLow} kt`;
  }
  if (e.unit === "Mt") return `${e.yieldLow}–${e.yieldHigh} Mt`;
  return `${e.yieldLow}–${e.yieldHigh} kt`;
}

export function yieldsForNation(nationId: string): WarheadYieldEntry[] {
  return WARHEAD_YIELDS.filter((w) => w.nationId === nationId);
}

export function aircraftForNation(nationId: string): NuclearAircraft[] {
  return NUCLEAR_AIRCRAFT.filter((a) => a.nationId === nationId);
}
