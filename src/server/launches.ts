import { createServerFn } from "@tanstack/react-start";
import { LAUNCH_CALENDAR, type LaunchEvent } from "@/data/launches";
import { ONTAS_UA, parseRssItems } from "@/lib/rss-utils";

export type LaunchNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
};

export type LaunchDeskSnapshot = {
  calendar: LaunchEvent[];
  news: LaunchNewsItem[];
  fetchedAt: string;
  disclaimer: string;
  feedOk: boolean;
};

let cache: { at: number; snap: LaunchDeskSnapshot } | null = null;
const TTL = 120_000;

async function fetchFeed(url: string, source: string): Promise<LaunchNewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": ONTAS_UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    return parseRssItems(await res.text(), 12).map((it, i) => ({
      id: `${source}-${i}-${it.title.slice(0, 40)}`,
      title: it.title,
      link: it.link || `https://news.google.com/search?q=${encodeURIComponent(it.title)}`,
      source,
      publishedAt: it.publishedAt,
    }));
  } catch {
    return [];
  }
}

export const fetchLaunchDesk = createServerFn({ method: "GET" }).handler(
  async (): Promise<LaunchDeskSnapshot> => {
    const now = Date.now();
    if (cache && now - cache.at < TTL) return cache.snap;

    const queries = [
      "missile test launch",
      "ICBM test",
      "North Korea missile",
      "space launch schedule",
    ];
    const results = await Promise.all(
      queries.map((q) =>
        fetchFeed(
          `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`,
          `GNews:${q.slice(0, 18)}`,
        ),
      ),
    );
    const seen = new Set<string>();
    const news: LaunchNewsItem[] = [];
    for (const batch of results) {
      for (const item of batch) {
        const key = item.title.toLowerCase().slice(0, 80);
        if (seen.has(key)) continue;
        seen.add(key);
        news.push(item);
        if (news.length >= 24) break;
      }
      if (news.length >= 24) break;
    }

    const snap: LaunchDeskSnapshot = {
      calendar: LAUNCH_CALENDAR,
      news,
      fetchedAt: new Date().toISOString(),
      feedOk: news.length > 0,
      disclaimer:
        "Launch calendar mixes curated public events with open news RSS. Not Space-Track classified data, not official range control, not a prediction service. NOTAMs and national range notices are the authoritative flight-safety sources.",
    };
    cache = { at: now, snap };
    return snap;
  },
);
