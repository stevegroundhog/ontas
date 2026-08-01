/** Open-source estimates (FAS / SIPRI / Arms Control Association, early–mid 2026).
 *  Not official government figures. For educational visualization only. */

export type DeliveryLeg = "ICBM" | "SLBM" | "IRBM/MRBM" | "Bomber" | "Cruise" | "Tactical";

export interface DeliverySystem {
  name: string;
  type: DeliveryLeg;
  rangeKm: number;
  status: "operational" | "deploying" | "development" | "estimated";
  mirv?: boolean;
  notes: string;
}

export interface NuclearNation {
  id: string;
  name: string;
  short: string;
  /** Approximate capital / primary C2 for map pins */
  lat: number;
  lon: number;
  flag: string;
  deployedStrategic: number;
  deployedNonstrategic: number;
  reserve: number;
  militaryStockpile: number;
  totalInventory: number;
  triad: boolean;
  doctrine: string;
  posture: string;
  climateNote: string;
  /** Public-domain summary of nuclear strategy / employment concepts */
  strategy: string;
  systems: DeliverySystem[];
  threatLevel: 1 | 2 | 3 | 4 | 5;
}

export interface Scenario {
  id: string;
  name: string;
  defcon: 1 | 2 | 3 | 4 | 5;
  description: string;
  actors: string[];
  /** Great-circle arcs [fromId, toId] for map animation */
  trajectories: [string, string][];
  outcome: string;
  techInvolved: string[];
}

export const DATA_AS_OF = "January–June 2026 (open estimates)";
export const GLOBAL_TOTAL_INVENTORY = 12187;
export const GLOBAL_MILITARY_STOCKPILE = 9745;
export const GLOBAL_DEPLOYED_STRATEGIC = 3912;

export const nations: NuclearNation[] = [
  {
    id: "ru",
    name: "Russian Federation",
    short: "RUS",
    lat: 55.75,
    lon: 37.62,
    flag: "RU",
    deployedStrategic: 1796,
    deployedNonstrategic: 0,
    reserve: 2604,
    militaryStockpile: 4400,
    totalInventory: 5420,
    triad: true,
    doctrine: "Escalate-to-deescalate doctrine debated; full triad; large non-strategic inventory in storage",
    posture: "New START expired Feb 2026 after suspension; high alert strategic forces; ongoing modernization",
    climateNote:
      "Primary peer competitor to US strategic forces. Ukraine war elevated nuclear signaling 2022–25. Large theater nuclear stockpile remains a unique asymmetry in Europe.",
    strategy:
      "Assured second strike via full triad; large non-strategic stockpile for regional warfighting options; escalate-to-deescalate concepts remain debated in open literature; presidential nuclear authority; modernization prioritizes mobile ICBMs, Borei SSBNs, and dual-capable theater systems.",
    threatLevel: 5,
    systems: [
      {
        name: "RS-28 Sarmat (SS-X-30 Satan II)",
        type: "ICBM",
        rangeKm: 18000,
        status: "deploying",
        mirv: true,
        notes: "Heavy liquid-fuel ICBM; up to ~10 MIRVs + penetration aids; silo-based",
      },
      {
        name: "RS-24 Yars (SS-27 Mod 2)",
        type: "ICBM",
        rangeKm: 10500,
        status: "operational",
        mirv: true,
        notes: "Solid-fuel road-mobile and silo variants; backbone of land leg",
      },
      {
        name: "RS-12M2 Topol-M",
        type: "ICBM",
        rangeKm: 11000,
        status: "operational",
        mirv: false,
        notes: "Single-warhead solid ICBM; being phased toward Yars",
      },
      {
        name: "Avangard HGV",
        type: "ICBM",
        rangeKm: 10000,
        status: "operational",
        mirv: false,
        notes: "Hypersonic glide vehicle carried by modified UR-100N / Sarmat",
      },
      {
        name: "R-29RMU2 Sineva / R-29RMU2.1 Liner",
        type: "SLBM",
        rangeKm: 11500,
        status: "operational",
        mirv: true,
        notes: "Delta-IV class; liquid SLBM",
      },
      {
        name: "RSM-56 Bulava",
        type: "SLBM",
        rangeKm: 9300,
        status: "operational",
        mirv: true,
        notes: "Borei-class SSBN solid SLBM",
      },
      {
        name: "Tu-160 / Tu-95MS",
        type: "Bomber",
        rangeKm: 12000,
        status: "operational",
        notes: "Strategic bombers with Kh-55/102 cruise missiles",
      },
      {
        name: "Iskander-M / dual-capable systems",
        type: "Tactical",
        rangeKm: 500,
        status: "operational",
        notes: "Theater / non-strategic nuclear-capable missiles (storage)",
      },
    ],
  },
  {
    id: "us",
    name: "United States of America",
    short: "USA",
    lat: 38.9,
    lon: -77.04,
    flag: "US",
    deployedStrategic: 1670,
    deployedNonstrategic: 100,
    reserve: 1930,
    militaryStockpile: 3700,
    totalInventory: 5042,
    triad: true,
    doctrine: "Flexible response / assured second strike; sole presidential authority; NATO nuclear sharing",
    posture: "Hair-trigger ICBM alert; ~100 B61 bombs in Europe; full triad modernization (Sentinel, Columbia, B-21)",
    climateNote:
      "Peer rivalry with Russia and rising China triad. New START lapsed 2026. Extended deterrence commitments in Europe and Indo-Pacific shape forward posture.",
    strategy:
      "Assured second strike + flexible response; sole presidential launch authority; extended deterrence / NATO nuclear sharing; counterforce and countervalue options maintained; modernization (Sentinel, Columbia, B-21, B61-12/13) to sustain triad credibility after New START lapse.",
    threatLevel: 5,
    systems: [
      {
        name: "LGM-30G Minuteman III",
        type: "ICBM",
        rangeKm: 13000,
        status: "operational",
        mirv: false,
        notes: "400 deployed silo ICBMs (single warhead); 50 warm silos; W78/W87",
      },
      {
        name: "LGM-35A Sentinel (GBSD)",
        type: "ICBM",
        rangeKm: 13000,
        status: "development",
        mirv: true,
        notes: "Minuteman III replacement program under development",
      },
      {
        name: "UGM-133A Trident II D5",
        type: "SLBM",
        rangeKm: 12000,
        status: "operational",
        mirv: true,
        notes: "Ohio-class SSBN; ~970 deployed warheads at sea",
      },
      {
        name: "B-2A / B-52H / B-21",
        type: "Bomber",
        rangeKm: 11000,
        status: "operational",
        notes: "Gravity bombs and ALCMs; B-21 entering force",
      },
      {
        name: "B61-12 / B61-13",
        type: "Tactical",
        rangeKm: 0,
        status: "operational",
        notes: "~100 forward-deployed gravity bombs at NATO bases; B61-13 first unit 2025",
      },
    ],
  },
  {
    id: "cn",
    name: "People's Republic of China",
    short: "CHN",
    lat: 39.9,
    lon: 116.4,
    flag: "CN",
    deployedStrategic: 34,
    deployedNonstrategic: 0,
    reserve: 586,
    militaryStockpile: 620,
    totalInventory: 620,
    triad: true,
    doctrine: "No-first-use declared; assured retaliation; expanding toward larger second-strike force",
    posture: "Rapid expansion of silo fields; ~600+ warheads; path toward ~1,000 by 2030 per DoD",
    climateNote:
      "Fastest arsenal growth among P5. Three new silo fields (Yumen/Hami/Jilantai region); >100 solid DF-31 class reportedly loaded. No arms-control dialogue with US/Russia.",
    strategy:
      "Declared no-first-use and assured retaliation; expanding silo + mobile ICBM force to harden second strike against peer first strike; sea and air legs maturing; opacity on alert status and warhead mating; no bilateral arms-control ceiling with US/Russia.",
    threatLevel: 4,
    systems: [
      {
        name: "DF-41 (CSS-20)",
        type: "ICBM",
        rangeKm: 15000,
        status: "operational",
        mirv: true,
        notes: "Road-mobile (and possible silo/rail) solid ICBM; MIRV-capable",
      },
      {
        name: "DF-31AG / DF-31A",
        type: "ICBM",
        rangeKm: 11200,
        status: "operational",
        mirv: true,
        notes: "Solid mobile ICBMs; silo field loading reported late 2025",
      },
      {
        name: "DF-5B / DF-5C",
        type: "ICBM",
        rangeKm: 13000,
        status: "operational",
        mirv: true,
        notes: "Liquid silo ICBM; multi-warhead variants",
      },
      {
        name: "JL-2 / JL-3",
        type: "SLBM",
        rangeKm: 10000,
        status: "operational",
        mirv: true,
        notes: "Type 094 SSBN; JL-3 extends reach from near-home waters",
      },
      {
        name: "H-6N / H-20 (future)",
        type: "Bomber",
        rangeKm: 8000,
        status: "operational",
        notes: "Air-launched ballistic/cruise options; H-20 stealth bomber in development",
      },
      {
        name: "DF-26 / DF-21",
        type: "IRBM/MRBM",
        rangeKm: 4000,
        status: "operational",
        notes: "Regional dual-capable missiles; anti-ship variants",
      },
    ],
  },
  {
    id: "fr",
    name: "France",
    short: "FRA",
    lat: 48.86,
    lon: 2.35,
    flag: "FR",
    deployedStrategic: 280,
    deployedNonstrategic: 0,
    reserve: 10,
    militaryStockpile: 290,
    totalInventory: 370,
    triad: false,
    doctrine: "Strict sufficiency; independent deterrent; European strategic autonomy debates",
    posture: "SSBN + air-launched cruise; March 2026 signals on possible stockpile increase",
    climateNote:
      "Only EU nuclear state with full national deterrent. Heightened European security after Ukraine; discussions of extended French umbrella.",
    strategy:
      "Strict sufficiency and independent national deterrent; final warning / proportional response concepts; sea-based strategic core (M51) plus air-launched ASMP-A; presidential sole authority; European security debates on possible extended assurance.",
    threatLevel: 2,
    systems: [
      {
        name: "M51 SLBM",
        type: "SLBM",
        rangeKm: 9000,
        status: "operational",
        mirv: true,
        notes: "Triomphant-class SSBN; primary strategic leg",
      },
      {
        name: "ASMP-A / ASN4G",
        type: "Cruise",
        rangeKm: 500,
        status: "operational",
        notes: "Air-launched cruise on Rafale; ASN4G successor in development",
      },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    short: "UK",
    lat: 51.5,
    lon: -0.12,
    flag: "GB",
    deployedStrategic: 120,
    deployedNonstrategic: 0,
    reserve: 105,
    militaryStockpile: 225,
    totalInventory: 225,
    triad: false,
    doctrine: "Minimum credible deterrent; continuous at-sea deterrence (CASD)",
    posture: "Trident-only; stockpile ceiling raised to 260; Dreadnought SSBN replacement",
    climateNote:
      "Sea-based only. Deep integration with US Trident D5 / warhead cooperation. Exploring dual-capable F-35A nuclear sharing option.",
    strategy:
      "Minimum credible deterrent via Continuous At-Sea Deterrence (CASD) only; Trident D5 with UK warheads; sole prime-ministerial authority; deep technical cooperation with US; stockpile ceiling raised for resilience against peer threats.",
    threatLevel: 2,
    systems: [
      {
        name: "Trident II D5 (UK)",
        type: "SLBM",
        rangeKm: 12000,
        status: "operational",
        mirv: true,
        notes: "Vanguard-class SSBN; UK warheads; continuous patrol",
      },
    ],
  },
  {
    id: "in",
    name: "India",
    short: "IND",
    lat: 28.61,
    lon: 77.21,
    flag: "IN",
    deployedStrategic: 0,
    deployedNonstrategic: 0,
    reserve: 178,
    militaryStockpile: 190,
    totalInventory: 190,
    triad: true,
    doctrine: "No-first-use; credible minimum deterrence; triad emerging",
    posture: "Most warheads demated; canisterization and SSBN patrols expanding readiness",
    climateNote:
      "Rivalry with Pakistan and China drives arsenal growth. Agni-V and sea-based systems push toward true intercontinental reach.",
    strategy:
      "Declared no-first-use and credible minimum deterrence; punitive retaliation doctrine; emerging triad with canisterized missiles and SSBN patrols; most warheads believed demated in peacetime; China and Pakistan as dual peer/near-peer concerns.",
    threatLevel: 3,
    systems: [
      {
        name: "Agni-V",
        type: "ICBM",
        rangeKm: 5000,
        status: "operational",
        mirv: true,
        notes: "Canisterized solid ICBM-class; MIRV tests reported; range may exceed 5,000 km",
      },
      {
        name: "Agni-P / Agni-III / Agni-IV",
        type: "IRBM/MRBM",
        rangeKm: 3500,
        status: "operational",
        notes: "Regional solid ballistic missiles",
      },
      {
        name: "K-15 / K-4 (SSBN)",
        type: "SLBM",
        rangeKm: 3500,
        status: "operational",
        notes: "Arihant-class; K-4 extends second-strike reach",
      },
      {
        name: "Mirage 2000 / Rafale / Jaguar",
        type: "Bomber",
        rangeKm: 2000,
        status: "operational",
        notes: "Gravity bomb delivery aircraft",
      },
    ],
  },
  {
    id: "pk",
    name: "Pakistan",
    short: "PAK",
    lat: 33.69,
    lon: 73.06,
    flag: "PK",
    deployedStrategic: 0,
    deployedNonstrategic: 0,
    reserve: 170,
    militaryStockpile: 170,
    totalInventory: 170,
    triad: false,
    doctrine: "Full-spectrum deterrence including tactical options vs India",
    posture: "Warheads in central storage; diverse short/medium missile inventory",
    climateNote:
      "India-centric deterrent. Tactical nuclear systems raise crisis-stability concerns. No ICBM program publicly fielded.",
    strategy:
      "Full-spectrum deterrence including short-range tactical options intended to deter Indian conventional thrusts; warheads typically in central storage; diverse ballistic and cruise inventory; India-centric targeting logic raises crisis-stability concerns in open analysis.",
    threatLevel: 3,
    systems: [
      {
        name: "Shaheen-III",
        type: "IRBM/MRBM",
        rangeKm: 2750,
        status: "operational",
        notes: "Longest-range ballistic; covers Indian subcontinent and beyond",
      },
      {
        name: "Shaheen-II / Ghauri",
        type: "IRBM/MRBM",
        rangeKm: 2000,
        status: "operational",
        notes: "Medium-range solid/liquid systems",
      },
      {
        name: "Nasr (Hatf-IX)",
        type: "Tactical",
        rangeKm: 70,
        status: "operational",
        notes: "Short-range tactical nuclear-capable rocket",
      },
      {
        name: "Babur / Ra'ad cruise",
        type: "Cruise",
        rangeKm: 700,
        status: "operational",
        notes: "Ground- and air-launched cruise options",
      },
    ],
  },
  {
    id: "il",
    name: "Israel",
    short: "ISR",
    lat: 31.77,
    lon: 35.22,
    flag: "IL",
    deployedStrategic: 0,
    deployedNonstrategic: 0,
    reserve: 90,
    militaryStockpile: 90,
    totalInventory: 90,
    triad: true,
    doctrine: "Nuclear opacity; neither confirm nor deny; last-resort Samson Option narrative",
    posture: "Estimated ~90 warheads; Jericho missiles, aircraft, possible Dolphin SLCM",
    climateNote:
      "Undeclared arsenal. Middle East security architecture; Iran nuclear program remains primary regional driver.",
    strategy:
      "Nuclear opacity (neither confirm nor deny); last-resort strategic insurance often labeled 'Samson Option' in open literature; multi-leg estimated force (missile, air, possible sea-based); regional focus on existential threats and Iran nuclear trajectory.",
    threatLevel: 2,
    systems: [
      {
        name: "Jericho III",
        type: "IRBM/MRBM",
        rangeKm: 6500,
        status: "estimated",
        notes: "Estimated intermediate / near-ICBM class ballistic missile",
      },
      {
        name: "F-15 / F-16 / F-35 dual-capable",
        type: "Bomber",
        rangeKm: 3000,
        status: "estimated",
        notes: "Air-delivered gravity weapons (estimated)",
      },
      {
        name: "Dolphin-class (possible SLCM)",
        type: "Cruise",
        rangeKm: 1500,
        status: "estimated",
        notes: "Sea-based second-strike option widely assessed",
      },
    ],
  },
  {
    id: "kp",
    name: "Democratic People's Republic of Korea",
    short: "DPRK",
    lat: 39.02,
    lon: 125.75,
    flag: "KP",
    deployedStrategic: 0,
    deployedNonstrategic: 0,
    reserve: 60,
    militaryStockpile: 60,
    totalInventory: 60,
    triad: false,
    doctrine: "Explicit nuclear-armed state; warfighting + deterrent language in law",
    posture: "ICBM tests demonstrating CONUS reach; ~60 assembled warheads estimated; growing fissile stock",
    climateNote:
      "Most active ICBM test program among smaller arsenals. Sanctions, alliance drills, and succession politics keep peninsula at elevated risk.",
    strategy:
      "Explicit nuclear-armed state under domestic law; deterrent plus warfighting language; ICBM demonstrations aimed at US homeland; tactical nuclear claims for peninsula war scenarios; opaque C2 and high crisis instability relative to arsenal size.",
    threatLevel: 4,
    systems: [
      {
        name: "Hwasong-17 / Hwasong-18",
        type: "ICBM",
        rangeKm: 15000,
        status: "operational",
        mirv: false,
        notes: "Liquid / solid ICBMs assessed capable of reaching continental US",
      },
      {
        name: "Hwasong-15 / Hwasong-14",
        type: "ICBM",
        rangeKm: 13000,
        status: "operational",
        notes: "Earlier ICBM class demonstrating intercontinental range",
      },
      {
        name: "Hwasong-12 / IRBM family",
        type: "IRBM/MRBM",
        rangeKm: 4500,
        status: "operational",
        notes: "Regional strike including Guam corridor",
      },
      {
        name: "KN-23 / tactical systems",
        type: "Tactical",
        rangeKm: 600,
        status: "operational",
        notes: "Claims of tactical nuclear warheads; short-range solid missiles",
      },
    ],
  },
];

export const scenarios: Scenario[] = [
  {
    id: "status-quo",
    name: "STATUS QUO — DETERRENCE HOLD",
    defcon: 4,
    description:
      "Baseline peacetime posture. Dual peer competition (US–RU, US–CN). New START expired. No active crisis launch sequences. Continuous SSBN patrols and silo alert remain.",
    actors: ["us", "ru", "cn", "uk", "fr"],
    trajectories: [],
    outcome: "Stable but brittle equilibrium. Arms racing replaces treaty ceilings.",
    techInvolved: ["Minuteman III alert", "Yars road-mobile", "DF-41 mobile", "Trident CASD", "M51 CASD"],
  },
  {
    id: "euro-escalate",
    name: "EUROPEAN THEATER ESCALATION",
    defcon: 2,
    description:
      "Conventional conflict on NATO's eastern flank risks theater nuclear use. Russian non-strategic systems and US B61 dual-capable aircraft enter heightened readiness. Early-warning and NC3 stress.",
    actors: ["ru", "us", "fr", "uk"],
    trajectories: [
      ["ru", "fr"],
      ["ru", "uk"],
      ["us", "ru"],
    ],
    outcome: "Highest inadvertent-escalation risk. Limited nuclear use could cascade via alliance commitments.",
    techInvolved: ["Iskander dual-capable", "B61-12 NATO", "ASMP-A", "SLBM second-strike"],
  },
  {
    id: "indo-pacific",
    name: "INDO-PACIFIC PEER CRISIS",
    defcon: 2,
    description:
      "Taiwan Strait / Western Pacific crisis. Chinese ICBM silo fields and mobile DF-41 on heightened alert. US triad surge; regional allies under nuclear umbrella pressure.",
    actors: ["cn", "us"],
    trajectories: [
      ["cn", "us"],
      ["us", "cn"],
    ],
    outcome: "First true three-body nuclear crisis dynamic if Russia simultaneously signals support.",
    techInvolved: ["DF-41 MIRV", "DF-26 dual-capable", "Trident II D5", "B-21 / ALCM", "Aegis BMD"],
  },
  {
    id: "south-asia",
    name: "SOUTH ASIA FULL-SPECTRUM",
    defcon: 2,
    description:
      "India–Pakistan crisis involving conventional cross-border strikes. Pakistan tactical nuclear thresholds vs Indian cold-start concepts. China as third nuclear neighbor complicates escalation ladders.",
    actors: ["in", "pk", "cn"],
    trajectories: [
      ["pk", "in"],
      ["in", "pk"],
      ["cn", "in"],
    ],
    outcome: "Short ranges compress decision time. Tactical nuclear first use hardest to control.",
    techInvolved: ["Nasr tactical", "Shaheen-III", "Agni-V", "Babur cruise", "K-4 SLBM"],
  },
  {
    id: "dprk-icbm",
    name: "DPRK ICBM DEMONSTRATION / CRISIS",
    defcon: 3,
    description:
      "North Korean solid-fuel ICBM launch or nuclear test during alliance exercises. US–ROK–Japan missile defense activation. Risk of miscalculation on launch-on-warning cues.",
    actors: ["kp", "us"],
    trajectories: [
      ["kp", "us"],
      ["us", "kp"],
    ],
    outcome: "Limited arsenal but high instability. Conventionally superior adversary + opaque C2.",
    techInvolved: ["Hwasong-18", "THAAD / GMD", "B-2 dual-capable", "Trident"],
  },
  {
    id: "global-thermo",
    name: "GLOBAL THERMONUCLEAR WAR",
    defcon: 1,
    description:
      "WOPR end-state. Full counterforce + countervalue exchanges among major arsenals. MIRV saturation, SLBM second strike, bomber fail-deadly. No winner.",
    actors: ["us", "ru", "cn", "uk", "fr", "in", "pk", "kp", "il"],
    trajectories: [
      ["us", "ru"],
      ["ru", "us"],
      ["cn", "us"],
      ["us", "cn"],
      ["ru", "fr"],
      ["ru", "uk"],
      ["fr", "ru"],
      ["uk", "ru"],
      ["in", "pk"],
      ["pk", "in"],
      ["kp", "us"],
      ["cn", "in"],
    ],
    outcome: "THE ONLY WINNING MOVE IS NOT TO PLAY. Civilizational collapse. Nuclear winter scenarios.",
    techInvolved: [
      "All ICBM / SLBM / bomber legs",
      "MIRV + MaRV + HGV",
      "Early-warning satellites",
      "NC3 fail-deadly",
      "Civil defense (inadequate)",
    ],
  },
  {
    id: "nc3-false",
    name: "FALSE ALARM / NC3 FAILURE",
    defcon: 2,
    description:
      "Historical pattern (1983 Petrov; 1995 Black Brant). Degraded sensors or cyber intrusion produces phantom attack indication during high tension. Minutes to decide under launch-on-warning doctrine.",
    actors: ["us", "ru"],
    trajectories: [
      ["ru", "us"],
      ["us", "ru"],
    ],
    outcome: "Human judgment and procedural brakes remain last line of defense.",
    techInvolved: ["DSP/SBIRS", "Russian Oko successors", "Minuteman LOA", "Perimeter/Dead Hand debates"],
  },
];

export const climateBrief = [
  {
    title: "TREATY REGIME",
    body: "New START expired February 2026 after Russia's 2023 suspension. No bilateral US–Russia strategic ceilings remain. INF collapsed earlier. CTBT not in force. NPT review politics strained.",
  },
  {
    title: "ARSENAL TRAJECTORY",
    body: "Global inventory ~12,187 warheads. Military stockpiles ~9,745. China expanding fastest (~600→1000 by 2030 possible). US and Russia modernizing full triads. Smaller states diversifying delivery.",
  },
  {
    title: "TECHNOLOGY EDGE",
    body: "Hypersonic glide vehicles (Avangard), solid-fuel ICBM proliferation, MIRV/MaRV, dual-capable precision missiles, AI-assisted C2 debates, missile defense vs MIRV saturation, NC3 cyber risk.",
  },
  {
    title: "GEO-STRATEGIC FLASHPOINTS",
    body: "Eastern Europe, Taiwan Strait / Western Pacific, Korean Peninsula, South Asia, Middle East (Iran nuclear file). Multipolar nuclear order replaces bipolar simplicity.",
  },
];

export function nationById(id: string): NuclearNation | undefined {
  return nations.find((n) => n.id === id);
}

export function stockpileShare(n: NuclearNation): number {
  return (n.totalInventory / GLOBAL_TOTAL_INVENTORY) * 100;
}
