import { createServerFn } from "@tanstack/react-start";
import { estimateSubPositions, HOME_PORTS, SSBN_FLEET } from "@/data/naval-deployments";
import {
  CATEGORY_META,
  classifyAis,
  NATION_COLORS,
  type MaritimeUnit,
  type UnitCategory,
} from "@/data/maritime-units";
import { nationById } from "@/data/nuclear-forces";

export type AisContact = {
  mmsi: number;
  name: string;
  lat: number;
  lon: number;
  sog: number;
  cog: number;
  heading: number;
  shipType: number;
  shipTypeLabel: string;
  source: string;
  militaryLikely: boolean;
  category: UnitCategory;
  updatedAt: string;
};

export type MaritimeSnapshot = {
  fetchedAt: string;
  ais: AisContact[];
  aisSource: string;
  aisCount: number;
  units: MaritimeUnit[];
  subs: ReturnType<typeof estimateSubPositions>;
  homePorts: typeof HOME_PORTS;
  categories: typeof CATEGORY_META;
  note: string;
  cached?: boolean;
};

function shipTypeLabel(t: number): string {
  if (t >= 30 && t <= 32) return "fishing";
  if (t === 35) return "military";
  if (t >= 40 && t < 50) return "high-speed";
  if (t >= 60 && t < 70) return "passenger";
  if (t >= 70 && t < 80) return "cargo";
  if (t >= 80 && t < 90) return "tanker";
  if (t === 90) return "other";
  return `type-${t}`;
}

function isMilitaryLikely(shipType: number, name: string): boolean {
  if (shipType === 35) return true;
  return /\b(HMS|USS|FS |RFS |CG |DDG|FFG|LHD|LHA|SSN|SSBN|NAVAL|NAVY|WARSHIP|PATROL)\b/i.test(
    name,
  );
}

async function fetchFinnishAis(): Promise<AisContact[]> {
  try {
    const [locRes, vesRes] = await Promise.all([
      fetch("https://meri.digitraffic.fi/api/ais/v1/locations", {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "User-Agent": "ONTAS-Educational/1.0",
        },
        signal: AbortSignal.timeout(15000),
      }),
      fetch("https://meri.digitraffic.fi/api/ais/v1/vessels", {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "User-Agent": "ONTAS-Educational/1.0",
        },
        signal: AbortSignal.timeout(15000),
      }),
    ]);
    if (!locRes.ok) return [];
    const loc = (await locRes.json()) as {
      features: {
        mmsi: number;
        geometry: { coordinates: [number, number] };
        properties: { sog: number; cog: number; heading: number; timestampExternal: number };
      }[];
    };
    const nameByMmsi = new Map<number, { name: string; shipType: number }>();
    if (vesRes.ok) {
      const vessels = (await vesRes.json()) as { mmsi: number; name?: string; shipType?: number }[];
      for (const v of vessels) {
        nameByMmsi.set(v.mmsi, {
          name: (v.name || "").trim() || `MMSI ${v.mmsi}`,
          shipType: v.shipType ?? 0,
        });
      }
    }

    const out: AisContact[] = [];
    for (const f of loc.features) {
      const meta = nameByMmsi.get(f.mmsi) ?? { name: `MMSI ${f.mmsi}`, shipType: 0 };
      const [lon, lat] = f.geometry.coordinates;
      const mil = isMilitaryLikely(meta.shipType, meta.name);
      const category = classifyAis(meta.shipType, meta.name);
      if (!mil && category === "merchant" && out.filter((x) => !x.militaryLikely).length > 60) {
        // Deterministic ~6% sample by MMSI (stable snapshots)
        if ((Number(f.mmsi) % 100) > 5) continue;
      }
      out.push({
        mmsi: f.mmsi,
        name: meta.name,
        lat,
        lon,
        sog: f.properties.sog ?? 0,
        cog: f.properties.cog ?? 0,
        heading: f.properties.heading ?? 0,
        shipType: meta.shipType,
        shipTypeLabel: shipTypeLabel(meta.shipType),
        source: "digitraffic.fi (Baltic AIS)",
        militaryLikely: mil,
        category,
        updatedAt: new Date(f.properties.timestampExternal || Date.now()).toISOString(),
      });
    }
    out.sort((a, b) => Number(b.militaryLikely) - Number(a.militaryLikely));
    return out.slice(0, 180);
  } catch {
    return [];
  }
}

function buildUnits(now: number, ais: AisContact[]) {
  const subs = estimateSubPositions(now);
  const units: MaritimeUnit[] = [];
  const fleetById = new Map(SSBN_FLEET.map((b) => [b.id, b]));

  for (const s of subs) {
    const n = nationById(s.nationId);
    const boat = fleetById.get(s.id);
    const phase = boat?.phase ?? 0;
    units.push({
      id: s.id,
      name: s.name,
      className: s.className,
      category: "ssbn",
      nationId: s.nationId,
      nationLabel: n?.short ?? s.nationId.toUpperCase(),
      lat: s.lat,
      lon: s.lon,
      heading: s.heading,
      speedKn: s.status === "patrol" ? 10 + phase * 6 : 0,
      status: s.status,
      missiles: s.missiles,
      homePort: HOME_PORTS.find((p) => p.id === s.homePortId)?.name,
      trackSource: "osint-estimate",
      updatedAt: now,
      color: NATION_COLORS[s.nationId] ?? CATEGORY_META.ssbn.color,
      note: "Submerged SSBNs do not broadcast AIS — open-source patrol zone estimate",
    });
  }

  for (const a of ais) {
    if (!a.militaryLikely && a.category === "merchant") continue;
    units.push({
      id: `ais-${a.mmsi}`,
      name: a.name,
      hull: String(a.mmsi),
      className: a.shipTypeLabel,
      category: a.category,
      nationId: null,
      nationLabel: "AIS",
      lat: a.lat,
      lon: a.lon,
      heading: a.heading || a.cog,
      speedKn: a.sog,
      status: a.sog < 0.5 ? "anchored" : "underway",
      trackSource: "ais-live",
      updatedAt: new Date(a.updatedAt).getTime(),
      color: CATEGORY_META[a.category].color,
      note: "Live AIS surface contact",
    });
  }

  return { units, subs };
}

let cache: { at: number; ais: AisContact[]; source: string } | null = null;
const CACHE_MS = 40_000;

export const fetchMaritimeSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();

  let ais: AisContact[];
  let aisSource: string;
  let cached = false;

  if (cache && now - cache.at < CACHE_MS) {
    ais = cache.ais;
    aisSource = cache.source;
    cached = true;
  } else {
    ais = await fetchFinnishAis();
    aisSource = ais.length ? "digitraffic.fi open AIS (Baltic)" : "unavailable";
    cache = { at: now, ais, source: aisSource };
  }

  const { units, subs } = buildUnits(now, ais);

  return {
    fetchedAt: new Date(now).toISOString(),
    ais,
    aisSource,
    aisCount: ais.length,
    units,
    subs,
    homePorts: HOME_PORTS,
    categories: CATEGORY_META,
    note: "SSBN = OSINT patrol estimates. Surface military units from live AIS when available.",
    cached,
  } satisfies MaritimeSnapshot;
});
