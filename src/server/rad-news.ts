import { createServerFn } from "@tanstack/react-start";
import { ONTAS_UA, parseRssItems } from "@/lib/rss-utils";

export type RadNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
};

export type RadNewsSnapshot = {
  items: RadNewsItem[];
  fetchedAt: string;
  feedOk: boolean;
  disclaimer: string;
};

let cache: { at: number; snap: RadNewsSnapshot } | null = null;
const TTL = 120_000;

async function fetchFeed(url: string, source: string): Promise<RadNewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": ONTAS_UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    return parseRssItems(await res.text(), 10).map((it, i) => ({
      id: `${source}-${i}-${it.title.slice(0, 48)}`,
      title: it.title,
      link: it.link || `https://news.google.com/search?q=${encodeURIComponent(it.title)}`,
      source,
      publishedAt: it.publishedAt,
    }));
  } catch {
    return [];
  }
}

export const fetchRadNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<RadNewsSnapshot> => {
    const now = Date.now();
    if (cache && now - cache.at < TTL) return cache.snap;

    const queries = [
      "nuclear security IAEA",
      "radiological incident OR dirty bomb",
      "nuclear smuggling OR radioactive source theft",
      "nuclear terrorism threat",
    ];
    const batches = await Promise.all(
      queries.map((q) =>
        fetchFeed(
          `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`,
          `GNews:${q.slice(0, 22)}`,
        ),
      ),
    );
    const seen = new Set<string>();
    const items: RadNewsItem[] = [];
    for (const batch of batches) {
      for (const it of batch) {
        const k = it.title.toLowerCase().slice(0, 70);
        if (seen.has(k)) continue;
        seen.add(k);
        items.push(it);
        if (items.length >= 20) break;
      }
      if (items.length >= 20) break;
    }
    const snap: RadNewsSnapshot = {
      items,
      fetchedAt: new Date().toISOString(),
      feedOk: items.length > 0,
      disclaimer:
        "Open news mesh for nuclear security / radiological topics only. Headlines are not confirmed intelligence. Not a terrorism tip line.",
    };
    cache = { at: now, snap };
    return snap;
  },
);
