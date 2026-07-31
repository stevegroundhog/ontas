/** Simplified political geography for nuclear-armed states.
 *  Polygons are educational approximations (not survey-grade).
 *  Coordinates: [longitude, latitude] rings, exterior rings closed.
 */

export type LonLat = [number, number];

export interface NationGeometry {
  id: string;
  name: string;
  /** One or more exterior rings [lon, lat][] */
  polygons: LonLat[][];
  /** Label anchor */
  label: { lon: number; lat: number };
  /** Major strategic sites for map pins */
  sites?: { name: string; lon: number; lat: number; kind: "silo" | "base" | "ssbn" | "test" | "c2" }[];
}

/** Non-nuclear landmass outlines for geographic context */
export const CONTINENT_OUTLINES: { name: string; polygons: LonLat[][] }[] = [
  {
    name: "North America",
    polygons: [
      [
        [-168, 65], [-141, 70], [-105, 73], [-80, 73], [-60, 60], [-55, 50],
        [-65, 45], [-70, 42], [-75, 35], [-80, 25], [-97, 26], [-105, 30],
        [-115, 32], [-125, 40], [-130, 50], [-140, 58], [-165, 55], [-168, 65],
      ],
    ],
  },
  {
    name: "South America",
    polygons: [
      [
        [-80, 10], [-70, 12], [-60, 5], [-50, 0], [-35, -5], [-40, -20],
        [-50, -30], [-55, -40], [-70, -55], [-75, -50], [-75, -30], [-80, -5],
        [-80, 10],
      ],
    ],
  },
  {
    name: "Europe",
    polygons: [
      [
        [-10, 36], [-9, 44], [-5, 48], [-1, 50], [5, 53], [8, 55], [12, 55],
        [20, 54], [25, 50], [28, 45], [25, 40], [20, 37], [15, 38], [10, 42],
        [5, 43], [0, 40], [-5, 36], [-10, 36],
      ],
    ],
  },
  {
    name: "Africa",
    polygons: [
      [
        [-17, 15], [-10, 30], [0, 35], [10, 32], [25, 32], [35, 30], [40, 15],
        [45, 10], [50, 10], [45, 0], [40, -10], [35, -25], [30, -30], [20, -35],
        [15, -30], [10, -15], [5, 5], [-5, 5], [-15, 10], [-17, 15],
      ],
    ],
  },
  {
    name: "Asia",
    polygons: [
      [
        [30, 45], [40, 55], [60, 60], [80, 70], [100, 70], [140, 65], [160, 60],
        [170, 55], [145, 45], [140, 35], [130, 35], [120, 25], [105, 10],
        [100, 5], [95, 10], [90, 20], [75, 25], [65, 25], [55, 30], [45, 35],
        [35, 40], [30, 45],
      ],
    ],
  },
  {
    name: "Australia",
    polygons: [
      [
        [113, -22], [125, -15], [135, -12], [145, -15], [153, -25], [150, -35],
        [140, -38], [130, -32], [115, -35], [113, -22],
      ],
    ],
  },
  {
    name: "Greenland",
    polygons: [
      [
        [-55, 60], [-45, 60], [-30, 70], [-20, 75], [-40, 83], [-60, 75],
        [-70, 70], [-55, 60],
      ],
    ],
  },
];

export const NATION_BORDERS: NationGeometry[] = [
  {
    id: "us",
    name: "United States",
    label: { lon: -98, lat: 39 },
    polygons: [
      // Contiguous US
      [
        [-124.5, 48.5], [-117, 49], [-95, 49], [-83, 46.5], [-70, 45],
        [-67, 44.5], [-70, 41.5], [-74, 40], [-75.5, 37], [-76, 35],
        [-80, 32], [-81.5, 25.5], [-87, 30], [-94, 29.5], [-97.5, 26],
        [-104, 29], [-106.5, 31.5], [-111, 31.3], [-114.5, 32.5],
        [-117, 32.5], [-122, 37], [-124.5, 42], [-124.5, 48.5],
      ],
      // Alaska (simplified)
      [
        [-168, 54], [-160, 55], [-150, 60], [-141, 60], [-141, 70],
        [-155, 71], [-165, 68], [-168, 65], [-168, 54],
      ],
    ],
    sites: [
      { name: "Malmstrom AFB (MM III)", lon: -111.2, lat: 47.5, kind: "silo" },
      { name: "Minot AFB (MM III)", lon: -101.3, lat: 48.4, kind: "silo" },
      { name: "F.E. Warren AFB (MM III)", lon: -104.9, lat: 41.1, kind: "silo" },
      { name: "Kings Bay SSBN", lon: -81.5, lat: 30.8, kind: "ssbn" },
      { name: "Bangor SSBN", lon: -122.7, lat: 47.7, kind: "ssbn" },
      { name: "Vandenberg test", lon: -120.6, lat: 34.7, kind: "test" },
      { name: "Pentagon / NMCC", lon: -77.1, lat: 38.9, kind: "c2" },
    ],
  },
  {
    id: "ru",
    name: "Russian Federation",
    label: { lon: 90, lat: 60 },
    polygons: [
      [
        [20, 55], [28, 60], [30, 70], [40, 68], [60, 70], [80, 72],
        [100, 72], [130, 70], [160, 65], [175, 62], [170, 55], [150, 50],
        [140, 48], [135, 45], [130, 43], [120, 50], [100, 52], [80, 50],
        [60, 50], [50, 48], [45, 45], [40, 44], [38, 48], [30, 50],
        [28, 54], [20, 55],
      ],
    ],
    sites: [
      { name: "Kozelsk / silo belt", lon: 35.8, lat: 54.0, kind: "silo" },
      { name: "Yasny (Sarmat test)", lon: 59.8, lat: 51.1, kind: "test" },
      { name: "Gadzhiyevo SSBN", lon: 33.3, lat: 69.3, kind: "ssbn" },
      { name: "Vilyuchinsk SSBN", lon: 158.4, lat: 52.9, kind: "ssbn" },
      { name: "National Defense Mgmt Ctr", lon: 37.6, lat: 55.75, kind: "c2" },
    ],
  },
  {
    id: "cn",
    name: "China",
    label: { lon: 105, lat: 35 },
    polygons: [
      [
        [74, 40], [80, 42], [90, 45], [100, 42], [110, 42], [120, 40],
        [122, 35], [120, 30], [115, 25], [110, 22], [108, 20], [100, 22],
        [95, 28], [90, 28], [80, 32], [75, 35], [74, 40],
      ],
    ],
    sites: [
      { name: "Yumen silo field", lon: 97.0, lat: 40.3, kind: "silo" },
      { name: "Hami silo field", lon: 93.5, lat: 42.8, kind: "silo" },
      { name: "Jilantai silo field", lon: 105.7, lat: 39.8, kind: "silo" },
      { name: "Hainan / Type 094", lon: 109.5, lat: 18.2, kind: "ssbn" },
      { name: "CMC / Beijing", lon: 116.4, lat: 39.9, kind: "c2" },
    ],
  },
  {
    id: "fr",
    name: "France",
    label: { lon: 2.5, lat: 46.5 },
    polygons: [
      [
        [-4.8, 48.5], [-2, 49.5], [2, 51], [4, 50], [7.5, 48.5], [7.5, 47.5],
        [6, 46], [7, 44], [7.5, 43.5], [3, 42.5], [-1.5, 43.3], [-1.8, 46.5],
        [-4.5, 48], [-4.8, 48.5],
      ],
    ],
    sites: [
      { name: "Île Longue SSBN", lon: -4.5, lat: 48.3, kind: "ssbn" },
      { name: "Istres / air leg", lon: 4.95, lat: 43.5, kind: "base" },
      { name: "Élysée / C2", lon: 2.3, lat: 48.87, kind: "c2" },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    label: { lon: -2, lat: 54 },
    polygons: [
      // Great Britain
      [
        [-5.5, 50], [-3, 50.5], [1.5, 51], [1.7, 52.5], [0, 53.5],
        [-2, 55.5], [-1.5, 57.5], [-3, 58.5], [-5, 57], [-6, 55.5],
        [-5, 54], [-4.5, 53], [-5.5, 51.5], [-5.5, 50],
      ],
      // Northern Ireland (simplified)
      [
        [-8.2, 54.1], [-5.5, 54.1], [-5.5, 55.3], [-7.5, 55.3],
        [-8.2, 54.5], [-8.2, 54.1],
      ],
    ],
    sites: [
      { name: "HMNB Clyde (Faslane)", lon: -4.82, lat: 56.07, kind: "ssbn" },
      { name: "Coulport", lon: -4.88, lat: 56.05, kind: "base" },
      { name: "Whitehall C2", lon: -0.13, lat: 51.5, kind: "c2" },
    ],
  },
  {
    id: "in",
    name: "India",
    label: { lon: 78, lat: 22 },
    polygons: [
      [
        [68.2, 23.5], [70, 20], [72.5, 21], [73, 18], [74, 15], [77, 8],
        [80, 10], [80, 13], [82, 16], [87, 21], [89, 22], [88, 26],
        [85, 27], [80, 28], [77, 32], [74, 32], [72, 28], [70, 25],
        [68.2, 23.5],
      ],
    ],
    sites: [
      { name: "Agni / Integrated Test Range", lon: 87.0, lat: 20.8, kind: "test" },
      { name: "Visakhapatnam SSBN", lon: 83.3, lat: 17.7, kind: "ssbn" },
      { name: "New Delhi C2", lon: 77.2, lat: 28.6, kind: "c2" },
    ],
  },
  {
    id: "pk",
    name: "Pakistan",
    label: { lon: 69, lat: 30 },
    polygons: [
      [
        [61, 25], [66.5, 24], [68, 24], [71, 28], [73.5, 30], [75, 32],
        [74.5, 35], [73, 36.5], [71, 35], [70, 32], [66, 28], [62, 28],
        [61, 25],
      ],
    ],
    sites: [
      { name: "Southern storage belt", lon: 67.0, lat: 25.5, kind: "base" },
      { name: "Islamabad C2", lon: 73.05, lat: 33.7, kind: "c2" },
    ],
  },
  {
    id: "il",
    name: "Israel",
    label: { lon: 35, lat: 31.5 },
    polygons: [
      [
        [34.2, 31.2], [34.5, 31.1], [35.1, 29.5], [35.5, 31.2],
        [35.6, 32.5], [35.1, 33.1], [34.9, 32.9], [34.5, 32.0],
        [34.2, 31.2],
      ],
    ],
    sites: [
      { name: "Dimona (assessed)", lon: 35.15, lat: 31.0, kind: "base" },
      { name: "Tel Aviv C2", lon: 34.78, lat: 32.08, kind: "c2" },
    ],
  },
  {
    id: "kp",
    name: "North Korea",
    label: { lon: 127, lat: 40 },
    polygons: [
      [
        [124.3, 39.8], [125, 38], [126.5, 37.7], [128.5, 38.5],
        [129.5, 40.5], [130.5, 42], [129, 42.5], [128, 41.5],
        [126.5, 41], [124.5, 40.5], [124.3, 39.8],
      ],
    ],
    sites: [
      { name: "Yongbyon nuclear complex", lon: 125.75, lat: 39.8, kind: "base" },
      { name: "Punggye-ri test site", lon: 129.1, lat: 41.3, kind: "test" },
      { name: "Sohae launch", lon: 124.7, lat: 39.7, kind: "test" },
      { name: "Pyongyang C2", lon: 125.75, lat: 39.02, kind: "c2" },
    ],
  },
];

export function geoForNation(id: string): NationGeometry | undefined {
  return NATION_BORDERS.find((n) => n.id === id);
}

/** Convert lon/lat ring to SVG path using equirectangular project fn */
export function ringToPath(
  ring: LonLat[],
  project: (lat: number, lon: number) => { x: number; y: number },
): string {
  if (ring.length === 0) return "";
  const pts = ring.map(([lon, lat]) => project(lat, lon));
  let d = `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i]!.x.toFixed(2)} ${pts[i]!.y.toFixed(2)}`;
  }
  return d + " Z";
}
