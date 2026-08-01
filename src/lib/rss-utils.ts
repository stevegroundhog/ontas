/** Shared public RSS helpers — correct HTML entity decode (amp last). */

export function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/'/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&/g, "&");
}

export function stripTags(s: string): string {
  return decodeXml(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type ParsedRssItem = {
  title: string;
  link: string;
  publishedAt: string | null;
  summary: string;
};

export function parseRssItems(xml: string, limit = 12): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];
  const parts = xml.split(/<item[\s>]/i).slice(1);
  for (const part of parts) {
    if (items.length >= limit) break;
    const chunk = part.split(/<\/item>/i)[0] ?? part;
    const title = stripTags((chunk.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? "");
    if (!title) continue;
    const link = stripTags(
      (chunk.match(/<link[^>]*>([\s\S]*?)<\/link>/i) ?? [])[1] ??
        (chunk.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i) ?? [])[1] ??
        "",
    );
    const dateRaw = stripTags(
      (chunk.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) ?? [])[1] ?? "",
    );
    const desc = stripTags(
      (chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i) ?? [])[1] ?? "",
    );
    let publishedAt: string | null = null;
    if (dateRaw) {
      const d = new Date(dateRaw);
      if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString();
    }
    items.push({
      title,
      link: link.startsWith("http") ? link : "",
      publishedAt,
      summary: desc.slice(0, 320),
    });
  }
  return items;
}

export const ONTAS_UA =
  "Mozilla/5.0 (compatible; ONTAS/1.0; +https://github.com/stevegroundhog/ontas; educational)";
