/** Equirectangular projection for world map viewBox 0..W x 0..H */

export const MAP_W = 1000;
export const MAP_H = 500;

export function project(lat: number, lon: number, w = MAP_W, h = MAP_H): { x: number; y: number } {
  // Clamp antimeridian display
  let L = lon;
  if (L > 180) L -= 360;
  if (L < -180) L += 360;
  const x = ((L + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

type Ring = number[][];

function ringToPath(ring: Ring): string {
  if (!ring.length) return "";
  const pts = ring.map(([lon, lat]) => project(lat!, lon!));
  let d = `M${pts[0]!.x.toFixed(2)},${pts[0]!.y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += `L${pts[i]!.x.toFixed(2)},${pts[i]!.y.toFixed(2)}`;
  }
  return d + "Z";
}

/** GeoJSON Polygon or MultiPolygon → SVG path `d` */
export function geometryToPath(geometry: {
  type: string;
  coordinates: number[][][] | number[][][][];
}): string {
  if (geometry.type === "Polygon") {
    const polys = geometry.coordinates as number[][][];
    return polys.map((ring) => ringToPath(ring)).join("");
  }
  if (geometry.type === "MultiPolygon") {
    const multi = geometry.coordinates as number[][][][];
    return multi.map((poly) => poly.map((ring) => ringToPath(ring)).join("")).join("");
  }
  return "";
}

export function controlPoint(
  from: { x: number; y: number },
  to: { x: number; y: number },
): { x: number; y: number } {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const lift = Math.min(120, Math.max(30, dist * 0.22));
  return { x: mx, y: my - lift };
}

export function arcPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const c = controlPoint(from, to);
  return `M ${from.x} ${from.y} Q ${c.x} ${c.y} ${to.x} ${to.y}`;
}

export function pointOnArc(
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  const c = controlPoint(from, to);
  const u = 1 - t;
  return {
    x: u * u * from.x + 2 * u * t * c.x + t * t * to.x,
    y: u * u * from.y + 2 * u * t * c.y + t * t * to.y,
  };
}


const EARTH_KM = 6371;

/** Destination along a great-circle bearing (degrees, km). */
export function destinationPoint(
  lat: number,
  lon: number,
  bearingDeg: number,
  distanceKm: number,
): { lat: number; lon: number } {
  const δ = distanceKm / EARTH_KM;
  const θ = (bearingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lon * Math.PI) / 180;
  const sinφ2 =
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(Math.min(1, Math.max(-1, sinφ2)));
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2),
    );
  return {
    lat: (φ2 * 180) / Math.PI,
    lon: ((((λ2 * 180) / Math.PI) + 540) % 360) - 180,
  };
}

/**
 * Equirectangular path for a constant-range ring (great-circle).
 * Splits on antimeridian jumps so strokes do not cross the map.
 */
export function rangeRingPath(
  lat: number,
  lon: number,
  rangeKm: number,
  steps = 128,
): string {
  if (rangeKm <= 0) return "";
  // Cap extreme ranges that wrap the globe (still show near-full coverage)
  const km = Math.min(rangeKm, EARTH_KM * Math.PI * 0.98);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const brng = (i / steps) * 360;
    const d = destinationPoint(lat, lon, brng, km);
    const clat = Math.max(-85, Math.min(85, d.lat));
    pts.push(project(clat, d.lon));
  }
  let d = "";
  let started = false;
  let prevX: number | null = null;
  for (const pt of pts) {
    // Break stroke when equirectangular projection jumps across the date line
    if (prevX != null && Math.abs(pt.x - prevX) > MAP_W * 0.4) {
      started = false;
    }
    if (!started) {
      d += `M${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
      started = true;
    } else {
      d += `L${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
    }
    prevX = pt.x;
  }
  return d;
}

/** Label position at bearing (default east-ish) on the ring. */
export function rangeRingLabelPoint(
  lat: number,
  lon: number,
  rangeKm: number,
  bearingDeg = 55,
): { x: number; y: number } {
  const d = destinationPoint(lat, lon, bearingDeg, rangeKm);
  return project(d.lat, d.lon);
}
