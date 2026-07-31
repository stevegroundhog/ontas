/** Open-source SSBN / strategic naval deployment catalogue.
 *  Submerged SSBNs do NOT broadcast AIS. Positions here are
 *  EDUCATIONAL ESTIMATES within known open-source patrol zones —
 *  not classified tracks.
 */

export type NavalKind = "ssbn" | "ssgn" | "surface" | "tender" | "base";

export interface HomePort {
  id: string;
  name: string;
  nationId: string;
  lat: number;
  lon: number;
  kind: "ssbn-base" | "naval-base";
}

export interface SsbnBoat {
  id: string;
  name: string;
  className: string;
  nationId: string;
  homePortId: string;
  /** Patrol zone center */
  zoneLat: number;
  zoneLon: number;
  /** Semi-axes of patrol ellipse in degrees (approx) */
  zoneRx: number;
  zoneRy: number;
  /** Patrol period hours */
  periodH: number;
  /** Phase offset 0..1 */
  phase: number;
  status: "patrol" | "in-port" | "transit" | "overhaul";
  missiles?: string;
}

export const HOME_PORTS: HomePort[] = [
  { id: "bangor", name: "Naval Base Kitsap-Bangor", nationId: "us", lat: 47.72, lon: -122.75, kind: "ssbn-base" },
  { id: "kingsbay", name: "Naval Submarine Base Kings Bay", nationId: "us", lat: 30.79, lon: -81.53, kind: "ssbn-base" },
  { id: "faslane", name: "HMNB Clyde (Faslane)", nationId: "uk", lat: 56.07, lon: -4.82, kind: "ssbn-base" },
  { id: "ilelongue", name: "Île Longue", nationId: "fr", lat: 48.31, lon: -4.51, kind: "ssbn-base" },
  { id: "gadzhiyevo", name: "Gadzhiyevo", nationId: "ru", lat: 69.25, lon: 33.35, kind: "ssbn-base" },
  { id: "vilyuchinsk", name: "Vilyuchinsk", nationId: "ru", lat: 52.93, lon: 158.4, kind: "ssbn-base" },
  { id: "yalong", name: "Yulin / Longpo (Hainan)", nationId: "cn", lat: 18.2, lon: 109.5, kind: "ssbn-base" },
  { id: "vizag", name: "Visakhapatnam", nationId: "in", lat: 17.7, lon: 83.3, kind: "ssbn-base" },
];

/** Representative boats per fleet (not exhaustive classified orders of battle) */
export const SSBN_FLEET: SsbnBoat[] = [
  // US Pacific
  { id: "us-oh-1", name: "USS Louisiana", className: "Ohio", nationId: "us", homePortId: "bangor", zoneLat: 35, zoneLon: -155, zoneRx: 18, zoneRy: 10, periodH: 168, phase: 0.05, status: "patrol", missiles: "Trident II D5" },
  { id: "us-oh-2", name: "USS Nebraska", className: "Ohio", nationId: "us", homePortId: "bangor", zoneLat: 40, zoneLon: -165, zoneRx: 14, zoneRy: 8, periodH: 160, phase: 0.4, status: "patrol", missiles: "Trident II D5" },
  { id: "us-oh-3", name: "USS Henry M. Jackson", className: "Ohio", nationId: "us", homePortId: "bangor", zoneLat: 47.72, zoneLon: -122.75, zoneRx: 0.4, zoneRy: 0.3, periodH: 720, phase: 0.1, status: "in-port", missiles: "Trident II D5" },
  // US Atlantic
  { id: "us-oh-4", name: "USS Wyoming", className: "Ohio", nationId: "us", homePortId: "kingsbay", zoneLat: 28, zoneLon: -50, zoneRx: 16, zoneRy: 9, periodH: 175, phase: 0.22, status: "patrol", missiles: "Trident II D5" },
  { id: "us-oh-5", name: "USS Maryland", className: "Ohio", nationId: "us", homePortId: "kingsbay", zoneLat: 32, zoneLon: -40, zoneRx: 12, zoneRy: 7, periodH: 155, phase: 0.7, status: "patrol", missiles: "Trident II D5" },
  { id: "us-oh-6", name: "USS West Virginia", className: "Ohio", nationId: "us", homePortId: "kingsbay", zoneLat: 30.79, zoneLon: -81.53, zoneRx: 0.3, zoneRy: 0.2, periodH: 720, phase: 0.5, status: "in-port", missiles: "Trident II D5" },
  // UK CASD
  { id: "uk-vg-1", name: "HMS Vanguard", className: "Vanguard", nationId: "uk", homePortId: "faslane", zoneLat: 58, zoneLon: -20, zoneRx: 10, zoneRy: 6, periodH: 200, phase: 0.15, status: "patrol", missiles: "Trident II D5" },
  { id: "uk-vg-2", name: "HMS Victorious", className: "Vanguard", nationId: "uk", homePortId: "faslane", zoneLat: 56.07, zoneLon: -4.82, zoneRx: 0.25, zoneRy: 0.2, periodH: 720, phase: 0.3, status: "in-port", missiles: "Trident II D5" },
  // France
  { id: "fr-tr-1", name: "Le Triomphant", className: "Triomphant", nationId: "fr", homePortId: "ilelongue", zoneLat: 45, zoneLon: -25, zoneRx: 12, zoneRy: 7, periodH: 180, phase: 0.55, status: "patrol", missiles: "M51" },
  { id: "fr-tr-2", name: "Le Téméraire", className: "Triomphant", nationId: "fr", homePortId: "ilelongue", zoneLat: 48.31, zoneLon: -4.51, zoneRx: 0.2, zoneRy: 0.15, periodH: 720, phase: 0.8, status: "in-port", missiles: "M51" },
  // Russia Northern
  { id: "ru-bo-1", name: "Knyaz Vladimir", className: "Borei-A", nationId: "ru", homePortId: "gadzhiyevo", zoneLat: 74, zoneLon: 25, zoneRx: 10, zoneRy: 5, periodH: 190, phase: 0.12, status: "patrol", missiles: "Bulava" },
  { id: "ru-bo-2", name: "Yury Dolgorukiy", className: "Borei", nationId: "ru", homePortId: "gadzhiyevo", zoneLat: 72, zoneLon: 40, zoneRx: 9, zoneRy: 5, periodH: 170, phase: 0.6, status: "patrol", missiles: "Bulava" },
  { id: "ru-dl-1", name: "Karelia", className: "Delta IV", nationId: "ru", homePortId: "gadzhiyevo", zoneLat: 69.25, zoneLon: 33.35, zoneRx: 0.4, zoneRy: 0.3, periodH: 720, phase: 0.2, status: "in-port", missiles: "Sineva" },
  // Russia Pacific
  { id: "ru-bo-3", name: "Generalissimus Suvorov", className: "Borei-A", nationId: "ru", homePortId: "vilyuchinsk", zoneLat: 48, zoneLon: 165, zoneRx: 12, zoneRy: 7, periodH: 185, phase: 0.35, status: "patrol", missiles: "Bulava" },
  { id: "ru-bo-4", name: "Imperator Aleksandr III", className: "Borei-A", nationId: "ru", homePortId: "vilyuchinsk", zoneLat: 52.93, zoneLon: 158.4, zoneRx: 0.35, zoneRy: 0.25, periodH: 720, phase: 0.45, status: "in-port", missiles: "Bulava" },
  // China
  { id: "cn-094-1", name: "Type 094 (Longpo)", className: "Type 094 Jin", nationId: "cn", homePortId: "yalong", zoneLat: 16, zoneLon: 116, zoneRx: 8, zoneRy: 5, periodH: 140, phase: 0.25, status: "patrol", missiles: "JL-2/JL-3" },
  { id: "cn-094-2", name: "Type 094 (SCS)", className: "Type 094 Jin", nationId: "cn", homePortId: "yalong", zoneLat: 12, zoneLon: 118, zoneRx: 7, zoneRy: 4, periodH: 150, phase: 0.75, status: "patrol", missiles: "JL-2/JL-3" },
  { id: "cn-094-3", name: "Type 094 (base)", className: "Type 094 Jin", nationId: "cn", homePortId: "yalong", zoneLat: 18.2, zoneLon: 109.5, zoneRx: 0.25, zoneRy: 0.2, periodH: 720, phase: 0.1, status: "in-port", missiles: "JL-2/JL-3" },
  // India
  { id: "in-ar-1", name: "INS Arihant", className: "Arihant", nationId: "in", homePortId: "vizag", zoneLat: 12, zoneLon: 85, zoneRx: 6, zoneRy: 4, periodH: 120, phase: 0.4, status: "patrol", missiles: "K-15/K-4" },
  { id: "in-ar-2", name: "INS Arighat", className: "Arihant", nationId: "in", homePortId: "vizag", zoneLat: 17.7, zoneLon: 83.3, zoneRx: 0.2, zoneRy: 0.15, periodH: 720, phase: 0.6, status: "in-port", missiles: "K-15/K-4" },
];

export interface SubPosition {
  id: string;
  name: string;
  className: string;
  nationId: string;
  lat: number;
  lon: number;
  status: SsbnBoat["status"];
  missiles?: string;
  homePortId: string;
  estimated: true;
  heading: number;
  updatedAt: number;
}

/** Estimated SSBN position in open patrol zone (deterministic from time) */
export function estimateSubPositions(now = Date.now()): SubPosition[] {
  return SSBN_FLEET.map((b) => {
    if (b.status === "in-port" || b.status === "overhaul") {
      const port = HOME_PORTS.find((p) => p.id === b.homePortId)!;
      return {
        id: b.id,
        name: b.name,
        className: b.className,
        nationId: b.nationId,
        lat: port.lat + Math.sin(now / 1e6 + b.phase) * 0.02,
        lon: port.lon + Math.cos(now / 1e6 + b.phase) * 0.02,
        status: b.status,
        missiles: b.missiles,
        homePortId: b.homePortId,
        estimated: true as const,
        heading: (now / 60000 + b.phase * 360) % 360,
        updatedAt: now,
      };
    }
    const t = now / 1000 / 3600; // hours
    const ang = ((t / b.periodH) + b.phase) * Math.PI * 2;
    const lat = b.zoneLat + Math.sin(ang) * b.zoneRy;
    const lon = b.zoneLon + Math.cos(ang) * b.zoneRx;
    const heading = ((Math.atan2(Math.cos(ang) * b.zoneRy, -Math.sin(ang) * b.zoneRx) * 180) / Math.PI + 360) % 360;
    return {
      id: b.id,
      name: b.name,
      className: b.className,
      nationId: b.nationId,
      lat: Math.max(-80, Math.min(80, lat)),
      lon: ((((lon + 180) % 360) + 360) % 360) - 180,
      status: b.status,
      missiles: b.missiles,
      homePortId: b.homePortId,
      estimated: true as const,
      heading,
      updatedAt: now,
    };
  });
}
