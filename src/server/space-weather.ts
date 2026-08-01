import { createServerFn } from "@tanstack/react-start";
import { ONTAS_UA } from "@/lib/rss-utils";

/**
 * NOAA SWPC public JSON — space weather (Kp). Educational context only
 * (solar storms / radio blackouts — not nuclear fallout).
 */
export type SpaceWeatherSnapshot = {
  fetchedAt: string;
  kp: number | null;
  kpTime: string | null;
  scale: "quiet" | "unsettled" | "storm" | "unknown";
  note: string;
  source: string;
  ok: boolean;
};

let cache: { at: number; snap: SpaceWeatherSnapshot } | null = null;
const TTL = 180_000;

function scaleKp(kp: number): SpaceWeatherSnapshot["scale"] {
  if (kp >= 5) return "storm";
  if (kp >= 3) return "unsettled";
  return "quiet";
}

function parseLastKp(data: unknown): { kp: number; time: string | null } | null {
  if (!Array.isArray(data) || data.length < 1) return null;

  // Format A: array of objects { time_tag, Kp, ... }
  const lastObj = data[data.length - 1];
  if (lastObj && typeof lastObj === "object" && !Array.isArray(lastObj)) {
    const rec = lastObj as Record<string, unknown>;
    const kp = Number(rec.Kp ?? rec.kp);
    if (Number.isFinite(kp)) {
      return { kp, time: String(rec.time_tag ?? rec.timeTag ?? "") || null };
    }
  }

  // Format B: legacy [[header...],[time,kp,...],...]
  const rows = data as unknown[];
  const first = rows[0];
  const start =
    Array.isArray(first) &&
    typeof first[0] === "string" &&
    String(first[0]).toLowerCase().includes("time")
      ? 1
      : 0;
  for (let i = rows.length - 1; i >= start; i--) {
    const row = rows[i];
    if (Array.isArray(row) && row.length >= 2) {
      const kp = Number(row[1]);
      if (Number.isFinite(kp)) return { kp, time: String(row[0] ?? "") || null };
    }
  }
  return null;
}

export async function getSpaceWeather(): Promise<SpaceWeatherSnapshot> {
  const now = Date.now();
  if (cache && now - cache.at < TTL) return cache.snap;

  const empty = (ok: boolean, note: string): SpaceWeatherSnapshot => ({
    fetchedAt: new Date().toISOString(),
    kp: null,
    kpTime: null,
    scale: "unknown",
    note,
    source: "NOAA SWPC planetary K-index (public)",
    ok,
  });

  try {
    const res = await fetch(
      "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
      {
        headers: { Accept: "application/json", "User-Agent": ONTAS_UA },
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!res.ok) {
      const snap = empty(false, `HTTP ${res.status}`);
      cache = { at: now, snap };
      return snap;
    }
    const data = await res.json();
    const parsed = parseLastKp(data);
    if (!parsed) {
      const snap = empty(false, "Could not parse SWPC Kp table");
      cache = { at: now, snap };
      return snap;
    }
    const snap: SpaceWeatherSnapshot = {
      fetchedAt: new Date().toISOString(),
      kp: parsed.kp,
      kpTime: parsed.time,
      scale: scaleKp(parsed.kp),
      note: `Planetary Kp ≈ ${parsed.kp} (${scaleKp(parsed.kp)}). Solar storms affect radio/GPS — not a nuclear alert.`,
      source: "NOAA Space Weather Prediction Center — public JSON",
      ok: true,
    };
    cache = { at: now, snap };
    return snap;
  } catch (e) {
    const snap = empty(false, e instanceof Error ? e.message : "error");
    cache = { at: now, snap };
    return snap;
  }
}

export const fetchSpaceWeather = createServerFn({ method: "GET" }).handler(
  async (): Promise<SpaceWeatherSnapshot> => getSpaceWeather(),
);
