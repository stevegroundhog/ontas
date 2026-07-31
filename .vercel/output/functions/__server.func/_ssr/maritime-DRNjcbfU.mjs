import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { c as SSBN_FLEET, d as estimateSubPositions, f as nationById, l as classifyAis, o as HOME_PORTS, s as NATION_COLORS, t as CATEGORY_META } from "./maritime-units-DQLpBDQ5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maritime-DRNjcbfU.js
function shipTypeLabel(t) {
	if (t >= 30 && t <= 32) return "fishing";
	if (t === 35) return "military";
	if (t >= 40 && t < 50) return "high-speed";
	if (t >= 60 && t < 70) return "passenger";
	if (t >= 70 && t < 80) return "cargo";
	if (t >= 80 && t < 90) return "tanker";
	if (t === 90) return "other";
	return `type-${t}`;
}
function isMilitaryLikely(shipType, name) {
	if (shipType === 35) return true;
	return /\b(HMS|USS|FS |RFS |CG |DDG|FFG|LHD|LHA|SSN|SSBN|NAVAL|NAVY|WARSHIP|PATROL)\b/i.test(name);
}
async function fetchFinnishAis() {
	try {
		const [locRes, vesRes] = await Promise.all([fetch("https://meri.digitraffic.fi/api/ais/v1/locations", {
			headers: {
				Accept: "application/json",
				"Accept-Encoding": "gzip",
				"User-Agent": "ONTAS-Educational/1.0"
			},
			signal: AbortSignal.timeout(15e3)
		}), fetch("https://meri.digitraffic.fi/api/ais/v1/vessels", {
			headers: {
				Accept: "application/json",
				"Accept-Encoding": "gzip",
				"User-Agent": "ONTAS-Educational/1.0"
			},
			signal: AbortSignal.timeout(15e3)
		})]);
		if (!locRes.ok) return [];
		const loc = await locRes.json();
		const nameByMmsi = /* @__PURE__ */ new Map();
		if (vesRes.ok) {
			const vessels = await vesRes.json();
			for (const v of vessels) nameByMmsi.set(v.mmsi, {
				name: (v.name || "").trim() || `MMSI ${v.mmsi}`,
				shipType: v.shipType ?? 0
			});
		}
		const out = [];
		for (const f of loc.features) {
			const meta = nameByMmsi.get(f.mmsi) ?? {
				name: `MMSI ${f.mmsi}`,
				shipType: 0
			};
			const [lon, lat] = f.geometry.coordinates;
			const mil = isMilitaryLikely(meta.shipType, meta.name);
			const category = classifyAis(meta.shipType, meta.name);
			if (!mil && category === "merchant" && out.filter((x) => !x.militaryLikely).length > 60) {
				if (Math.random() > .06) continue;
			}
			out.push({
				mmsi: f.mmsi,
				name: meta.name,
				lat,
				lon,
				sog: f.properties.sog ?? 0,
				cog: f.properties.cog ?? 0,
				heading: f.properties.heading ?? 0,
				shipType: meta.shipType,
				shipTypeLabel: shipTypeLabel(meta.shipType),
				source: "digitraffic.fi (Baltic AIS)",
				militaryLikely: mil,
				category,
				updatedAt: new Date(f.properties.timestampExternal || Date.now()).toISOString()
			});
		}
		out.sort((a, b) => Number(b.militaryLikely) - Number(a.militaryLikely));
		return out.slice(0, 180);
	} catch {
		return [];
	}
}
function buildUnits(now, ais) {
	const subs = estimateSubPositions(now);
	const units = [];
	const fleetById = new Map(SSBN_FLEET.map((b) => [b.id, b]));
	for (const s of subs) {
		const n = nationById(s.nationId);
		const phase = fleetById.get(s.id)?.phase ?? 0;
		units.push({
			id: s.id,
			name: s.name,
			className: s.className,
			category: "ssbn",
			nationId: s.nationId,
			nationLabel: n?.short ?? s.nationId.toUpperCase(),
			lat: s.lat,
			lon: s.lon,
			heading: s.heading,
			speedKn: s.status === "patrol" ? 10 + phase * 6 : 0,
			status: s.status,
			missiles: s.missiles,
			homePort: HOME_PORTS.find((p) => p.id === s.homePortId)?.name,
			trackSource: "osint-estimate",
			updatedAt: now,
			color: NATION_COLORS[s.nationId] ?? CATEGORY_META.ssbn.color,
			note: "Submerged SSBNs do not broadcast AIS — open-source patrol zone estimate"
		});
	}
	for (const a of ais) {
		if (!a.militaryLikely && a.category === "merchant") continue;
		units.push({
			id: `ais-${a.mmsi}`,
			name: a.name,
			hull: String(a.mmsi),
			className: a.shipTypeLabel,
			category: a.category,
			nationId: null,
			nationLabel: "AIS",
			lat: a.lat,
			lon: a.lon,
			heading: a.heading || a.cog,
			speedKn: a.sog,
			status: a.sog < .5 ? "anchored" : "underway",
			trackSource: "ais-live",
			updatedAt: new Date(a.updatedAt).getTime(),
			color: CATEGORY_META[a.category].color,
			note: "Live AIS surface contact"
		});
	}
	return {
		units,
		subs
	};
}
var cache = null;
var CACHE_MS = 4e4;
var fetchMaritimeSnapshot_createServerFn_handler = createServerRpc({
	id: "fc8b055a3d096c148616235710396279fabf03a1bbbd9488a18ee5b6882807c9",
	name: "fetchMaritimeSnapshot",
	filename: "src/server/maritime.ts"
}, (opts) => fetchMaritimeSnapshot.__executeServer(opts));
var fetchMaritimeSnapshot = createServerFn({ method: "GET" }).handler(fetchMaritimeSnapshot_createServerFn_handler, async () => {
	const now = Date.now();
	let ais;
	let aisSource;
	let cached = false;
	if (cache && now - cache.at < CACHE_MS) {
		ais = cache.ais;
		aisSource = cache.source;
		cached = true;
	} else {
		ais = await fetchFinnishAis();
		aisSource = ais.length ? "digitraffic.fi open AIS (Baltic)" : "unavailable";
		cache = {
			at: now,
			ais,
			source: aisSource
		};
	}
	const { units, subs } = buildUnits(now, ais);
	return {
		fetchedAt: new Date(now).toISOString(),
		ais,
		aisSource,
		aisCount: ais.length,
		units,
		subs,
		homePorts: HOME_PORTS,
		categories: CATEGORY_META,
		note: "SSBN = OSINT patrol estimates. Surface military units from live AIS when available.",
		cached
	};
});
//#endregion
export { fetchMaritimeSnapshot_createServerFn_handler };
