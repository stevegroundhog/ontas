import { createServerFn } from "@tanstack/react-start";
import { LAUNCH_CALENDAR, type LaunchEvent } from "@/data/launches";

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

const UA =
  "Mozilla/5.0 (compatible; ONTAS/1.0; +https://github.com/stevegroundhog/ontas; educational)";

function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/'/g, "'");
}

function stripTags(s: string): string {
  return decodeXml(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseRssSafe(xml: string, source: string, limit: number): LaunchNewsItem[] {
  const items: LaunchNewsItem[] = [];
  const parts = xml.split(/<item[\s>]/i).slice(1);
  for (const part of parts) {
    if (items.length >= limit) break;
    const title = stripTags((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? "");
    const link = stripTags(
      (part.match(/<link[^>]*>([\s\S]*?)<\/link>/i) ?? [])[1] ??
        (part.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i) ?? [])[1] ??
        "",
    );
    const pub =
      stripTags((part.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) ?? [])[1] ?? "") || null;
    if (!title) continue;
    items.push({
      id: `${source}-${items.length}-${title.slice(0, 40)}`,
      title,
      link: link.startsWith("http")
        ? link
        : `https://news.google.com/search?q=${encodeURIComponent(title)}`,
      source,
      publishedAt: pub,
    });
  }
  return items;
}

async function fetchFeed(url: string, source: string): Promise<LaunchNewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssSafe(xml, source, 12);
  } catch {
    return [];
  }
}

export const fetchLaunchDesk = createServerFn({ method: "GET" }).handler(
  async (): Promise<LaunchDeskSnapshot> => {
    const queries = [
      "missile test launch",
      "ICBM test",
      "North Korea missile",
      "space launch schedule",
    ];
    const urls = queries.map(
      (q) =>
        `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`,
    );

    const results = await Promise.all(
      urls.map((u, i) => fetchFeed(u, `GNews:${queries[i]!.slice(0, 18)}`)),
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

    return {
      calendar: LAUNCH_CALENDAR,
      news,
      fetchedAt: new Date().toISOString(),
      feedOk: news.length > 0,
      disclaimer:
        "Launch calendar mixes curated public events with open news RSS. Not Space-Track classified data, not official range control, not a prediction service. NOTAMs and national range notices are the authoritative flight-safety sources.",
    };
  },
);
