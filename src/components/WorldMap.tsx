import { useEffect, useMemo, useRef, useState } from "react";
import {
  ISO_TO_NUCLEAR,
  NATO_NUCLEAR_HOST_ISO,
  NUCLEAR_ISO,
  type WorldCollection,
  type WorldCountryFeature,
} from "@/data/country-codes";
import {
  ARMED_CONFLICTS,
  CONFLICT_INTENSITY_META,
  type ArmedConflict,
} from "@/data/conflicts";
import { geoForNation } from "@/data/geography";
import type { HomePort, SubPosition } from "@/data/naval-deployments";
import { NATION_COLORS } from "@/data/maritime-units";
import { WATCH_ZONES } from "@/data/watch-zones";
import { nationById, type NuclearNation, type Scenario } from "@/data/nuclear-forces";
import {
  MAP_H,
  MAP_W,
  arcPath,
  geometryToPath,
  pointOnArc,
  project,
} from "@/lib/geo-project";
import type { AisContact } from "@/server/maritime";
import type { SeismicEvent } from "@/server/threat-intel";
import type { PlaceHit } from "@/server/geocode";

interface WorldMapProps {
  nations: NuclearNation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  scenario: Scenario;
  animating: boolean;
  showSites?: boolean;
  showSubs?: boolean;
  showAis?: boolean;
  showConflicts?: boolean;
  subs?: SubPosition[];
  homePorts?: HomePort[];
  ais?: AisContact[];
  selectedSubId?: string | null;
  onSelectSub?: (id: string | null) => void;
  seismic?: SeismicEvent[];
  searchedPlace?: PlaceHit | null;
  selectedConflictId?: string | null;
  onSelectConflict?: (id: string | null) => void;
  conflicts?: ArmedConflict[];
}

interface PathCountry {
  iso: string;
  name: string;
  path: string;
  nuclearId: string | null;
  isHost: boolean;
}

function radiusToMapDelta(km: number, lat: number): number {
  const degLat = km / 111;
  const degLon = km / (111 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  return Math.max(degLat, degLon) * 0.55;
}

const NUCLEAR_FILL: Record<string, string> = {
  us: "#1d4ed8",
  ru: "#b91c1c",
  cn: "#b45309",
  fr: "#0e7490",
  uk: "#6d28d9",
  in: "#15803d",
  pk: "#4d7c0f",
  il: "#0369a1",
  kp: "#9f1239",
};

export function WorldMap({
  nations,
  selectedId,
  onSelect,
  scenario,
  animating,
  showSites = true,
  showSubs = true,
  showAis = true,
  showConflicts = true,
  subs = [],
  homePorts = [],
  ais = [],
  selectedSubId = null,
  onSelectSub,
  seismic = [],
  searchedPlace = null,
  selectedConflictId = null,
  onSelectConflict,
  conflicts = ARMED_CONFLICTS,
}: WorldMapProps) {
  const [countries, setCountries] = useState<PathCountry[]>([]);
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<{ iso: string; name: string; x: number; y: number } | null>(
    null,
  );
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/geo/world.json");
        if (!res.ok) return;
        const data = (await res.json()) as WorldCollection;
        if (cancelled) return;
        setCountries(
          data.features
            .map((ft: WorldCountryFeature) => {
              const iso = (ft.properties.iso || ft.properties.id || "").toUpperCase();
              return {
                iso,
                name: ft.properties.name || ft.properties.admin || iso,
                path: geometryToPath(ft.geometry),
                nuclearId: ISO_TO_NUCLEAR[iso] ?? null,
                isHost: NATO_NUCLEAR_HOST_ISO.has(iso),
              };
            })
            .filter((c) => c.path.length > 0),
        );
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!animating || scenario.trajectories.length === 0) {
      setProgress(0);
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 4200);
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [animating, scenario.id, scenario.trajectories.length]);

  const selectedIso = selectedId ? NUCLEAR_ISO[selectedId] : null;

  const arcs = useMemo(() => {
    return scenario.trajectories
      .map(([a, b], i) => {
        const na = nationById(a);
        const nb = nationById(b);
        if (!na || !nb) return null;
        return {
          id: `${a}-${b}-${i}`,
          path: arcPath(project(na.lat, na.lon), project(nb.lat, nb.lon)),
          from: project(na.lat, na.lon),
          to: project(nb.lat, nb.lon),
        };
      })
      .filter(Boolean) as {
      id: string;
      path: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
    }[];
  }, [scenario]);

  const selectedSites = useMemo(() => {
    if (!showSites || !selectedId) return [];
    return geoForNation(selectedId)?.sites ?? [];
  }, [selectedId, showSites]);

  const watchSeismic = seismic.filter((e) => e.nuclearRelevance !== "background");
  const searchPin = searchedPlace ? project(searchedPlace.lat, searchedPlace.lon) : null;
  const nuclearCount = countries.filter((c) => c.nuclearId).length;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-[#070f1c] shadow-[inset_0_0_80px_rgba(14,165,233,0.06)]">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="h-full w-full"
        role="img"
        aria-label="Realtime world geopolitical map"
      >
        <defs>
          <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1528" />
            <stop offset="55%" stopColor="#07101c" />
            <stop offset="100%" stopColor="#050b14" />
          </linearGradient>
          <radialGradient id="oceanVignette" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#0b1a30" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </radialGradient>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#13233a" strokeWidth="0.3" />
          </pattern>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={MAP_W} height={MAP_H} fill="url(#ocean)" />
        <rect width={MAP_W} height={MAP_H} fill="url(#oceanVignette)" pointerEvents="none" />
        <rect width={MAP_W} height={MAP_H} fill="url(#grid)" pointerEvents="none" opacity="0.85" />

        {/* Lat/lon graticule (30°) */}
        <g pointerEvents="none" opacity="0.22" className="graticule">
          {Array.from({ length: 12 }, (_, i) => {
            const lon = -180 + i * 30;
            const a = project(85, lon);
            const b = project(-85, lon);
            return (
              <line
                key={`lon-${lon}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#64748b"
                strokeWidth="0.35"
              />
            );
          })}
          {Array.from({ length: 7 }, (_, i) => {
            const lat = -90 + i * 30;
            const a = project(lat, -180);
            const b = project(lat, 180);
            return (
              <line
                key={`lat-${lat}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#64748b"
                strokeWidth={lat === 0 ? 0.6 : 0.35}
              />
            );
          })}
          <line
            x1={project(85, 0).x}
            y1={project(85, 0).y}
            x2={project(-85, 0).x}
            y2={project(-85, 0).y}
            stroke="#38bdf866"
            strokeWidth="0.5"
          />
        </g>

        <g>
          {countries.map((c) => {
            const isNuclear = !!c.nuclearId;
            const isSelected =
              (selectedId && c.nuclearId === selectedId) ||
              (selectedIso && c.iso === selectedIso);
            const isHover = hover?.iso === c.iso;

            let fill = "#101a2c";
            let stroke = "#2a3f5f";
            let sw = 0.35;
            let opacity = 1;

            if (c.isHost && !isNuclear) {
              fill = "#0f2a32";
              stroke = "#2dd4bf88";
              sw = 0.55;
            }
            if (isNuclear && c.nuclearId) {
              fill = (NUCLEAR_FILL[c.nuclearId] ?? "#334155") + "b8";
              stroke = "#e2e8f0cc";
              sw = 0.75;
            }
            if (isSelected) {
              fill = "#0ea5e9aa";
              stroke = "#7dd3fc";
              sw = 1.5;
            } else if (isHover) {
              stroke = "#f8fafc";
              sw = 0.95;
              opacity = 0.95;
            }

            return (
              <path
                key={c.iso + c.name}
                d={c.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={sw}
                strokeLinejoin="round"
                opacity={opacity}
                className="cursor-pointer transition-[fill,stroke-width] duration-150"
                onClick={() => {
                  if (c.nuclearId) onSelect(c.nuclearId);
                }}
                onMouseEnter={(e) => {
                  const svg = e.currentTarget.ownerSVGElement;
                  if (!svg) return;
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const ctm = svg.getScreenCTM();
                  if (!ctm) return;
                  const sp = pt.matrixTransform(ctm.inverse());
                  setHover({ iso: c.iso, name: c.name, x: sp.x, y: sp.y });
                }}
                onMouseLeave={() => setHover(null)}
                aria-label={c.name}
              />
            );
          })}
        </g>

        <g pointerEvents="none" opacity="0.5">
          {WATCH_ZONES.filter((z) => z.kind === "test-site" || z.kind === "flashpoint").map(
            (z) => {
              const p = project(z.lat, z.lon);
              const d = radiusToMapDelta(z.radiusKm, z.lat);
              const r = Math.abs(project(z.lat + d, z.lon).y - p.y);
              return (
                <circle
                  key={z.id}
                  cx={p.x}
                  cy={p.y}
                  r={Math.max(4, r)}
                  fill="none"
                  stroke={z.kind === "test-site" ? "#fbbf24" : "#f472b6"}
                  strokeWidth="0.65"
                  strokeDasharray="2.5 2"
                />
              );
            },
          )}
        </g>

        {seismic.slice(0, 45).map((e) => {
          const p = project(e.lat, e.lon);
          const relevant = e.nuclearRelevance !== "background";
          if (!relevant && e.mag < 5) return null;
          return (
            <circle
              key={e.id}
              cx={p.x}
              cy={p.y}
              r={1.2 + e.mag * 0.5}
              fill={
                e.nuclearRelevance === "elevated"
                  ? "#f87171"
                  : e.nuclearRelevance === "watch"
                    ? "#fbbf24"
                    : "#64748b"
              }
              opacity={relevant ? 0.9 : 0.35}
              pointerEvents="none"
            />
          );
        })}

        {showAis &&
          ais.map((a) => {
            const p = project(a.lat, a.lon);
            return (
              <circle
                key={`ais-${a.mmsi}`}
                cx={p.x}
                cy={p.y}
                r={a.militaryLikely ? 2.2 : 1.05}
                fill={a.militaryLikely ? "#fbbf24" : "#334155"}
                opacity={a.militaryLikely ? 0.92 : 0.4}
                pointerEvents="none"
              />
            );
          })}

        {showSubs &&
          homePorts.map((hp) => {
            const p = project(hp.lat, hp.lon);
            return (
              <rect
                key={hp.id}
                x={p.x - 3.2}
                y={p.y - 3.2}
                width={6.4}
                height={6.4}
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="1"
                pointerEvents="none"
              />
            );
          })}

        {showSubs &&
          subs.map((s) => {
            const p = project(s.lat, s.lon);
            const selected = selectedSubId === s.id;
            const color = NATION_COLORS[s.nationId] ?? "#a78bfa";
            return (
              <g
                key={s.id}
                transform={`translate(${p.x},${p.y}) rotate(${s.heading})`}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSub?.(selected ? null : s.id);
                  onSelect(s.nationId);
                }}
              >
                <circle r={11} fill="transparent" />
                {selected && (
                  <circle
                    r={9}
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth="1.1"
                    className="crt-pulse"
                  />
                )}
                <path
                  d="M 0 -5.5 L 3.6 4.5 L 0 2.2 L -3.6 4.5 Z"
                  fill={color}
                  stroke="#f8fafc"
                  strokeWidth="0.55"
                  filter={s.status === "patrol" ? "url(#glow)" : undefined}
                />
              </g>
            );
          })}

        {showConflicts &&
          conflicts.map((cf) => {
            const p = project(cf.lat, cf.lon);
            const meta = CONFLICT_INTENSITY_META[cf.intensity];
            const selected = selectedConflictId === cf.id;
            const r = selected ? 6.5 : 3.6 + meta.rank * 0.35;
            return (
              <g
                key={cf.id}
                transform={`translate(${p.x},${p.y})`}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectConflict?.(selected ? null : cf.id);
                }}
              >
                <circle r={r + 5} fill={`${meta.color}22`} filter="url(#softGlow)" />
                <circle
                  r={r}
                  fill={meta.color}
                  stroke={selected ? "#f8fafc" : "#0f172a"}
                  strokeWidth={selected ? 1.35 : 0.65}
                  className={meta.rank >= 4 ? "crt-pulse" : undefined}
                />
                {selected && (
                  <text
                    y={-r - 5}
                    textAnchor="middle"
                    fill="#fecdd3"
                    fontSize="8.5"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontWeight="700"
                  >
                    {cf.shortName}
                  </text>
                )}
              </g>
            );
          })}

        <g pointerEvents="none">
          {arcs.map((arc, i) => {
            const delay = i * 0.06;
            const local = Math.max(0, Math.min(1, (progress - delay) / Math.max(0.35, 1 - delay)));
            const tip = pointOnArc(arc.from, arc.to, local);
            return (
              <g key={arc.id}>
                <path
                  d={arc.path}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="1.5"
                  opacity={animating ? 0.45 + local * 0.5 : 0.12}
                  strokeDasharray={`${local * 900} 900`}
                  strokeLinecap="round"
                />
                {animating && local > 0.02 && local < 1 && (
                  <circle cx={tip.x} cy={tip.y} r="3" fill="#f9a8d4" filter="url(#glow)" />
                )}
              </g>
            );
          })}
        </g>

        {nations.map((n) => {
          const p = project(n.lat, n.lon);
          const selected = selectedId === n.id;
          return (
            <g
              key={n.id}
              transform={`translate(${p.x},${p.y})`}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(n.id)}
            >
              <circle
                r={selected ? 4.2 : 2.4}
                fill={NATION_COLORS[n.id] ?? "#94a3b8"}
                stroke="#f8fafc"
                strokeWidth="0.65"
                filter={selected ? "url(#glow)" : undefined}
              />
            </g>
          );
        })}

        {selectedSites.map((s) => {
          const p = project(s.lat, s.lon);
          return (
            <circle
              key={s.name}
              cx={p.x}
              cy={p.y}
              r={2}
              fill="none"
              stroke="#a5f3fc"
              strokeWidth="0.75"
              pointerEvents="none"
            />
          );
        })}

        {searchPin && searchedPlace && (
          <g transform={`translate(${searchPin.x},${searchPin.y})`} pointerEvents="none">
            <circle
              r={13}
              fill="#38bdf822"
              stroke="#38bdf8"
              strokeWidth="1.1"
              className="crt-pulse"
            />
            <circle r={4.5} fill="#38bdf8" stroke="#f8fafc" strokeWidth="1.1" />
            <path d="M 0 4.5 L 0 12" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
            <text
              y={-16}
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="9"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="700"
            >
              {searchedPlace.name.length > 18
                ? `${searchedPlace.name.slice(0, 17)}…`
                : searchedPlace.name}
            </text>
          </g>
        )}

        {hover && (
          <g pointerEvents="none">
            <rect
              x={Math.min(hover.x + 8, MAP_W - 148)}
              y={Math.max(hover.y - 24, 6)}
              rx={7}
              width={Math.min(140, hover.name.length * 6.2 + 32)}
              height={18}
              fill="#0f172af2"
              stroke="#38bdf8"
              strokeWidth="0.9"
            />
            <text
              x={Math.min(hover.x + 14, MAP_W - 140)}
              y={Math.max(hover.y - 11, 18)}
              fill="#e0f2fe"
              fontSize="8.5"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {hover.iso} · {hover.name.length > 16 ? `${hover.name.slice(0, 15)}…` : hover.name}
            </text>
          </g>
        )}

        <g pointerEvents="none">
          <rect x={8} y={6} width={520} height={20} rx={8} fill="#0f172ae6" />
          <text
            x={16}
            y={19}
            fill="#cbd5e1"
            fontSize="8.5"
            fontFamily="Inter, system-ui, sans-serif"
          >
            GEOPOLITICAL LIVE MAP · {countries.length || "…"} countries · {nuclearCount} NWS ·{" "}
            {conflicts.length} conflicts
            {selectedConflictId
              ? ` · ${conflicts.find((c) => c.id === selectedConflictId)?.shortName ?? ""}`
              : ""}
            {searchedPlace ? ` · PIN ${searchedPlace.name}` : ""}
            {watchSeismic.length ? ` · ${watchSeismic.length} seismic watch` : ""}
          </text>
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
        {[
          ["Nuclear state", "#3b82f6"],
          ["NATO host", "#2dd4bf"],
          ["Conflict", "#f43f5e"],
          ["Place pin", "#38bdf8"],
          ["SSBN est.", "#a78bfa"],
          ["AIS", "#fbbf24"],
        ].map(([label, color]) => (
          <span
            key={label}
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-sm"
            style={{ background: `${color}b3` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
