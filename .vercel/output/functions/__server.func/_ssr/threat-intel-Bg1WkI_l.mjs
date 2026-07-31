import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { r as getOsintDefcon } from "./defcon-osint-IboRX7yo.mjs";
import { a as matchWatchZones, r as getLiveNuclearNewsData } from "./nuclear-news-ANqVRmP5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/threat-intel-Bg1WkI_l.js
function stripTags(s) {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;/g, "'").replace(/'/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&/g, "&").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function parseRss(xml, source, max = 12) {
	const items = [];
	const blocks = xml.split(/<item[\s>]/i).slice(1);
	for (const block of blocks) {
		const chunk = block.split(/<\/item>/i)[0] ?? "";
		const title = stripTags(chunk.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
		if (!title) continue;
		if (/^UN News/i.test(title) && source === "UN") continue;
		const link = stripTags(chunk.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "");
		const dateRaw = stripTags(chunk.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "");
		const desc = stripTags(chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "");
		const pub = dateRaw ? new Date(dateRaw) : /* @__PURE__ */ new Date();
		items.push({
			id: `${source}-${title.slice(0, 40)}-${pub.getTime()}`.replace(/\s+/g, "_"),
			title,
			link,
			publishedAt: Number.isNaN(pub.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : pub.toISOString(),
			source,
			summary: desc.slice(0, 280) || title
		});
		if (items.length >= max) break;
	}
	return items;
}
async function fetchUsgsSeismic() {
	try {
		const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", {
			headers: {
				Accept: "application/json",
				"User-Agent": "ONTAS-Educational/1.0"
			},
			signal: AbortSignal.timeout(12e3)
		});
		if (!res.ok) return {
			events: [],
			status: {
				id: "usgs",
				name: "USGS Earthquake GeoJSON (M2.5+ 24h)",
				status: "down",
				detail: `HTTP ${res.status}`,
				legal: "Public domain U.S. Geological Survey data"
			}
		};
		const events = (await res.json()).features.map((f) => {
			const [lon, lat, depth] = f.geometry.coordinates;
			const hits = matchWatchZones(lat, lon).map((h) => ({
				zoneId: h.zone.id,
				zoneName: h.zone.name,
				kind: h.zone.kind,
				distanceKm: h.distanceKm
			}));
			let nuclearRelevance = "background";
			if (hits.some((h) => h.kind === "test-site" && h.distanceKm < 50)) nuclearRelevance = "elevated";
			else if (hits.length > 0) nuclearRelevance = "watch";
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
				nuclearRelevance
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
				legal: "Public domain U.S. Geological Survey data"
			}
		};
	} catch (e) {
		return {
			events: [],
			status: {
				id: "usgs",
				name: "USGS Earthquake GeoJSON (M2.5+ 24h)",
				status: "down",
				detail: e instanceof Error ? e.message : "fetch failed",
				legal: "Public domain U.S. Geological Survey feed"
			}
		};
	}
}
async function fetchOfficialRss(url, source, name, legal) {
	try {
		const res = await fetch(url, {
			headers: {
				Accept: "application/rss+xml, application/xml, text/xml, */*",
				"User-Agent": "Mozilla/5.0 (compatible; ONTAS-Educational/1.0)"
			},
			signal: AbortSignal.timeout(12e3)
		});
		if (!res.ok) return {
			items: [],
			status: {
				id: source.toLowerCase(),
				name,
				status: "down",
				detail: `HTTP ${res.status}`,
				legal
			}
		};
		const items = parseRss(await res.text(), source, 12);
		const filtered = source === "DoD" ? items.filter((i) => /nuclear|missile|strategic|deterr|ICBM|SSBN|arsenal|strike|korea|china|russia|nato|trident|minuteman|hypersonic|arms|force|gaza|ukraine|iran/i.test(`${i.title} ${i.summary}`)) : items;
		return {
			items: filtered.length ? filtered : items.slice(0, 8),
			status: {
				id: source.toLowerCase(),
				name,
				status: items.length ? "ok" : "degraded",
				detail: `${filtered.length || items.length} items`,
				legal
			}
		};
	} catch (e) {
		return {
			items: [],
			status: {
				id: source.toLowerCase(),
				name,
				status: "down",
				detail: e instanceof Error ? e.message : "fetch failed",
				legal
			}
		};
	}
}
var cache = null;
var CACHE_MS = 6e4;
var fetchThreatIntel_createServerFn_handler = createServerRpc({
	id: "115e0feb63da68db7ab6bd65464677985cdf816242d461bdfd65b7f05678c06b",
	name: "fetchThreatIntel",
	filename: "src/server/threat-intel.ts"
}, (opts) => fetchThreatIntel.__executeServer(opts));
var fetchThreatIntel = createServerFn({ method: "GET" }).handler(fetchThreatIntel_createServerFn_handler, async () => {
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS) return {
		...cache.snap,
		cached: true
	};
	const [newsPack, usgs, dod, iaea, un, osint] = await Promise.all([
		getLiveNuclearNewsData().catch(() => null),
		fetchUsgsSeismic(),
		fetchOfficialRss("https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=15", "DoD", "U.S. Department of Defense news RSS", "Public DoD news releases (unclassified)"),
		fetchOfficialRss("https://www.iaea.org/feeds/topnews", "IAEA", "IAEA Top News RSS", "Public International Atomic Energy Agency feed"),
		fetchOfficialRss("https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml", "UN", "UN Peace & Security RSS", "United Nations News public RSS"),
		getOsintDefcon().catch(() => null)
	]);
	const news = newsPack?.items ?? [];
	const sources = [
		{
			id: "news-mesh",
			name: "Multi-region nuclear news RSS mesh",
			status: news.length ? "ok" : "degraded",
			detail: newsPack ? `${news.length} items · ${newsPack.feedCount} feeds` : "unavailable",
			legal: "Public Google News search RSS — educational aggregation"
		},
		usgs.status,
		dod.status,
		iaea.status,
		un.status,
		{
			id: "defcon-osint",
			name: "Unofficial DEFCON OSINT",
			status: osint ? osint.source.includes("fallback") ? "degraded" : "ok" : "down",
			detail: osint ? `D${osint.level} ${osint.label} · ${osint.source}` : "unavailable",
			legal: "Independent open estimate (defconlevel.com) — NOT official U.S. DEFCON"
		},
		{
			id: "ais-fi",
			name: "Open AIS (digitraffic.fi Baltic)",
			status: "ok",
			detail: "Surface contacts via maritime module (gzip open AIS)",
			legal: "Open data — Finnish Transport Infrastructure Agency"
		},
		{
			id: "defcon-official",
			name: "Official U.S. DEFCON",
			status: "degraded",
			detail: "CLASSIFIED — no lawful public real-time feed",
			legal: "Not published; public life-safety path is IPAWS / EAS / WEA"
		},
		{
			id: "ssbn",
			name: "SSBN real-time tracks",
			status: "degraded",
			detail: "No public AIS while submerged — educational patrol estimates only",
			legal: "Unclassified open-source modeling only"
		}
	];
	const snap = {
		fetchedAt: new Date(now).toISOString(),
		news,
		newsFeedCount: newsPack?.feedCount ?? 0,
		seismic: usgs.events,
		seismicWatchCount: usgs.events.filter((e) => e.nuclearRelevance !== "background").length,
		official: [
			...un.items,
			...dod.items,
			...iaea.items
		].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
		sources,
		osintDefconLevel: osint?.level,
		disclaimer: "ONTAS fuses only public/unclassified open data and clearly labeled estimates. It is NOT NORAD, USSTRATCOM, FEMA, or any official warning authority. Official U.S. DEFCON is classified. Life-safety nuclear attack warnings in the U.S. are issued via FEMA IPAWS / EAS / Wireless Emergency Alerts."
	};
	cache = {
		at: now,
		snap
	};
	return {
		...snap,
		cached: false
	};
});
//#endregion
export { fetchThreatIntel_createServerFn_handler };
