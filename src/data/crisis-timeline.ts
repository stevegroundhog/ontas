/** Historical nuclear crises & close calls — public educational record only. */

export type CrisisEra = "cold-war" | "post-cold-war" | "21st-century";

export type CrisisEvent = {
  id: string;
  year: number;
  month?: number;
  title: string;
  era: CrisisEra;
  actors: string[];
  knownThen: string;
  knownLater: string;
  lesson: string;
  kind: "crisis" | "false-alarm" | "test-cycle" | "accident" | "signaling";
};

export const CRISIS_ERA_META: Record<CrisisEra, { label: string; color: string }> = {
  "cold-war": { label: "Cold War", color: "#60a5fa" },
  "post-cold-war": { label: "Post–Cold War", color: "#a78bfa" },
  "21st-century": { label: "21st century", color: "#fbbf24" },
};

export const CRISIS_TIMELINE: CrisisEvent[] = [
  {
    id: "cuban-1962",
    year: 1962,
    month: 10,
    title: "Cuban Missile Crisis",
    era: "cold-war",
    actors: ["us", "ru", "cu"],
    kind: "crisis",
    knownThen:
      "US detected Soviet nuclear missiles in Cuba; naval quarantine and high alert; public feared war within days.",
    knownLater:
      "Local Soviet tactical nuclear authority and submarine near-use episodes were poorly understood in Washington at the time.",
    lesson:
      "Crisis stability depends on communication channels and accurate knowledge of the other side’s local authorities — not only strategic warhead counts.",
  },
  {
    id: "able-archer-1983",
    year: 1983,
    month: 11,
    title: "Able Archer 83",
    era: "cold-war",
    actors: ["us", "ru", "nato"],
    kind: "crisis",
    knownThen:
      "NATO command-post exercise looked more realistic than usual; Soviet intelligence raised concern about possible cover for attack.",
    knownLater:
      "Declassified material showed Soviet leadership genuinely feared a surprise strike; risk of misreading exercises is now a standard case study.",
    lesson:
      "Exercises and signaling can be misread as preparations for war when trust and transparency are low.",
  },
  {
    id: "sergei-petrov-1983",
    year: 1983,
    month: 9,
    title: "1983 Soviet early-warning false alarm",
    era: "cold-war",
    actors: ["ru", "us"],
    kind: "false-alarm",
    knownThen:
      "A satellite early-warning system reported US missile launches; duty officer judged it a false alarm and did not escalate.",
    knownLater:
      "Later analysis attributed the reading to sunlight on high-altitude clouds; human judgment prevented a catastrophic chain.",
    lesson:
      "Sensors lie sometimes. Independent verification and human override paths matter more than raw automation.",
  },
  {
    id: "norwegian-rocket-1995",
    year: 1995,
    month: 1,
    title: "Norwegian rocket incident",
    era: "post-cold-war",
    actors: ["ru", "no", "us"],
    kind: "false-alarm",
    knownThen:
      "A scientific sounding rocket from Norway produced a radar track that resembled a submarine-launched missile trajectory toward Russia.",
    knownLater:
      "Russia’s nuclear briefcase was reportedly activated briefly; prior notification of the launch had not fully reached the right channels.",
    lesson:
      "Even after the Cold War, launch notifications and bureaucracy remain part of nuclear safety.",
  },
  {
    id: "indiapak-1999",
    year: 1999,
    title: "Kargil War (nuclear-armed neighbors)",
    era: "post-cold-war",
    actors: ["in", "pk"],
    kind: "crisis",
    knownThen:
      "Limited conventional war between India and Pakistan after both had conducted nuclear tests (1998).",
    knownLater:
      "Scholars still debate how close escalation came; both sides learned nuclear signaling under combat conditions.",
    lesson:
      "Nuclear possession does not automatically prevent limited wars — it changes the risks around them.",
  },
  {
    id: "dprk-2017",
    year: 2017,
    title: "DPRK ICBM / thermonuclear test cycle",
    era: "21st-century",
    actors: ["kp", "us", "cn", "kr", "jp"],
    kind: "test-cycle",
    knownThen:
      "Rapid sequence of missile tests and a claimed thermonuclear test; public debate over ranges that could reach the US mainland.",
    knownLater:
      "Open estimates of reliability and re-entry capability remained contested; diplomacy and sanctions cycles continued.",
    lesson:
      "Test calendars are public signals. Range claims need separation from operational reliability.",
  },
  {
    id: "hawaii-2018",
    year: 2018,
    month: 1,
    title: "Hawaii ballistic missile false alert",
    era: "21st-century",
    actors: ["us"],
    kind: "false-alarm",
    knownThen:
      "A state emergency alert told residents a ballistic missile threat was inbound; panic followed for ~38 minutes before cancellation.",
    knownLater:
      "Human/procedural error in the alert system — not an incoming weapon. Highlighted public confusion about verification.",
    lesson:
      "Know how official alerts work and how cancellations are issued. Viral screenshots are not authoritative.",
  },
  {
    id: "ukraine-signaling-2022",
    year: 2022,
    title: "Russia–Ukraine war nuclear signaling",
    era: "21st-century",
    actors: ["ru", "us", "nato", "ua"],
    kind: "signaling",
    knownThen:
      "Explicit nuclear rhetoric and elevated rhetoric about red lines during a major European war.",
    knownLater:
      "Open-source tracking of posture changes is incomplete; risk communication became a public diplomacy tool.",
    lesson:
      "Nuclear language in conventional wars is meant to shape adversary decisions — treat official channels as primary.",
  },
  {
    id: "new-start-2026",
    year: 2026,
    month: 2,
    title: "New START expiry without successor",
    era: "21st-century",
    actors: ["us", "ru"],
    kind: "signaling",
    knownThen:
      "Last bilateral strategic ceilings expired; no replacement treaty in force; mutual transparency reduced since 2023 suspension.",
    knownLater:
      "Still unfolding. Open inventories rely more on national statements and independent estimates (FAS/SIPRI-class).",
    lesson:
      "Arms-control gaps raise uncertainty — they do not by themselves equal imminent use. Watch verification and rhetoric separately.",
  },
];

export function crisesNewestFirst(): CrisisEvent[] {
  return [...CRISIS_TIMELINE].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return (b.month ?? 0) - (a.month ?? 0);
  });
}
