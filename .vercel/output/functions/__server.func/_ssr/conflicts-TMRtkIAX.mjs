import { t as createServerFn } from "./ssr.mjs";
import { i as conflictById, t as ARMED_CONFLICTS } from "./conflicts-D5AgD6d3.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conflicts-TMRtkIAX.js
function decodeXml(s) {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/* @__PURE__ */ new RegExp("&lt;", "g"), "<").replace(/* @__PURE__ */ new RegExp("&gt;", "g"), ">").replace(/* @__PURE__ */ new RegExp("&quot;", "g"), "\"").replace(/* @__PURE__ */ new RegExp("&#39;", "g"), "'").replace(/* @__PURE__ */ new RegExp("&apos;", "g"), "'").replace(/* @__PURE__ */ new RegExp("&nbsp;", "g"), " ").replace(/* @__PURE__ */ new RegExp("&#(\\d+);", "g"), (_, n) => String.fromCharCode(Number(n))).replace(/* @__PURE__ */ new RegExp("&amp;", "g"), "&");
}
function stripTags(s) {
	return decodeXml(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function parseRssItems(xml, max) {
	const out = [];
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
		const desc = stripTags(chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "");
		const pub = stripTags(chunk.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "") || (/* @__PURE__ */ new Date()).toISOString();
		const publishedAt = Number.isFinite(Date.parse(pub)) ? new Date(pub).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
		out.push({
			title,
			link,
			summary: desc.slice(0, 400) || title,
			publishedAt,
			source
		});
	}
	return out;
}
async function fetchText(url, timeoutMs = 12e3) {
	try {
		const res = await fetch(url, {
			headers: {
				Accept: "application/rss+xml, application/xml, text/xml, */*",
				"User-Agent": "ONTAS-Educational/1.0 (conflict reports aggregator)"
			},
			signal: AbortSignal.timeout(timeoutMs)
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	}
}
function matchConflict(text, c) {
	const t = text.toLowerCase();
	return c.keywords.some((k) => t.includes(k.toLowerCase()));
}
function googleNewsUrl(q) {
	const u = new URL("https://news.google.com/rss/search");
	u.searchParams.set("q", q);
	u.searchParams.set("hl", "en-US");
	u.searchParams.set("gl", "US");
	u.searchParams.set("ceid", "US:en");
	return u.toString();
}
var cache = /* @__PURE__ */ new Map();
var CACHE_MS = 9e4;
async function loadReportsForConflict(c) {
	const health = [];
	const reports = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (items, sourceKind, feedName) => {
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
				conflictName: c.shortName
			});
			n++;
		}
		health.push({
			name: feedName,
			ok: n > 0,
			count: n
		});
	};
	for (const q of c.newsQueries.slice(0, 2)) {
		const xml = await fetchText(googleNewsUrl(q));
		if (xml) push(parseRssItems(xml, 10), "wire", `Google News: ${q}`);
		else health.push({
			name: `Google News: ${q}`,
			ok: false,
			count: 0
		});
	}
	{
		const xml = await fetchText("https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml");
		if (xml) push(parseRssItems(xml, 40).filter((it) => matchConflict(`${it.title} ${it.summary}`, c)).map((it) => ({
			...it,
			source: "UN News"
		})), "un", "UN Peace & Security");
		else health.push({
			name: "UN Peace & Security",
			ok: false,
			count: 0
		});
	}
	{
		const xml = await fetchText("https://feeds.bbci.co.uk/news/world/rss.xml");
		if (xml) push(parseRssItems(xml, 50).filter((it) => matchConflict(`${it.title} ${it.summary}`, c)).map((it) => ({
			...it,
			source: "BBC World"
		})), "bbc", "BBC World");
		else health.push({
			name: "BBC World",
			ok: false,
			count: 0
		});
	}
	reports.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
	return {
		reports: reports.slice(0, 40),
		health
	};
}
async function loadAllSnapshot() {
	const health = [];
	const reports = [];
	const seen = /* @__PURE__ */ new Set();
	const feeds = [
		{
			url: "https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml",
			kind: "un",
			name: "UN Peace & Security"
		},
		{
			url: "https://feeds.bbci.co.uk/news/world/rss.xml",
			kind: "bbc",
			name: "BBC World"
		},
		{
			url: googleNewsUrl("armed conflict war OR ceasefire OR Security Council"),
			kind: "wire",
			name: "Google News: armed conflict"
		}
	];
	for (const f of feeds) {
		const xml = await fetchText(f.url);
		if (!xml) {
			health.push({
				name: f.name,
				ok: false,
				count: 0
			});
			continue;
		}
		const items = parseRssItems(xml, 30);
		let n = 0;
		for (const it of items) {
			const blob = `${it.title} ${it.summary}`.toLowerCase();
			const match = ARMED_CONFLICTS.find((c) => matchConflict(blob, c)) ?? null;
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
				conflictName: match.shortName
			});
			n++;
		}
		health.push({
			name: f.name,
			ok: n > 0 || items.length > 0,
			count: n
		});
	}
	reports.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
	return {
		conflictId: null,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		reports: reports.slice(0, 50),
		feedHealth: health,
		note: "Factual multi-source open reports. Not a government or propaganda channel. Cross-check primary sources."
	};
}
var fetchConflictReports_createServerFn_handler = createServerRpc({
	id: "f2fe828d4c66f01bbe367d9c64cdd9ef8530b10aff6e51c515de9bb07e845376",
	name: "fetchConflictReports",
	filename: "src/server/conflicts.ts"
}, (opts) => fetchConflictReports.__executeServer(opts));
var fetchConflictReports = createServerFn({ method: "GET" }).validator((input) => {
	if (input == null || input === "") return { conflictId: null };
	if (typeof input === "string") return { conflictId: input };
	if (typeof input === "object" && input !== null && "conflictId" in input) return { conflictId: input.conflictId ?? null };
	return { conflictId: null };
}).handler(fetchConflictReports_createServerFn_handler, async ({ data }) => {
	const conflictId = data.conflictId;
	const cacheKey = conflictId ?? "all";
	const now = Date.now();
	const hit = cache.get(cacheKey);
	if (hit && now - hit.at < CACHE_MS) return hit.data;
	if (!conflictId) {
		const result = await loadAllSnapshot();
		cache.set(cacheKey, {
			at: now,
			data: result
		});
		return result;
	}
	const c = conflictById(conflictId);
	if (!c) return {
		conflictId,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		reports: [],
		feedHealth: [],
		note: "Unknown conflict id"
	};
	const { reports, health } = await loadReportsForConflict(c);
	const result = {
		conflictId: c.id,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		reports,
		feedHealth: health,
		note: "Live open-source reports only (UN, BBC, Google News). Neutral aggregation — verify original articles."
	};
	cache.set(cacheKey, {
		at: now,
		data: result
	});
	return result;
});
var listConflicts_createServerFn_handler = createServerRpc({
	id: "e6b99e3c8e70bd108dc25751bf1920a2b7624c113f75503774aeeaf3913f4b50",
	name: "listConflicts",
	filename: "src/server/conflicts.ts"
}, (opts) => listConflicts.__executeServer(opts));
var listConflicts = createServerFn({ method: "GET" }).handler(listConflicts_createServerFn_handler, async () => {
	return {
		conflicts: ARMED_CONFLICTS,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		methodology: "Conflict list is a curated open-source registry (UCDP/UN-agenda style). Live reports pull from public RSS. Intensity labels are descriptive, not legal war declarations."
	};
});
//#endregion
export { fetchConflictReports_createServerFn_handler, listConflicts_createServerFn_handler };
