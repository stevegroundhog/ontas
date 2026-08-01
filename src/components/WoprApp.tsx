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
import {
  fetchMaritimeSnapshot,
  type AisContact,
} from "@/server/maritime";
import {
  fetchThreatIntel,
  type DataSourceStatus,
  type OfficialItem,
  type SeismicEvent,
} from "@/server/threat-intel";
import type { SubPosition } from "@/data/naval-deployments";
import { BootScreen } from "./BootScreen";
import { ClimatePanel } from "./ClimatePanel";
import { ComparePanel } from "./ComparePanel";
import { ConflictsPanel } from "./ConflictsPanel";
import { DefconBadge } from "./DefconBadge";
import { ForceTable } from "./ForceTable";
import { IntelPanel } from "./IntelPanel";
import { LaunchesPanel } from "./LaunchesPanel";
import { LearnPanel } from "./LearnPanel";
import { LiveStatusBar } from "./LiveStatusBar";
import { NationPanel } from "./NationPanel";
import { NavalPanel } from "./NavalPanel";
import { PlaceSearch } from "./PlaceSearch";
import { ScenarioPanel } from "./ScenarioPanel";
import { ThreatNewsFeed } from "./ThreatNewsFeed";
import { TreatiesPanel } from "./TreatiesPanel";
import { WorldMap } from "./WorldMap";

type RightTab =
  | "conflicts"
  | "search"
  | "compare"
  | "nation"
  | "naval"
  | "intel"
  | "launches"
  | "scenario";
type BottomTab = "learn" | "news" | "forces" | "treaties" | "climate";

const LEARN_KEY = "ontas-saw-learn";

export function WoprApp() {
  const [booted, setBooted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("us");
  const [compareLeft, setCompareLeft] = useState("us");
  const [compareRight, setCompareRight] = useState("ru");
  const [newsFilterId, setNewsFilterId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState(scenarios[0]!.id);
  const [animating, setAnimating] = useState(false);
  const [clock, setClock] = useState(() => formatZulu(new Date()));
  const [now, setNow] = useState(() => Date.now());
  const [rightTab, setRightTab] = useState<RightTab>("conflicts");
  const [bottomTab, setBottomTab] = useState<BottomTab>(() => {
    try {
      return sessionStorage.getItem(LEARN_KEY) === "1" ? "news" : "learn";
    } catch {
      return "learn";
    }
  });

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
  const [linkLive, setLinkLive] = useState(false);

  const [searchedPlace, setSearchedPlace] = useState<PlaceHit | null>(null);
  const [survivalProfile, setSurvivalProfile] = useState<SurvivalProfile | null>(null);
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);

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
        /* keep last */
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

  const onBootDone = useCallback(() => setBooted(true), []);

  const openLearn = useCallback(() => {
    setBottomTab("learn");
    try {
      sessionStorage.setItem(LEARN_KEY, "1");
    } catch {
      /* ignore */
    }
    window.requestAnimationFrame(() => {
      document.getElementById("ontas-learn")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const onRun = useCallback(() => {
    if (scenario.trajectories.length === 0) {
      setAnimating(false);
      return;
    }
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 4500);
  }, [scenario.trajectories.length]);

  const onScenarioSelect = useCallback((id: string) => {
    setScenarioId(id);
    setAnimating(false);
    setRightTab("scenario");
    const sc = scenarios.find((s) => s.id === id);
    if (sc?.actors[0]) setSelectedId(sc.actors[0]);
  }, []);

  if (!booted) {
    return <BootScreen onDone={onBootDone} />;
  }

  const tabs: { id: RightTab; label: string }[] = [
    { id: "conflicts", label: "Conflicts" },
    { id: "search", label: "Survivability" },
    { id: "compare", label: "Compare" },
    { id: "launches", label: "Launches" },
    { id: "naval", label: "Ships" },
    { id: "intel", label: "Intel" },
    { id: "nation", label: "Country" },
    { id: "scenario", label: "Scenarios" },
  ];

  const selectedConflictName = ARMED_CONFLICTS.find((c) => c.id === selectedConflictId)?.shortName;
  const liveBits = [
    news.length ? `${news.length} news` : null,
    seismic.length ? `${seismic.length} quakes` : null,
    ais.length ? `${ais.length} AIS` : null,
    official.length ? `${official.length} wires` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="relative min-h-dvh text-fg">
      <div
        className="border-b px-3 py-2 text-center text-xs font-semibold sm:text-sm"
        style={{
          background: `${defcon.color}22`,
          borderColor: defcon.color,
          color: defcon.color,
        }}
      >
        Unofficial OSINT DEFCON {defcon.level} ({defcon.label}) · public data only
        {selectedConflictName ? ` · Focus: ${selectedConflictName}` : ""} ·{" "}
        <button
          type="button"
          onClick={openLearn}
          className="underline decoration-dotted underline-offset-2 hover:text-bright"
        >
          What does DEFCON mean?
        </button>
        {" · "}
        <Link
          to="/article"
          className="underline decoration-dotted underline-offset-2 hover:text-bright"
        >
          Read the essay
        </Link>
      </div>

      <header className="sticky top-0 z-20 border-b border-border bg-[#0b1220ee] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-3 py-3 sm:px-4">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-400/90">
              ONTAS · Unclassified open-source fusion
            </div>
            <h1 className="truncate text-lg font-bold text-bright sm:text-xl">
              Map · Conflicts · Compare · Launches · Treaties
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link to="/article" className="soft-btn">
              Essay
            </Link>
            <button type="button" className="soft-btn active" onClick={openLearn}>
              Beginner guide
            </button>
            <span className="chip tabular text-fg">{clock}</span>
            <span className="chip">{formatNum(GLOBAL_TOTAL_INVENTORY)} warheads</span>
            {liveBits && (
              <span className="chip" style={{ borderColor: "#34d399", color: "#6ee7b7" }}>
                {liveBits}
              </span>
            )}
            <span
              className="chip"
              style={{
                borderColor: linkLive ? "#34d399" : "#fbbf24",
                color: linkLive ? "#6ee7b7" : "#fcd34d",
              }}
            >
              {linkLive ? "● LIVE" : "○ reconnecting"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-3 p-3 sm:p-4">
        <LiveStatusBar now={now} />

        <div className="grid gap-3 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <DefconBadge state={defcon} onExplain={openLearn} />
          </div>
          <div className="crt-panel flex min-w-0 flex-wrap items-center gap-2 px-3 py-3 lg:col-span-8">
            <span className="text-xs font-semibold text-muted">Map layers</span>
            <button
              type="button"
              className={`soft-btn ${showConflicts ? "active" : ""}`}
              onClick={() => setShowConflicts((v) => !v)}
            >
              Conflicts {showConflicts ? "on" : "off"}
            </button>
            <button
              type="button"
              className={`soft-btn ${showSubs ? "active" : ""}`}
              onClick={() => setShowSubs((v) => !v)}
            >
              SSBN {showSubs ? "on" : "off"}
            </button>
            <button
              type="button"
              className={`soft-btn ${showAis ? "active" : ""}`}
              onClick={() => setShowAis((v) => !v)}
            >
              AIS {showAis ? "on" : "off"}
            </button>
            <div className="ml-auto flex max-w-full flex-wrap gap-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`soft-btn ${rightTab === t.id ? "active" : ""}`}
                  onClick={() => setRightTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <div className="relative z-0 min-w-0 overflow-hidden lg:col-span-5">
            <div className="aspect-[2/1] w-full min-h-[220px] lg:min-h-[420px]">
              <WorldMap
                nations={nations}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setRightTab("nation");
                }}
                scenario={scenario}
                animating={animating}
                showSites
                showSubs={showSubs}
                showAis={showAis}
                showConflicts={showConflicts}
                subs={subs}
                homePorts={HOME_PORTS}
                ais={ais}
                selectedSubId={selectedSubId}
                onSelectSub={(id) => {
                  setSelectedSubId(id);
                  if (id) setRightTab("naval");
                }}
                seismic={seismic}
                searchedPlace={searchedPlace}
                selectedConflictId={selectedConflictId}
                onSelectConflict={(id) => {
                  setSelectedConflictId(id);
                  setRightTab("conflicts");
                }}
                conflicts={ARMED_CONFLICTS}
              />
            </div>
          </div>
          <div className="relative z-10 min-h-[380px] min-w-0 lg:col-span-7 lg:min-h-[420px]">
            {rightTab === "conflicts" && (
              <ConflictsPanel
                selectedId={selectedConflictId}
                onSelect={setSelectedConflictId}
                now={now}
              />
            )}
            {rightTab === "search" && (
              <PlaceSearch
                selectedPlace={searchedPlace}
                profile={survivalProfile}
                onSelectPlace={(place, profile) => {
                  setSearchedPlace(place);
                  setSurvivalProfile(profile);
                }}
              />
            )}
            {rightTab === "compare" && (
              <ComparePanel
                leftId={compareLeft}
                rightId={compareRight}
                onChangeLeft={(id) => {
                  setCompareLeft(id);
                  setSelectedId(id);
                }}
                onChangeRight={setCompareRight}
              />
            )}
            {rightTab === "launches" && <LaunchesPanel />}
            {rightTab === "naval" && (
              <NavalPanel
                units={units}
                subs={subs}
                ais={ais}
                aisSource={aisSource}
                fetchedAt={maritimeAt}
                selectedSubId={selectedSubId}
                onSelectSub={setSelectedSubId}
                now={now}
              />
            )}
            {rightTab === "intel" && (
              <IntelPanel
                seismic={seismic}
                official={official}
                sources={sources}
                fetchedAt={intelAt}
                now={now}
                disclaimer={disclaimer}
              />
            )}
            {rightTab === "nation" && <NationPanel nation={selected} />}
            {rightTab === "scenario" && (
              <ScenarioPanel
                scenarios={scenarios}
                active={scenario}
                onSelect={onScenarioSelect}
                animating={animating}
                onRun={onRun}
              />
            )}
          </div>
        </div>

        <div id="ontas-learn" className="flex flex-wrap items-center gap-2 scroll-mt-24">
          <button
            type="button"
            className={`soft-btn ${bottomTab === "learn" ? "active" : ""}`}
            onClick={openLearn}
          >
            Beginner guide
          </button>
          <button
            type="button"
            className={`soft-btn ${bottomTab === "news" ? "active" : ""}`}
            onClick={() => setBottomTab("news")}
          >
            Live news {news.length ? `(${news.length})` : ""}
          </button>
          <button
            type="button"
            className={`soft-btn ${bottomTab === "forces" ? "active" : ""}`}
            onClick={() => setBottomTab("forces")}
          >
            Nuclear forces
          </button>
          <button
            type="button"
            className={`soft-btn ${bottomTab === "treaties" ? "active" : ""}`}
            onClick={() => setBottomTab("treaties")}
          >
            Treaties
          </button>
          <button
            type="button"
            className={`soft-btn ${bottomTab === "climate" ? "active" : ""}`}
            onClick={() => setBottomTab("climate")}
          >
            Strategic climate
          </button>
          <span className="ml-auto text-xs text-muted">
            OSINT D{defcon.osintLevel} → display D{defcon.level}
            {newsMeta.feedCount ? ` · ${newsMeta.feedCount} news feeds` : ""}
            {ais.length ? ` · ${ais.length} AIS` : ""}
          </span>
        </div>

        <div className="min-h-[320px] lg:min-h-[380px]">
          {bottomTab === "learn" && <LearnPanel />}
          {bottomTab === "news" && (
            <ThreatNewsFeed
              filterNationId={newsFilterId}
              onSelectNation={(id) => {
                if (!id) {
                  setNewsFilterId(null);
                  return;
                }
                setNewsFilterId(id);
                setSelectedId(id);
                setRightTab("nation");
              }}
              externalItems={news}
              externalFetchedAt={newsMeta.fetchedAt}
              externalFeedCount={newsMeta.feedCount}
            />
          )}
          {bottomTab === "forces" && (
            <ForceTable
              nations={nations}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setRightTab("nation");
              }}
            />
          )}
          {bottomTab === "treaties" && <TreatiesPanel />}
          {bottomTab === "climate" && <ClimatePanel />}
        </div>

        <footer className="crt-panel px-4 py-3 text-xs leading-relaxed text-muted">
          <div className="font-semibold text-bright">Unclassified realtime scope</div>
          <p className="mt-1">
            Live: USGS, UN/DoD/IAEA RSS, news mesh, BBC/UN conflict wires, Finnish AIS, OSM geocode,
            launch-news mesh, DEFCON OSINT. Curated: treaty timeline, launch calendar, fatality
            ranges (contested open estimates). Not live: official DEFCON, submerged SSBNs,
            classified C2. Educational only.{" "}
            <button type="button" className="text-sky-300 underline" onClick={openLearn}>
              Beginner guide
            </button>
            {" · "}
            <Link to="/article" className="text-sky-300 underline">
              Full essay
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
          </p>
        </footer>
      </main>
    </div>
  );
}

function formatZulu(d: Date): string {
  const iso = d.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}Z`;
}
