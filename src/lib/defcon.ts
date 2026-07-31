import type { Scenario } from "@/data/nuclear-forces";
import type { LiveNewsItem } from "@/server/nuclear-news";
import type { SeismicEvent } from "@/server/threat-intel";
import type { OsintDefcon } from "@/server/defcon-osint";

export type DefconLevel = 1 | 2 | 3 | 4 | 5;

export interface DefconState {
  /** Display level: unofficial OSINT primary, adjusted by live sensors */
  level: DefconLevel;
  label: string;
  officialName: string;
  /** Pure OSINT feed level (defconlevel.com) */
  osintLevel: DefconLevel;
  osintSource: string;
  osintUrl: string;
  nuclearRisk: number | null;
  reasons: string[];
  score: number;
  newsPressure: number;
  seismicPressure: number;
  scenarioFloor: DefconLevel;
  isOfficialDefcon: false;
  classificationNote: string;
  updatedAt: number;
  bands: { id: string; label: string; value: number; max: number; color: string }[];
  /** Classic DEFCON color for UI */
  color: string;
}

const LABELS: Record<DefconLevel, { code: string; official: string; color: string }> = {
  5: { code: "FADE OUT", official: "Lowest readiness (peacetime baseline)", color: "#3b82f6" },
  4: { code: "DOUBLE TAKE", official: "Increased intelligence watch", color: "#22c55e" },
  3: { code: "ROUND HOUSE", official: "Increase in force readiness above normal", color: "#eab308" },
  2: { code: "FAST PACE", official: "Further increase in force readiness", color: "#f97316" },
  1: { code: "COCKED PISTOL", official: "Maximum readiness", color: "#ef4444" },
};

function clampDefcon(n: number): DefconLevel {
  return Math.max(1, Math.min(5, Math.round(n))) as DefconLevel;
}

export type DefconInputs = {
  scenario: Scenario;
  news: LiveNewsItem[] | { severity: string; title: string; publishedAt: string }[];
  seismic?: SeismicEvent[];
  osint?: OsintDefcon | null;
  now?: number;
};

/**
 * Unofficial realtime DEFCON:
 * 1) Primary floor = public OSINT estimate (defconlevel.com)
 * 2) Live news + USGS can tighten (lower number) one step
 * Never claims official classified DEFCON.
 */
export function computeDefcon({
  scenario,
  news,
  seismic = [],
  osint = null,
  now = Date.now(),
}: DefconInputs): DefconState {
  const scenarioFloor = scenario.defcon as DefconLevel;
  const osintLevel = (osint?.level ?? 3) as DefconLevel;
  const day = 24 * 3600 * 1000;
  const recent = news.filter((n) => now - new Date(n.publishedAt).getTime() < day);

  let newsPressure = 0;
  let seismicPressure = 0;
  const reasons: string[] = [];

  reasons.push(
    `Unofficial OSINT DEFCON ${osintLevel} — ${osint?.source ?? "consensus"} (not official)`,
  );

  const crit = recent.filter((n) => n.severity === "critical").length;
  const high = recent.filter((n) => n.severity === "high").length;
  const elev = recent.filter((n) => n.severity === "elevated").length;
  newsPressure += crit * 1.15 + high * 0.65 + elev * 0.22;

  const launchHits = recent.filter((n) =>
    /launch|test[- ]fire|icbm|slbm|ballistic|sarmat|minuteman|hwasong|nuclear test|missile strike/i.test(
      n.title,
    ),
  ).length;
  if (launchHits >= 4) {
    newsPressure += 1.4;
    reasons.push(`${launchHits} launch/missile headlines (24h live news)`);
  } else if (launchHits >= 1) {
    newsPressure += 0.45 * Math.min(3, launchHits);
    reasons.push(`${launchHits} missile-related headline(s) live`);
  }

  const elevatedSeismic = seismic.filter((e) => e.nuclearRelevance === "elevated");
  const watchSeismic = seismic.filter((e) => e.nuclearRelevance === "watch");
  seismicPressure += elevatedSeismic.length * 1.5 + watchSeismic.length * 0.35;
  if (elevatedSeismic.length) {
    reasons.push(`${elevatedSeismic.length} USGS quake(s) near nuclear test watch zones`);
  } else {
    reasons.push("USGS: no elevated nuclear-watch seismic hits");
  }

  if (osint?.nuclearRisk != null) {
    reasons.push(`OSINT nuclear risk index: ${osint.nuclearRisk}`);
  }

  // Display: OSINT primary; live sensors can raise readiness by at most 1 step
  const sensorBump = Math.min(1, Math.floor((newsPressure + seismicPressure) * 0.5));
  const level = clampDefcon(osintLevel - sensorBump);
  // Scenario only for educational sims — soft note
  if (scenarioFloor < osintLevel) {
    reasons.push(`Active edu scenario floor D${scenarioFloor} (does not override OSINT display)`);
  }
  if (sensorBump > 0) {
    reasons.push(`Live sensors tightened OSINT D${osintLevel} → D${level}`);
  }

  const meta = LABELS[level];

  return {
    level,
    label: meta.code,
    officialName: meta.official,
    osintLevel,
    osintSource: osint?.source ?? "OSINT",
    osintUrl: osint?.sourceUrl ?? "https://www.defconlevel.com/current-level",
    nuclearRisk: osint?.nuclearRisk ?? null,
    reasons: reasons.slice(0, 6),
    score: newsPressure + seismicPressure,
    newsPressure,
    seismicPressure,
    scenarioFloor,
    isOfficialDefcon: false,
    classificationNote:
      "Unofficial realtime DEFCON from public OSINT (defconlevel.com) + live open sensors. Official U.S. DEFCON is classified and never published.",
    updatedAt: now,
    color: meta.color,
    bands: [
      {
        id: "osint",
        label: "OSINT DEFCON",
        value: 6 - osintLevel,
        max: 5,
        color: LABELS[osintLevel].color,
      },
      {
        id: "news",
        label: "Live news",
        value: newsPressure,
        max: 6,
        color: "#38bdf8",
      },
      {
        id: "seismic",
        label: "USGS watch",
        value: seismicPressure,
        max: 4,
        color: "#fbbf24",
      },
    ],
  };
}
