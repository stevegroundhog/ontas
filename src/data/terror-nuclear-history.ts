/**
 * Public historical record of non-state nuclear / radiological threats & attempts.
 * Drawn from open government reports, court cases, and academic summaries.
 * Educational only — not operational intelligence. Not exhaustive of every hoax call.
 */

export type TerrorIncidentKind =
  | "nuclear-threat"
  | "nuclear-interest"
  | "radiological-plot"
  | "materials-attempt"
  | "disrupted-plot"
  | "hoax-or-claim";

export interface TerrorNuclearIncident {
  id: string;
  group: string;
  aka?: string;
  years: string;
  kind: TerrorIncidentKind;
  region: string;
  summary: string;
  outcome: string;
  publicSources: string;
  /** true = open sources describe concrete steps beyond rhetoric */
  beyondRhetoric: boolean;
}

export const TERROR_INCIDENT_KIND_META: Record<
  TerrorIncidentKind,
  { label: string; color: string }
> = {
  "nuclear-threat": { label: "Nuclear threat / rhetoric", color: "#f87171" },
  "nuclear-interest": { label: "Nuclear interest / pursuit", color: "#fb923c" },
  "radiological-plot": { label: "Radiological plot", color: "#fbbf24" },
  "materials-attempt": { label: "Materials attempt", color: "#a78bfa" },
  "disrupted-plot": { label: "Disrupted plot", color: "#38bdf8" },
  "hoax-or-claim": { label: "Hoax / unverified claim", color: "#94a3b8" },
};

/**
 * Groups and cases widely cited in open nuclear-terrorism literature.
 * Order: more substantiated historical cases first.
 */
export const TERROR_NUCLEAR_HISTORY: TerrorNuclearIncident[] = [
  {
    id: "aq-nuclear-interest",
    group: "Al-Qaeda (core and affiliates)",
    aka: "AQ",
    years: "1990s–2010s (ongoing concern in assessments)",
    kind: "nuclear-interest",
    region: "Global / Afghanistan–Pakistan theater historically",
    summary:
      "Open reporting and declassified assessments describe long-standing interest in nuclear and radiological weapons, including attempts to acquire materials and technical know-how. No confirmed nuclear detonation or completed IND.",
    outcome:
      "Plots and procurement efforts disrupted or failed; remains a high-consequence concern in nuclear-security literature rather than a demonstrated nuclear capability.",
    publicSources: "9/11 Commission-related materials; open DoJ/FBI case summaries; academic nuclear terrorism literature",
    beyondRhetoric: true,
  },
  {
    id: "aq-jose-padilla",
    group: "Al-Qaeda–linked cell (Padilla case framing)",
    years: "2002 (arrest / charges context)",
    kind: "radiological-plot",
    region: "United States (alleged planning)",
    summary:
      "U.S. case materials publicly discussed an alleged “dirty bomb” (RDD) interest connected to al-Qaeda-linked planning. Details and legal framing evolved over the case.",
    outcome: "Arrest and prosecution path; no RDD was detonated.",
    publicSources: "U.S. DoJ public releases; major press contemporaneous reporting",
    beyondRhetoric: true,
  },
  {
    id: "aum-shinrikyo",
    group: "Aum Shinrikyo",
    aka: "Aleph (successor entities monitored)",
    years: "1993–1995 peak",
    kind: "nuclear-interest",
    region: "Japan / international procurement attempts",
    summary:
      "Cult pursued chemical (sarin), biological, and explored nuclear options including attempts related to uranium and technical recruitment. Famous for Tokyo subway sarin attack (chemical, not nuclear).",
    outcome:
      "No nuclear weapon produced. Leadership dismantled after 1995; chemical attack killed and injured many — shows WMD ambition without nuclear success.",
    publicSources: "Japanese court records summaries; open WMD terrorism case studies",
    beyondRhetoric: true,
  },
  {
    id: "chechen-rdd-threats",
    group: "Chechen militant networks (historical)",
    years: "1990s–2000s",
    kind: "radiological-plot",
    region: "Russia / Caucasus",
    summary:
      "Open reporting includes episodes involving radioactive materials (e.g. publicized cesium-related incidents) and threats in the context of the Chechen conflicts — often cited as RDD-adjacent history.",
    outcome:
      "No nuclear explosion. Radiological scares and materials incidents informed Russian and international nuclear-security focus.",
    publicSources: "Open press; nuclear security case compilations (IAEA ITDB-class discussions)",
    beyondRhetoric: true,
  },
  {
    id: "isis-nuclear-rhetoric",
    group: "Islamic State (ISIS/ISIL)",
    years: "2014–2019 peak territorial period",
    kind: "nuclear-threat",
    region: "Iraq–Syria; propaganda global",
    summary:
      "Propaganda and reporting included nuclear and radiological threats and interest in materials from conflict zones. No confirmed nuclear device; chemical weapons use is separately documented in open sources.",
    outcome:
      "Territorial defeat reduced capacity; nuclear capability never demonstrated. Nuclear-security focus included orphan sources in conflict zones.",
    publicSources: "UN investigations (chemical); open terrorism analysis; IAEA conflict-zone source security themes",
    beyondRhetoric: false,
  },
  {
    id: "ltte",
    group: "Liberation Tigers of Tamil Eelam (LTTE)",
    years: "1980s–2009",
    kind: "nuclear-threat",
    region: "Sri Lanka / diaspora fundraising contexts",
    summary:
      "Occasionally appears in older open literature regarding WMD interest or threats; better documented for conventional and suicide terrorism than nuclear capability.",
    outcome: "Defeated 2009; no nuclear weapon program confirmed in reliable open consensus.",
    publicSources: "Open conflict histories; secondary WMD-terrorism surveys",
    beyondRhetoric: false,
  },
  {
    id: "hezbollah-rhetoric",
    group: "Hezbollah",
    years: "2000s–present (rhetoric intermittent)",
    kind: "nuclear-threat",
    region: "Lebanon / regional",
    summary:
      "Open political rhetoric sometimes references Israeli nuclear capability and regional escalation; not the same as a demonstrated non-state nuclear weapons program.",
    outcome:
      "Treated in open analysis primarily as a conventional/missile and political-military actor; nuclear weapons remain Israeli state opacity topic.",
    publicSources: "Open regional security analysis",
    beyondRhetoric: false,
  },
  {
    id: "ansar-allah-rhetoric",
    group: "Ansar Allah (Houthis)",
    years: "2010s–2020s",
    kind: "nuclear-threat",
    region: "Yemen / Red Sea",
    summary:
      "Wartime propaganda has included extreme threats; public military activity centers on missiles, drones, and shipping attacks — not confirmed nuclear weapons.",
    outcome: "No nuclear capability demonstrated in open sources.",
    publicSources: "UN Yemen reporting; open defense press",
    beyondRhetoric: false,
  },
  {
    id: "right-wing-plots-us",
    group: "Various far-right / extremist individuals & small cells (US/Europe cases)",
    years: "1990s–2020s",
    kind: "disrupted-plot",
    region: "United States / Europe",
    summary:
      "Law-enforcement cases occasionally involve threats or interest in radiological materials or “dirty bomb” language among domestic extremists. Most are disrupted early; many are aspirational.",
    outcome: "Arrests and disruptions; no mass radiological dispersal event of nuclear scale in public record from these cases.",
    publicSources: "FBI/DoJ press releases; Europol TE-SAT themes (open)",
    beyondRhetoric: true,
  },
  {
    id: "smuggling-networks",
    group: "Criminal smuggling networks (not always ideological)",
    years: "1990s–present",
    kind: "materials-attempt",
    region: "Eurasia corridors historically emphasized; global seizures",
    summary:
      "IAEA ITDB-class public reporting tracks thefts, losses, and trafficking of nuclear and other radioactive material. Many cases are industrial sources or fraud, not bomb-usable HEU/Pu quantities.",
    outcome:
      "Seizures and stings; continuous nuclear-security mission. Few cases approach weapons-usable quantities according to open summaries.",
    publicSources: "IAEA Incident and Trafficking Database public fact sheets; NTI nuclear security indices",
    beyondRhetoric: true,
  },
  {
    id: "hoaxes-general",
    group: "Unattributed hoax callers / copycats",
    years: "Ongoing",
    kind: "hoax-or-claim",
    region: "Global",
    summary:
      "Airports, embassies, and cities periodically receive nuclear or radiological threat hoaxes. Consume responder resources.",
    outcome: "Cleared as false or unfounded in vast majority of publicized cases.",
    publicSources: "Local police/airport authority releases",
    beyondRhetoric: false,
  },
];

export const TERROR_NUCLEAR_BOTTOM_LINE =
  "Open consensus: no terrorist group is known to possess nuclear weapons. Confirmed nuclear arsenals remain state-held. Non-state risk centers on radiological dispersal, materials security, and (theoretically) crude nuclear devices if fissile material were obtained — a pathway governments invest heavily to block.";
