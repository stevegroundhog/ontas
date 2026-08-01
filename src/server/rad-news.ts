import { createServerFn } from "@tanstack/react-start";

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

const UA =
  "Mozilla/5.0 (compatible; ONTAS/1.0; +https://github.com/stevegroundhog/ontas; educational)";

function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(s: string): string {
  return decodeXml(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseRss(xml: string, source: string, limit: number): RadNewsItem[] {
  const items: RadNewsItem[] = [];
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
      id: `${source}-${items.length}-${title.slice(0, 48)}`,
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

async function fetchFeed(url: string, source: string): Promise<RadNewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    return parseRss(await res.text(), source, 10);
  } catch {
    return [];
  }
}

export const fetchRadNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<RadNewsSnapshot> => {
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
    return {
      items,
      fetchedAt: new Date().toISOString(),
      feedOk: items.length > 0,
      disclaimer:
        "Open news mesh for nuclear security / radiological topics only. Headlines are not confirmed intelligence. Not a terrorism tip line.",
    };
  },
);
