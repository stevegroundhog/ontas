/** Curated nuclear-threat intelligence items for fallback when live feeds are empty.
 *  Educational open-source style reporting — not official alerts.
 */

export type ThreatSeverity = "critical" | "high" | "elevated" | "info";

export type ThreatNewsItem = {
  id: string;
  headline: string;
  summary: string;
  publishedAt: string;
  source: string;
  sourceUrl?: string;
  region: string;
  severity: ThreatSeverity;
  actors: string[];
  category: string;
};

/** Relative age of an ISO timestamp; safe for invalid dates */
export function formatRelative(iso: string, now = Date.now()): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const diff = Math.max(0, now - t);
  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 14) return `${day}d ago`;
  return new Date(t).toISOString().slice(0, 10);
}

export const LIVE_PULSE_LINES = [
  "SCANNING OPEN NEWSWIRES…",
  "CORRELATING USGS + STRATEGIC SITES…",
  "REFRESHING MULTI-REGION RSS MESH…",
  "NO OFFICIAL DEFCON FEED — OSINT ONLY…",
];

/** Static archive used when live mesh is empty or offline */
export const THREAT_NEWS: ThreatNewsItem[] = [
  {
    id: "newstart-2026",
    headline: "New START expired — no bilateral US–Russia strategic ceilings remain",
    summary:
      "With New START lapsed after earlier Russian suspension, open-source analysts note unconstrained deployed strategic accounting between the two largest arsenals. Educational baseline, not an alert.",
    publishedAt: "2026-02-05T12:00:00.000Z",
    source: "Arms Control Association (open reporting)",
    region: "Global",
    severity: "critical",
    actors: ["us", "ru"],
    category: "treaty",
  },
  {
    id: "china-triad",
    headline: "China continues solid-fuel ICBM and SSBN force expansion",
    summary:
      "Open estimates place China as the fastest-growing nuclear arsenal, with silo fields and Type 094/JL-class sea leg modernization widely reported in open literature.",
    publishedAt: "2026-06-15T08:00:00.000Z",
    source: "FAS / open literature synthesis",
    region: "Indo-Pacific",
    severity: "elevated",
    actors: ["cn", "us"],
    category: "posture",
  },
  {
    id: "dprk-icbm",
    headline: "DPRK ICBM flight-test cycles remain a peninsula flashpoint",
    summary:
      "Public reporting continues to track Hwasong-class long-range systems and related missile activity. Watch zones around Punggye-ri remain relevant for seismic correlation.",
    publishedAt: "2026-05-20T14:30:00.000Z",
    source: "Open-source peninsula reporting",
    region: "Korean Peninsula",
    severity: "high",
    actors: ["kp", "us"],
    category: "test",
  },
  {
    id: "eu-posture",
    headline: "NATO nuclear sharing and dual-capable aircraft posture under review",
    summary:
      "European basing of US gravity bombs and dual-capable aircraft remains part of extended deterrence discussions in open policy literature.",
    publishedAt: "2026-04-10T10:00:00.000Z",
    source: "Open policy analysis",
    region: "Europe",
    severity: "info",
    actors: ["us", "uk", "fr"],
    category: "posture",
  },
  {
    id: "south-asia",
    headline: "India–Pakistan strategic forces remain hair-trigger regional risk",
    summary:
      "Short flight times and dual-capable delivery systems keep South Asia a high-attention region in educational nuclear risk literature.",
    publishedAt: "2026-03-22T09:00:00.000Z",
    source: "Open regional analysis",
    region: "South Asia",
    severity: "elevated",
    actors: ["in", "pk"],
    category: "analysis",
  },
  {
    id: "ssbn-patrol",
    headline: "Continuous SSBN patrols remain core of sea-based deterrence",
    summary:
      "US, UK, France, Russia, China, and India maintain or expand ballistic-missile submarine legs. Submerged positions are not public; open estimates use patrol zones only.",
    publishedAt: "2026-07-01T11:00:00.000Z",
    source: "Naval open-source synthesis",
    region: "Global",
    severity: "info",
    actors: ["us", "ru", "cn", "uk", "fr", "in"],
    category: "exercise",
  },
];

export function newsForNation(nationId: string | null): ThreatNewsItem[] {
  if (!nationId) return THREAT_NEWS;
  return THREAT_NEWS.filter((n) => n.actors.includes(nationId));
}
