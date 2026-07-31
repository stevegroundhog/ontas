import { createServerFn } from "@tanstack/react-start";

export type PlaceHit = {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  kind: string;
  countryCode: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  importance: number;
};

type Nom = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  class?: string;
  importance?: number;
  address?: {
    country_code?: string;
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    hamlet?: string;
  };
};

function mapHits(raw: Nom[]): PlaceHit[] {
  return raw.map((r) => {
    const addr = r.address ?? {};
    const local =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.hamlet ||
      r.name ||
      r.display_name.split(",")[0] ||
      "Place";
    return {
      id: String(r.place_id),
      name: local,
      displayName: r.display_name,
      lat: Number(r.lat),
      lon: Number(r.lon),
      kind: r.type || r.class || "place",
      countryCode: addr.country_code?.toUpperCase() ?? null,
      country: addr.country ?? null,
      state: addr.state ?? null,
      city: addr.city || addr.town || addr.village || null,
      importance: r.importance ?? 0,
    };
  });
}

export const searchPlaces = createServerFn({ method: "GET" })
  .validator((q: unknown) => String(q ?? ""))
  .handler(async ({ data: q }) => {
    const query = q.trim();
    if (query.length < 2) {
      return { query, results: [] as PlaceHit[], error: null as string | null };
    }

    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", query);
      url.searchParams.set("format", "json");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("limit", "8");

      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": "ONTAS-Educational/1.0 (survivability place search)",
        },
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) {
        return {
          query,
          results: [] as PlaceHit[],
          error: `Geocoder HTTP ${res.status}`,
        };
      }

      const raw = (await res.json()) as Nom[];
      // Prefer settlements first
      const sorted = [...raw].sort((a, b) => {
        const score = (x: Nom) => {
          const t = `${x.type} ${x.class}`.toLowerCase();
          let s = x.importance ?? 0;
          if (/city|town|village|hamlet|municipality|suburb/.test(t)) s += 1;
          return s;
        };
        return score(b) - score(a);
      });

      return {
        query,
        results: mapHits(sorted),
        error: null as string | null,
      };
    } catch (e) {
      return {
        query,
        results: [] as PlaceHit[],
        error: e instanceof Error ? e.message : "search failed",
      };
    }
  });
