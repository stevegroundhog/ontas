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
