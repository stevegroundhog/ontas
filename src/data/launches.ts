/**
 * Missile / space launch calendar — public, announced, or widely reported events.
 * Not live classified telemetry. NOTAMs/space-track-class open sources + press.
 */

export type LaunchKind =
  | "icbm-test"
  | "irbm-test"
  | "slbm-test"
  | "cruise-test"
  | "space-orbital"
  | "space-suborbital"
  | "bmd-test"
  | "announced-window";

export type LaunchStatus = "confirmed-public" | "reported" | "scheduled-window" | "historical";

export interface LaunchEvent {
  id: string;
  date: string; // ISO date or YYYY-MM
  kind: LaunchKind;
  status: LaunchStatus;
  actor: string;
  actorId?: string; // nuclear nation id when applicable
  name: string;
  location?: string;
  summary: string;
  sources: { label: string; url: string }[];
}

export const LAUNCH_KIND_META: Record<LaunchKind, { label: string; color: string }> = {
  "icbm-test": { label: "ICBM test", color: "#f87171" },
  "irbm-test": { label: "IRBM/MRBM", color: "#fb923c" },
  "slbm-test": { label: "SLBM test", color: "#a78bfa" },
  "cruise-test": { label: "Cruise / other", color: "#fbbf24" },
  "space-orbital": { label: "Orbital space", color: "#38bdf8" },
  "space-suborbital": { label: "Suborbital", color: "#2dd4bf" },
  "bmd-test": { label: "Missile defense", color: "#34d399" },
  "announced-window": { label: "NOTAM / window", color: "#94a3b8" },
};

/** Curated educational calendar (public reporting). Update as open sources allow. */
export const LAUNCH_CALENDAR: LaunchEvent[] = [
  {
    id: "kp-hwasong-2024",
    date: "2024-10",
    kind: "icbm-test",
    status: "confirmed-public",
    actor: "DPRK",
    actorId: "kp",
    name: "Hwasong-class ICBM flight tests (series)",
    location: "Korean Peninsula / East Sea corridors",
    summary:
      "Multiple public DPRK ICBM demonstrations in 2024–2025 establishing claimed CONUS-range solid/liquid systems; widely tracked by ROK–US–JP open reporting.",
    sources: [
      { label: "UN Security Council DPRK files", url: "https://www.un.org/securitycouncil/" },
    ],
  },
  {
    id: "cn-df-tests",
    date: "2024-09",
    kind: "icbm-test",
    status: "reported",
    actor: "China",
    actorId: "cn",
    name: "DF-series training / rare public ICBM flight reporting",
    location: "PRC ranges (as reported)",
    summary:
      "Open sources periodically report PLA Rocket Force training launches; a rare long-range ICBM flight into the Pacific drew global attention when publicly acknowledged.",
    sources: [{ label: "Open defense press", url: "https://www.reuters.com/" }],
  },
  {
    id: "us-minuteman-gt",
    date: "2025-02",
    kind: "icbm-test",
    status: "confirmed-public",
    actor: "United States",
    actorId: "us",
    name: "Minuteman III operational test launches",
    location: "Vandenberg SFB → Ronald Reagan Test Site corridor",
    summary:
      "Routine unarmed ICBM reliability tests announced via USAF/USSF public affairs; NOTAMs and range safety notices published for hazard areas.",
    sources: [
      { label: "US Space Force / Vandenberg public affairs", url: "https://www.spaceforce.mil/" },
    ],
  },
  {
    id: "ru-yars-sarmat",
    date: "2025-06",
    kind: "icbm-test",
    status: "reported",
    actor: "Russia",
    actorId: "ru",
    name: "Yars / Sarmat developmental & training launches",
    location: "Plesetsk / domestic ranges (as reported)",
    summary:
      "Russian MoD and open OSINT report periodic ICBM training and Sarmat program activity; independent verification varies by event.",
    sources: [{ label: "Open MoD / wire reporting", url: "https://www.reuters.com/" }],
  },
  {
    id: "in-agni",
    date: "2025-03",
    kind: "icbm-test",
    status: "confirmed-public",
    actor: "India",
    actorId: "in",
    name: "Agni-V / Agni-series user & developmental tests",
    location: "Dr APJ Abdul Kalam Island corridor",
    summary:
      "DRDO/Indian MoD public statements on strategic missile tests; NOTAMs for Bay of Bengal hazard areas accompany launches.",
    sources: [{ label: "PIB / Indian MoD releases", url: "https://pib.gov.in/" }],
  },
  {
    id: "fr-m51",
    date: "2024-11",
    kind: "slbm-test",
    status: "confirmed-public",
    actor: "France",
    actorId: "fr",
    name: "M51 SLBM qualification / test firings",
    location: "Bay of Biscay / Atlantic test corridors",
    summary:
      "French MoD announces occasional unarmed M51 tests from submerged SSBNs for deterrence credibility.",
    sources: [{ label: "French MoD", url: "https://www.defense.gouv.fr/" }],
  },
  {
    id: "us-trident-daso",
    date: "2025-09",
    kind: "slbm-test",
    status: "confirmed-public",
    actor: "United States / UK",
    actorId: "us",
    name: "Trident II D5 DASO / FCET series",
    location: "Eastern Test Range",
    summary:
      "Demonstration and shakedown operations for US (and periodic UK) SSBN crews; public notices of hazard areas.",
    sources: [{ label: "US Navy strategic systems", url: "https://www.navy.mil/" }],
  },
  {
    id: "space-starlink-routine",
    date: "2026-01",
    kind: "space-orbital",
    status: "confirmed-public",
    actor: "Commercial / multi-state",
    name: "High-tempo orbital launches (SpaceX, China, others)",
    location: "Global spaceports",
    summary:
      "Routine commercial and national orbital launches create continuous NOTAM/airspace closures. Useful background: not nuclear tests, but public range activity often confused with missile events.",
    sources: [
      { label: "Spaceflight Now / open launch calendars", url: "https://spaceflightnow.com/launch-schedule/" },
    ],
  },
  {
    id: "kp-window-2026",
    date: "2026-03",
    kind: "announced-window",
    status: "scheduled-window",
    actor: "DPRK (watch)",
    actorId: "kp",
    name: "Alliance exercise periods → elevated DPRK launch risk windows",
    location: "Peninsula / East Sea",
    summary:
      "Historically, ROK–US exercises correlate with higher probability of DPRK missile demonstrations. Not a prediction — a pattern noted in open reporting.",
    sources: [{ label: "Open peninsula reporting", url: "https://www.reuters.com/" }],
  },
  {
    id: "bmd-thaad-gmd",
    date: "2025-05",
    kind: "bmd-test",
    status: "confirmed-public",
    actor: "United States",
    actorId: "us",
    name: "GMD / Aegis / THAAD flight tests",
    location: "Pacific test ranges",
    summary:
      "Missile-defense intercept tests are publicly scheduled with range hazard notices; distinct from offensive ICBM tests but relevant to strategic balance debates.",
    sources: [{ label: "MDA public releases", url: "https://www.mda.mil/" }],
  },
];

export function launchesSortedNewestFirst(): LaunchEvent[] {
  return [...LAUNCH_CALENDAR].sort((a, b) => b.date.localeCompare(a.date));
}
