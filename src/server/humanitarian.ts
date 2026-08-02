import { createServerFn } from "@tanstack/react-start";
import { ONTAS_UA, parseRssItems } from "@/lib/rss-utils";

export type HumanitarianItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  summary: string;
};

export type HumanitarianSnapshot = {
  items: HumanitarianItem[];
  fetchedAt: string;
  feedOk: boolean;
  disclaimer: string;
};

let cache: { at: number; snap: HumanitarianSnapshot } | null = null;
const TTL = 120_000;

async function fetchFeed(url: string, source: string): Promise<HumanitarianItem[]> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": ONTAS_UA,
        Accept: "application/rss+xml, application/xml, text/xml, application/json, */*",
      },
      signal: AbortSignal.timeout(14000),
    });
    if (!res.ok) return [];
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("json")) {
      // ReliefWeb API v2 list shape
      const data = (await res.json()) as {
        data?: { id: string; fields?: { title?: string; url?: string; date?: { created?: string }; body?: string } }[];
      };
      return (data.data ?? []).slice(0, 12).map((row, i) => ({
        id: `rw-${row.id ?? i}`,
        title: row.fields?.title ?? "Untitled",
        link: row.fields?.url ?? `https://reliefweb.int`,
        source,
        publishedAt: row.fields?.date?.created ?? null,
        summary: (row.fields?.body ?? "").replace(/<[^>]+>/g, " ").slice(0, 220),
      }));
    }
    const xml = await res.text();
    return parseRssItems(xml, 12).map((it, i) => ({
      id: `${source}-${i}-${it.title.slice(0, 40)}`,
      title: it.title,
      link: it.link || "https://reliefweb.int",
      source,
      publishedAt: it.publishedAt,
      summary: it.summary,
    }));
  } catch {
    return [];
  }
}

export const fetchHumanitarian = createServerFn({ method: "GET" }).handler(
  async (): Promise<HumanitarianSnapshot> => {
    const now = Date.now();
    if (cache && now - cache.at < TTL) return cache.snap;

    const feeds = await Promise.all([
      fetchFeed(
        "https://api.reliefweb.int/v1/reports?appname=ontas-edu&limit=12&profile=list&sort[]=date:desc&filter[field]=theme&filter[value]=Conflict",
        "ReliefWeb",
      ),
      fetchFeed(
        "https://news.un.org/feed/subscribe/en/news/topic/humanitarian-aid/feed/rss.xml",
        "UN Humanitarian",
      ),
      fetchFeed(
        "https://news.google.com/rss/search?q=humanitarian+crisis+OR+OHCHR+casualties&hl=en-US&gl=US&ceid=US:en",
        "GNews:humanitarian",
      ),
    ]);

    const seen = new Set<string>();
    const items: HumanitarianItem[] = [];
    for (const batch of feeds) {
      for (const it of batch) {
        const k = it.title.toLowerCase().slice(0, 70);
        if (seen.has(k)) continue;
        seen.add(k);
        items.push(it);
        if (items.length >= 24) break;
      }
      if (items.length >= 24) break;
    }

    const snap: HumanitarianSnapshot = {
      items,
      fetchedAt: new Date().toISOString(),
      feedOk: items.length > 0,
      disclaimer:
        "Humanitarian headlines from public ReliefWeb / UN / open news. Not a casualty ledger. Fatality bands on conflict cards remain separately sourced.",
    };
    cache = { at: now, snap };
    return snap;
  },
);
