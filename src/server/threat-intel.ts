import { createServerFn } from "@tanstack/react-start";
import { matchWatchZones, type WatchZone } from "@/data/watch-zones";
import { getLiveNuclearNewsData, type LiveNewsItem } from "@/server/nuclear-news";
import { getOsintDefcon } from "@/server/defcon-osint";
import { parseRssItems } from "@/lib/rss-utils";
import { getSpaceWeather } from "@/server/space-weather";

export type SeismicEvent = {
  id: string;
  mag: number;
  place: string;
  time: string;
  lat: number;
  lon: number;
  depthKm: number;
  url: string;
  watchHits: { zoneId: string; zoneName: string; kind: WatchZone["kind"]; distanceKm: number }[];
  nuclearRelevance: "watch" | "elevated" | "background";
};

export type OfficialItem = {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  source: "DoD" | "IAEA" | "USGS" | "UN" | "FAS" | "Other";
  summary: string;
};

export type DataSourceStatus = {
  id: string;
  name: string;
  status: "ok" | "degraded" | "down";
  detail: string;
  legal: string;
};

export type ThreatIntelSnapshot = {
  fetchedAt: string;
  news: LiveNewsItem[];
  newsFeedCount: number;
  seismic: SeismicEvent[];
  seismicWatchCount: number;
  official: OfficialItem[];
  sources: DataSourceStatus[];
  disclaimer: string;
  osintDefconLevel?: number;
  cached?: boolean;
};

function parseRss(xml: string, source: OfficialItem["source"], max = 12): OfficialItem[] {
  const items: OfficialItem[] = [];
  for (const it of parseRssItems(xml, max + 4)) {
    if (/^UN News/i.test(it.title) && source === "UN") continue;
    const pub = it.publishedAt ? new Date(it.publishedAt) : new Date();
    items.push({
      id: `${source}-${it.title.slice(0, 40)}-${pub.getTime()}`.replace(/\s+/g, "_"),
      title: it.title,
      link: it.link,
      publishedAt: it.publishedAt ?? new Date().toISOString(),
      source,
      summary: it.summary || it.title,
    });
    if (items.length >= max) break;
  }
  return items;
}

async function fetchUsgsSeismic(): Promise<{ events: SeismicEvent[]; status: DataSourceStatus }> {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
      {
        headers: { Accept: "application/json", "User-Agent": "ONTAS-Educational/1.0" },
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!res.ok) {
      return {
        events: [],
        status: {
          id: "usgs",
          name: "USGS Earthquake GeoJSON (M2.5+ 24h)",
          status: "down",
          detail: `HTTP ${res.status}`,
          legal: "Public domain U.S. Geological Survey data",
        },
      };
    }
    const data = (await res.json()) as {
      features: {
        id: string;
        geometry: { coordinates: [number, number, number] };
        properties: { mag: number; place: string; time: number; url: string };
      }[];
    };

    const events: SeismicEvent[] = data.features.map((f) => {
      const [lon, lat, depth] = f.geometry.coordinates;
      const hits = matchWatchZones(lat, lon).map((h) => ({
        zoneId: h.zone.id,
        zoneName: h.zone.name,
        kind: h.zone.kind,
        distanceKm: h.distanceKm,
      }));
      let nuclearRelevance: SeismicEvent["nuclearRelevance"] = "background";
      if (hits.some((h) => h.kind === "test-site" && h.distanceKm < 50)) {
        nuclearRelevance = "elevated";
      } else if (hits.length > 0) {
        nuclearRelevance = "watch";
      }
      return {
        id: f.id,
        mag: f.properties.mag,
        place: f.properties.place,
        time: new Date(f.properties.time).toISOString(),
        lat,
        lon,
        depthKm: depth ?? 0,
        url: f.properties.url,
        watchHits: hits,
        nuclearRelevance,
      };
    });

    events.sort((a, b) => b.mag - a.mag);

    return {
      events,
      status: {
        id: "usgs",
        name: "USGS Earthquake GeoJSON (M2.5+ 24h)",
        status: "ok",
        detail: `${events.length} events · ${events.filter((e) => e.nuclearRelevance !== "background").length} near watch zones`,
        legal: "Public domain U.S. Geological Survey data",
      },
    };
  } catch (e) {
    return {
      events: [],
      status: {
        id: "usgs",
        name: "USGS Earthquake GeoJSON (M2.5+ 24h)",
        status: "down",
        detail: e instanceof Error ? e.message : "fetch failed",
        legal: "Public domain U.S. Geological Survey feed",
      },
    };
  }
}

async function fetchOfficialRss(
  url: string,
  source: OfficialItem["source"],
  name: string,
  legal: string,
): Promise<{ items: OfficialItem[]; status: DataSourceStatus }> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "Mozilla/5.0 (compatible; ONTAS-Educational/1.0)",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return {
        items: [],
        status: {
          id: source.toLowerCase(),
          name,
          status: "down",
          detail: `HTTP ${res.status}`,
          legal,
        },
      };
    }
    const xml = await res.text();
    const items = parseRss(xml, source, 12);
    const filtered =
      source === "DoD"
        ? items.filter((i) =>
            /nuclear|missile|strategic|deterr|ICBM|SSBN|arsenal|strike|korea|china|russia|nato|trident|minuteman|hypersonic|arms|force|gaza|ukraine|iran/i.test(
              `${i.title} ${i.summary}`,
            ),
          )
        : items;
    return {
      items: filtered.length ? filtered : items.slice(0, 8),
      status: {
        id: source.toLowerCase(),
        name,
        status: items.length ? "ok" : "degraded",
        detail: `${filtered.length || items.length} items`,
        legal,
      },
    };
  } catch (e) {
    return {
      items: [],
      status: {
        id: source.toLowerCase(),
        name,
        status: "down",
        detail: e instanceof Error ? e.message : "fetch failed",
        legal,
      },
    };
  }
}

let cache: { at: number; snap: ThreatIntelSnapshot } | null = null;
const CACHE_MS = 60_000;

export const fetchThreatIntel = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) {
    return { ...cache.snap, cached: true as const };
  }

  const [newsPack, usgs, dod, iaea, un, bbc, osint, spaceWx] = await Promise.all([
    getLiveNuclearNewsData().catch(() => null),
    fetchUsgsSeismic(),
    fetchOfficialRss(
      "https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=15",
      "DoD",
      "U.S. Department of Defense news RSS",
      "Public DoD news releases (unclassified)",
    ),
    fetchOfficialRss(
      "https://www.iaea.org/feeds/topnews",
      "IAEA",
      "IAEA Top News RSS",
      "Public International Atomic Energy Agency feed",
    ),
    fetchOfficialRss(
      "https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml",
      "UN",
      "UN Peace & Security RSS",
      "United Nations News public RSS",
    ),
    fetchOfficialRss(
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "Other",
      "BBC World RSS",
      "BBC public RSS — open news wire",
    ),
    getOsintDefcon().catch(() => null),
    getSpaceWeather().catch(() => null),
  ]);

  const news = newsPack?.items ?? [];
  const sources: DataSourceStatus[] = [
    {
      id: "news-mesh",
      name: "Multi-region nuclear news RSS mesh",
      status: news.length ? "ok" : "degraded",
      detail: newsPack ? `${news.length} items · ${newsPack.feedCount} feeds` : "unavailable",
      legal: "Public Google News search RSS — educational aggregation",
    },
    usgs.status,
    dod.status,
    iaea.status,
    un.status,
    {
      id: "defcon-osint",
      name: "Unofficial DEFCON OSINT",
      status: osint ? (osint.source.includes("fallback") ? "degraded" : "ok") : "down",
      detail: osint ? `D${osint.level} ${osint.label} · ${osint.source}` : "unavailable",
      legal: "Independent open estimate (defconlevel.com) — NOT official U.S. DEFCON",
    },
    {
      id: "ais-fi",
      name: "Open AIS (digitraffic.fi Baltic)",
      status: "degraded",
      detail: "Regional Baltic open AIS — live count set by maritime poller in UI",
      legal: "Open data — Finnish Transport Infrastructure Agency",
    },
    {
      id: "bbc",
      name: "BBC World RSS",
      status: bbc.status.status,
      detail: bbc.status.detail,
      legal: bbc.status.legal,
    },
    {
      id: "swpc",
      name: "NOAA SWPC planetary K-index",
      status: spaceWx?.ok ? "ok" : "degraded",
      detail: spaceWx?.note ?? "unavailable",
      legal: "NOAA Space Weather Prediction Center public JSON",
    },
    {
      id: "defcon-official",
      name: "Official U.S. DEFCON",
      status: "degraded",
      detail: "CLASSIFIED — no lawful public real-time feed",
      legal: "Not published; public life-safety path is IPAWS / EAS / WEA",
    },
    {
      id: "ssbn",
      name: "SSBN real-time tracks",
      status: "degraded",
      detail: "No public AIS while submerged — educational patrol estimates only",
      legal: "Unclassified open-source modeling only",
    },
  ];

  const snap: ThreatIntelSnapshot = {
    fetchedAt: new Date(now).toISOString(),
    news,
    newsFeedCount: newsPack?.feedCount ?? 0,
    seismic: usgs.events,
    seismicWatchCount: usgs.events.filter((e) => e.nuclearRelevance !== "background").length,
    official: [...un.items, ...dod.items, ...iaea.items, ...bbc.items].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    ),
    sources,
    osintDefconLevel: osint?.level,
    disclaimer:
      "ONTAS fuses only public/unclassified open data and clearly labeled estimates. It is NOT NORAD, USSTRATCOM, FEMA, or any official warning authority. Official U.S. DEFCON is classified. Life-safety nuclear attack warnings in the U.S. are issued via FEMA IPAWS / EAS / Wireless Emergency Alerts.",
  };

  cache = { at: now, snap };
  return { ...snap, cached: false as const };
});
