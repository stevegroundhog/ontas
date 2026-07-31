/** Map our nuclear force ids ↔ ISO 3166-1 alpha-2 (Natural Earth) */

export const NUCLEAR_ISO: Record<string, string> = {
  us: "US",
  ru: "RU",
  cn: "CN",
  fr: "FR",
  uk: "GB",
  in: "IN",
  pk: "PK",
  il: "IL",
  kp: "KP",
};

export const ISO_TO_NUCLEAR: Record<string, string> = Object.fromEntries(
  Object.entries(NUCLEAR_ISO).map(([id, iso]) => [iso, id]),
);

/** ISO codes of states hosting US non-strategic nuclear weapons (NATO sharing) */
export const NATO_NUCLEAR_HOST_ISO = new Set(["BE", "DE", "IT", "NL", "TR"]);

export interface WorldCountryFeature {
  type: "Feature";
  properties: {
    id: string;
    iso: string;
    a3: string;
    name: string;
    admin: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface WorldCollection {
  type: "FeatureCollection";
  features: WorldCountryFeature[];
}
