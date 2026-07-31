import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocode-CX5WuRWj.js
function mapHits(raw) {
	return raw.map((r) => {
		const addr = r.address ?? {};
		const local = addr.city || addr.town || addr.village || addr.municipality || addr.hamlet || r.name || r.display_name.split(",")[0] || "Place";
		return {
			id: String(r.place_id),
			name: local,
			displayName: r.display_name,
			lat: Number(r.lat),
			lon: Number(r.lon),
			kind: r.type || r.class || "place",
			countryCode: addr.country_code?.toUpperCase() ?? null,
			country: addr.country ?? null,
			state: addr.state ?? null,
			city: addr.city || addr.town || addr.village || null,
			importance: r.importance ?? 0
		};
	});
}
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "1e41d8fc665db2805a2587692966ab0f16962dfa80a65feb47fa3e342c19a904",
	name: "searchPlaces",
	filename: "src/server/geocode.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "GET" }).validator((q) => String(q ?? "")).handler(searchPlaces_createServerFn_handler, async ({ data: q }) => {
	const query = q.trim();
	if (query.length < 2) return {
		query,
		results: [],
		error: null
	};
	try {
		const url = new URL("https://nominatim.openstreetmap.org/search");
		url.searchParams.set("q", query);
		url.searchParams.set("format", "json");
		url.searchParams.set("addressdetails", "1");
		url.searchParams.set("limit", "8");
		const res = await fetch(url.toString(), {
			headers: {
				Accept: "application/json",
				"User-Agent": "ONTAS-Educational/1.0 (survivability place search)"
			},
			signal: AbortSignal.timeout(12e3)
		});
		if (!res.ok) return {
			query,
			results: [],
			error: `Geocoder HTTP ${res.status}`
		};
		return {
			query,
			results: mapHits([...await res.json()].sort((a, b) => {
				const score = (x) => {
					const t = `${x.type} ${x.class}`.toLowerCase();
					let s = x.importance ?? 0;
					if (/city|town|village|hamlet|municipality|suburb/.test(t)) s += 1;
					return s;
				};
				return score(b) - score(a);
			})),
			error: null
		};
	} catch (e) {
		return {
			query,
			results: [],
			error: e instanceof Error ? e.message : "search failed"
		};
	}
});
//#endregion
export { searchPlaces_createServerFn_handler };
