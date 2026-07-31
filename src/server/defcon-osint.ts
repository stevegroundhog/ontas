import { createServerFn } from "@tanstack/react-start";

export type OsintDefcon = {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  nuclearRisk: number | null;
  source: string;
  sourceUrl: string;
  summary: string;
  fetchedAt: string;
  isOfficial: false;
  rawSignals: string[];
};

const LABELS: Record<number, string> = {
  5: "FADE OUT",
  4: "DOUBLE TAKE",
  3: "ROUND HOUSE",
  2: "FAST PACE",
  1: "COCKED PISTOL",
};

let cache: { at: number; data: OsintDefcon } | null = null;
const CACHE_MS = 120_000;

function parseLevel(html: string): {
  level: 1 | 2 | 3 | 4 | 5;
  nuclearRisk: number | null;
  signals: string[];
} {
  const signals: string[] = [];
  let level: 1 | 2 | 3 | 4 | 5 = 3;
  let nuclearRisk: number | null = null;

  // Prefer explicit FAQ / schema phrasing from defconlevel.com
  const faq =
    html.match(
      /places global readiness at DEFCON\s*([1-5])/i,
    ) ||
    html.match(
      /estimated DEFCON level is\s*\*?\*?\s*([1-5])/i,
    ) ||
    html.match(
      /Based on our Open Source Intelligence[^\d]{0,120}DEFCON level[^\d]{0,40}([1-5])/i,
    ) ||
    html.match(/Current DEFCON[^0-9]{0,40}DEFCON\s*([1-5])/i);

  if (faq) {
    level = Number(faq[1]) as 1 | 2 | 3 | 4 | 5;
    signals.push(`defconlevel.com OSINT estimate DEFCON ${level}`);
  } else {
    // Majority vote on early page "DEFCON N" tokens
    const early = html.slice(0, 25000);
    const counts = [0, 0, 0, 0, 0, 0];
    for (const m of early.matchAll(/DEFCON\s*([1-5])/gi)) {
      counts[Number(m[1])]++;
    }
    let best = 3;
    let bestC = 0;
    for (let i = 1; i <= 5; i++) {
      if (counts[i]! > bestC) {
        bestC = counts[i]!;
        best = i;
      }
    }
    level = best as 1 | 2 | 3 | 4 | 5;
    signals.push(`heuristic DEFCON ${level} (token frequency)`);
  }

  const nr =
    html.match(/nuclear risk level is\s*([1-5])/i) ||
    html.match(/NUCLEAR\s*([1-5])/i) ||
    html.match(/Nuclear Risk[^0-9]{0,40}([1-5])/i);
  if (nr) {
    nuclearRisk = Number(nr[1]);
    signals.push(`nuclear risk index ${nuclearRisk}`);
  }

  return { level, nuclearRisk, signals };
}

/** Unofficial realtime DEFCON from public OSINT site (defconlevel.com) */
export async function getOsintDefcon(): Promise<OsintDefcon> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.data;

  try {
    const res = await fetch("https://www.defconlevel.com/current-level", {
      headers: {
        "User-Agent": "ONTAS-Educational/1.0 (public OSINT aggregator)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(14000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const { level, nuclearRisk, signals } = parseLevel(html);

    const data: OsintDefcon = {
      level,
      label: LABELS[level] ?? "UNKNOWN",
      nuclearRisk,
      source: "defconlevel.com OSINT estimate",
      sourceUrl: "https://www.defconlevel.com/current-level",
      summary: `Unofficial public OSINT estimate: DEFCON ${level} (${LABELS[level]}). Official U.S. DEFCON remains classified.`,
      fetchedAt: new Date(now).toISOString(),
      isOfficial: false,
      rawSignals: signals,
    };
    cache = { at: now, data };
    return data;
  } catch (e) {
    // Safe fallback — last known OSINT consensus mid-2026
    const data: OsintDefcon = {
      level: 3,
      label: LABELS[3]!,
      nuclearRisk: 4,
      source: "fallback (OSINT feed unreachable)",
      sourceUrl: "https://www.defconlevel.com/current-level",
      summary: `OSINT feed error; using last public consensus DEFCON 3. ${e instanceof Error ? e.message : ""}`.trim(),
      fetchedAt: new Date(now).toISOString(),
      isOfficial: false,
      rawSignals: ["fallback"],
    };
    cache = { at: now, data };
    return data;
  }
}

export const fetchOsintDefcon = createServerFn({ method: "GET" }).handler(async () => {
  return getOsintDefcon();
});
