import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { estimateSubPositions, HOME_PORTS } from "@/data/naval-deployments";
import type { MaritimeUnit } from "@/data/maritime-units";
import {
  GLOBAL_TOTAL_INVENTORY,
  nations,
  scenarios,
  type Scenario,
} from "@/data/nuclear-forces";
import { ARMED_CONFLICTS } from "@/data/conflicts";
import { computeDefcon, type DefconState } from "@/lib/defcon";
import { seedSsbnUnits } from "@/lib/seed-units";
import type { SurvivalProfile } from "@/lib/survivability";
import { formatNum } from "@/lib/utils";
import type { LiveNewsItem } from "@/server/nuclear-news";
import { fetchOsintDefcon, type OsintDefcon } from "@/server/defcon-osint";
import type { PlaceHit } from "@/server/geocode";
import { fetchMaritimeSnapshot, type AisContact } from "@/server/maritime";
import {
  fetchThreatIntel,
  type DataSourceStatus,
  type OfficialItem,
  type SeismicEvent,
} from "@/server/threat-intel";
import type { SubPosition } from "@/data/naval-deployments";
import {
  type AppSection,
  NAV_ITEMS,
  QuickFind,
} from "./AppNav";
import { BootScreen } from "./BootScreen";
import { ClimatePanel } from "./ClimatePanel";
import { ComparePanel } from "./ComparePanel";
import { ConflictsPanel } from "./ConflictsPanel";
import { DefconBadge } from "./DefconBadge";
import { FleetPanel } from "./FleetPanel";
import { ForceTable } from "./ForceTable";
import { IntelPanel } from "./IntelPanel";
import { LaunchesPanel } from "./LaunchesPanel";
import { LearnPanel } from "./LearnPanel";
import { LiveStatusBar } from "./LiveStatusBar";
import { NationPanel } from "./NationPanel";
import { PlaceSearch } from "./PlaceSearch";
import { RadiologicalPanel } from "./RadiologicalPanel";
import { ScenarioPanel } from "./ScenarioPanel";
import { TerrorHistoryPanel } from "./TerrorHistoryPanel";
import { ThreatNewsFeed } from "./ThreatNewsFeed";
import { TreatiesPanel } from "./TreatiesPanel";
import { WarheadsPanel } from "./WarheadsPanel";
import { WorldMap } from "./WorldMap";
import { fetchSpaceWeather, type SpaceWeatherSnapshot } from "@/server/space-weather";

const LEARN_KEY = "ontas-saw-learn";
const NAV_KEY = "ontas-section";

function loadSection(): AppSection {
  try {
    const s = sessionStorage.getItem(NAV_KEY) as AppSection | null;
    if (s && NAV_ITEMS.some((i) => i.id === s)) return s;
  } catch {
    /* ignore */
  }
  return "map";
}

export function WoprApp() {
  const [booted, setBooted] = useState(false);
  const [section, setSection] = useState<AppSection>(loadSection);
  const [jump, setJump] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>("us");
  const [compareLeft, setCompareLeft] = useState("us");
  const [compareRight, setCompareRight] = useState("ru");
  const [newsFilterId, setNewsFilterId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState(scenarios[0]!.id);
  const [animating, setAnimating] = useState(false);
  const [clock, setClock] = useState(() => formatZulu(new Date()));
  const [now, setNow] = useState(() => Date.now());

  const [news, setNews] = useState<LiveNewsItem[]>([]);
  const [newsMeta, setNewsMeta] = useState({ feedCount: 0, fetchedAt: null as string | null });
  const [seismic, setSeismic] = useState<SeismicEvent[]>([]);
  const [official, setOfficial] = useState<OfficialItem[]>([]);
  const [sources, setSources] = useState<DataSourceStatus[]>([]);
  const [disclaimer, setDisclaimer] = useState(
    "Educational open-source system. Unofficial DEFCON from public OSINT. Not a life-safety alert.",
  );
  const [intelAt, setIntelAt] = useState<string | null>(null);
  const [osint, setOsint] = useState<OsintDefcon | null>(null);

  const [subs, setSubs] = useState<SubPosition[]>(() => estimateSubPositions());
  const [units, setUnits] = useState<MaritimeUnit[]>(() => seedSsbnUnits());
  const [ais, setAis] = useState<AisContact[]>([]);
  const [aisSource, setAisSource] = useState("…");
  const [maritimeAt, setMaritimeAt] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [showSubs, setShowSubs] = useState(true);
  const [showAis, setShowAis] = useState(true);
  const [showConflicts, setShowConflicts] = useState(true);
  const [showSeismic, setShowSeismic] = useState(true);
  const [spaceWx, setSpaceWx] = useState<SpaceWeatherSnapshot | null>(null);
  const [linkLive, setLinkLive] = useState(false);

  const [searchedPlace, setSearchedPlace] = useState<PlaceHit | null>(null);
  const [survivalProfile, setSurvivalProfile] = useState<SurvivalProfile | null>(null);
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);

  const go = useCallback((s: AppSection) => {
    setSection(s);
    try {
      sessionStorage.setItem(NAV_KEY, s);
      if (s === "learn") sessionStorage.setItem(LEARN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      const n = Date.now();
      setNow(n);
      setClock(formatZulu(new Date(n)));
      const next = estimateSubPositions(n);
      setSubs(next);
      setUnits((prev) => {
        const byId = new Map(next.map((s) => [s.id, s]));
        const hasSsbn = prev.some((u) => u.category === "ssbn");
        if (!hasSsbn) {
          const seeded = seedSsbnUnits(n);
          const aisUnits = prev.filter((u) => u.trackSource === "ais-live");
          return [...seeded, ...aisUnits];
        }
        return prev.map((u) => {
          if (u.category !== "ssbn") return u;
          const s = byId.get(u.id);
          if (!s) return u;
          return {
            ...u,
            lat: s.lat,
            lon: s.lon,
            heading: s.heading,
            status: s.status,
            updatedAt: n,
          };
        });
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const d = await fetchOsintDefcon();
        if (!cancelled) setOsint(d);
      } catch {
        /* keep */
      }
    };
    void pull();
    const t = window.setInterval(pull, 120_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const data = await fetchThreatIntel();
        if (cancelled) return;
        setNews(data.news);
        setNewsMeta({ feedCount: data.newsFeedCount, fetchedAt: data.fetchedAt });
        setSeismic(data.seismic);
        setOfficial(data.official);
        setSources(data.sources);
        setDisclaimer(data.disclaimer);
        setIntelAt(data.fetchedAt);
        setLinkLive(true);
      } catch {
        if (!cancelled) setLinkLive(false);
      }
    };
    void pull();
    const t = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const d = await fetchSpaceWeather();
        if (!cancelled) setSpaceWx(d);
      } catch {
        /* keep */
      }
    };
    void pull();
    const id = window.setInterval(pull, 180_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const data = await fetchMaritimeSnapshot();
        if (cancelled) return;
        setSubs(data.subs);
        setUnits(data.units.length ? data.units : seedSsbnUnits());
        setAis(data.ais);
        setAisSource(data.aisSource);
        setMaritimeAt(data.fetchedAt);
        setSources((prev) =>
          prev.map((s) =>
            s.id === "ais-fi"
              ? {
                  ...s,
                  status: data.aisCount > 0 ? "ok" : "degraded",
                  detail:
                    data.aisCount > 0
                      ? `${data.aisCount} surface contacts · ${data.aisSource}`
                      : `AIS empty · ${data.aisSource}`,
                }
              : s,
          ),
        );
      } catch {
        setUnits((prev) => (prev.length ? prev : seedSsbnUnits()));
      }
    };
    void pull();
    const t = window.setInterval(pull, 40_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const scenario: Scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!,
    [scenarioId],
  );

  const defcon: DefconState = useMemo(
    () => computeDefcon({ scenario, news, seismic, osint, now }),
    [scenario, news, seismic, osint, now],
  );

  const selected = useMemo(
    () => nations.find((n) => n.id === selectedId) ?? null,
    [selectedId],
  );

  const jumpResults = useMemo(() => {
    const q = jump.trim().toLowerCase();
    if (q.length < 1) return [];
    return NAV_ITEMS.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.hint.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [jump]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setJump("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onBootDone = useCallback(() => setBooted(true), []);

  const onRun = useCallback(() => {
    if (scenario.trajectories.length === 0) {
      setAnimating(false);
      return;
    }
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 4500);
  }, [scenario.trajectories.length]);

  const onScenarioSelect = useCallback(
    (id: string) => {
      setScenarioId(id);
      setAnimating(false);
      go("scenarios");
      const sc = scenarios.find((s) => s.id === id);
      if (sc?.actors[0]) setSelectedId(sc.actors[0]);
    },
    [go],
  );

  if (!booted) {
    return <BootScreen onDone={onBootDone} />;
  }

  const selectedConflictName = ARMED_CONFLICTS.find((c) => c.id === selectedConflictId)?.shortName;
  const sectionMeta = NAV_ITEMS.find((i) => i.id === section);
  const showMap =
    section === "map" ||
    section === "conflicts" ||
    section === "forces" ||
    section === "maritime" ||
    section === "survive" ||
    section === "scenarios";

  const sidePanel = (() => {
    switch (section) {
      case "conflicts":
        return (
          <ConflictsPanel
            selectedId={selectedConflictId}
            onSelect={setSelectedConflictId}
            now={now}
          />
        );
      case "forces":
        return (
          <div className="flex h-full min-h-0 flex-col gap-3">
            <div className="min-h-[280px] flex-1">
              <NationPanel nation={selected} />
            </div>
            <div className="max-h-[240px] min-h-[160px]">
              <ForceTable
                nations={nations}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  go("forces");
                }}
              />
            </div>
          </div>
        );
      case "arsenal":
        return (
          <WarheadsPanel
            nationId={selectedId}
            onSelectNation={(id) => {
              setSelectedId(id);
            }}
          />
        );
      case "compare":
        return (
          <ComparePanel
            leftId={compareLeft}
            rightId={compareRight}
            onChangeLeft={(id) => {
              setCompareLeft(id);
              setSelectedId(id);
            }}
            onChangeRight={setCompareRight}
          />
        );
      case "maritime":
        return (
          <FleetPanel
            units={units}
            subs={subs}
            ais={ais}
            aisSource={aisSource}
            fetchedAt={maritimeAt}
            selectedSubId={selectedSubId}
            onSelectSub={setSelectedSubId}
            now={now}
            nationId={selectedId}
            onSelectNation={(id) => setSelectedId(id)}
          />
        );
      case "launches":
        return <LaunchesPanel />;
      case "treaties":
        return <TreatiesPanel />;
      case "rad":
        return <RadiologicalPanel />;
      case "terror":
        return <TerrorHistoryPanel />;
      case "survive":
        return (
          <PlaceSearch
            selectedPlace={searchedPlace}
            profile={survivalProfile}
            onSelectPlace={(place, profile) => {
              setSearchedPlace(place);
              setSurvivalProfile(profile);
            }}
          />
        );
      case "intel":
        return (
          <IntelPanel
            seismic={seismic}
            official={official}
            sources={sources}
            fetchedAt={intelAt}
            now={now}
            disclaimer={disclaimer}
          />
        );
      case "news":
        return (
          <ThreatNewsFeed
            filterNationId={newsFilterId}
            onSelectNation={(id) => {
              if (!id) {
                setNewsFilterId(null);
                return;
              }
              setNewsFilterId(id);
              setSelectedId(id);
            }}
            externalItems={news}
            externalFetchedAt={newsMeta.fetchedAt}
            externalFeedCount={newsMeta.feedCount}
          />
        );
      case "learn":
        return <LearnPanel />;
      case "scenarios":
        return (
          <ScenarioPanel
            scenarios={scenarios}
            active={scenario}
            onSelect={onScenarioSelect}
            animating={animating}
            onRun={onRun}
          />
        );
      case "climate":
        return <ClimatePanel />;
      case "map":
      default:
        return (
          <div className="crt-panel flex h-full flex-col gap-3 overflow-y-auto p-4">
            <DefconBadge state={defcon} onExplain={() => go("learn")} />
            <LiveStatusBar now={now} />
            {spaceWx && (
              <div className="rounded-xl border border-border bg-bg/40 px-3 py-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-violet-300">Space weather</span>
                  <span className="chip">
                    Kp {spaceWx.kp ?? "—"} · {spaceWx.scale}
                  </span>
                  <span className="text-dim">{spaceWx.ok ? "NOAA SWPC live" : "limited"}</span>
                </div>
                <p className="mt-1 text-muted">{spaceWx.note}</p>
              </div>
            )}
            {news.length > 0 && (
              <div className="rounded-xl border border-border bg-bg/40 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-sky-400">
                  Live headline tick · open mesh
                </div>
                <ul className="mt-1.5 max-h-28 space-y-1 overflow-y-auto">
                  {news.slice(0, 6).map((n) => (
                    <li key={n.id} className="text-[11px] leading-snug">
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg/90 hover:text-sky-300 hover:underline"
                      >
                        <span className="text-dim">[{n.severity}] </span>
                        {n.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <QuickFind section={section} onGo={go} />
            <div className="text-[11px] text-dim">
              {selectedConflictName
                ? `Map focus: ${selectedConflictName}`
                : "Click a conflict or country on the map."}
              {ais.length ? ` · Baltic AIS contacts: ${ais.length}` : ""}
            </div>
          </div>
        );
    }
  })();

  return (
    <div className="relative min-h-dvh text-fg">
      {/* DEFCON strip */}
      <div
        className="border-b px-3 py-1.5 text-center text-[11px] font-semibold sm:text-xs"
        style={{
          background: `${defcon.color}18`,
          borderColor: defcon.color,
          color: defcon.color,
        }}
      >
        Unofficial OSINT DEFCON {defcon.level} ({defcon.label}) · educational only
        {selectedConflictName ? ` · ${selectedConflictName}` : ""}
        {" · "}
        <button type="button" className="underline decoration-dotted" onClick={() => go("learn")}>
          What is DEFCON?
        </button>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-[#0b1220f2] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
          <button
            type="button"
            className={`soft-btn shrink-0 ${section === "map" ? "active" : ""}`}
            onClick={() => go("map")}
            title="Return to main live map"
          >
            Live map
          </button>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-400/90">
              ONTAS
            </div>
            <div className="truncate text-sm font-bold text-bright sm:text-base">
              Live Map
              {section !== "map" && sectionMeta ? (
                <span className="ml-2 font-normal text-muted">· {sectionMeta.label}</span>
              ) : (
                <span className="ml-2 hidden font-normal text-muted sm:inline">
                  · world overview
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className={`soft-btn shrink-0 ${section === "learn" ? "active" : ""}`}
            onClick={() => go("learn")}
          >
            Beginner guide
          </button>
          <Link
            to="/article"
            className="soft-btn shrink-0"
          >
            Essay
          </Link>
          <div className="relative hidden min-w-[160px] max-w-xs flex-1 md:block">
            <input
              value={jump}
              onChange={(e) => setJump(e.target.value)}
              placeholder="Jump to… conflicts, yields, terror"
              className="w-full rounded-full border border-border bg-bg/80 px-3 py-2 text-xs text-fg outline-none placeholder:text-dim focus:border-sky-500/50"
              aria-label="Jump to section"
            />
            {jumpResults.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-border bg-panel shadow-xl">
                {jumpResults.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex w-full flex-col px-3 py-2 text-left text-xs hover:bg-white/5"
                      onClick={() => {
                        go(item.id);
                        setJump("");
                      }}
                    >
                      <span className="font-semibold text-bright">{item.label}</span>
                      <span className="text-[10px] text-muted">
                        {item.group} · {item.hint}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="chip tabular hidden text-fg lg:inline">{clock}</span>
          <span className="chip hidden sm:inline">{formatNum(GLOBAL_TOTAL_INVENTORY)} warheads</span>
          <span
            className="chip"
            style={{
              borderColor: linkLive ? "#34d399" : "#fbbf24",
              color: linkLive ? "#6ee7b7" : "#fcd34d",
            }}
          >
            {linkLive ? "● LIVE" : "○ …"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1680px]">
        <main className="min-w-0 space-y-3 p-3 sm:p-4">
          {/* Always-visible quick find (compact when not on map home) */}
          {section !== "map" && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="soft-btn active"
                  onClick={() => go("map")}
                >
                  ← Live map
                </button>
                <span className="text-[11px] text-muted">
                  Viewing <span className="font-semibold text-bright">{sectionMeta?.label}</span>
                </span>
              </div>
              <QuickFind section={section} onGo={go} compact />
            </div>
          )}

          <div className="relative md:hidden">
            <input
              value={jump}
              onChange={(e) => setJump(e.target.value)}
              placeholder="Jump to section…"
              className="w-full rounded-full border border-border bg-bg/80 px-3 py-2.5 text-sm text-fg outline-none"
            />
            {jumpResults.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border bg-panel shadow-xl">
                {jumpResults.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-white/5"
                      onClick={() => {
                        go(item.id);
                        setJump("");
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showMap && (
            <div className="crt-panel flex flex-wrap items-center gap-2 px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Map layers
              </span>
              <button
                type="button"
                className={`soft-btn ${showConflicts ? "active" : ""}`}
                onClick={() => setShowConflicts((v) => !v)}
              >
                Conflicts
              </button>
              <button
                type="button"
                className={`soft-btn ${showSubs ? "active" : ""}`}
                onClick={() => setShowSubs((v) => !v)}
              >
                SSBN
              </button>
              <button
                type="button"
                className={`soft-btn ${showAis ? "active" : ""}`}
                onClick={() => setShowAis((v) => !v)}
              >
                AIS Baltic
              </button>
              <button
                type="button"
                className={`soft-btn ${showSeismic ? "active" : ""}`}
                onClick={() => setShowSeismic((v) => !v)}
              >
                Seismic
              </button>
              {section !== "map" && (
                <button type="button" className="soft-btn ml-auto" onClick={() => go("map")}>
                  ← Live map
                </button>
              )}
            </div>
          )}

          <div
            className={`grid gap-3 ${
              showMap ? "lg:grid-cols-12" : "grid-cols-1"
            }`}
          >
            {showMap && (
              <div className="min-w-0 lg:col-span-7">
                <div className="aspect-[2/1] w-full min-h-[220px] lg:min-h-[min(58vh,560px)]">
                  <WorldMap
                    nations={nations}
                    selectedId={selectedId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      go("forces");
                    }}
                    scenario={scenario}
                    animating={animating}
                    showSites
                    showSubs={showSubs}
                    showAis={showAis}
                    showConflicts={showConflicts}
                    showSeismic={showSeismic}
                    subs={subs}
                    homePorts={HOME_PORTS}
                    ais={ais}
                    selectedSubId={selectedSubId}
                    onSelectSub={(id) => {
                      setSelectedSubId(id);
                      if (id) go("maritime");
                    }}
                    seismic={seismic}
                    searchedPlace={searchedPlace}
                    selectedConflictId={selectedConflictId}
                    onSelectConflict={(id) => {
                      setSelectedConflictId(id);
                      go("conflicts");
                    }}
                    conflicts={ARMED_CONFLICTS}
                  />
                </div>
              </div>
            )}
            <div
              className={`min-h-[420px] min-w-0 ${showMap ? "lg:col-span-5" : "w-full"}`}
            >
              {sidePanel}
            </div>
          </div>

          <footer className="rounded-xl border border-border bg-panel/60 px-4 py-3 text-[11px] leading-relaxed text-muted">
            <span className="font-semibold text-bright">ONTAS · educational build</span>
            {" — "}
            Public sensors, open estimates, historical terrorism record, yields/aircraft desks.
            Not official DEFCON, not a warning system. Emergencies: IPAWS/EAS/WEA.{" "}
            <Link to="/article" className="text-sky-300 underline">
              Essay
            </Link>
            {" · "}
            <a
              href="https://github.com/stevegroundhog/ontas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 underline"
            >
              GitHub
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

function formatZulu(d: Date): string {
  const iso = d.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}Z`;
}
