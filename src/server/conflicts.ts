import { createServerFn } from "@tanstack/react-start";
import {
  ARMED_CONFLICTS,
  conflictById,
  type ArmedConflict,
} from "@/data/conflicts";

export type ConflictReport = {
  id: string;
  title: string;
  summary: string;
  link: string;
  publishedAt: string;
  source: string;
  sourceKind: "un" | "wire" | "bbc" | "other";
  conflictId: string;
  conflictName: string;
};

export type ConflictFeedResult = {
  conflictId: string | null;
  fetchedAt: string;
  reports: ConflictReport[];
  feedHealth: { name: string; ok: boolean; count: number }[];
  note: string;
};

function decodeXml(s: string): string {
  const amp = "&";
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(new RegExp(amp + "lt;", "g"), "<")
    .replace(new RegExp(amp + "gt;", "g"), ">")
    .replace(new RegExp(amp + "quot;", "g"), '"')
    .replace(new RegExp(amp + "#39;", "g"), "'")
    .replace(new RegExp(amp + "apos;", "g"), "'")
    .replace(new RegExp(amp + "nbsp;", "g"), " ")
    .replace(new RegExp(amp + "#(\\d+);", "g"), (_, n) =>
      String.fromCharCode(Number(n)),
    )
    .replace(new RegExp(amp + "amp;", "g"), amp);
}

function stripTags(s: string): string {
  return decodeXml(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml: string, max: number): {
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  source: string;
}[] {
  const out: {
    title: string;
    link: string;
    summary: string;
    publishedAt: string;
    source: string;
  }[] = [];
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  for (const block of blocks) {
    if (out.length >= max) break;
    const chunk = block.split(/<\/item>/i)[0] ?? "";
    let title = stripTags(chunk.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    if (!title) continue;
    let source = "Wire";
    const dash = title.lastIndexOf(" - ");
    if (dash > 12 && title.length - dash < 48) {
      source = title.slice(dash + 3).trim();
      title = title.slice(0, dash).trim();
    }
    const link = stripTags(chunk.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "");
    const desc = stripTags(
      chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "",
    );
    const pub =
      stripTags(chunk.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "") ||
      new Date().toISOString();
    const publishedAt = Number.isFinite(Date.parse(pub))
      ? new Date(pub).toISOString()
      : new Date().toISOString();
    out.push({
      title,
      link,
      summary: desc.slice(0, 400) || title,
      publishedAt,
      source,
    });
  }
  return out;
}

async function fetchText(url: string, timeoutMs = 12000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "ONTAS-Educational/1.0 (conflict reports aggregator)",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function matchConflict(text: string, c: ArmedConflict): boolean {
  const t = text.toLowerCase();
  return c.keywords.some((k) => t.includes(k.toLowerCase()));
}

function googleNewsUrl(q: string): string {
  const u = new URL("https://news.google.com/rss/search");
  u.searchParams.set("q", q);
  u.searchParams.set("hl", "en-US");
  u.searchParams.set("gl", "US");
  u.searchParams.set("ceid", "US:en");
  return u.toString();
}

const cache = new Map<string, { at: number; data: ConflictFeedResult }>();
const CACHE_MS = 90_000;

async function loadReportsForConflict(c: ArmedConflict): Promise<{
  reports: ConflictReport[];
  health: { name: string; ok: boolean; count: number }[];
}> {
  const health: { name: string; ok: boolean; count: number }[] = [];
  const reports: ConflictReport[] = [];
  const seen = new Set<string>();

  const push = (
    items: { title: string; link: string; summary: string; publishedAt: string; source: string }[],
    sourceKind: ConflictReport["sourceKind"],
    feedName: string,
  ) => {
    let n = 0;
    for (const it of items) {
      const key = it.title.toLowerCase().slice(0, 80);
      if (seen.has(key)) continue;
      seen.add(key);
      reports.push({
        id: `${c.id}-${sourceKind}-${n}-${it.publishedAt}`,
        title: it.title,
        summary: it.summary,
        link: it.link,
        publishedAt: it.publishedAt,
        source: it.source || feedName,
        sourceKind,
        conflictId: c.id,
        conflictName: c.shortName,
      });
      n++;
    }
    health.push({ name: feedName, ok: n > 0, count: n });
  };

  // Per-conflict Google News (primary realtime mesh)
  for (const q of c.newsQueries.slice(0, 2)) {
    const xml = await fetchText(googleNewsUrl(q));
    if (xml) push(parseRssItems(xml, 10), "wire", `Google News: ${q}`);
    else health.push({ name: `Google News: ${q}`, ok: false, count: 0 });
  }

  // UN Peace & Security — filter by keywords
  {
    const xml = await fetchText(
      "https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml",
    );
    if (xml) {
      const items = parseRssItems(xml, 40).filter((it) =>
        matchConflict(`${it.title} ${it.summary}`, c),
      );
      push(
        items.map((it) => ({ ...it, source: "UN News" })),
        "un",
        "UN Peace & Security",
      );
    } else {
      health.push({ name: "UN Peace & Security", ok: false, count: 0 });
    }
  }

  // BBC World — keyword filter
  {
    const xml = await fetchText("https://feeds.bbci.co.uk/news/world/rss.xml");
    if (xml) {
      const items = parseRssItems(xml, 50).filter((it) =>
        matchConflict(`${it.title} ${it.summary}`, c),
      );
      push(
        items.map((it) => ({ ...it, source: "BBC World" })),
        "bbc",
        "BBC World",
      );
    } else {
      health.push({ name: "BBC World", ok: false, count: 0 });
    }
  }

  reports.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return { reports: reports.slice(0, 40), health };
}

async function loadAllSnapshot(): Promise<ConflictFeedResult> {
  // Lightweight: UN + BBC only, tag each item to best-matching conflict
  const health: { name: string; ok: boolean; count: number }[] = [];
  const reports: ConflictReport[] = [];
  const seen = new Set<string>();

  const feeds: { url: string; kind: ConflictReport["sourceKind"]; name: string }[] = [
    {
      url: "https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml",
      kind: "un",
      name: "UN Peace & Security",
    },
    {
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
      kind: "bbc",
      name: "BBC World",
    },
    {
      url: googleNewsUrl("armed conflict war OR ceasefire OR Security Council"),
      kind: "wire",
      name: "Google News: armed conflict",
    },
  ];

  for (const f of feeds) {
    const xml = await fetchText(f.url);
    if (!xml) {
      health.push({ name: f.name, ok: false, count: 0 });
      continue;
    }
    const items = parseRssItems(xml, 30);
    let n = 0;
    for (const it of items) {
      const blob = `${it.title} ${it.summary}`.toLowerCase();
      const match =
        ARMED_CONFLICTS.find((c) => matchConflict(blob, c)) ?? null;
      if (!match) continue;
      const key = it.title.toLowerCase().slice(0, 80);
      if (seen.has(key)) continue;
      seen.add(key);
      reports.push({
        id: `all-${f.kind}-${n}-${it.publishedAt}`,
        title: it.title,
        summary: it.summary,
        link: it.link,
        publishedAt: it.publishedAt,
        source: it.source || f.name,
        sourceKind: f.kind,
        conflictId: match.id,
        conflictName: match.shortName,
      });
      n++;
    }
    health.push({ name: f.name, ok: n > 0 || items.length > 0, count: n });
  }

  reports.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    conflictId: null,
    fetchedAt: new Date().toISOString(),
    reports: reports.slice(0, 50),
    feedHealth: health,
    note: "Factual multi-source open reports. Not a government or propaganda channel. Cross-check primary sources.",
  };
}

export const fetchConflictReports = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    if (input == null || input === "") return { conflictId: null as string | null };
    if (typeof input === "string") return { conflictId: input };
    if (typeof input === "object" && input !== null && "conflictId" in input) {
      const id = (input as { conflictId?: string | null }).conflictId;
      return { conflictId: id ?? null };
    }
    return { conflictId: null as string | null };
  })
  .handler(async ({ data }) => {
    const conflictId = data.conflictId;
    const cacheKey = conflictId ?? "all";
    const now = Date.now();
    const hit = cache.get(cacheKey);
    if (hit && now - hit.at < CACHE_MS) return hit.data;

    if (!conflictId) {
      const result = await loadAllSnapshot();
      cache.set(cacheKey, { at: now, data: result });
      return result;
    }

    const c = conflictById(conflictId);
    if (!c) {
      return {
        conflictId,
        fetchedAt: new Date().toISOString(),
        reports: [],
        feedHealth: [],
        note: "Unknown conflict id",
      } satisfies ConflictFeedResult;
    }

    const { reports, health } = await loadReportsForConflict(c);
    const result: ConflictFeedResult = {
      conflictId: c.id,
      fetchedAt: new Date().toISOString(),
      reports,
      feedHealth: health,
      note: "Live open-source reports only (UN, BBC, Google News). Neutral aggregation — verify original articles.",
    };
    cache.set(cacheKey, { at: now, data: result });
    return result;
  });

export const listConflicts = createServerFn({ method: "GET" }).handler(async () => {
  return {
    conflicts: ARMED_CONFLICTS,
    fetchedAt: new Date().toISOString(),
    methodology:
      "Conflict list is a curated open-source registry (UCDP/UN-agenda style). Live reports pull from public RSS. Intensity labels are descriptive, not legal war declarations.",
  };
});
