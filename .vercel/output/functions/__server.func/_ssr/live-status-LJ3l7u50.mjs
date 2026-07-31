import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { r as getOsintDefcon } from "./defcon-osint-IboRX7yo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-status-LJ3l7u50.js
async function probe(id, name, category, legal, classification, url, fn) {
	const t0 = Date.now();
	try {
		const r = await fn();
		return {
			id,
			name,
			category,
			status: r.ok ? r.degraded ? "degraded" : "ok" : "down",
			detail: r.detail,
			legal,
			classification,
			url,
			latencyMs: Date.now() - t0
		};
	} catch (e) {
		return {
			id,
			name,
			category,
			status: "down",
			detail: e instanceof Error ? e.message : "error",
			legal,
			classification,
			url,
			latencyMs: Date.now() - t0
		};
	}
}
async function getLiveStatus() {
	const sources = await Promise.all([
		probe("usgs", "USGS Earthquake GeoJSON (M2.5+ 24h)", "sensor", "U.S. Geological Survey — public domain", "public-unclassified", "https://earthquake.usgs.gov/", async () => {
			const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", {
				headers: {
					Accept: "application/json",
					"User-Agent": "ONTAS-Educational/1.0"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			return {
				ok: true,
				detail: `${(await res.json()).features?.length ?? 0} events (24h)`
			};
		}),
		probe("iaea", "IAEA Top News RSS", "official", "International Atomic Energy Agency public feed", "public-unclassified", "https://www.iaea.org/", async () => {
			const res = await fetch("https://www.iaea.org/feeds/topnews", {
				headers: {
					Accept: "application/rss+xml, application/xml",
					"User-Agent": "ONTAS-Educational/1.0"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const n = ((await res.text()).match(/<item/gi) || []).length;
			return {
				ok: n > 0,
				detail: `${n} items`
			};
		}),
		probe("dod", "U.S. DoD news RSS", "official", "Public DoD news releases (unclassified)", "public-unclassified", "https://www.defense.gov/", async () => {
			const res = await fetch("https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10", {
				headers: {
					Accept: "application/rss+xml, application/xml",
					"User-Agent": "Mozilla/5.0 (compatible; ONTAS/1.0)"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const n = ((await res.text()).match(/<item/gi) || []).length;
			return {
				ok: n > 0,
				detail: `${n} items`
			};
		}),
		probe("un", "UN Peace & Security RSS", "news", "United Nations News — public RSS", "public-unclassified", "https://news.un.org/", async () => {
			const res = await fetch("https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml", {
				headers: {
					Accept: "application/rss+xml",
					"User-Agent": "ONTAS-Educational/1.0"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const n = ((await res.text()).match(/<item/gi) || []).length;
			return {
				ok: n > 0,
				detail: `${n} items`
			};
		}),
		probe("bbc", "BBC World RSS", "news", "BBC public RSS (terms apply for display of headlines)", "public-unclassified", "https://www.bbc.com/news", async () => {
			const res = await fetch("https://feeds.bbci.co.uk/news/world/rss.xml", {
				headers: {
					Accept: "application/rss+xml",
					"User-Agent": "ONTAS-Educational/1.0"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const n = ((await res.text()).match(/<item/gi) || []).length;
			return {
				ok: n > 0,
				detail: `${n} items`
			};
		}),
		probe("gnews", "Google News search RSS (nuclear/conflict)", "news", "Public news search RSS for personal/educational aggregation", "public-unclassified", "https://news.google.com/", async () => {
			const res = await fetch("https://news.google.com/rss/search?q=ICBM%20OR%20%22nuclear%20weapon%22&hl=en-US&gl=US&ceid=US:en", {
				headers: {
					Accept: "application/rss+xml",
					"User-Agent": "Mozilla/5.0 (compatible; ONTAS-Educational/1.0)"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const n = ((await res.text()).match(/<item/gi) || []).length;
			return {
				ok: n > 0,
				detail: `${n} headlines`,
				degraded: n < 5
			};
		}),
		probe("ais", "Open AIS — Finnish Digitraffic (Baltic)", "maritime", "Open data, Finnish Transport Infrastructure Agency", "public-unclassified", "https://www.digitraffic.fi/", async () => {
			const res = await fetch("https://meri.digitraffic.fi/api/ais/v1/locations", {
				headers: {
					Accept: "application/json",
					"Accept-Encoding": "gzip",
					"User-Agent": "ONTAS-Educational/1.0"
				},
				signal: AbortSignal.timeout(15e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const n = (await res.json()).features?.length ?? 0;
			return {
				ok: n > 0,
				detail: `${n} surface contacts (regional open AIS)`
			};
		}),
		probe("nominatim", "OpenStreetMap Nominatim geocoder", "geo", "OpenStreetMap ODbL — place search only", "public-unclassified", "https://nominatim.openstreetmap.org/", async () => {
			const res = await fetch("https://nominatim.openstreetmap.org/search?q=Geneva&format=json&limit=1", {
				headers: {
					Accept: "application/json",
					"User-Agent": "ONTAS-Educational/1.0 (survivability place search)"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return {
				ok: false,
				detail: `HTTP ${res.status}`
			};
			const d = await res.json();
			return {
				ok: Array.isArray(d) && d.length > 0,
				detail: "geocode ok"
			};
		}),
		probe("defcon-osint", "Unofficial DEFCON OSINT (defconlevel.com)", "osint", "Independent OSINT estimate — NOT U.S. government", "open-estimate", "https://www.defconlevel.com/current-level", async () => {
			const d = await getOsintDefcon();
			return {
				ok: true,
				detail: `D${d.level} ${d.label} · ${d.source}`,
				degraded: d.source.includes("fallback")
			};
		}),
		Promise.resolve({
			id: "defcon-official",
			name: "Official U.S. DEFCON",
			category: "osint",
			status: "degraded",
			detail: "No lawful public real-time feed — classified readiness posture",
			legal: "Not published by DoD; public life-safety path is IPAWS/EAS/WEA",
			classification: "no-public-feed",
			url: "https://www.ready.gov/"
		}),
		Promise.resolve({
			id: "ssbn-tracks",
			name: "SSBN real positions",
			category: "maritime",
			status: "degraded",
			detail: "Submerged boats do not broadcast — map uses open patrol-zone estimates only",
			legal: "No classified or proprietary tracker used",
			classification: "open-estimate"
		})
	]);
	const okCount = sources.filter((s) => s.status === "ok").length;
	return {
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		sources,
		okCount,
		total: sources.length,
		note: "All sources are public/unclassified or clearly labeled open estimates. No classified networks, no paid military intel APIs."
	};
}
var fetchLiveStatus_createServerFn_handler = createServerRpc({
	id: "647ac0deb4dc97949d584cac2704ffb771e88fddb51e3fe84d8c6931056bb178",
	name: "fetchLiveStatus",
	filename: "src/server/live-status.ts"
}, (opts) => fetchLiveStatus.__executeServer(opts));
var fetchLiveStatus = createServerFn({ method: "GET" }).handler(fetchLiveStatus_createServerFn_handler, async () => {
	return getLiveStatus();
});
//#endregion
export { fetchLiveStatus_createServerFn_handler };
