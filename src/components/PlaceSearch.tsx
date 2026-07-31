import { useCallback, useEffect, useMemo, useState } from "react";
import { buildSurvivalProfile, type SurvivalItem, type SurvivalProfile } from "@/lib/survivability";
import { searchPlaces, type PlaceHit } from "@/server/geocode";

interface PlaceSearchProps {
  onSelectPlace: (place: PlaceHit | null, profile: SurvivalProfile | null) => void;
  selectedPlace: PlaceHit | null;
  profile: SurvivalProfile | null;
}

const CAT_COLOR: Record<SurvivalItem["category"], string> = {
  water: "#38bdf8",
  food: "#fbbf24",
  shelter: "#a78bfa",
  medical: "#f87171",
  comms: "#34d399",
  nuclear: "#fb7185",
  tools: "#94a3b8",
  docs: "#c084fc",
  climate: "#2dd4bf",
};

export function PlaceSearch({ onSelectPlace, selectedPlace, profile }: PlaceSearchProps) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | SurvivalItem["category"]>("all");

  const runSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setHits([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await searchPlaces({ data: query.trim() });
      setHits(res.results);
      if (res.error) setError(res.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = window.setTimeout(() => void runSearch(q), 400);
    return () => clearTimeout(t);
  }, [q, runSearch]);

  const pick = (place: PlaceHit) => {
    const p = buildSurvivalProfile(place);
    onSelectPlace(place, p);
    setHits([]);
    setQ(place.name);
  };

  const items = useMemo(() => {
    if (!profile) return [];
    if (filter === "all") return profile.items;
    return profile.items.filter((i) => i.category === filter);
  }, [profile, filter]);

  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#38bdf8" }}>
          Place search
        </div>
        <div className="mt-0.5 text-sm font-bold text-bright">
          City, town, or village → survivability kit
        </div>
        <div className="relative mt-3">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anywhere… e.g. Hiroshima, Omaha, Kyiv, Lagos"
            className="w-full rounded-xl border border-border bg-black/30 px-3 py-2.5 text-sm text-bright outline-none placeholder:text-dim focus:border-sky-400"
            aria-label="Search for a city, town, or village"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
              Searching…
            </span>
          )}
        </div>
        {error && <div className="mt-2 text-xs text-danger">{error}</div>}
        {hits.length > 0 && (
          <ul className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-border bg-[#0f172a]">
            {hits.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => pick(h)}
                  className="flex w-full flex-col px-3 py-2 text-left hover:bg-white/5"
                >
                  <span className="text-sm font-semibold text-bright">{h.name}</span>
                  <span className="truncate text-xs text-muted">{h.displayName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!profile || !selectedPlace ? (
          <div className="space-y-3 p-4 text-sm text-muted">
            <p>
              Search any populated place on Earth. You’ll get a plain-language readiness list tailored
              to climate, settlement size, and proximity to open-source strategic sites.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Washington", "Moscow", "Beijing", "London", "Karachi", "Anchorage", "Suva"].map(
                (example) => (
                  <button
                    key={example}
                    type="button"
                    className="soft-btn"
                    onClick={() => setQ(example)}
                  >
                    {example}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <div
              className="rounded-xl border px-3 py-3"
              style={{ borderColor: profile.riskColor, background: `${profile.riskColor}18` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-lg font-bold text-bright">{selectedPlace.name}</div>
                  <div className="text-xs text-muted">{selectedPlace.displayName}</div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: profile.riskColor }}
                  >
                    {profile.riskBand} readiness focus
                  </div>
                  <div className="tabular text-sm text-muted">score {profile.riskScore}/100</div>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg">{profile.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="chip">{profile.settlement}</span>
                <span className="chip">{profile.climate}</span>
                <span className="chip tabular">
                  {selectedPlace.lat.toFixed(2)}°, {selectedPlace.lon.toFixed(2)}°
                </span>
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Why this kit
              </div>
              <ul className="space-y-1 text-xs text-muted">
                {profile.factors.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Nearest mapped strategic sites
              </div>
              <ul className="space-y-1">
                {profile.nearestTargets.slice(0, 4).map((t) => (
                  <li
                    key={t.name + t.distanceKm}
                    className="flex justify-between gap-2 text-xs text-fg"
                  >
                    <span className="truncate">
                      <span className="text-muted">{t.kind}</span> · {t.name}
                    </span>
                    <span className="shrink-0 tabular text-muted">{t.distanceKm} km</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  className={`soft-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All items
                </button>
                {(
                  [
                    "nuclear",
                    "water",
                    "food",
                    "shelter",
                    "medical",
                    "comms",
                    "climate",
                    "tools",
                  ] as const
                ).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`soft-btn ${filter === c ? "active" : ""}`}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border bg-black/20 px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="chip capitalize"
                        style={{
                          borderColor: CAT_COLOR[item.category],
                          color: CAT_COLOR[item.category],
                        }}
                      >
                        {item.category}
                      </span>
                      <span className="chip">P{item.priority}</span>
                      <span className="font-semibold text-bright">{item.name}</span>
                    </div>
                    {item.qtyHint && (
                      <div className="mt-1 text-xs font-medium text-sky-300">{item.qtyHint}</div>
                    )}
                    <div className="mt-1 text-xs leading-relaxed text-muted">{item.reason}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                What to do
              </div>
              <ol className="list-decimal space-y-1 pl-4 text-xs text-fg">
                {profile.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </div>

            <p className="text-[11px] leading-relaxed text-dim">{profile.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
