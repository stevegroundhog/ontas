/**
 * Registry of major ongoing armed conflicts (open-source / academic framing).
 * Intensity tiers follow UCDP-style public reporting conventions, not official
 * government war declarations. Descriptions are deliberately neutral.
 */

export type ConflictIntensity = "war" | "limited-war" | "major-violence" | "insurgency" | "tension";
export type ConflictType =
  | "interstate"
  | "civil"
  | "internationalized-civil"
  | "non-state"
  | "insurgency"
  | "territorial"
  | "occupation";

export type ConflictRegion =
  | "Europe"
  | "Middle East"
  | "Africa"
  | "Asia"
  | "Americas"
  | "Global";

export interface ArmedConflict {
  id: string;
  name: string;
  shortName: string;
  /** Neutral one-line factual description */
  summary: string;
  type: ConflictType;
  intensity: ConflictIntensity;
  region: ConflictRegion;
  /** Approximate map anchor */
  lat: number;
  lon: number;
  /** ISO-ish area codes for filtering */
  countries: string[];
  /** Named parties without valorizing language */
  parties: string[];
  startYear: number;
  /** Public estimate ranges only — cite open sources in UI */
  fatalitiesNote: string;
  /** Approximate lower bound of reported deaths (open sources; contested) */
  fatalitiesLow: number;
  /** Approximate upper bound of reported deaths (open sources; contested) */
  fatalitiesHigh: number;
  fatalitiesAsOf: string;
  fatalitiesSource: string;
  status: "active" | "frozen" | "escalating" | "de-escalating";
  /** Search strings for live news mesh */
  newsQueries: string[];
  keywords: string[];
  nuclearRisk: "none" | "latent" | "elevated";
  sources: { label: string; url: string }[];
}

export const CONFLICT_INTENSITY_META: Record<
  ConflictIntensity,
  { label: string; color: string; rank: number }
> = {
  war: { label: "War-level", color: "#ef4444", rank: 5 },
  "limited-war": { label: "Limited war", color: "#f97316", rank: 4 },
  "major-violence": { label: "Major violence", color: "#fbbf24", rank: 3 },
  insurgency: { label: "Insurgency", color: "#a78bfa", rank: 2 },
  tension: { label: "Heightened tension", color: "#38bdf8", rank: 1 },
};

export const CONFLICT_TYPE_LABEL: Record<ConflictType, string> = {
  interstate: "Interstate",
  civil: "Civil / internal",
  "internationalized-civil": "Internationalized civil",
  "non-state": "Non-state armed",
  insurgency: "Insurgency",
  territorial: "Territorial dispute",
  occupation: "Occupation / control dispute",
};

/**
 * Snapshot of major conflicts widely tracked by UCDP, CrisisWatch-class
 * reporting, UN Security Council agenda items, and major wire services (2024–2026).
 * Not exhaustive of every local clash; selected for global visibility & reporting density.
 */
export const ARMED_CONFLICTS: ArmedConflict[] = [
  {
    id: "ukraine-russia",
    name: "Russia–Ukraine war",
    shortName: "Ukraine",
    summary:
      "Full-scale interstate war since February 2022 following Russia’s invasion of Ukraine; high-intensity combat, territorial control disputes, and large-scale displacement continue.",
    type: "interstate",
    intensity: "war",
    region: "Europe",
    lat: 49.0,
    lon: 32.0,
    countries: ["UA", "RU"],
    parties: ["Russian Federation", "Ukraine", "Western military assistance to Ukraine (material)"],
    startYear: 2022,
    fatalitiesNote: "Combatant deaths likely 150k–500k+ combined; civilian deaths tens of thousands. No single authoritative total; figures remain contested by all parties.",
    fatalitiesLow: 150000,
    fatalitiesHigh: 500000,
    fatalitiesAsOf: "2024–2026 open ranges",
    fatalitiesSource: "Mediazona/BBC/UA+RU official fragments + US/EU intel leaks (highly contested)",
    status: "active",
    newsQueries: [
      "Ukraine Russia war",
      "Ukraine frontline",
      "UN Security Council Ukraine",
    ],
    keywords: ["ukraine", "russia", "kyiv", "donbas", "crimea", "putin", "zelensky"],
    nuclearRisk: "elevated",
    sources: [
      { label: "UN News — Peace & Security", url: "https://news.un.org/en/news/topic/peace-and-security" },
      { label: "UCDP conflict data (academic)", url: "https://ucdp.uu.se/" },
    ],
  },
  {
    id: "gaza-israel",
    name: "Israel–Hamas / Gaza war",
    shortName: "Gaza",
    summary:
      "High-intensity war in and around the Gaza Strip after the 7 October 2023 Hamas attack on Israel; ongoing hostilities, civilian harm, and regional spillover remain under UN and ICRC reporting.",
    type: "interstate",
    intensity: "war",
    region: "Middle East",
    lat: 31.5,
    lon: 34.45,
    countries: ["PS", "IL"],
    parties: ["Israel", "Hamas", "Other Gaza armed groups"],
    startYear: 2023,
    fatalitiesNote: "Gaza MoH reports 45k–65k+ killed depending on date cutoffs; Israeli fatalities from 7 Oct 2023 ~1,200 with additional soldiers since. Independent verification incomplete under wartime conditions.",
    fatalitiesLow: 45000,
    fatalitiesHigh: 65000,
    fatalitiesAsOf: "mid-2025–2026 Gaza MoH + media",
    fatalitiesSource: "Gaza Health Ministry tallies + UN/OHCHR citations (methodology disputed by Israel)",
    status: "active",
    newsQueries: ["Gaza war", "Israel Hamas", "UNRWA Gaza"],
    keywords: ["gaza", "hamas", "israel", "rafah", "unrwa", "hostage"],
    nuclearRisk: "latent",
    sources: [
      { label: "UN News", url: "https://news.un.org/en/news/topic/middle-east" },
      { label: "ICRC updates", url: "https://www.icrc.org/" },
    ],
  },
  {
    id: "israel-hezbollah",
    name: "Israel–Hezbollah / Lebanon front",
    shortName: "Lebanon",
    summary:
      "Cross-border military exchanges between Israel and Hezbollah expanded after late 2023; large-scale Israeli operations in Lebanon and reciprocal fire have been extensively documented by UNIFIL and wire services.",
    type: "interstate",
    intensity: "limited-war",
    region: "Middle East",
    lat: 33.4,
    lon: 35.5,
    countries: ["LB", "IL"],
    parties: ["Israel", "Hezbollah"],
    startYear: 2023,
    fatalitiesNote: "Lebanon-side deaths often cited in the low-to-mid thousands during intensive 2024 operations; Israeli civilian/military deaths lower but non-zero. Displacement in hundreds of thousands.",
    fatalitiesLow: 3000,
    fatalitiesHigh: 6000,
    fatalitiesAsOf: "2024–2025 peak operations",
    fatalitiesSource: "Lebanese MoH / Israeli military statements / UNIFIL",
    status: "active",
    newsQueries: ["Israel Hezbollah", "Lebanon conflict UNIFIL"],
    keywords: ["hezbollah", "lebanon", "beirut", "unifil", "litani"],
    nuclearRisk: "latent",
    sources: [
      { label: "UNIFIL", url: "https://unifil.unmissions.org/" },
    ],
  },
  {
    id: "sudan-civil",
    name: "Sudan civil war (SAF–RSF)",
    shortName: "Sudan",
    summary:
      "Civil war between the Sudanese Armed Forces and Rapid Support Forces since April 2023; mass displacement, urban fighting, and famine risk dominate humanitarian reporting.",
    type: "civil",
    intensity: "war",
    region: "Africa",
    lat: 15.5,
    lon: 32.5,
    countries: ["SD"],
    parties: ["Sudanese Armed Forces (SAF)", "Rapid Support Forces (RSF)"],
    startYear: 2023,
    fatalitiesNote: "Among the deadliest current wars; documented deaths incomplete. Some academic extrapolations exceed 100k–150k including excess mortality; displacement >10 million.",
    fatalitiesLow: 60000,
    fatalitiesHigh: 150000,
    fatalitiesAsOf: "2024–2026",
    fatalitiesSource: "Yale/HHU, UN, ACLED extrapolations",
    status: "active",
    newsQueries: ["Sudan civil war", "RSF SAF Khartoum", "Sudan famine"],
    keywords: ["sudan", "rsf", "darfur", "khartoum", "port sudan"],
    nuclearRisk: "none",
    sources: [
      { label: "UN OCHA Sudan", url: "https://www.unocha.org/sudan" },
    ],
  },
  {
    id: "myanmar-civil",
    name: "Myanmar civil conflict",
    shortName: "Myanmar",
    summary:
      "Nationwide armed conflict after the 2021 military coup; junta forces fight multiple ethnic armed organizations and People’s Defence Forces across large parts of the country.",
    type: "civil",
    intensity: "war",
    region: "Asia",
    lat: 21.9,
    lon: 96.1,
    countries: ["MM"],
    parties: ["Myanmar military (SAC/Tatmadaw)", "NUG/PDF", "Ethnic armed organizations"],
    startYear: 2021,
    fatalitiesNote: "AAPP documents thousands of political killings; full war deaths higher across EAOs and PDF fronts. Estimates vary widely by methodology.",
    fatalitiesLow: 5000,
    fatalitiesHigh: 50000,
    fatalitiesAsOf: "2021–2026 cumulative",
    fatalitiesSource: "AAPP / ACLED / UN Special Rapporteur",
    status: "active",
    newsQueries: ["Myanmar civil war", "Myanmar junta conflict"],
    keywords: ["myanmar", "burma", "junta", "rohingya", "sac"],
    nuclearRisk: "none",
    sources: [
      { label: "UN Special Rapporteur Myanmar", url: "https://www.ohchr.org/" },
    ],
  },
  {
    id: "yemen",
    name: "Yemen conflict",
    shortName: "Yemen",
    summary:
      "Protracted multi-party conflict involving Ansar Allah (Houthis), the internationally recognized government, and southern forces; Red Sea shipping attacks and Saudi–Houthi dynamics remain active issues.",
    type: "internationalized-civil",
    intensity: "limited-war",
    region: "Middle East",
    lat: 15.3,
    lon: 44.2,
    countries: ["YE"],
    parties: ["Ansar Allah (Houthis)", "Yemeni government", "Southern Transitional Council", "External naval coalitions (Red Sea)"],
    startYear: 2014,
    fatalitiesNote: "UNDP estimated ~377k total deaths by end-2021 including indirect (disease/hunger); direct battle deaths lower. Ongoing Red Sea phase adds maritime/crew casualties.",
    fatalitiesLow: 150000,
    fatalitiesHigh: 377000,
    fatalitiesAsOf: "2014–2021 peak UNDP + ongoing",
    fatalitiesSource: "UNDP conflict impact / UN OCHA",
    status: "active",
    newsQueries: ["Yemen conflict", "Houthi Red Sea", "UN Yemen"],
    keywords: ["yemen", "houthi", "sanaa", "aden", "red sea"],
    nuclearRisk: "none",
    sources: [
      { label: "UN Yemen", url: "https://news.un.org/en/tags/yemen" },
    ],
  },
  {
    id: "sahel-jihadist",
    name: "Central Sahel insurgencies",
    shortName: "Sahel",
    summary:
      "Islamist insurgencies and counter-insurgency campaigns across Burkina Faso, Mali, and Niger; juntas, Wagner/Africa Corps presence, and JNIM/ISGS activity drive high civilian harm.",
    type: "insurgency",
    intensity: "major-violence",
    region: "Africa",
    lat: 14.0,
    lon: -1.5,
    countries: ["BF", "ML", "NE"],
    parties: ["JNIM", "Islamic State Sahel", "National armies / juntas", "Local militias"],
    startYear: 2015,
    fatalitiesNote: "Central Sahel among Africa's highest annual conflict death rates; multi-thousand per year across three states in peak years.",
    fatalitiesLow: 8000,
    fatalitiesHigh: 20000,
    fatalitiesAsOf: "annual peaks 2022–2025",
    fatalitiesSource: "ACLED annual totals BF/ML/NE",
    status: "active",
    newsQueries: ["Sahel conflict", "Burkina Faso jihadist", "Mali JNIM"],
    keywords: ["sahel", "burkina", "mali", "niger", "jnim", "aes"],
    nuclearRisk: "none",
    sources: [
      { label: "UN peace & security Africa", url: "https://news.un.org/en/news/region/africa" },
    ],
  },
  {
    id: "drc-east",
    name: "Eastern DRC conflict (M23 / ADF)",
    shortName: "DRC East",
    summary:
      "Recurrent wars in North Kivu and Ituri; M23 advances, ADF attacks, and regional state involvement (notably Rwanda–DRC tensions) generate large displacement.",
    type: "internationalized-civil",
    intensity: "major-violence",
    region: "Africa",
    lat: -1.7,
    lon: 29.2,
    countries: ["CD", "RW", "UG"],
    parties: ["DRC armed forces (FARDC)", "M23", "ADF", "Other armed groups", "Regional actors"],
    startYear: 2021,
    fatalitiesNote: "Current Kivu fighting kills thousands yearly; historic 1998–2000s wars had far higher excess mortality estimates (methodologically contested).",
    fatalitiesLow: 3000,
    fatalitiesHigh: 15000,
    fatalitiesAsOf: "recent M23 phases + layered historical",
    fatalitiesSource: "UN / ACLED / historic IRC excess-mortality debates",
    status: "active",
    newsQueries: ["DRC M23", "North Kivu conflict", "Goma fighting"],
    keywords: ["congo", "m23", "goma", "kivu", "adf"],
    nuclearRisk: "none",
    sources: [
      { label: "MONUSCO / UN DRC", url: "https://monusco.unmissions.org/" },
    ],
  },
  {
    id: "somalia",
    name: "Somalia conflict (Al-Shabaab)",
    shortName: "Somalia",
    summary:
      "Protracted conflict between the Federal Government of Somalia (with ATMIS/AU and partner support) and Al-Shabaab; urban attacks and rural control contests continue.",
    type: "insurgency",
    intensity: "major-violence",
    region: "Africa",
    lat: 5.2,
    lon: 46.2,
    countries: ["SO"],
    parties: ["Federal Government of Somalia", "Al-Shabaab", "Clan militias", "AU / partner forces"],
    startYear: 2006,
    fatalitiesNote: "Multi-thousand annual conflict deaths in high years; Al-Shabaab attacks and offensives drive spikes.",
    fatalitiesLow: 1000,
    fatalitiesHigh: 5000,
    fatalitiesAsOf: "annual recent years",
    fatalitiesSource: "ACLED / UNSOM",
    status: "active",
    newsQueries: ["Somalia Al-Shabaab", "Mogadishu attack"],
    keywords: ["somalia", "shabaab", "mogadishu", "atmis"],
    nuclearRisk: "none",
    sources: [
      { label: "UNSOM", url: "https://unsom.unmissions.org/" },
    ],
  },
  {
    id: "syria",
    name: "Syria multi-party conflict",
    shortName: "Syria",
    summary:
      "Post-Assad transition and residual multi-actor conflict: Turkish operations, SDF/Autonomous Administration issues, Israeli strikes, and ISIS remnants keep violence intermittent but serious.",
    type: "internationalized-civil",
    intensity: "limited-war",
    region: "Middle East",
    lat: 35.0,
    lon: 38.5,
    countries: ["SY"],
    parties: ["Syrian authorities (post-2024 transition)", "HTS / other factions", "SDF", "Türkiye", "Israel (airstrikes)", "ISIS remnants"],
    startYear: 2011,
    fatalitiesNote: "Civil war cumulative deaths widely cited ~500k–600k+. Residual 2025–26 violence is lower but ongoing.",
    fatalitiesLow: 500000,
    fatalitiesHigh: 620000,
    fatalitiesAsOf: "2011–2024 cumulative SNHR/SOHR-class",
    fatalitiesSource: "SOHR / SNHR / UN past estimates",
    status: "active",
    newsQueries: ["Syria conflict", "Syria SDF Turkey", "Israel strikes Syria"],
    keywords: ["syria", "damascus", "idlib", "sdf", "hts"],
    nuclearRisk: "none",
    sources: [
      { label: "UN Syria", url: "https://news.un.org/en/tags/syria" },
    ],
  },
  {
    id: "ethiopia-amhara",
    name: "Ethiopia Amhara / residual conflicts",
    shortName: "Ethiopia",
    summary:
      "After the Tigray war’s formal end, armed conflict in Amhara (Fano) and other regions continues to produce significant casualties and displacement per UN and local reporting.",
    type: "civil",
    intensity: "major-violence",
    region: "Africa",
    lat: 11.5,
    lon: 38.0,
    countries: ["ET"],
    parties: ["Ethiopian federal forces", "Fano militias", "Other regional actors"],
    startYear: 2023,
    fatalitiesNote: "Tigray war 2020–22 likely hundreds of thousands excess deaths (debated); Amhara conflict since 2023 adds thousands more.",
    fatalitiesLow: 5000,
    fatalitiesHigh: 30000,
    fatalitiesAsOf: "Amhara phase + Tigray residual",
    fatalitiesSource: "UN / EHRC / academic estimates",
    status: "active",
    newsQueries: ["Ethiopia Amhara conflict", "Fano Ethiopia"],
    keywords: ["ethiopia", "amhara", "fano", "tigray"],
    nuclearRisk: "none",
    sources: [
      { label: "UN Ethiopia", url: "https://ethiopia.un.org/" },
    ],
  },
  {
    id: "haiti-gangs",
    name: "Haiti armed gang crisis",
    shortName: "Haiti",
    summary:
      "Armed gangs control large parts of Port-au-Prince and corridors; state collapse dynamics and the Multinational Security Support mission dominate security reporting.",
    type: "non-state",
    intensity: "major-violence",
    region: "Americas",
    lat: 18.5,
    lon: -72.3,
    countries: ["HT"],
    parties: ["Armed gangs (e.g. G9/Viv Ansanm coalitions)", "Haitian National Police", "MSS mission partners"],
    startYear: 2021,
    fatalitiesNote: "Thousands killed yearly in peak gang violence; kidnapping and displacement massive relative to population.",
    fatalitiesLow: 2000,
    fatalitiesHigh: 5000,
    fatalitiesAsOf: "annual peak years",
    fatalitiesSource: "UN / BINUH",
    status: "active",
    newsQueries: ["Haiti gangs", "Port-au-Prince violence UN"],
    keywords: ["haiti", "port-au-prince", "gang", "mss"],
    nuclearRisk: "none",
    sources: [
      { label: "UN Haiti", url: "https://news.un.org/en/tags/haiti" },
    ],
  },
  {
    id: "mexico-cartels",
    name: "Mexico organized crime violence",
    shortName: "Mexico",
    summary:
      "High-intensity non-state armed violence among cartels and with security forces; not a classic interstate war but meets major-violence thresholds in many municipalities.",
    type: "non-state",
    intensity: "major-violence",
    region: "Americas",
    lat: 24.0,
    lon: -102.5,
    countries: ["MX"],
    parties: ["Multiple cartels", "Mexican federal/state forces"],
    startYear: 2006,
    fatalitiesNote: "Not classic war but homicide levels 25k–35k/year in peak periods; large share organized-crime related.",
    fatalitiesLow: 25000,
    fatalitiesHigh: 35000,
    fatalitiesAsOf: "annual intentional homicides peak bands",
    fatalitiesSource: "INEGI / SESNSP national stats",
    status: "active",
    newsQueries: ["Mexico cartel violence", "Mexico homicide conflict"],
    keywords: ["mexico", "cartel", "sinaloa", "jalisco", "cjng"],
    nuclearRisk: "none",
    sources: [
      { label: "Open government homicide stats (INEGI)", url: "https://www.inegi.org.mx/" },
    ],
  },
  {
    id: "kashmir",
    name: "India–Pakistan Kashmir tensions",
    shortName: "Kashmir",
    summary:
      "Long-running territorial dispute with periodic kinetic incidents along the LoC/IB; nuclear-armed adversaries make even limited clashes strategically significant.",
    type: "territorial",
    intensity: "tension",
    region: "Asia",
    lat: 34.0,
    lon: 75.0,
    countries: ["IN", "PK"],
    parties: ["India", "Pakistan", "Militant groups (variable)"],
    startYear: 1947,
    fatalitiesNote: "Lower annual deaths than major wars; spikes during crises. Strategic significance exceeds body count due to nuclear dyad.",
    fatalitiesLow: 50,
    fatalitiesHigh: 500,
    fatalitiesAsOf: "typical recent annual LoC/IB",
    fatalitiesSource: "Open military statements / local press",
    status: "active",
    newsQueries: ["Kashmir conflict", "India Pakistan LoC"],
    keywords: ["kashmir", "loc", "jammu", "pakistan", "india"],
    nuclearRisk: "elevated",
    sources: [
      { label: "UNMOGIP", url: "https://unmogip.unmissions.org/" },
    ],
  },
  {
    id: "korea-peninsula",
    name: "Korean Peninsula standoff",
    shortName: "Korea",
    summary:
      "Armistice without peace treaty since 1953; DPRK nuclear/missile tests and ROK–US exercises sustain high military readiness and periodic crises.",
    type: "interstate",
    intensity: "tension",
    region: "Asia",
    lat: 38.0,
    lon: 127.0,
    countries: ["KP", "KR"],
    parties: ["DPRK", "ROK", "United States (alliance)"],
    startYear: 1950,
    fatalitiesNote: "Korean War 1950–53 killed millions. Current phase is deterrence with rare kinetic deaths; missile tests are not combat fatalities.",
    fatalitiesLow: 0,
    fatalitiesHigh: 50,
    fatalitiesAsOf: "current armistice phase",
    fatalitiesSource: "Open incident reporting",
    status: "active",
    newsQueries: ["North Korea missile", "Korean peninsula tensions", "DPRK nuclear"],
    keywords: ["north korea", "dprk", "pyongyang", "dmz", "hwasong"],
    nuclearRisk: "elevated",
    sources: [
      { label: "UN Security Council DPRK", url: "https://www.un.org/securitycouncil/" },
    ],
  },
  {
    id: "taiwan-strait",
    name: "Taiwan Strait tensions",
    shortName: "Taiwan",
    summary:
      "Unresolved sovereignty dispute; PLA exercises, grey-zone pressure, and US–Taiwan security ties keep risk of great-power conflict elevated without daily ground combat.",
    type: "territorial",
    intensity: "tension",
    region: "Asia",
    lat: 24.5,
    lon: 120.0,
    countries: ["TW", "CN"],
    parties: ["People’s Republic of China", "Taiwan (ROC)", "United States (security commitments)"],
    startYear: 1949,
    fatalitiesNote: "Not an active shooting war. Historical 1950s crises had combat deaths; today risk is strategic, not a continuous body count.",
    fatalitiesLow: 0,
    fatalitiesHigh: 10,
    fatalitiesAsOf: "current non-war phase",
    fatalitiesSource: "Open incident reporting",
    status: "active",
    newsQueries: ["Taiwan Strait", "PLA Taiwan exercises", "China Taiwan tensions"],
    keywords: ["taiwan", "strait", "pla", "taipei", "xi"],
    nuclearRisk: "elevated",
    sources: [
      { label: "Open military transparency reporting", url: "https://www.iiss.org/" },
    ],
  },
  {
    id: "iran-regional",
    name: "Iran regional military confrontations",
    shortName: "Iran theater",
    summary:
      "Recurring direct and proxy confrontations involving Iran, Israel, and the United States across the region (strikes, naval incidents, militia activity). Public reporting in 2025–2026 has included periods of open hostilities.",
    type: "interstate",
    intensity: "limited-war",
    region: "Middle East",
    lat: 32.0,
    lon: 53.0,
    countries: ["IR", "IL", "IQ", "SY"],
    parties: ["Iran", "Israel", "United States", "Regional proxy/militia networks"],
    startYear: 2019,
    fatalitiesNote: "Baseline proxy violence lower; direct exchange periods can kill hundreds to low thousands depending on campaign intensity.",
    fatalitiesLow: 500,
    fatalitiesHigh: 5000,
    fatalitiesAsOf: "2019–2026 episodic",
    fatalitiesSource: "Open military claims / wire services",
    status: "active",
    newsQueries: ["Iran Israel strikes", "US Iran military", "Iran nuclear tensions"],
    keywords: ["iran", "tehran", "centcom", "irgc", "strait of hormuz"],
    nuclearRisk: "elevated",
    sources: [
      { label: "IAEA / UN reporting", url: "https://www.iaea.org/" },
    ],
  },
  {
    id: "afghanistan",
    name: "Afghanistan (Taliban rule & IS-K)",
    shortName: "Afghanistan",
    summary:
      "After the 2021 Taliban takeover, large-scale civil war ended but Islamic State Khorasan and other violence, plus humanitarian crisis, continue under international monitoring.",
    type: "insurgency",
    intensity: "insurgency",
    region: "Asia",
    lat: 33.9,
    lon: 66.0,
    countries: ["AF"],
    parties: ["Taliban authorities", "Islamic State Khorasan (IS-K)", "Other armed opposition (limited)"],
    startYear: 2021,
    fatalitiesNote: "Far below 2001–2021 war peaks; IS-K mass-casualty attacks still cause multi-hundred death years.",
    fatalitiesLow: 500,
    fatalitiesHigh: 3000,
    fatalitiesAsOf: "annual post-2021",
    fatalitiesSource: "UNAMA / ACLED",
    status: "active",
    newsQueries: ["Afghanistan IS-K", "Taliban Afghanistan conflict"],
    keywords: ["afghanistan", "taliban", "isk", "kabul"],
    nuclearRisk: "none",
    sources: [
      { label: "UNAMA", url: "https://unama.unmissions.org/" },
    ],
  },
  {
    id: "libya",
    name: "Libya political-military fragmentation",
    shortName: "Libya",
    summary:
      "Eastern–western political split with armed groups and foreign influence; violence is episodic compared with 2011–2020 peaks but still triggers UN mediation.",
    type: "civil",
    intensity: "insurgency",
    region: "Africa",
    lat: 27.0,
    lon: 17.0,
    countries: ["LY"],
    parties: ["Government of National Unity (west)", "LNA / eastern authorities", "Militias"],
    startYear: 2014,
    fatalitiesNote: "Episodic; well below 2011–2020 peaks.",
    fatalitiesLow: 100,
    fatalitiesHigh: 1000,
    fatalitiesAsOf: "recent years",
    fatalitiesSource: "UNSMIL / ACLED",
    status: "active",
    newsQueries: ["Libya conflict", "Libya LNA"],
    keywords: ["libya", "tripoli", "benghazi", "lna"],
    nuclearRisk: "none",
    sources: [
      { label: "UNSMIL", url: "https://unsmil.unmissions.org/" },
    ],
  },
  {
    id: "colombia",
    name: "Colombia residual armed conflict",
    shortName: "Colombia",
    summary:
      "Peace process with FARC reduced major civil war, but ELN, FARC dissidents, and criminal groups sustain organized violence in several departments.",
    type: "insurgency",
    intensity: "insurgency",
    region: "Americas",
    lat: 4.0,
    lon: -73.0,
    countries: ["CO"],
    parties: ["Colombian state", "ELN", "FARC dissident groups", "Criminal armed groups"],
    startYear: 1964,
    fatalitiesNote: "Far below historical civil-war peaks; ELN/dissident violence still lethal in specific departments.",
    fatalitiesLow: 200,
    fatalitiesHigh: 1500,
    fatalitiesAsOf: "recent years",
    fatalitiesSource: "UN Verification / national stats",
    status: "active",
    newsQueries: ["Colombia ELN", "Colombia armed conflict"],
    keywords: ["colombia", "eln", "farc", "catatumbo"],
    nuclearRisk: "none",
    sources: [
      { label: "UN Verification Mission Colombia", url: "https://colombia.unmissions.org/" },
    ],
  },
];

// Fix type errors for insurgency - I used cast incorrectly. Fix to proper ConflictType
// I'll fix in a follow-up write - actually ConflictType doesn't include insurgency.
// I should add "insurgency" to ConflictType or use civil/non-state.

export function conflictById(id: string): ArmedConflict | undefined {
  return ARMED_CONFLICTS.find((c) => c.id === id);
}

export function conflictsByRegion(region: ConflictRegion | "all"): ArmedConflict[] {
  if (region === "all") return ARMED_CONFLICTS;
  return ARMED_CONFLICTS.filter((c) => c.region === region);
}

export function sortConflictsByIntensity(list: ArmedConflict[]): ArmedConflict[] {
  return [...list].sort(
    (a, b) =>
      CONFLICT_INTENSITY_META[b.intensity].rank - CONFLICT_INTENSITY_META[a.intensity].rank ||
      a.name.localeCompare(b.name),
  );
}
