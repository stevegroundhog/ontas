/** Open-source nuclear-relevant watch zones for seismic / geographic correlation.
 *  Used only for educational correlation of public USGS earthquake data.
 */

export type WatchZone = {
  id: string;
  name: string;
  kind: "test-site" | "silo-field" | "ssbn-base" | "capital" | "flashpoint";
  lat: number;
  lon: number;
  /** Radius in km for seismic correlation */
  radiusKm: number;
  nationId?: string;
  note: string;
};

export const WATCH_ZONES: WatchZone[] = [
  {
    id: "punggye",
    name: "Punggye-ri (DPRK test site)",
    kind: "test-site",
    lat: 41.28,
    lon: 129.08,
    radiusKm: 120,
    nationId: "kp",
    note: "Historical nuclear test site; public seismic watch zone",
  },
  {
    id: "lopnur",
    name: "Lop Nur (China historical test)",
    kind: "test-site",
    lat: 41.5,
    lon: 88.5,
    radiusKm: 150,
    nationId: "cn",
    note: "Historical Chinese nuclear test area",
  },
  {
    id: "novaya",
    name: "Novaya Zemlya (RU historical)",
    kind: "test-site",
    lat: 73.0,
    lon: 54.0,
    radiusKm: 200,
    nationId: "ru",
    note: "Historical Soviet nuclear test range",
  },
  {
    id: "nts",
    name: "Nevada National Security Site",
    kind: "test-site",
    lat: 37.1,
    lon: -116.05,
    radiusKm: 100,
    nationId: "us",
    note: "US historical nuclear test site",
  },
  {
    id: "pokhran",
    name: "Pokhran (India)",
    kind: "test-site",
    lat: 27.1,
    lon: 71.75,
    radiusKm: 100,
    nationId: "in",
    note: "Indian nuclear test site (historical)",
  },
  {
    id: "chagai",
    name: "Chagai (Pakistan)",
    kind: "test-site",
    lat: 28.8,
    lon: 64.95,
    radiusKm: 100,
    nationId: "pk",
    note: "Pakistani nuclear test area (historical)",
  },
  {
    id: "yumen",
    name: "Yumen silo field (CN)",
    kind: "silo-field",
    lat: 40.3,
    lon: 97.0,
    radiusKm: 80,
    nationId: "cn",
    note: "Open-source reported ICBM silo field",
  },
  {
    id: "taiwan_strait",
    name: "Taiwan Strait flashpoint",
    kind: "flashpoint",
    lat: 24.5,
    lon: 119.5,
    radiusKm: 250,
    nationId: "cn",
    note: "Strategic flashpoint watch",
  },
  {
    id: "kaliningrad",
    name: "Kaliningrad / Baltic",
    kind: "flashpoint",
    lat: 54.7,
    lon: 20.5,
    radiusKm: 200,
    nationId: "ru",
    note: "European theater watch",
  },
  {
    id: "dmz",
    name: "Korean DMZ",
    kind: "flashpoint",
    lat: 38.0,
    lon: 127.0,
    radiusKm: 120,
    nationId: "kp",
    note: "Peninsula flashpoint",
  },
];

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toR = (d: number) => (d * Math.PI) / 180;
  const dLat = toR(lat2 - lat1);
  const dLon = toR(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function matchWatchZones(
  lat: number,
  lon: number,
): { zone: WatchZone; distanceKm: number }[] {
  const hits: { zone: WatchZone; distanceKm: number }[] = [];
  for (const zone of WATCH_ZONES) {
    const d = haversineKm(lat, lon, zone.lat, zone.lon);
    if (d <= zone.radiusKm) hits.push({ zone, distanceKm: d });
  }
  return hits.sort((a, b) => a.distanceKm - b.distanceKm);
}
