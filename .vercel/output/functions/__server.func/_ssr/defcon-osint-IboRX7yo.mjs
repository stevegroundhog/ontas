import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/defcon-osint-IboRX7yo.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var LABELS = {
	5: "FADE OUT",
	4: "DOUBLE TAKE",
	3: "ROUND HOUSE",
	2: "FAST PACE",
	1: "COCKED PISTOL"
};
var cache = null;
var CACHE_MS = 12e4;
function parseLevel(html) {
	const signals = [];
	let level = 3;
	let nuclearRisk = null;
	const faq = html.match(/places global readiness at DEFCON\s*([1-5])/i) || html.match(/estimated DEFCON level is\s*\*?\*?\s*([1-5])/i) || html.match(/Based on our Open Source Intelligence[^\d]{0,120}DEFCON level[^\d]{0,40}([1-5])/i) || html.match(/Current DEFCON[^0-9]{0,40}DEFCON\s*([1-5])/i);
	if (faq) {
		level = Number(faq[1]);
		signals.push(`defconlevel.com OSINT estimate DEFCON ${level}`);
	} else {
		const early = html.slice(0, 25e3);
		const counts = [
			0,
			0,
			0,
			0,
			0,
			0
		];
		for (const m of early.matchAll(/DEFCON\s*([1-5])/gi)) counts[Number(m[1])]++;
		let best = 3;
		let bestC = 0;
		for (let i = 1; i <= 5; i++) if (counts[i] > bestC) {
			bestC = counts[i];
			best = i;
		}
		level = best;
		signals.push(`heuristic DEFCON ${level} (token frequency)`);
	}
	const nr = html.match(/nuclear risk level is\s*([1-5])/i) || html.match(/NUCLEAR\s*([1-5])/i) || html.match(/Nuclear Risk[^0-9]{0,40}([1-5])/i);
	if (nr) {
		nuclearRisk = Number(nr[1]);
		signals.push(`nuclear risk index ${nuclearRisk}`);
	}
	return {
		level,
		nuclearRisk,
		signals
	};
}
/** Unofficial realtime DEFCON from public OSINT site (defconlevel.com) */
async function getOsintDefcon() {
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS) return cache.data;
	try {
		const res = await fetch("https://www.defconlevel.com/current-level", {
			headers: {
				"User-Agent": "ONTAS-Educational/1.0 (public OSINT aggregator)",
				Accept: "text/html"
			},
			signal: AbortSignal.timeout(14e3)
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const { level, nuclearRisk, signals } = parseLevel(await res.text());
		const data = {
			level,
			label: LABELS[level] ?? "UNKNOWN",
			nuclearRisk,
			source: "defconlevel.com OSINT estimate",
			sourceUrl: "https://www.defconlevel.com/current-level",
			summary: `Unofficial public OSINT estimate: DEFCON ${level} (${LABELS[level]}). Official U.S. DEFCON remains classified.`,
			fetchedAt: new Date(now).toISOString(),
			isOfficial: false,
			rawSignals: signals
		};
		cache = {
			at: now,
			data
		};
		return data;
	} catch (e) {
		const data = {
			level: 3,
			label: LABELS[3],
			nuclearRisk: 4,
			source: "fallback (OSINT feed unreachable)",
			sourceUrl: "https://www.defconlevel.com/current-level",
			summary: `OSINT feed error; using last public consensus DEFCON 3. ${e instanceof Error ? e.message : ""}`.trim(),
			fetchedAt: new Date(now).toISOString(),
			isOfficial: false,
			rawSignals: ["fallback"]
		};
		cache = {
			at: now,
			data
		};
		return data;
	}
}
var fetchOsintDefcon = createServerFn({ method: "GET" }).handler(createSsrRpc("7eccfaad6b10608de41dcc45dcf022373cfdb6e0a13c19d063d4f11943b772c0"));
//#endregion
export { fetchOsintDefcon as n, getOsintDefcon as r, createSsrRpc as t };
