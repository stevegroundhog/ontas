import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nuclear-news-4hEAoPN1.js
/** Multi-country nuclear-threat search feeds (Google News regional RSS) */
var FEEDS = [
	{
		region: "US",
		label: "United States",
		url: "https://news.google.com/rss/search?q=%22nuclear+weapon%22+OR+ICBM+OR+%22ballistic+missile%22+OR+SLBM+OR+%22nuclear+arsenal%22+OR+%22New+START%22&hl=en-US&gl=US&ceid=US:en"
	},
	{
		region: "GB",
		label: "United Kingdom",
		url: "https://news.google.com/rss/search?q=%22nuclear+weapon%22+OR+Trident+OR+ICBM+OR+%22ballistic+missile%22&hl=en-GB&gl=GB&ceid=GB:en"
	},
	{
		region: "FR",
		label: "France",
		url: "https://news.google.com/rss/search?q=arme+nucl%C3%A9aire+OR+dissuasion+OR+M51+OR+missile+balistique&hl=fr&gl=FR&ceid=FR:fr"
	},
	{
		region: "DE",
		label: "Germany",
		url: "https://news.google.com/rss/search?q=Atomwaffe+OR+ICBM+OR+Nukleare+OR+%22ballistische+Rakete%22&hl=de&gl=DE&ceid=DE:de"
	},
	{
		region: "RU",
		label: "Russia",
		url: "https://news.google.com/rss/search?q=%D1%8F%D0%B4%D0%B5%D1%80%D0%BD%D0%BE%D0%B5+%D0%BE%D1%80%D1%83%D0%B6%D0%B8%D0%B5+OR+ICBM+OR+%D0%A1%D0%B0%D1%80%D0%BC%D0%B0%D1%82+OR+%D0%B1%D0%B0%D0%BB%D0%BB%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F+%D1%80%D0%B0%D0%BA%D0%B5%D1%82%D0%B0&hl=ru&gl=RU&ceid=RU:ru"
	},
	{
		region: "CN",
		label: "China",
		url: "https://news.google.com/rss/search?q=%E6%A0%B8%E6%AD%A6%E5%99%A8+OR+ICBM+OR+%E5%AF%BC%E5%BC%B9+OR+DF-41+OR+JL-3&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
	},
	{
		region: "JP",
		label: "Japan",
		url: "https://news.google.com/rss/search?q=%E6%A0%B8%E5%85%B5%E5%99%A8+OR+ICBM+OR+%E5%BC%BE%E9%81%93%E3%83%9F%E3%82%B5%E3%82%A4%E3%83%AB+OR+%E5%8C%97%E6%9C%9D%E9%AE%AE&hl=ja&gl=JP&ceid=JP:ja"
	},
	{
		region: "KR",
		label: "South Korea",
		url: "https://news.google.com/rss/search?q=%ED%95%B5%EB%AC%B4%EA%B8%B0+OR+ICBM+OR+%EB%B0%9C%EC%82%AC%EC%B2%B4%EB%AF%B8%EC%82%AC%EC%9D%BC+OR+%EB%B6%81%ED%95%9C&hl=ko&gl=KR&ceid=KR:ko"
	},
	{
		region: "IN",
		label: "India",
		url: "https://news.google.com/rss/search?q=%22nuclear+weapon%22+OR+Agni+OR+ICBM+OR+%22ballistic+missile%22+OR+SSBN&hl=en-IN&gl=IN&ceid=IN:en"
	},
	{
		region: "PK",
		label: "Pakistan",
		url: "https://news.google.com/rss/search?q=nuclear+OR+Shaheen+OR+%22ballistic+missile%22+OR+Nasr&hl=en-PK&gl=PK&ceid=PK:en"
	},
	{
		region: "IL",
		label: "Israel",
		url: "https://news.google.com/rss/search?q=nuclear+OR+Jericho+OR+%22ballistic+missile%22+OR+Dimona&hl=en&gl=IL&ceid=IL:en"
	},
	{
		region: "UA",
		label: "Ukraine",
		url: "https://news.google.com/rss/search?q=%D1%8F%D0%B4%D0%B5%D1%80%D0%BD%D0%B0+OR+nuclear+OR+%D1%80%D0%B0%D0%BA%D0%B5%D1%82%D0%B0+OR+ICBM&hl=uk&gl=UA&ceid=UA:uk"
	},
	{
		region: "AU",
		label: "Australia",
		url: "https://news.google.com/rss/search?q=%22nuclear+weapon%22+OR+ICBM+OR+AUKUS+OR+%22ballistic+missile%22&hl=en-AU&gl=AU&ceid=AU:en"
	},
	{
		region: "BR",
		label: "Brazil",
		url: "https://news.google.com/rss/search?q=arma+nuclear+OR+ICBM+OR+m%C3%ADssil+bal%C3%ADstico&hl=pt-BR&gl=BR&ceid=BR:pt-419"
	},
	{
		region: "IR",
		label: "Iran",
		url: "https://news.google.com/rss/search?q=Iran+nuclear+OR+missile+OR+ICBM+OR+enrichment&hl=en-US&gl=US&ceid=US:en"
	},
	{
		region: "WW",
		label: "Global",
		url: "https://news.google.com/rss/search?q=%22nuclear+weapons%22+OR+%22intercontinental+ballistic%22+OR+%22strategic+forces%22&hl=en&gl=US&ceid=US:en"
	}
];
var WEAPONS_HINT = /nuclear\s*weapon|icbm|slbm|ballistic\s*missile|warhead|sarmat|minuteman|trident|df-41|hwasong|agni|shaheen|new\s*start|nuclear\s*arsenal|nuclear\s*test|hypersonic|dissuasion|atomwaffe|ядерн|核武|핵무|missile\s*test|strategic\s*forces|ssbn|m51|jericho|nasr|aukus|proliferation|deterrence|thermonuclear|plutonium|enriched\s*uranium|核兵|导弹/i;
var CIVILIAN_NOISE = /nuclear[- ]powered\s+ai|ai\s+factory|small\s+modular\s+reactor|smr\b|nuclear\s+energy\s+stock|uranium\s+mining\s+stock|nuclear\s+medicine|pet\s+scan/i;
var REGION_TO_ACTORS = {
	US: ["us"],
	GB: ["uk"],
	FR: ["fr"],
	DE: [],
	RU: ["ru"],
	CN: ["cn"],
	JP: [
		"kp",
		"cn",
		"us"
	],
	KR: ["kp", "us"],
	IN: ["in"],
	PK: ["pk"],
	IL: ["il"],
	UA: ["ru", "us"],
	AU: ["us", "uk"],
	BR: [],
	IR: [],
	WW: []
};
function decodeXml(s) {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, "&");
}
function stripTags(s) {
	return decodeXml(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function extractSourceFromTitle(title) {
	const idx = title.lastIndexOf(" - ");
	if (idx > 12) return {
		title: title.slice(0, idx).trim(),
		source: title.slice(idx + 3).trim()
	};
	return {
		title,
		source: "Wire"
	};
}
function scoreSeverity(title, summary) {
	const t = `${title} ${summary}`;
	if (/launch|test[- ]fire|explosion|strike|attack|war\b|defcon|alert/i.test(t)) return "high";
	if (/treaty|new start|arms control|expire|suspen/i.test(t)) return "critical";
	if (/moderniz|deploy|arsenal|icbm|slbm|warhead|sarmat|minuteman/i.test(t)) return "elevated";
	return "info";
}
function categorize(title) {
	const t = title.toLowerCase();
	if (/test|launch|fired|flight/.test(t)) return "test";
	if (/treaty|start|npt|ctbt|arms control/.test(t)) return "treaty";
	if (/exercise|drill|patrol/.test(t)) return "exercise";
	if (/deploy|modern|arsenal|posture|stockpile/.test(t)) return "posture";
	return "analysis";
}
function makeId(region, title, publishedAt) {
	let h = 0;
	const s = `${region}|${title}|${publishedAt}`;
	for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	return `${region}-${(h >>> 0).toString(36)}`;
}
function parseRssItems(xml, feed) {
	const items = [];
	const blocks = xml.split(/<item[\s>]/i).slice(1);
	for (const block of blocks) {
		const chunk = block.split(/<\/item>/i)[0] ?? "";
		const titleM = chunk.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
		const linkM = chunk.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
		const dateM = chunk.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
		const descM = chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
		const sourceM = chunk.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
		if (!titleM) continue;
		const rawTitle = stripTags(titleM[1] ?? "");
		if (!rawTitle) continue;
		const { title, source: titleSource } = extractSourceFromTitle(rawTitle);
		const summary = stripTags(descM?.[1] ?? "").slice(0, 420);
		const hay = `${title} ${summary}`;
		if (CIVILIAN_NOISE.test(hay) && !WEAPONS_HINT.test(hay)) continue;
		if (!WEAPONS_HINT.test(hay) && feed.region !== "WW") {
			if (!/nuclear|missile|ракет|核|핵|atome|atom|missile|warhead/i.test(hay)) continue;
		}
		const link = stripTags(linkM?.[1] ?? "").trim();
		const pub = dateM?.[1] ? new Date(stripTags(dateM[1])) : /* @__PURE__ */ new Date();
		const publishedAt = Number.isNaN(pub.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : pub.toISOString();
		const source = stripTags(sourceM?.[1] ?? "") || titleSource || feed.label;
		items.push({
			id: makeId(feed.region, title, publishedAt),
			title,
			summary: summary || title,
			link,
			publishedAt,
			source,
			region: feed.region,
			regionLabel: feed.label,
			severity: scoreSeverity(title, summary),
			actors: REGION_TO_ACTORS[feed.region] ?? [],
			category: categorize(title)
		});
	}
	return items;
}
async function fetchFeed(feed) {
	try {
		const res = await fetch(feed.url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; ONTAS-Educational/1.0; +https://x.ai)",
				Accept: "application/rss+xml, application/xml, text/xml, */*"
			},
			signal: AbortSignal.timeout(12e3)
		});
		if (!res.ok) return [];
		return parseRssItems(await res.text(), feed).slice(0, 12);
	} catch {
		return [];
	}
}
var cache = null;
var CACHE_MS = 9e4;
/** Shared core for server modules + server fn */
async function getLiveNuclearNewsData() {
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS) return {
		items: cache.items,
		fetchedAt: new Date(cache.at).toISOString(),
		cached: true,
		feedCount: FEEDS.length,
		source: "live-rss"
	};
	const merged = (await Promise.all(FEEDS.map((f) => fetchFeed(f)))).flat();
	const seen = /* @__PURE__ */ new Set();
	const items = [];
	for (const it of merged) {
		const key = it.title.toLowerCase().replace(/[^a-z0-9\u0400-\u04ff\u4e00-\u9fff]+/g, "").slice(0, 80);
		if (seen.has(key)) continue;
		seen.add(key);
		items.push(it);
	}
	items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
	const top = items.slice(0, 80);
	cache = {
		at: now,
		items: top
	};
	return {
		items: top,
		fetchedAt: new Date(now).toISOString(),
		cached: false,
		feedCount: FEEDS.length,
		source: "live-rss"
	};
}
var fetchLiveNuclearNews_createServerFn_handler = createServerRpc({
	id: "c162f60f5fbb2c3d1caf0b1877a4c0a56e95b4c87d22f1436d0ef8be65c98568",
	name: "fetchLiveNuclearNews",
	filename: "src/server/nuclear-news.ts"
}, (opts) => fetchLiveNuclearNews.__executeServer(opts));
var fetchLiveNuclearNews = createServerFn({ method: "GET" }).handler(fetchLiveNuclearNews_createServerFn_handler, async () => {
	return getLiveNuclearNewsData();
});
//#endregion
export { fetchLiveNuclearNews_createServerFn_handler };
