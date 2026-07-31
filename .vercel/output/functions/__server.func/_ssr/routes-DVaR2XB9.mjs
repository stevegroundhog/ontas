import { r as __toESM } from "../_runtime.mjs";
import { N as require_react, h as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as sortConflictsByIntensity, n as CONFLICT_INTENSITY_META, r as CONFLICT_TYPE_LABEL, t as ARMED_CONFLICTS } from "./conflicts-D5AgD6d3.mjs";
import { n as fetchOsintDefcon, t as createSsrRpc } from "./defcon-osint-IboRX7yo.mjs";
import { a as GLOBAL_TOTAL_INVENTORY, c as SSBN_FLEET, d as estimateSubPositions, f as nationById, h as stockpileShare, i as GLOBAL_MILITARY_STOCKPILE, m as scenarios, n as DATA_AS_OF, o as HOME_PORTS, p as nations, r as GLOBAL_DEPLOYED_STRATEGIC, s as NATION_COLORS, t as CATEGORY_META, u as climateBrief } from "./maritime-units-DQLpBDQ5.mjs";
import { i as haversineKm, n as fetchLiveNuclearNews, t as WATCH_ZONES } from "./nuclear-news-ANqVRmP5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DVaR2XB9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	5: {
		code: "FADE OUT",
		official: "Lowest readiness (peacetime baseline)",
		color: "#3b82f6"
	},
	4: {
		code: "DOUBLE TAKE",
		official: "Increased intelligence watch",
		color: "#22c55e"
	},
	3: {
		code: "ROUND HOUSE",
		official: "Increase in force readiness above normal",
		color: "#eab308"
	},
	2: {
		code: "FAST PACE",
		official: "Further increase in force readiness",
		color: "#f97316"
	},
	1: {
		code: "COCKED PISTOL",
		official: "Maximum readiness",
		color: "#ef4444"
	}
};
function clampDefcon(n) {
	return Math.max(1, Math.min(5, Math.round(n)));
}
/**
* Unofficial realtime DEFCON:
* 1) Primary floor = public OSINT estimate (defconlevel.com)
* 2) Live news + USGS can tighten (lower number) one step
* Never claims official classified DEFCON.
*/
function computeDefcon({ scenario, news, seismic = [], osint = null, now = Date.now() }) {
	const scenarioFloor = scenario.defcon;
	const osintLevel = osint?.level ?? 3;
	const day = 24 * 3600 * 1e3;
	const recent = news.filter((n) => now - new Date(n.publishedAt).getTime() < day);
	let newsPressure = 0;
	let seismicPressure = 0;
	const reasons = [];
	reasons.push(`Unofficial OSINT DEFCON ${osintLevel} — ${osint?.source ?? "consensus"} (not official)`);
	const crit = recent.filter((n) => n.severity === "critical").length;
	const high = recent.filter((n) => n.severity === "high").length;
	const elev = recent.filter((n) => n.severity === "elevated").length;
	newsPressure += crit * 1.15 + high * .65 + elev * .22;
	const launchHits = recent.filter((n) => /launch|test[- ]fire|icbm|slbm|ballistic|sarmat|minuteman|hwasong|nuclear test|missile strike/i.test(n.title)).length;
	if (launchHits >= 4) {
		newsPressure += 1.4;
		reasons.push(`${launchHits} launch/missile headlines (24h live news)`);
	} else if (launchHits >= 1) {
		newsPressure += .45 * Math.min(3, launchHits);
		reasons.push(`${launchHits} missile-related headline(s) live`);
	}
	const elevatedSeismic = seismic.filter((e) => e.nuclearRelevance === "elevated");
	const watchSeismic = seismic.filter((e) => e.nuclearRelevance === "watch");
	seismicPressure += elevatedSeismic.length * 1.5 + watchSeismic.length * .35;
	if (elevatedSeismic.length) reasons.push(`${elevatedSeismic.length} USGS quake(s) near nuclear test watch zones`);
	else reasons.push("USGS: no elevated nuclear-watch seismic hits");
	if (osint?.nuclearRisk != null) reasons.push(`OSINT nuclear risk index: ${osint.nuclearRisk}`);
	const sensorBump = Math.min(1, Math.floor((newsPressure + seismicPressure) * .5));
	const level = clampDefcon(osintLevel - sensorBump);
	if (scenarioFloor < osintLevel) reasons.push(`Active edu scenario floor D${scenarioFloor} (does not override OSINT display)`);
	if (sensorBump > 0) reasons.push(`Live sensors tightened OSINT D${osintLevel} → D${level}`);
	const meta = LABELS[level];
	return {
		level,
		label: meta.code,
		officialName: meta.official,
		osintLevel,
		osintSource: osint?.source ?? "OSINT",
		osintUrl: osint?.sourceUrl ?? "https://www.defconlevel.com/current-level",
		nuclearRisk: osint?.nuclearRisk ?? null,
		reasons: reasons.slice(0, 6),
		score: newsPressure + seismicPressure,
		newsPressure,
		seismicPressure,
		scenarioFloor,
		isOfficialDefcon: false,
		classificationNote: "Unofficial realtime DEFCON from public OSINT (defconlevel.com) + live open sensors. Official U.S. DEFCON is classified and never published.",
		updatedAt: now,
		color: meta.color,
		bands: [
			{
				id: "osint",
				label: "OSINT DEFCON",
				value: 6 - osintLevel,
				max: 5,
				color: LABELS[osintLevel].color
			},
			{
				id: "news",
				label: "Live news",
				value: newsPressure,
				max: 6,
				color: "#38bdf8"
			},
			{
				id: "seismic",
				label: "USGS watch",
				value: seismicPressure,
				max: 4,
				color: "#fbbf24"
			}
		]
	};
}
/** Client-side SSBN unit seed so naval panel is never empty before AIS fetch */
function seedSsbnUnits(now = Date.now()) {
	const subs = estimateSubPositions(now);
	const fleetById = new Map(SSBN_FLEET.map((b) => [b.id, b]));
	return subs.map((s) => {
		const n = nationById(s.nationId);
		const phase = fleetById.get(s.id)?.phase ?? 0;
		return {
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
		};
	});
}
function formatNum(n) {
	return n.toLocaleString("en-US");
}
var fetchMaritimeSnapshot = createServerFn({ method: "GET" }).handler(createSsrRpc("fc8b055a3d096c148616235710396279fabf03a1bbbd9488a18ee5b6882807c9"));
var fetchThreatIntel = createServerFn({ method: "GET" }).handler(createSsrRpc("115e0feb63da68db7ab6bd65464677985cdf816242d461bdfd65b7f05678c06b"));
var LINES = [
	"ONTAS — Open Nuclear Threat Awareness System",
	"Educational fusion · public data only",
	"New here? Open the Beginner guide anytime",
	"Unofficial OSINT DEFCON (not classified)",
	"Life-safety alerts: FEMA IPAWS / EAS / WEA only",
	"",
	"Fusion online."
];
var SKIP_KEY = "ontas-boot-seen";
function BootScreen({ onDone }) {
	const [visible, setVisible] = (0, import_react.useState)(0);
	const [skip, setSkip] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			if (sessionStorage.getItem(SKIP_KEY) === "1") {
				onDone();
				return;
			}
		} catch {}
	}, [onDone]);
	(0, import_react.useEffect)(() => {
		if (skip) {
			try {
				sessionStorage.setItem(SKIP_KEY, "1");
			} catch {}
			onDone();
			return;
		}
		if (visible >= LINES.length) {
			try {
				sessionStorage.setItem(SKIP_KEY, "1");
			} catch {}
			const t = setTimeout(onDone, 400);
			return () => clearTimeout(t);
		}
		const t = setTimeout(() => setVisible((v) => v + 1), 160);
		return () => clearTimeout(t);
	}, [
		visible,
		skip,
		onDone
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "fixed inset-0 z-40 flex flex-col items-start justify-center bg-[#0b1220] px-6 text-left sm:px-16",
		onClick: () => setSkip(true),
		"aria-label": "Skip boot sequence",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-2xl font-sans text-sm leading-relaxed text-fg sm:text-base",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 text-xs font-semibold tracking-[0.25em] text-sky-400",
					children: "ONTAS · LEARN · WATCH · PREPARE"
				}),
				LINES.slice(0, visible).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: line.includes("Fusion online") ? "mt-4 text-xl font-bold text-bright sm:text-2xl" : line.startsWith("Life-safety") || line.startsWith("Unofficial") ? "text-amber-300" : line.includes("Beginner") ? "text-sky-300" : "text-slate-300",
					children: line || "\xA0"
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 text-xs tracking-wide text-muted",
					children: "Tap anywhere to enter"
				})
			]
		})
	});
}
function ClimatePanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] tracking-[0.25em] text-muted",
					children: "GLOBAL POLITICAL / STRATEGIC CLIMATE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-bright",
					children: ["DATA WINDOW: ", DATA_AS_OF]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-px border-b border-border bg-border",
				children: [
					["GLOBAL INVENTORY", GLOBAL_TOTAL_INVENTORY],
					["MIL STOCKPILE", GLOBAL_MILITARY_STOCKPILE],
					["DEPLOYED STRAT", GLOBAL_DEPLOYED_STRATEGIC]
				].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-panel px-2 py-2 text-center sm:px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[8px] tracking-wider text-muted sm:text-[9px]",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base tabular text-fg crt-glow sm:text-lg",
						children: formatNum(val)
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 p-3 sm:grid-cols-2",
				children: climateBrief.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border/80 bg-bg/30 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] tracking-widest text-muted",
						children: b.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] leading-relaxed text-fg/90 sm:text-[11px]",
						children: b.body
					})]
				}, b.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-3 py-2 text-[9px] leading-relaxed text-muted",
				children: "EDUCATIONAL VISUALIZATION ONLY. FIGURES ARE OPEN-SOURCE ESTIMATES (FAS, SIPRI, ARMS CONTROL ASSOCIATION, BULLETIN OF THE ATOMIC SCIENTISTS). NOT OFFICIAL GOVERNMENT DATA. NOT A TARGETING SYSTEM."
			})
		]
	});
}
/** Relative age of an ISO timestamp; safe for invalid dates */
function formatRelative(iso, now = Date.now()) {
	const t = new Date(iso).getTime();
	if (!Number.isFinite(t)) return "—";
	const diff = Math.max(0, now - t);
	const sec = Math.floor(diff / 1e3);
	if (sec < 45) return "just now";
	const min = Math.floor(sec / 60);
	if (min < 60) return `${min}m ago`;
	const hr = Math.floor(min / 60);
	if (hr < 48) return `${hr}h ago`;
	const day = Math.floor(hr / 24);
	if (day < 14) return `${day}d ago`;
	return new Date(t).toISOString().slice(0, 10);
}
/** Static archive used when live mesh is empty or offline */
var THREAT_NEWS = [
	{
		id: "newstart-2026",
		headline: "New START expired — no bilateral US–Russia strategic ceilings remain",
		summary: "With New START lapsed after earlier Russian suspension, open-source analysts note unconstrained deployed strategic accounting between the two largest arsenals. Educational baseline, not an alert.",
		publishedAt: "2026-02-05T12:00:00.000Z",
		source: "Arms Control Association (open reporting)",
		region: "Global",
		severity: "critical",
		actors: ["us", "ru"],
		category: "treaty"
	},
	{
		id: "china-triad",
		headline: "China continues solid-fuel ICBM and SSBN force expansion",
		summary: "Open estimates place China as the fastest-growing nuclear arsenal, with silo fields and Type 094/JL-class sea leg modernization widely reported in open literature.",
		publishedAt: "2026-06-15T08:00:00.000Z",
		source: "FAS / open literature synthesis",
		region: "Indo-Pacific",
		severity: "elevated",
		actors: ["cn", "us"],
		category: "posture"
	},
	{
		id: "dprk-icbm",
		headline: "DPRK ICBM flight-test cycles remain a peninsula flashpoint",
		summary: "Public reporting continues to track Hwasong-class long-range systems and related missile activity. Watch zones around Punggye-ri remain relevant for seismic correlation.",
		publishedAt: "2026-05-20T14:30:00.000Z",
		source: "Open-source peninsula reporting",
		region: "Korean Peninsula",
		severity: "high",
		actors: ["kp", "us"],
		category: "test"
	},
	{
		id: "eu-posture",
		headline: "NATO nuclear sharing and dual-capable aircraft posture under review",
		summary: "European basing of US gravity bombs and dual-capable aircraft remains part of extended deterrence discussions in open policy literature.",
		publishedAt: "2026-04-10T10:00:00.000Z",
		source: "Open policy analysis",
		region: "Europe",
		severity: "info",
		actors: [
			"us",
			"uk",
			"fr"
		],
		category: "posture"
	},
	{
		id: "south-asia",
		headline: "India–Pakistan strategic forces remain hair-trigger regional risk",
		summary: "Short flight times and dual-capable delivery systems keep South Asia a high-attention region in educational nuclear risk literature.",
		publishedAt: "2026-03-22T09:00:00.000Z",
		source: "Open regional analysis",
		region: "South Asia",
		severity: "elevated",
		actors: ["in", "pk"],
		category: "analysis"
	},
	{
		id: "ssbn-patrol",
		headline: "Continuous SSBN patrols remain core of sea-based deterrence",
		summary: "US, UK, France, Russia, China, and India maintain or expand ballistic-missile submarine legs. Submerged positions are not public; open estimates use patrol zones only.",
		publishedAt: "2026-07-01T11:00:00.000Z",
		source: "Naval open-source synthesis",
		region: "Global",
		severity: "info",
		actors: [
			"us",
			"ru",
			"cn",
			"uk",
			"fr",
			"in"
		],
		category: "exercise"
	}
];
var fetchConflictReports = createServerFn({ method: "GET" }).validator((input) => {
	if (input == null || input === "") return { conflictId: null };
	if (typeof input === "string") return { conflictId: input };
	if (typeof input === "object" && input !== null && "conflictId" in input) return { conflictId: input.conflictId ?? null };
	return { conflictId: null };
}).handler(createSsrRpc("f2fe828d4c66f01bbe367d9c64cdd9ef8530b10aff6e51c515de9bb07e845376"));
createServerFn({ method: "GET" }).handler(createSsrRpc("e6b99e3c8e70bd108dc25751bf1920a2b7624c113f75503774aeeaf3913f4b50"));
var REGIONS = [
	"all",
	"Europe",
	"Middle East",
	"Africa",
	"Asia",
	"Americas"
];
function ConflictsPanel({ selectedId, onSelect, now }) {
	const [region, setRegion] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [reports, setReports] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [fetchedAt, setFetchedAt] = (0, import_react.useState)(null);
	const [health, setHealth] = (0, import_react.useState)([]);
	const [pulse, setPulse] = (0, import_react.useState)("Select a conflict for live reports");
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const list = (0, import_react.useMemo)(() => {
		let items = sortConflictsByIntensity(ARMED_CONFLICTS);
		if (region !== "all") items = items.filter((c) => c.region === region);
		if (q.trim()) {
			const s = q.trim().toLowerCase();
			items = items.filter((c) => c.name.toLowerCase().includes(s) || c.shortName.toLowerCase().includes(s) || c.countries.some((x) => x.toLowerCase().includes(s)) || c.parties.some((p) => p.toLowerCase().includes(s)) || c.keywords.some((k) => k.includes(s)));
		}
		return items;
	}, [region, q]);
	const selected = (0, import_react.useMemo)(() => ARMED_CONFLICTS.find((c) => c.id === selectedId) ?? null, [selectedId]);
	const load = (0, import_react.useCallback)(async (id) => {
		setLoading(true);
		setPulse(id ? "Pulling live reports…" : "Scanning global conflict feeds…");
		try {
			const data = await fetchConflictReports({ data: { conflictId: id } });
			setReports(data.reports);
			setFetchedAt(data.fetchedAt);
			setHealth(data.feedHealth);
			setPulse(data.reports.length ? `${data.reports.length} reports · open sources` : "No matching wire items right now");
		} catch {
			setPulse("Feed error — try again");
			setReports([]);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load(selectedId);
		const t = window.setInterval(() => void load(selectedId), 12e4);
		return () => clearInterval(t);
	}, [selectedId, load]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-rose-400",
					children: "Global conflicts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-sm font-bold text-bright",
					children: "Select any major war or conflict · live open reports"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[11px] leading-snug text-muted",
					children: "Neutral factual registry + multi-source wires (UN, BBC, Google News). Not propaganda — always open original articles."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "search",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter: Ukraine, Sudan, Gaza, Sahel…",
					className: "mt-2 w-full rounded-xl border border-border bg-black/30 px-3 py-2 text-sm text-bright outline-none placeholder:text-dim focus:border-rose-400/60",
					"aria-label": "Filter conflicts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-1",
					children: [REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `soft-btn ${region === r ? "active" : ""}`,
						onClick: () => setRegion(r),
						children: r === "all" ? "All regions" : r
					}, r)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `soft-btn ${selectedId == null ? "active" : ""}`,
						onClick: () => onSelect(null),
						children: "All live"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-0 flex-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 overflow-y-auto border-b border-border lg:border-b-0 lg:border-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted",
					children: [list.length, " conflicts"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: list.map((c) => {
					const meta = CONFLICT_INTENSITY_META[c.intensity];
					const active = selectedId === c.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect(active ? null : c.id),
						className: `flex w-full items-start gap-2 border-b border-border/50 px-3 py-2.5 text-left transition-colors ${active ? "bg-rose-500/15" : "hover:bg-white/5"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
							style: { background: meta.color }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold text-bright",
									children: c.shortName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[11px] text-muted",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 flex flex-wrap gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "chip",
											style: {
												borderColor: meta.color,
												color: meta.color
											},
											children: meta.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "chip",
											children: c.region
										}),
										c.nuclearRisk !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "chip border-amber-400/50 text-amber-300",
											children: ["nuclear risk: ", c.nuclearRisk]
										})
									]
								})
							]
						})]
					}) }, c.id);
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-col overflow-hidden",
				children: [
					selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConflictDetail, { conflict: selected }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-3 py-2 text-xs text-muted",
						children: "Showing cross-conflict live items. Select a conflict for focused coverage."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 border-b border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 truncate text-[11px] text-muted",
							children: [loading ? "Loading…" : pulse, fetchedAt ? ` · ${formatRelative(fetchedAt, now)}` : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "soft-btn shrink-0",
							onClick: () => void load(selectedId),
							disabled: loading,
							children: "Refresh"
						})]
					}),
					health.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1 border-b border-border px-3 py-1.5",
						children: health.slice(0, 6).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip text-[10px]",
							style: {
								borderColor: h.ok ? "#34d399" : "#64748b",
								color: h.ok ? "#6ee7b7" : "#94a3b8"
							},
							title: h.name,
							children: [
								h.ok ? "●" : "○",
								" ",
								h.name.length > 22 ? `${h.name.slice(0, 20)}…` : h.name
							]
						}, h.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-y-auto",
						children: reports.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 text-sm text-muted",
							children: loading ? "Fetching factual reports…" : "No live items matched. Try refresh or another conflict."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-b border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "w-full px-3 py-2.5 text-left hover:bg-white/5",
								onClick: () => setExpanded((e) => e === r.id ? null : r.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5 text-[10px] text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "chip",
											children: r.sourceKind.toUpperCase()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "chip",
											children: r.conflictName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular",
											children: formatRelative(r.publishedAt, now)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto truncate",
											children: r.source
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm font-medium leading-snug text-bright",
									children: r.title
								})]
							}), expanded === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 border-t border-border/30 bg-black/20 px-3 py-2 text-xs text-fg/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed",
									children: r.summary
								}), r.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: r.link,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-block rounded-full border border-rose-400/40 px-3 py-1 text-rose-200 hover:bg-rose-500/10",
									children: "Open original source"
								})]
							})]
						}, r.id)) })
					})
				]
			})]
		})]
	});
}
function ConflictDetail({ conflict }) {
	const meta = CONFLICT_INTENSITY_META[conflict.intensity];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-bold text-bright",
				children: conflict.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] leading-relaxed text-muted",
				children: conflict.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1 text-[10px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip",
						style: {
							borderColor: meta.color,
							color: meta.color
						},
						children: meta.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip",
						children: CONFLICT_TYPE_LABEL[conflict.type]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "chip",
						children: ["since ", conflict.startYear]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip",
						children: conflict.status
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-[11px] text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-fg",
					children: "Parties: "
				}), conflict.parties.join(" · ")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-[11px] text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-fg",
					children: "Casualties (open est.): "
				}), conflict.fatalitiesNote]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex flex-wrap gap-2",
				children: conflict.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: s.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-[10px] text-sky-300 underline-offset-2 hover:underline",
					children: s.label
				}, s.url))
			})
		]
	});
}
function DefconBadge({ state, onExplain }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel overflow-hidden",
		style: {
			borderColor: state.color,
			boxShadow: `0 0 0 1px ${state.color}33, 0 12px 40px ${state.color}22`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 px-4 py-3",
				style: { background: `linear-gradient(90deg, ${state.color}33, transparent 70%)` },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center shadow-lg",
					style: {
						background: state.color,
						color: state.level === 3 ? "#111" : "#fff"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold tracking-widest opacity-80",
						children: "DEFCON"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-black leading-none",
						children: state.level
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-bold text-bright",
								children: state.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip bg-black/20 text-muted",
								children: "UNOFFICIAL OSINT"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-sm text-muted",
							children: state.officialName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted",
							children: [
								"Source:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: state.osintUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "underline-offset-2 hover:underline",
									style: { color: "#38bdf8" },
									children: state.osintSource
								}),
								state.nuclearRisk != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 chip",
									style: {
										borderColor: "#fbbf24",
										color: "#fbbf24"
									},
									children: ["NUCLEAR RISK ", state.nuclearRisk]
								})
							]
						}),
						onExplain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onExplain,
							className: "mt-2 text-xs font-semibold text-sky-300 underline decoration-dotted underline-offset-2 hover:text-sky-200",
							children: "New here? What DEFCON means →"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2 border-t border-border px-4 py-3",
				children: state.bands.map((b) => {
					const pct = Math.min(100, b.value / b.max * 100);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 truncate text-[11px] font-medium text-muted",
						children: b.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-black/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full transition-all",
							style: {
								width: `${pct}%`,
								background: b.color
							}
						})
					})] }, b.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-4 py-2 text-xs leading-snug text-muted",
				children: state.reasons[0]
			})
		]
	});
}
function ForceTable({ nations, selectedId, onSelect }) {
	const sorted = [...nations].sort((a, b) => b.totalInventory - a.totalInventory);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-3 py-2 text-[10px] tracking-[0.25em] text-muted",
			children: "WORLD NUCLEAR FORCES — MILITARY STOCKPILE RANKING"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-[9px] tracking-wider text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal",
							children: "STATE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal tabular",
							children: "DEPLOYED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal tabular",
							children: "STOCKPILE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal tabular",
							children: "TOTAL INV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal",
							children: "ICBM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal",
							children: "TRIAD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-normal",
							children: "THREAT"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sorted.map((n, i) => {
					const hasIcbm = n.systems.some((s) => s.type === "ICBM");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => onSelect(n.id),
						className: `cursor-pointer border-b border-border/40 transition-colors ${selectedId === n.id ? "bg-fg/15 text-bright" : "hover:bg-fg/5"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5 tabular text-muted",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5 tracking-wide",
								children: n.short
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5 tabular",
								children: formatNum(n.deployedStrategic + n.deployedNonstrategic)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5 tabular",
								children: formatNum(n.militaryStockpile)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5 tabular",
								children: formatNum(n.totalInventory)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5",
								children: hasIcbm ? "YES" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5",
								children: n.triad ? "Y" : "N"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: n.threatLevel >= 4 ? "text-danger" : n.threatLevel >= 3 ? "text-warn" : "text-muted",
									children: ["■".repeat(n.threatLevel), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-dim",
										children: "■".repeat(5 - n.threatLevel)
									})]
								})
							})
						]
					}, n.id);
				}) })]
			})
		})]
	});
}
function IntelPanel({ seismic, official, sources, fetchedAt, now, disclaimer }) {
	const watch = seismic.filter((e) => e.nuclearRelevance !== "background");
	const ok = sources.filter((s) => s.status === "ok").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-sky-400",
						children: "Live intel fusion"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold text-bright",
						children: "USGS · UN · DoD · IAEA · news mesh · OSINT DEFCON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap gap-2 text-[11px] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip",
							style: {
								borderColor: "#34d399",
								color: "#6ee7b7"
							},
							children: [
								ok,
								"/",
								sources.length,
								" sources OK"
							]
						}), fetchedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular",
							children: ["updated ", formatRelative(fetchedAt, now)]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
						title: "Legal public sources",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 px-3 pb-2",
							children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border/60 px-2.5 py-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-fg",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { status: s.status })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-[11px] text-muted",
										children: s.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-dim",
										children: s.legal
									})
								]
							}, s.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
						title: `Seismic watch · USGS (${watch.length} near zones)`,
						children: [watch.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 pb-2 text-xs text-muted",
							children: "No M2.5+ events inside nuclear watch radii (24h). Most quakes are ordinary geology."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: watch.slice(0, 12).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-b border-border/40 px-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: e.nuclearRelevance === "elevated" ? "font-semibold text-warn" : "text-fg",
										children: [
											"M",
											e.mag.toFixed(1),
											" · ",
											e.place
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-muted tabular",
										children: formatRelative(e.time, now)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted",
									children: [
										e.watchHits.map((h) => h.zoneName).join(" · "),
										" · ",
										e.depthKm.toFixed(0),
										" km"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: e.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-[11px] text-sky-300 hover:underline",
									children: "USGS event"
								})
							]
						}, e.id)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 pb-2 text-[10px] text-dim",
							children: [
								"Background M≥5:",
								" ",
								seismic.filter((e) => e.nuclearRelevance === "background" && e.mag >= 5).length
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
						title: `Official / institutional wires (${official.length})`,
						children: official.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 pb-2 text-xs text-muted",
							children: "No items yet — feeds may be slow."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: official.slice(0, 20).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-b border-border/40 px-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5 text-[10px] text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chip",
										children: item.source
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular",
										children: formatRelative(item.publishedAt, now)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-medium text-bright",
									children: item.title
								}),
								item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: item.link,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-[11px] text-sky-300 hover:underline",
									children: "Open"
								})
							]
						}, item.id)) })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-3 py-2 text-[10px] leading-relaxed text-muted",
				children: disclaimer
			})
		]
	});
}
function Section$1({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted",
			children: title
		}), children]
	});
}
function StatusDot({ status }) {
	const color = status === "ok" ? "#34d399" : status === "degraded" ? "#fbbf24" : "#f87171";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "chip text-[10px]",
		style: {
			borderColor: color,
			color
		},
		children: status === "ok" ? "OK" : status === "degraded" ? "LIMITED" : "DOWN"
	});
}
var SECTIONS = [
	{
		id: "start",
		title: "Start here — what is this app?",
		blurb: "A plain-language map of public nuclear and conflict information.",
		body: [
			{ p: "ONTAS (Open Nuclear Threat Awareness System) is an educational dashboard. It pulls public data — news, earthquake sensors, open ship tracking, and open-source estimates of nuclear forces — and shows them on one screen." },
			{ p: "It is not a government warning system. It cannot tell you if a missile has been launched. If there is a real emergency in the United States, you will hear from FEMA, Wireless Emergency Alerts on your phone, sirens, or TV/radio — not from this app." },
			{ p: "Think of it as a classroom globe plus a news desk: useful for understanding the world, not for making life-or-death decisions." }
		]
	},
	{
		id: "geo",
		title: "Geopolitics in 60 seconds",
		blurb: "How countries compete, ally, and sometimes fight.",
		body: [
			{
				h: "What “geopolitics” means",
				p: "Geopolitics is how geography, power, trade, and military force shape relations between countries. Mountains, oceans, oil, shipping lanes, and borders all matter because they affect what states can protect or threaten."
			},
			{
				h: "Power is not only tanks",
				p: "Countries also use alliances (like NATO), trade, technology, sanctions, and information. Nuclear weapons are one extreme form of military power: they are mainly for deterrence — discouraging attack by making the cost unbearable — not for everyday fighting."
			},
			{
				h: "Why conflicts appear on this map",
				p: "Wars and crises change risk for ordinary people and can raise military readiness worldwide. Tracking them helps explain why news about missiles or DEFCON estimates sometimes spikes."
			}
		]
	},
	{
		id: "nuclear",
		title: "Nuclear weapons — basics",
		blurb: "What they are, who has them, and why numbers matter.",
		body: [
			{
				h: "What a nuclear weapon is",
				p: "A nuclear weapon releases energy from splitting atoms (fission) or combining them (fusion). Yield is often measured in kilotons or megatons of TNT equivalent. Even a “small” nuclear explosion is vastly more destructive than ordinary bombs and creates deadly radiation and fallout."
			},
			{
				h: "Who has them",
				p: "Nine states are widely assessed to possess nuclear weapons: the United States, Russia, China, France, the United Kingdom, India, Pakistan, Israel (undeclared but widely assessed), and North Korea. Others host allied weapons or pursue related technology under tight scrutiny."
			},
			{
				h: "Stockpile vs deployed",
				p: "“Total inventory” includes warheads in storage. “Deployed” means ready or on delivery systems. Open estimates (groups like FAS or SIPRI) are educated counts — not secret official tallies."
			},
			{
				h: "Deterrence, not a video game",
				p: "Nuclear strategy is about preventing use. Accidents, miscalculation, and escalation are the main public fears. That is why treaties, hotlines, and clear command systems matter."
			}
		]
	},
	{
		id: "defcon",
		title: "DEFCON levels explained",
		blurb: "What each number means — and why the real one is secret.",
		body: [
			{
				h: "What DEFCON is",
				p: "DEFCON stands for Defense Readiness Condition. It is a U.S. military alert scale from 5 (lowest readiness / peacetime baseline) to 1 (maximum readiness). Higher readiness means more forces prepared for combat — it does not by itself mean “nukes are launching.”"
			},
			{
				h: "The five levels (official names)",
				p: "DEFCON 5 FADE OUT — normal peacetime. DEFCON 4 DOUBLE TAKE — increased intelligence watch and security. DEFCON 3 ROUND HOUSE — increase in force readiness above normal. DEFCON 2 FAST PACE — further increase; next step to max. DEFCON 1 COCKED PISTOL — maximum readiness."
			},
			{
				h: "Important: the real level is classified",
				p: "The U.S. government does not publish the current DEFCON in real time. Websites (including the OSINT estimate shown here) are educated guesses from open signals. They can be wrong. This app always labels DEFCON as unofficial."
			},
			{
				h: "How to read our badge",
				p: "We combine a public OSINT estimate with open sensors (news pressure, quakes near test sites). A yellow DEFCON 3 means “elevated public concern in open sources,” not an official order. Never evacuate based on this display alone."
			}
		]
	},
	{
		id: "delivery",
		title: "ICBMs, submarines, and the triad",
		blurb: "How nuclear weapons can be delivered.",
		body: [
			{
				h: "The nuclear triad",
				p: "Many nuclear powers keep three legs: land-based missiles, sea-based missiles on submarines, and aircraft. Spreading forces makes a complete surprise attack harder."
			},
			{
				h: "ICBM",
				p: "Intercontinental Ballistic Missile — a long-range land-based rocket that flies into space on an arc and re-enters at high speed. Flight times between major powers are often measured in tens of minutes."
			},
			{
				h: "SLBM & SSBN",
				p: "Submarine-Launched Ballistic Missiles ride on ballistic-missile submarines (SSBNs). Submerged boats are hard to find; their tracks on this map are educational estimates, not live GPS of secret patrols. Real SSBNs do not broadcast AIS while hidden."
			},
			{
				h: "Bombers & cruise missiles",
				p: "Aircraft can carry nuclear bombs or long-range cruise missiles. They are slower than ICBMs but flexible and can be recalled after takeoff in many doctrines."
			}
		]
	},
	{
		id: "map",
		title: "How to read this map",
		blurb: "Colors, dots, and layers without the jargon.",
		body: [
			{
				h: "Countries",
				p: "Nuclear-armed states are tinted by country color. Click one to open its force card (warheads, systems, doctrine notes)."
			},
			{
				h: "Rose / red conflict markers",
				p: "Major wars and armed conflicts. Click a marker or use the Conflicts desk for a neutral fact sheet and live news from UN, BBC, and other open wires."
			},
			{
				h: "Purple chevrons (SSBN)",
				p: "Estimated patrol or in-port positions for ballistic-missile submarines. Educational modeling only."
			},
			{
				h: "Yellow AIS dots",
				p: "Live surface ships where open maritime data exists (strongest in some coastal feeds like the Baltic). Not a global military tracker."
			},
			{
				h: "Quake dots",
				p: "Earthquakes from USGS. Ones near known nuclear test areas are flagged for watch — most quakes are natural geology."
			}
		]
	},
	{
		id: "conflicts",
		title: "Wars & conflicts — reading neutrally",
		blurb: "How we describe fighting without propaganda.",
		body: [
			{ p: "Conflict cards list parties by name, intensity (from tension to war-level), and open casualty notes. Language is deliberately dry: who is fighting, where, since when — not who is “right.”" },
			{ p: "Live reports come from public RSS feeds. Headlines can be imperfect or biased; always open the original article. We do not invent battlefield scores." },
			{ p: "A conflict on the list does not mean nuclear war is imminent. Most wars stay conventional. Nuclear risk rises mainly when nuclear-armed states are direct parties or when crises spin out of control." }
		]
	},
	{
		id: "survive",
		title: "Survivability kits — what they are for",
		blurb: "Everyday emergency readiness, not doomsday fantasy.",
		body: [
			{ p: "Search any city or town to get a starter list: water, food, radio, medicine, shelter-in-place ideas. The list adjusts for climate, city vs village, and distance to large strategic sites on our open map." },
			{
				h: "Shelter vs evacuate",
				p: "For radioactive fallout, the usual public advice is go in, stay in, tune in — use thick walls and distance from windows unless officials order evacuation. Follow your country’s civil-defense instructions first."
			},
			{
				h: "Potassium iodide (KI)",
				p: "Only helps protect the thyroid from radioactive iodine, and only if public health officials say to take it. It is not an anti-radiation pill for everything."
			}
		]
	},
	{
		id: "limits",
		title: "Limits, trust, and good habits",
		blurb: "How to stay informed without panic.",
		body: [
			{
				h: "What we never claim",
				p: "We do not claim access to classified DEFCON, real-time missile warning, or secret submarine tracks. Anything labeled estimate or OSINT can be wrong."
			},
			{
				h: "Healthy habits",
				p: "Use multiple reputable sources. Prefer primary agencies (UN, IAEA, national meteorological/seismic services, civil defense). Be wary of viral maps with no sources."
			},
			{
				h: "If you feel overwhelmed",
				p: "Global news can be heavy. Limit doomscrolling, talk to people you trust, and remember that understanding risk is different from living in constant alarm. For U.S. emergencies, rely on official alerts on your phone and local authorities."
			}
		]
	}
];
var DEFCON_CARDS = [
	{
		n: 5,
		name: "FADE OUT",
		color: "#3b82f6",
		mean: "Normal peacetime readiness"
	},
	{
		n: 4,
		name: "DOUBLE TAKE",
		color: "#22c55e",
		mean: "Increased intelligence watch"
	},
	{
		n: 3,
		name: "ROUND HOUSE",
		color: "#eab308",
		mean: "Forces above normal readiness"
	},
	{
		n: 2,
		name: "FAST PACE",
		color: "#f97316",
		mean: "Further increase; next to max"
	},
	{
		n: 1,
		name: "COCKED PISTOL",
		color: "#ef4444",
		mean: "Maximum readiness"
	}
];
function LearnPanel() {
	const [open, setOpen] = (0, import_react.useState)("start");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full min-h-[360px] flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-sky-400",
					children: "Learn · beginner guide"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-0.5 text-lg font-bold text-bright",
					children: "Geopolitics, nuclear threats & DEFCON — explained simply"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-3xl text-sm leading-relaxed text-muted",
					children: "No prior knowledge needed. Short chapters you can open in any order. Written for curious readers, not specialists."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-0 flex-1 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "min-h-0 overflow-y-auto border-b border-border p-2 lg:col-span-4 lg:border-b-0 lg:border-r",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: SECTIONS.map((s) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOpen(s.id),
							className: `w-full rounded-xl px-3 py-2.5 text-left transition-colors ${open === s.id ? "bg-sky-500/20 text-bright ring-1 ring-sky-400/40" : "text-muted hover:bg-white/5 hover:text-fg"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold",
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-[11px] leading-snug opacity-80",
								children: s.blurb
							})]
						}) }, s.id);
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 overflow-y-auto px-4 py-4 lg:col-span-8",
				children: SECTIONS.filter((s) => s.id === open).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold text-bright",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-sky-300/90",
							children: s.blurb
						}),
						s.id === "defcon" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-2 sm:grid-cols-5",
							children: DEFCON_CARDS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border px-2 py-2 text-center",
								style: {
									borderColor: d.color,
									background: `${d.color}18`
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold tracking-wide text-muted",
										children: "DEFCON"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-black",
										style: { color: d.color },
										children: d.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-semibold text-bright",
										children: d.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-[10px] leading-snug text-muted",
										children: d.mean
									})
								]
							}, d.n))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-4",
							children: s.body.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [block.h && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold text-bright",
								children: block.h
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-fg/90",
								children: block.p
							})] }, i))
						}),
						s.id === "start" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-xl border border-border bg-black/25 p-3 text-xs leading-relaxed text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-bright",
								children: "Quick tour:"
							}), " Conflicts desk = wars & live reports · Survivability = city readiness kit · Ships & Subs = naval picture · Live Intel = sensors & official RSS · Country = nuclear force cards · Scenarios = educational what-ifs."]
						})
					]
				}, s.id))
			})]
		})]
	});
}
var fetchLiveStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("647ac0deb4dc97949d584cac2704ffb771e88fddb51e3fe84d8c6931056bb178"));
function LiveStatusBar({ now }) {
	const [sources, setSources] = (0, import_react.useState)([]);
	const [fetchedAt, setFetchedAt] = (0, import_react.useState)(null);
	const [okCount, setOkCount] = (0, import_react.useState)(0);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const pull = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const data = await fetchLiveStatus();
			setSources(data.sources);
			setFetchedAt(data.fetchedAt);
			setOkCount(data.okCount);
			setTotal(data.total);
			setNote(data.note);
		} catch {} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		pull();
		const t = window.setInterval(pull, 12e4);
		return () => clearInterval(t);
	}, [pull]);
	const color = (s) => s === "ok" ? "#34d399" : s === "degraded" ? "#fbbf24" : "#f87171";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				className: "flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-wider text-emerald-400",
						children: "Live unclassified sources"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "chip tabular",
						style: {
							borderColor: "#34d399",
							color: "#6ee7b7"
						},
						children: [
							okCount,
							"/",
							total,
							" OK"
						]
					}),
					fetchedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-muted",
						children: [
							"probed ",
							formatRelative(fetchedAt, now),
							loading ? " · refreshing…" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto text-[11px] text-sky-300",
						children: [open ? "Hide" : "Show", " detail"]
					})
				]
			}),
			!open && sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5 border-t border-border px-4 py-2",
				children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "chip",
					style: {
						borderColor: color(s.status),
						color: color(s.status)
					},
					title: `${s.name}: ${s.detail}`,
					children: [
						s.status === "ok" ? "●" : s.status === "degraded" ? "◐" : "○",
						" ",
						s.id
					]
				}, s.id))
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-2 text-[11px] leading-relaxed text-muted",
						children: note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-72 overflow-y-auto",
						children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-0.5 border-b border-border/50 px-4 py-2.5 text-xs sm:flex-row sm:items-start sm:justify-between sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { color: color(s.status) },
												children: s.status === "ok" ? "●" : s.status === "degraded" ? "◐" : "○"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-bright",
												children: s.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "chip text-[10px]",
												children: s.classification
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "chip text-[10px]",
												children: s.category
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-muted",
										children: s.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-dim",
										children: s.legal
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 text-[10px] text-muted tabular",
								children: [s.latencyMs != null ? `${s.latencyMs} ms` : "", s.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: s.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-sky-300 hover:underline",
									children: "source"
								})] })]
							})]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end px-4 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "soft-btn",
							onClick: () => void pull(),
							disabled: loading,
							children: "Re-probe now"
						})
					})
				]
			})
		]
	});
}
var NATION_BORDERS = [
	{
		id: "us",
		name: "United States",
		label: {
			lon: -98,
			lat: 39
		},
		polygons: [[
			[-124.5, 48.5],
			[-117, 49],
			[-95, 49],
			[-83, 46.5],
			[-70, 45],
			[-67, 44.5],
			[-70, 41.5],
			[-74, 40],
			[-75.5, 37],
			[-76, 35],
			[-80, 32],
			[-81.5, 25.5],
			[-87, 30],
			[-94, 29.5],
			[-97.5, 26],
			[-104, 29],
			[-106.5, 31.5],
			[-111, 31.3],
			[-114.5, 32.5],
			[-117, 32.5],
			[-122, 37],
			[-124.5, 42],
			[-124.5, 48.5]
		], [
			[-168, 54],
			[-160, 55],
			[-150, 60],
			[-141, 60],
			[-141, 70],
			[-155, 71],
			[-165, 68],
			[-168, 65],
			[-168, 54]
		]],
		sites: [
			{
				name: "Malmstrom AFB (MM III)",
				lon: -111.2,
				lat: 47.5,
				kind: "silo"
			},
			{
				name: "Minot AFB (MM III)",
				lon: -101.3,
				lat: 48.4,
				kind: "silo"
			},
			{
				name: "F.E. Warren AFB (MM III)",
				lon: -104.9,
				lat: 41.1,
				kind: "silo"
			},
			{
				name: "Kings Bay SSBN",
				lon: -81.5,
				lat: 30.8,
				kind: "ssbn"
			},
			{
				name: "Bangor SSBN",
				lon: -122.7,
				lat: 47.7,
				kind: "ssbn"
			},
			{
				name: "Vandenberg test",
				lon: -120.6,
				lat: 34.7,
				kind: "test"
			},
			{
				name: "Pentagon / NMCC",
				lon: -77.1,
				lat: 38.9,
				kind: "c2"
			}
		]
	},
	{
		id: "ru",
		name: "Russian Federation",
		label: {
			lon: 90,
			lat: 60
		},
		polygons: [[
			[20, 55],
			[28, 60],
			[30, 70],
			[40, 68],
			[60, 70],
			[80, 72],
			[100, 72],
			[130, 70],
			[160, 65],
			[175, 62],
			[170, 55],
			[150, 50],
			[140, 48],
			[135, 45],
			[130, 43],
			[120, 50],
			[100, 52],
			[80, 50],
			[60, 50],
			[50, 48],
			[45, 45],
			[40, 44],
			[38, 48],
			[30, 50],
			[28, 54],
			[20, 55]
		]],
		sites: [
			{
				name: "Kozelsk / silo belt",
				lon: 35.8,
				lat: 54,
				kind: "silo"
			},
			{
				name: "Yasny (Sarmat test)",
				lon: 59.8,
				lat: 51.1,
				kind: "test"
			},
			{
				name: "Gadzhiyevo SSBN",
				lon: 33.3,
				lat: 69.3,
				kind: "ssbn"
			},
			{
				name: "Vilyuchinsk SSBN",
				lon: 158.4,
				lat: 52.9,
				kind: "ssbn"
			},
			{
				name: "National Defense Mgmt Ctr",
				lon: 37.6,
				lat: 55.75,
				kind: "c2"
			}
		]
	},
	{
		id: "cn",
		name: "China",
		label: {
			lon: 105,
			lat: 35
		},
		polygons: [[
			[74, 40],
			[80, 42],
			[90, 45],
			[100, 42],
			[110, 42],
			[120, 40],
			[122, 35],
			[120, 30],
			[115, 25],
			[110, 22],
			[108, 20],
			[100, 22],
			[95, 28],
			[90, 28],
			[80, 32],
			[75, 35],
			[74, 40]
		]],
		sites: [
			{
				name: "Yumen silo field",
				lon: 97,
				lat: 40.3,
				kind: "silo"
			},
			{
				name: "Hami silo field",
				lon: 93.5,
				lat: 42.8,
				kind: "silo"
			},
			{
				name: "Jilantai silo field",
				lon: 105.7,
				lat: 39.8,
				kind: "silo"
			},
			{
				name: "Hainan / Type 094",
				lon: 109.5,
				lat: 18.2,
				kind: "ssbn"
			},
			{
				name: "CMC / Beijing",
				lon: 116.4,
				lat: 39.9,
				kind: "c2"
			}
		]
	},
	{
		id: "fr",
		name: "France",
		label: {
			lon: 2.5,
			lat: 46.5
		},
		polygons: [[
			[-4.8, 48.5],
			[-2, 49.5],
			[2, 51],
			[4, 50],
			[7.5, 48.5],
			[7.5, 47.5],
			[6, 46],
			[7, 44],
			[7.5, 43.5],
			[3, 42.5],
			[-1.5, 43.3],
			[-1.8, 46.5],
			[-4.5, 48],
			[-4.8, 48.5]
		]],
		sites: [
			{
				name: "Île Longue SSBN",
				lon: -4.5,
				lat: 48.3,
				kind: "ssbn"
			},
			{
				name: "Istres / air leg",
				lon: 4.95,
				lat: 43.5,
				kind: "base"
			},
			{
				name: "Élysée / C2",
				lon: 2.3,
				lat: 48.87,
				kind: "c2"
			}
		]
	},
	{
		id: "uk",
		name: "United Kingdom",
		label: {
			lon: -2,
			lat: 54
		},
		polygons: [[
			[-5.5, 50],
			[-3, 50.5],
			[1.5, 51],
			[1.7, 52.5],
			[0, 53.5],
			[-2, 55.5],
			[-1.5, 57.5],
			[-3, 58.5],
			[-5, 57],
			[-6, 55.5],
			[-5, 54],
			[-4.5, 53],
			[-5.5, 51.5],
			[-5.5, 50]
		], [
			[-8.2, 54.1],
			[-5.5, 54.1],
			[-5.5, 55.3],
			[-7.5, 55.3],
			[-8.2, 54.5],
			[-8.2, 54.1]
		]],
		sites: [
			{
				name: "HMNB Clyde (Faslane)",
				lon: -4.82,
				lat: 56.07,
				kind: "ssbn"
			},
			{
				name: "Coulport",
				lon: -4.88,
				lat: 56.05,
				kind: "base"
			},
			{
				name: "Whitehall C2",
				lon: -.13,
				lat: 51.5,
				kind: "c2"
			}
		]
	},
	{
		id: "in",
		name: "India",
		label: {
			lon: 78,
			lat: 22
		},
		polygons: [[
			[68.2, 23.5],
			[70, 20],
			[72.5, 21],
			[73, 18],
			[74, 15],
			[77, 8],
			[80, 10],
			[80, 13],
			[82, 16],
			[87, 21],
			[89, 22],
			[88, 26],
			[85, 27],
			[80, 28],
			[77, 32],
			[74, 32],
			[72, 28],
			[70, 25],
			[68.2, 23.5]
		]],
		sites: [
			{
				name: "Agni / Integrated Test Range",
				lon: 87,
				lat: 20.8,
				kind: "test"
			},
			{
				name: "Visakhapatnam SSBN",
				lon: 83.3,
				lat: 17.7,
				kind: "ssbn"
			},
			{
				name: "New Delhi C2",
				lon: 77.2,
				lat: 28.6,
				kind: "c2"
			}
		]
	},
	{
		id: "pk",
		name: "Pakistan",
		label: {
			lon: 69,
			lat: 30
		},
		polygons: [[
			[61, 25],
			[66.5, 24],
			[68, 24],
			[71, 28],
			[73.5, 30],
			[75, 32],
			[74.5, 35],
			[73, 36.5],
			[71, 35],
			[70, 32],
			[66, 28],
			[62, 28],
			[61, 25]
		]],
		sites: [{
			name: "Southern storage belt",
			lon: 67,
			lat: 25.5,
			kind: "base"
		}, {
			name: "Islamabad C2",
			lon: 73.05,
			lat: 33.7,
			kind: "c2"
		}]
	},
	{
		id: "il",
		name: "Israel",
		label: {
			lon: 35,
			lat: 31.5
		},
		polygons: [[
			[34.2, 31.2],
			[34.5, 31.1],
			[35.1, 29.5],
			[35.5, 31.2],
			[35.6, 32.5],
			[35.1, 33.1],
			[34.9, 32.9],
			[34.5, 32],
			[34.2, 31.2]
		]],
		sites: [{
			name: "Dimona (assessed)",
			lon: 35.15,
			lat: 31,
			kind: "base"
		}, {
			name: "Tel Aviv C2",
			lon: 34.78,
			lat: 32.08,
			kind: "c2"
		}]
	},
	{
		id: "kp",
		name: "North Korea",
		label: {
			lon: 127,
			lat: 40
		},
		polygons: [[
			[124.3, 39.8],
			[125, 38],
			[126.5, 37.7],
			[128.5, 38.5],
			[129.5, 40.5],
			[130.5, 42],
			[129, 42.5],
			[128, 41.5],
			[126.5, 41],
			[124.5, 40.5],
			[124.3, 39.8]
		]],
		sites: [
			{
				name: "Yongbyon nuclear complex",
				lon: 125.75,
				lat: 39.8,
				kind: "base"
			},
			{
				name: "Punggye-ri test site",
				lon: 129.1,
				lat: 41.3,
				kind: "test"
			},
			{
				name: "Sohae launch",
				lon: 124.7,
				lat: 39.7,
				kind: "test"
			},
			{
				name: "Pyongyang C2",
				lon: 125.75,
				lat: 39.02,
				kind: "c2"
			}
		]
	}
];
function geoForNation(id) {
	return NATION_BORDERS.find((n) => n.id === id);
}
function NationPanel({ nation }) {
	if (!nation) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col justify-center p-4 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "tracking-wide",
			children: "SELECT A NATION ON THE MAP"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs",
			children: "CLICK TERRITORY BORDERS, FORCE NODES, OR TABLE ROWS"
		})]
	});
	const share = stockpileShare(nation);
	const geo = geoForNation(nation.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm tracking-widest text-bright crt-glow sm:text-base",
						children: nation.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted tabular",
						children: nation.short
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex flex-wrap gap-2 text-[10px] tracking-wide text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["TRIAD: ", nation.triad ? "YES" : "NO"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"THREAT IDX: ",
							nation.threatLevel,
							"/5"
						] }),
						geo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"GEO ",
							geo.label.lat.toFixed(1),
							"N ",
							Math.abs(geo.label.lon).toFixed(1),
							geo.label.lon >= 0 ? "E" : "W"
						] })] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-px border-b border-border bg-border",
				children: [
					["DEPLOYED STRAT", nation.deployedStrategic],
					["DEPLOYED NS", nation.deployedNonstrategic],
					["RESERVE", nation.reserve],
					["MIL STOCKPILE", nation.militaryStockpile]
				].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-panel px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] tracking-wider text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg tabular text-fg crt-glow",
						children: formatNum(val)
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[10px] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL INVENTORY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular text-fg",
							children: formatNum(nation.totalInventory)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-sm bg-dim",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-fg transition-[width] duration-500",
							style: { width: `${Math.max(2, Math.min(100, share))}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-[9px] text-muted tabular",
						children: [share.toFixed(1), "% OF GLOBAL INVENTORY"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "DOCTRINE",
						body: nation.doctrine
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "POSTURE",
						body: nation.posture
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "CLIMATE",
						body: nation.climateNote
					}),
					geo?.sites && geo.sites.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-widest text-muted",
							children: "STRATEGIC GEOGRAPHY"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-1",
							children: geo.sites.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-baseline justify-between gap-1 border border-border/60 bg-bg/30 px-2 py-1 text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: s.kind === "silo" ? "SILO" : s.kind === "ssbn" ? "SSBN" : s.kind === "test" ? "TEST" : s.kind === "c2" ? "C2" : "BASE"
										}),
										" ",
										s.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular text-muted",
									children: [
										s.lat.toFixed(1),
										"°, ",
										s.lon.toFixed(1),
										"°"
									]
								})]
							}, s.name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-[10px] tracking-widest text-muted",
						children: "DELIVERY SYSTEMS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-2",
						children: nation.systems.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border border-border/80 bg-bg/40 px-2 py-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[9px] text-muted",
										children: [s.type, s.mirv ? " · MIRV" : ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex flex-wrap gap-2 text-[9px] text-muted tabular",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["RANGE: ", s.rangeKm > 0 ? `${formatNum(s.rangeKm)} km` : "N/A (gravity)"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["STATUS: ", s.status.toUpperCase()] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] leading-snug text-muted",
									children: s.notes
								})
							]
						}, s.name))
					})
				]
			})
		]
	});
}
function Section({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] tracking-widest text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-[11px] leading-relaxed text-fg/90",
			children: body
		})]
	});
}
function NavalPanel({ units, ais, aisSource, fetchedAt, selectedSubId, onSelectSub, now }) {
	const ssbns = units.filter((u) => u.category === "ssbn");
	const live = units.filter((u) => u.trackSource === "ais-live");
	const patrol = ssbns.filter((s) => s.status === "patrol").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-accent",
						style: { color: "#a78bfa" },
						children: "Maritime units"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-sm font-bold text-bright",
						children: [
							patrol,
							" SSBN on patrol · ",
							live.length,
							" live AIS military/surface"
						]
					}),
					fetchedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted",
						children: [
							"Updated ",
							formatRelative(fetchedAt, now),
							" · ",
							aisSource
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5 border-b border-border px-3 py-2",
				children: Object.entries(CATEGORY_META).filter(([k]) => [
					"ssbn",
					"surface",
					"support",
					"tender",
					"merchant"
				].includes(k)).map(([k, meta]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "chip",
					style: {
						borderColor: meta.color,
						color: meta.color
					},
					title: meta.description,
					children: meta.short
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Strategic SSBNs (OSINT estimates)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: ssbns.map((u) => {
						const selected = selectedSubId === u.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelectSub(selected ? null : u.id),
							className: `flex w-full items-start gap-3 border-b border-border/60 px-4 py-2.5 text-left transition-colors ${selected ? "bg-white/10" : "hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 h-3 w-3 shrink-0 rounded-full",
								style: { background: u.color }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-semibold text-bright",
										children: u.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted",
										children: [
											u.nationLabel,
											" · ",
											u.className,
											" · ",
											u.status,
											u.missiles ? ` · ${u.missiles}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-0.5 block text-[11px] text-dim",
										children: [
											u.trackSource === "osint-estimate" ? "EST track" : "LIVE AIS",
											" ·",
											" ",
											u.speedKn.toFixed(0),
											" kn · ",
											u.lat.toFixed(1),
											"°, ",
											u.lon.toFixed(1),
											"°"
										]
									})
								]
							})]
						}) }, u.id);
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Home ports"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "px-4 pb-2",
						children: HOME_PORTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between py-1 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-dim",
								children: [
									p.lat.toFixed(1),
									"° ",
									p.lon.toFixed(1),
									"°"
								]
							})]
						}, p.id))
					}),
					live.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Live AIS units (Baltic)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: live.slice(0, 16).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 border-b border-border/40 px-4 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2.5 w-2.5 shrink-0 rounded-full",
								style: { background: u.color }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate text-fg",
								children: u.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip",
								style: {
									borderColor: u.color,
									color: u.color
								},
								children: CATEGORY_META[u.category].short
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-muted",
								children: [u.speedKn.toFixed(0), " kn"]
							})
						]
					}, u.id)) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-4 py-2 text-[11px] leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-fg",
						children: "SSBN"
					}),
					" = ballistic missile submarine (strategic). Tracks are open-source estimates while submerged. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-fg",
						children: "AIS"
					}),
					" = live surface contacts (",
					ais.length,
					" raw)."
				]
			})
		]
	});
}
function settlementType(place) {
	const k = `${place.kind} ${place.displayName}`.toLowerCase();
	if (/city|municipality|borough/.test(k) || place.importance > .55) return "city";
	if (/town|suburb/.test(k) || place.importance > .35) return "town";
	if (/village|hamlet|locality/.test(k)) return "village";
	if (/isolated|farm|rural/.test(k)) return "rural";
	return place.importance > .4 ? "town" : "unknown";
}
function climateBand(lat) {
	const a = Math.abs(lat);
	if (a >= 66) return "arctic";
	if (a >= 50) return "cold";
	if (a <= 15) return "tropical";
	if (a <= 30) return "hot";
	return "temperate";
}
function collectTargets() {
	const targets = [];
	for (const n of nations) targets.push({
		name: `${n.short} C2 / capital area`,
		kind: "c2",
		lat: n.lat,
		lon: n.lon
	});
	for (const g of NATION_BORDERS) for (const s of g.sites ?? []) targets.push({
		name: s.name,
		kind: s.kind,
		lat: s.lat,
		lon: s.lon
	});
	for (const p of HOME_PORTS) targets.push({
		name: p.name,
		kind: "ssbn-base",
		lat: p.lat,
		lon: p.lon
	});
	for (const z of WATCH_ZONES) targets.push({
		name: z.name,
		kind: z.kind,
		lat: z.lat,
		lon: z.lon
	});
	return targets;
}
var ALL_TARGETS = collectTargets();
function baseKit(settlement, climate) {
	const items = [
		{
			id: "water",
			name: "Drinking water (sealed)",
			category: "water",
			priority: 1,
			qtyHint: settlement === "city" ? "4 L / person / day × 7–14 days" : "4 L / person / day × 14 days",
			reason: "Utilities fail first after blast, EMP-like disruption, or infrastructure damage"
		},
		{
			id: "water-filter",
			name: "Portable water filter + purification tabs",
			category: "water",
			priority: 1,
			reason: "Backup when stored water runs out"
		},
		{
			id: "food",
			name: "Non-perishable calorie food",
			category: "food",
			priority: 1,
			qtyHint: "2,000+ kcal / person / day × 7–14 days",
			reason: "Stores and supply chains may close during crisis"
		},
		{
			id: "radio",
			name: "Battery / hand-crank NOAA or AM/FM radio",
			category: "comms",
			priority: 1,
			reason: "Official alerts (EAS/WEA) and news when phones/networks fail"
		},
		{
			id: "light",
			name: "Flashlights + spare batteries / headlamps",
			category: "tools",
			priority: 1,
			reason: "Power outages; avoid open flames indoors during sheltering"
		},
		{
			id: "firstaid",
			name: "First-aid kit + personal medications (14+ days)",
			category: "medical",
			priority: 1,
			reason: "Emergency rooms overload; pharmacies may close"
		},
		{
			id: "docs",
			name: "IDs, cash, copies of critical documents (waterproof pouch)",
			category: "docs",
			priority: 1,
			reason: "Evacuation, medical access, and family reunification"
		},
		{
			id: "whistle",
			name: "Whistle, multi-tool, duct tape, work gloves",
			category: "tools",
			priority: 2,
			reason: "Signaling, light debris, and shelter sealing"
		},
		{
			id: "hygiene",
			name: "Hygiene kit, trash bags, bleach (unscented)",
			category: "tools",
			priority: 2,
			reason: "Sanitation when water service is limited"
		}
	];
	if (settlement === "city") {
		items.push({
			id: "go-bag",
			name: "Go-bag (ready to evacuate in 5 minutes)",
			category: "tools",
			priority: 1,
			reason: "Dense urban areas may order rapid evacuation or shelter-in-place"
		});
		items.push({
			id: "n95",
			name: "N95 / P100 respirators (fitted)",
			category: "nuclear",
			priority: 1,
			qtyHint: "Several per person",
			reason: "Dust, smoke, and fallout particulates after explosions or fires"
		});
	}
	if (settlement === "village" || settlement === "rural") items.push({
		id: "fuel",
		name: "Safe fuel for cooking/heating + carbon monoxide detector",
		category: "tools",
		priority: 2,
		reason: "Rural power and fuel logistics are slower to restore"
	});
	if (climate === "arctic" || climate === "cold") items.push({
		id: "warm",
		name: "Cold-weather layers, sleeping bags (0°F / −18°C rated)",
		category: "climate",
		priority: 1,
		reason: "Shelter without heat is life-threatening in cold climates"
	}, {
		id: "heat-safe",
		name: "Indoor-safe heat plan (never charcoal indoors)",
		category: "climate",
		priority: 1,
		reason: "CO poisoning risk during blackouts"
	});
	if (climate === "hot" || climate === "tropical") items.push({
		id: "cool",
		name: "Electrolyte packets, shade tarp, extra water margin",
		category: "climate",
		priority: 1,
		reason: "Heat injury risk rises without power for cooling"
	});
	return items;
}
function nuclearItems(minTargetKm, nearWatch) {
	const items = [
		{
			id: "shelter-plan",
			name: "Shelter-in-place plan (interior room, few windows)",
			category: "shelter",
			priority: 1,
			reason: "Fallout is most dangerous in the first 24–48 hours; thick walls + distance help"
		},
		{
			id: "plastic-tape",
			name: "Plastic sheeting + tape for sealing one room",
			category: "shelter",
			priority: 2,
			reason: "Reduces dust/fallout infiltration while sheltering"
		},
		{
			id: "clothes-change",
			name: "Spare sealed clothes + zip bags for contaminated outer layers",
			category: "nuclear",
			priority: 2,
			reason: "Remove outer clothing to cut external contamination if exposed outdoors"
		}
	];
	if (minTargetKm < 80 || nearWatch) {
		items.push({
			id: "ki",
			name: "Potassium iodide (KI) — only if public health directs",
			category: "nuclear",
			priority: 2,
			reason: "Near potential nuclear targets / fallout corridors; use only on official instruction"
		});
		items.push({
			id: "dosimeter",
			name: "Optional personal radiation detector (if available)",
			category: "nuclear",
			priority: 3,
			reason: "Helps time outdoor movement after fallout; not required for basic readiness"
		});
	}
	if (minTargetKm < 25) items.push({
		id: "evacuation-route",
		name: "Two printed evacuation routes away from blast / downwind areas",
		category: "docs",
		priority: 1,
		reason: "Very close to strategic sites — know how to leave before roads clog"
	});
	return items;
}
function buildSurvivalProfile(place) {
	const settlement = settlementType(place);
	const climate = climateBand(place.lat);
	const nearestTargets = ALL_TARGETS.map((t) => ({
		name: t.name,
		kind: t.kind,
		distanceKm: Math.round(haversineKm(place.lat, place.lon, t.lat, t.lon))
	})).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
	const minTargetKm = nearestTargets[0]?.distanceKm ?? 9999;
	const nearWatch = WATCH_ZONES.some((z) => haversineKm(place.lat, place.lon, z.lat, z.lon) <= z.radiusKm * 1.5);
	let risk = 10;
	if (minTargetKm < 15) risk += 45;
	else if (minTargetKm < 50) risk += 30;
	else if (minTargetKm < 150) risk += 18;
	else if (minTargetKm < 400) risk += 8;
	if (settlement === "city") risk += 12;
	if (settlement === "town") risk += 6;
	if (nearWatch) risk += 10;
	if (nearestTargets.some((t) => t.kind === "silo" && t.distanceKm < 100)) risk += 12;
	if (nearestTargets.some((t) => t.kind === "ssbn-base" && t.distanceKm < 80)) risk += 8;
	const nuclearCountries = /* @__PURE__ */ new Set([
		"US",
		"RU",
		"CN",
		"FR",
		"GB",
		"IN",
		"PK",
		"IL",
		"KP"
	]);
	if (place.countryCode && nuclearCountries.has(place.countryCode)) risk += 6;
	risk = Math.min(100, risk);
	let riskBand = "low";
	if (risk >= 70) riskBand = "high";
	else if (risk >= 45) riskBand = "elevated";
	else if (risk >= 25) riskBand = "moderate";
	const riskColor = riskBand === "high" ? "#f87171" : riskBand === "elevated" ? "#fb923c" : riskBand === "moderate" ? "#fbbf24" : "#34d399";
	const factors = [
		`Settlement type: ${settlement}`,
		`Climate band: ${climate}`,
		`Nearest mapped strategic site: ${nearestTargets[0]?.name ?? "n/a"} (~${minTargetKm} km)`
	];
	if (nearWatch) factors.push("Inside / near a nuclear-relevant watch zone");
	if (place.country) factors.push(`Country: ${place.country}`);
	const items = [...baseKit(settlement, climate), ...nuclearItems(minTargetKm, nearWatch)].sort((a, b) => a.priority - b.priority);
	const seen = /* @__PURE__ */ new Set();
	const unique = items.filter((i) => {
		if (seen.has(i.id)) return false;
		seen.add(i.id);
		return true;
	});
	const actions = [
		"Learn local public-alert channels (phone WEA, radio, sirens).",
		"Pick an interior shelter room and practice sealing it once.",
		"Store water/food where you can reach them in the dark.",
		"If advised to shelter: go in, stay in, tune in — wait for official “all clear”.",
		"Only take potassium iodide if public health officials say so."
	];
	if (minTargetKm < 50) actions.unshift("Because you are relatively close to a mapped strategic site, prioritize early warning + a ready go-bag.");
	if (settlement === "city") actions.push("Have a family meeting point outside your neighborhood if phones fail.");
	const summary = riskBand === "high" ? `${place.name} scores high on this educational proximity model (near strategic geography and/or dense urban). Prioritize shelter, water, medical, and official-alert readiness.` : riskBand === "elevated" ? `${place.name} has elevated educational risk factors. Keep a solid 7–14 day kit and a clear shelter / evacuate plan.` : riskBand === "moderate" ? `${place.name} is moderate on this model. A standard emergency kit plus basic nuclear shelter knowledge is appropriate.` : `${place.name} is relatively lower on this strategic-proximity model. Maintain a normal emergency kit and alert plan.`;
	return {
		place,
		riskBand,
		riskScore: risk,
		riskColor,
		summary,
		factors,
		nearestTargets,
		climate,
		settlement,
		items: unique,
		actions,
		disclaimer: "Educational readiness guidance only — not an official warning, medical advice, or prediction of attack. Follow your national civil-defense / FEMA / local emergency management instructions. Risk scores use open geographic proximity heuristics, not classified targeting data."
	};
}
var searchPlaces = createServerFn({ method: "GET" }).validator((q) => String(q ?? "")).handler(createSsrRpc("1e41d8fc665db2805a2587692966ab0f16962dfa80a65feb47fa3e342c19a904"));
var CAT_COLOR = {
	water: "#38bdf8",
	food: "#fbbf24",
	shelter: "#a78bfa",
	medical: "#f87171",
	comms: "#34d399",
	nuclear: "#fb7185",
	tools: "#94a3b8",
	docs: "#c084fc",
	climate: "#2dd4bf"
};
function PlaceSearch({ onSelectPlace, selectedPlace, profile }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const runSearch = (0, import_react.useCallback)(async (query) => {
		if (query.trim().length < 2) {
			setHits([]);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await searchPlaces({ data: query.trim() });
			setHits(res.results);
			if (res.error) setError(res.error);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Search failed");
			setHits([]);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (q.trim().length < 2) {
			setHits([]);
			return;
		}
		const t = window.setTimeout(() => void runSearch(q), 400);
		return () => clearTimeout(t);
	}, [q, runSearch]);
	const pick = (place) => {
		onSelectPlace(place, buildSurvivalProfile(place));
		setHits([]);
		setQ(place.name);
	};
	const items = (0, import_react.useMemo)(() => {
		if (!profile) return [];
		if (filter === "all") return profile.items;
		return profile.items.filter((i) => i.category === filter);
	}, [profile, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider",
					style: { color: "#38bdf8" },
					children: "Place search"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-sm font-bold text-bright",
					children: "City, town, or village → survivability kit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "search",
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search anywhere… e.g. Hiroshima, Omaha, Kyiv, Lagos",
						className: "w-full rounded-xl border border-border bg-black/30 px-3 py-2.5 text-sm text-bright outline-none placeholder:text-dim focus:border-sky-400",
						"aria-label": "Search for a city, town, or village"
					}), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted",
						children: "Searching…"
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-xs text-danger",
					children: error
				}),
				hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 max-h-48 overflow-y-auto rounded-xl border border-border bg-[#0f172a]",
					children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => pick(h),
						className: "flex w-full flex-col px-3 py-2 text-left hover:bg-white/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-bright",
							children: h.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-xs text-muted",
							children: h.displayName
						})]
					}) }, h.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: !profile || !selectedPlace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Search any populated place on Earth. You’ll get a plain-language readiness list tailored to climate, settlement size, and proximity to open-source strategic sites." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"Washington",
						"Moscow",
						"Beijing",
						"London",
						"Karachi",
						"Anchorage",
						"Suva"
					].map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "soft-btn",
						onClick: () => setQ(example),
						children: example
					}, example))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border px-3 py-3",
						style: {
							borderColor: profile.riskColor,
							background: `${profile.riskColor}18`
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-bold text-bright",
									children: selectedPlace.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted",
									children: selectedPlace.displayName
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-bold uppercase tracking-wide",
										style: { color: profile.riskColor },
										children: [profile.riskBand, " readiness focus"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tabular text-sm text-muted",
										children: [
											"score ",
											profile.riskScore,
											"/100"
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-fg",
								children: profile.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chip",
										children: profile.settlement
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chip",
										children: profile.climate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "chip tabular",
										children: [
											selectedPlace.lat.toFixed(2),
											"°, ",
											selectedPlace.lon.toFixed(2),
											"°"
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Why this kit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 text-xs text-muted",
						children: profile.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", f] }, f))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Nearest mapped strategic sites"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: profile.nearestTargets.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2 text-xs text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: t.kind
									}),
									" · ",
									t.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 tabular text-muted",
								children: [t.distanceKm, " km"]
							})]
						}, t.name + t.distanceKm))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex flex-wrap gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `soft-btn ${filter === "all" ? "active" : ""}`,
							onClick: () => setFilter("all"),
							children: "All items"
						}), [
							"nuclear",
							"water",
							"food",
							"shelter",
							"medical",
							"comms",
							"climate",
							"tools"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `soft-btn ${filter === c ? "active" : ""}`,
							onClick: () => setFilter(c),
							children: c
						}, c))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl border border-border bg-black/20 px-3 py-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "chip capitalize",
											style: {
												borderColor: CAT_COLOR[item.category],
												color: CAT_COLOR[item.category]
											},
											children: item.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "chip",
											children: ["P", item.priority]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-bright",
											children: item.name
										})
									]
								}),
								item.qtyHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs font-medium text-sky-300",
									children: item.qtyHint
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: item.reason
								})
							]
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "What to do"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "list-decimal space-y-1 pl-4 text-xs text-fg",
						children: profile.actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a }, a))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-dim",
						children: profile.disclaimer
					})
				]
			})
		})]
	});
}
function ScenarioPanel({ scenarios, active, onSelect, animating, onRun }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] tracking-[0.25em] text-muted",
					children: "GAME LIST — SCENARIOS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-bright crt-glow",
					children: "HOW ABOUT A NICE GAME OF..."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-40 overflow-y-auto border-b border-border sm:max-h-48",
				children: scenarios.map((s) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect(s.id),
						className: `flex w-full items-center gap-2 border-b border-border/50 px-3 py-2 text-left text-[11px] transition-colors ${s.id === active.id ? "bg-fg/10 text-bright" : "text-fg hover:bg-fg/5"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `tabular ${s.defcon <= 2 ? "text-danger" : "text-muted"}`,
							children: ["D", s.defcon]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate tracking-wide",
							children: s.name
						})]
					}, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm tracking-wide text-bright crt-glow",
						children: active.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[11px] text-fg/90",
						children: active.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-[10px] tracking-widest text-muted",
						children: "ACTORS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex flex-wrap gap-1",
						children: active.actors.map((id) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "border border-border px-1.5 py-0.5 text-[10px] text-fg",
								children: nationById(id)?.short ?? id
							}, id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-[10px] tracking-widest text-muted",
						children: "SYSTEMS IN PLAY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-0.5 text-[10px] text-muted",
						children: active.techInvolved.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", t] }, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 border border-border bg-bg/50 px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] tracking-widest text-muted",
							children: "ASSESSED OUTCOME"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-1 text-[11px] leading-snug ${active.defcon === 1 ? "text-danger crt-glow" : "text-fg"}`,
							children: active.outcome
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onRun,
					disabled: active.trajectories.length === 0 && active.id !== "status-quo",
					className: "w-full border border-fg/40 bg-fg/10 px-3 py-2.5 text-xs tracking-[0.2em] text-bright transition-colors hover:bg-fg/20 disabled:cursor-not-allowed disabled:opacity-40",
					children: animating ? "SIMULATION RUNNING..." : active.trajectories.length === 0 ? "LOAD BASELINE POSTURE" : "RUN TRAJECTORY SIM"
				})
			})
		]
	});
}
/** Map our nuclear force ids ↔ ISO 3166-1 alpha-2 (Natural Earth) */
var NUCLEAR_ISO = {
	us: "US",
	ru: "RU",
	cn: "CN",
	fr: "FR",
	uk: "GB",
	in: "IN",
	pk: "PK",
	il: "IL",
	kp: "KP"
};
var ISO_TO_NUCLEAR = Object.fromEntries(Object.entries(NUCLEAR_ISO).map(([id, iso]) => [iso, id]));
/** ISO codes of states hosting US non-strategic nuclear weapons (NATO sharing) */
var NATO_NUCLEAR_HOST_ISO = /* @__PURE__ */ new Set([
	"BE",
	"DE",
	"IT",
	"NL",
	"TR"
]);
var SEV_STYLE = {
	critical: "border-danger text-danger",
	high: "border-warn text-warn",
	elevated: "border-sky-400/50 text-sky-300",
	info: "border-border text-muted"
};
function liveToDisplay(it) {
	return {
		id: it.id,
		title: it.title,
		summary: it.summary,
		link: it.link,
		publishedAt: it.publishedAt,
		source: it.source,
		regionLabel: it.regionLabel,
		region: it.region,
		severity: it.severity,
		actors: it.actors,
		category: it.category,
		live: true
	};
}
function curatedFallback() {
	return THREAT_NEWS.map((n) => ({
		id: `curated-${n.id}`,
		title: n.headline,
		summary: n.summary,
		link: n.sourceUrl,
		publishedAt: n.publishedAt,
		source: n.source,
		regionLabel: n.region,
		region: "ARCHIVE",
		severity: n.severity,
		actors: n.actors,
		category: n.category,
		live: false
	}));
}
function ThreatNewsFeed({ filterNationId, onSelectNation, externalItems, externalFetchedAt, externalFeedCount }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [localItems, setLocalItems] = (0, import_react.useState)(() => curatedFallback());
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [fetchedAt, setFetchedAt] = (0, import_react.useState)(null);
	const [feedCount, setFeedCount] = (0, import_react.useState)(0);
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const [category, setCategory] = (0, import_react.useState)("all");
	const [regionFilter, setRegionFilter] = (0, import_react.useState)("all");
	const [pulse, setPulse] = (0, import_react.useState)("Connecting to news mesh…");
	const useExternal = Array.isArray(externalItems);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!useExternal) return;
		if (externalItems && externalItems.length > 0) {
			setStatus("live");
			setFetchedAt(externalFetchedAt ?? null);
			setFeedCount(externalFeedCount ?? 0);
			setPulse(`Live · ${externalItems.length} items · ${externalFeedCount ?? 0} feeds`);
			return;
		}
		setStatus("loading");
		setPulse("Waiting for live news…");
		const t = window.setTimeout(() => {
			setStatus("fallback");
			setPulse("Live mesh empty — showing archive");
			setLocalItems(curatedFallback());
		}, 12e3);
		return () => clearTimeout(t);
	}, [
		useExternal,
		externalItems,
		externalFetchedAt,
		externalFeedCount
	]);
	const load = (0, import_react.useCallback)(async (silent = false) => {
		if (useExternal) return;
		if (!silent) setStatus((s) => s === "live" ? s : "loading");
		setPulse("Scanning world newswires…");
		try {
			const data = await fetchLiveNuclearNews();
			if (data.items.length > 0) {
				setLocalItems(data.items.map(liveToDisplay));
				setFetchedAt(data.fetchedAt);
				setFeedCount(data.feedCount);
				setStatus("live");
				setPulse(`Live · ${data.items.length} items · ${data.feedCount} feeds`);
			} else {
				setLocalItems(curatedFallback());
				setStatus("fallback");
				setPulse("Archive fallback");
			}
		} catch {
			setLocalItems(curatedFallback());
			setStatus("fallback");
			setPulse("Offline — archive mode");
		}
	}, [useExternal]);
	(0, import_react.useEffect)(() => {
		if (useExternal) return;
		load();
		const t = window.setInterval(() => void load(true), 9e4);
		return () => clearInterval(t);
	}, [load, useExternal]);
	const items = (0, import_react.useMemo)(() => {
		if (useExternal && externalItems && externalItems.length > 0) return externalItems.map(liveToDisplay);
		return localItems.length ? localItems : curatedFallback();
	}, [
		useExternal,
		externalItems,
		localItems
	]);
	const regions = (0, import_react.useMemo)(() => {
		const set = new Set(items.map((i) => i.region));
		return ["all", ...Array.from(set).sort()];
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = items;
		if (category !== "all") list = list.filter((i) => i.category === category);
		if (regionFilter !== "all") list = list.filter((i) => i.region === regionFilter);
		if (filterNationId) {
			const iso = NUCLEAR_ISO[filterNationId];
			const short = nationById(filterNationId)?.name.split(" ")[0]?.toLowerCase() ?? "___";
			list = list.filter((i) => i.actors.includes(filterNationId) || i.region === iso || i.title.toLowerCase().includes(short));
		}
		return list;
	}, [
		items,
		category,
		regionFilter,
		filterNationId
	]);
	const criticalCount = filtered.filter((i) => i.severity === "critical" || i.severity === "high").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crt-panel flex h-full min-h-[320px] flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-sky-400",
						children: "Global nuclear news"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: pulse
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: status === "live" ? "text-emerald-400" : status === "loading" ? "text-warn" : "text-muted",
							children: status === "live" ? "● LIVE" : status === "loading" ? "○ SYNC" : "◌ ARCHIVE"
						}), !useExternal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void load(),
							className: "soft-btn",
							children: "Refresh"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-1",
					children: [
						[
							"all",
							"test",
							"treaty",
							"posture",
							"analysis",
							"exercise"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCategory(c),
							className: `soft-btn ${category === c ? "active" : ""}`,
							children: c
						}, c)),
						regions.slice(0, 10).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setRegionFilter(r),
							className: `soft-btn ${regionFilter === r ? "active" : ""}`,
							children: r
						}, r)),
						filterNationId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelectNation(""),
							className: "soft-btn",
							children: ["Clear ", nationById(filterNationId)?.short]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 text-[11px] text-muted tabular",
					children: [
						filtered.length,
						" shown · ",
						criticalCount,
						" high/crit",
						fetchedAt ? ` · ${formatRelative(fetchedAt, now)}` : "",
						feedCount ? ` · ${feedCount} feeds` : ""
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: status === "loading" && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 text-sm text-muted crt-pulse",
				children: "Syncing news…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 text-sm text-muted",
				children: "No matches for this filter"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border-b border-border/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setExpanded((e) => e === item.id ? null : item.id),
					className: "flex w-full flex-col gap-1 px-4 py-2.5 text-left hover:bg-white/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full border px-1.5 py-0.5 uppercase ${SEV_STYLE[item.severity]}`,
									children: item.severity
								}),
								item.live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-400",
									children: "LIVE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted tabular",
									children: formatRelative(item.publishedAt, now)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-dim",
									children: item.regionLabel
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium leading-snug text-bright",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted",
							children: item.source
						})
					]
				}), expanded === item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-t border-border/40 bg-black/20 px-4 py-3 text-sm text-fg/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "leading-relaxed",
						children: item.summary
					}), item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.link,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-block rounded-full border border-sky-500/40 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/10",
						children: "Open article"
					})]
				})]
			}, item.id)) })
		})]
	});
}
/** Equirectangular projection for world map viewBox 0..W x 0..H */
var MAP_W = 1e3;
function project(lat, lon, w = MAP_W, h = 500) {
	let L = lon;
	if (L > 180) L -= 360;
	if (L < -180) L += 360;
	return {
		x: (L + 180) / 360 * w,
		y: (90 - lat) / 180 * h
	};
}
function ringToPath(ring) {
	if (!ring.length) return "";
	const pts = ring.map(([lon, lat]) => project(lat, lon));
	let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
	for (let i = 1; i < pts.length; i++) d += `L${pts[i].x.toFixed(2)},${pts[i].y.toFixed(2)}`;
	return d + "Z";
}
/** GeoJSON Polygon or MultiPolygon → SVG path `d` */
function geometryToPath(geometry) {
	if (geometry.type === "Polygon") return geometry.coordinates.map((ring) => ringToPath(ring)).join("");
	if (geometry.type === "MultiPolygon") return geometry.coordinates.map((poly) => poly.map((ring) => ringToPath(ring)).join("")).join("");
	return "";
}
function controlPoint(from, to) {
	const mx = (from.x + to.x) / 2;
	const my = (from.y + to.y) / 2;
	const dist = Math.hypot(to.x - from.x, to.y - from.y);
	return {
		x: mx,
		y: my - Math.min(120, Math.max(30, dist * .22))
	};
}
function arcPath(from, to) {
	const c = controlPoint(from, to);
	return `M ${from.x} ${from.y} Q ${c.x} ${c.y} ${to.x} ${to.y}`;
}
function pointOnArc(from, to, t) {
	const c = controlPoint(from, to);
	const u = 1 - t;
	return {
		x: u * u * from.x + 2 * u * t * c.x + t * t * to.x,
		y: u * u * from.y + 2 * u * t * c.y + t * t * to.y
	};
}
function radiusToMapDelta(km, lat) {
	const degLat = km / 111;
	const degLon = km / (111 * Math.max(.2, Math.cos(lat * Math.PI / 180)));
	return Math.max(degLat, degLon) * .55;
}
var NUCLEAR_FILL = {
	us: "#1d4ed8",
	ru: "#b91c1c",
	cn: "#b45309",
	fr: "#0e7490",
	uk: "#6d28d9",
	in: "#15803d",
	pk: "#4d7c0f",
	il: "#0369a1",
	kp: "#9f1239"
};
function WorldMap({ nations, selectedId, onSelect, scenario, animating, showSites = true, showSubs = true, showAis = true, showConflicts = true, subs = [], homePorts = [], ais = [], selectedSubId = null, onSelectSub, seismic = [], searchedPlace = null, selectedConflictId = null, onSelectConflict, conflicts = ARMED_CONFLICTS }) {
	const [countries, setCountries] = (0, import_react.useState)([]);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [hover, setHover] = (0, import_react.useState)(null);
	const raf = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/geo/world.json");
				if (!res.ok) return;
				const data = await res.json();
				if (cancelled) return;
				setCountries(data.features.map((ft) => {
					const iso = (ft.properties.iso || ft.properties.id || "").toUpperCase();
					return {
						iso,
						name: ft.properties.name || ft.properties.admin || iso,
						path: geometryToPath(ft.geometry),
						nuclearId: ISO_TO_NUCLEAR[iso] ?? null,
						isHost: NATO_NUCLEAR_HOST_ISO.has(iso)
					};
				}).filter((c) => c.path.length > 0));
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!animating || scenario.trajectories.length === 0) {
			setProgress(0);
			return;
		}
		const start = performance.now();
		const tick = (t) => {
			const p = Math.min(1, (t - start) / 4200);
			setProgress(p);
			if (p < 1) raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => {
			if (raf.current) cancelAnimationFrame(raf.current);
		};
	}, [
		animating,
		scenario.id,
		scenario.trajectories.length
	]);
	const selectedIso = selectedId ? NUCLEAR_ISO[selectedId] : null;
	const arcs = (0, import_react.useMemo)(() => {
		return scenario.trajectories.map(([a, b], i) => {
			const na = nationById(a);
			const nb = nationById(b);
			if (!na || !nb) return null;
			return {
				id: `${a}-${b}-${i}`,
				path: arcPath(project(na.lat, na.lon), project(nb.lat, nb.lon)),
				from: project(na.lat, na.lon),
				to: project(nb.lat, nb.lon)
			};
		}).filter(Boolean);
	}, [scenario]);
	const selectedSites = (0, import_react.useMemo)(() => {
		if (!showSites || !selectedId) return [];
		return geoForNation(selectedId)?.sites ?? [];
	}, [selectedId, showSites]);
	countries.filter((c) => c.nuclearId).length;
	const watchSeismic = seismic.filter((e) => e.nuclearRelevance !== "background");
	const searchPin = searchedPlace ? project(searchedPlace.lat, searchedPlace.lon) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full w-full overflow-hidden rounded-xl border border-border bg-[#0a1628]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${MAP_W} 500`,
			className: "h-full w-full",
			role: "img",
			"aria-label": "Realtime world geopolitical map",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "ocean",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#0c1a32"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#07101f"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
						id: "grid",
						width: "50",
						height: "25",
						patternUnits: "userSpaceOnUse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M 50 0 L 0 0 0 25",
							fill: "none",
							stroke: "#1e3a5f",
							strokeWidth: "0.35"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
						id: "glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
							stdDeviation: "1.8",
							result: "b"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "b" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: MAP_W,
					height: 500,
					fill: "url(#ocean)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: MAP_W,
					height: 500,
					fill: "url(#grid)",
					pointerEvents: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: countries.map((c) => {
					const isNuclear = !!c.nuclearId;
					const isSelected = selectedId && c.nuclearId === selectedId || selectedIso && c.iso === selectedIso;
					const isHover = hover?.iso === c.iso;
					let fill = "#1a2740";
					let stroke = "#2d4063";
					let sw = .4;
					if (c.isHost && !isNuclear) {
						fill = "#1e3a4a";
						stroke = "#2dd4bf";
					}
					if (isNuclear && c.nuclearId) {
						fill = (NUCLEAR_FILL[c.nuclearId] ?? "#334155") + "cc";
						stroke = "#e2e8f0";
						sw = .7;
					}
					if (isSelected) {
						fill = "#38bdf8aa";
						stroke = "#7dd3fc";
						sw = 1.4;
					} else if (isHover) {
						stroke = "#f8fafc";
						sw = 1;
					}
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: c.path,
						fill,
						stroke,
						strokeWidth: sw,
						className: "cursor-pointer",
						onClick: () => {
							if (c.nuclearId) onSelect(c.nuclearId);
						},
						onMouseEnter: (e) => {
							const svg = e.currentTarget.ownerSVGElement;
							if (!svg) return;
							const pt = svg.createSVGPoint();
							pt.x = e.clientX;
							pt.y = e.clientY;
							const ctm = svg.getScreenCTM();
							if (!ctm) return;
							const sp = pt.matrixTransform(ctm.inverse());
							setHover({
								iso: c.iso,
								name: c.name,
								x: sp.x,
								y: sp.y
							});
						},
						onMouseLeave: () => setHover(null),
						"aria-label": c.name
					}, c.iso + c.name);
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
					pointerEvents: "none",
					opacity: "0.55",
					children: WATCH_ZONES.filter((z) => z.kind === "test-site" || z.kind === "flashpoint").map((z) => {
						const p = project(z.lat, z.lon);
						const d = radiusToMapDelta(z.radiusKm, z.lat);
						const r = Math.abs(project(z.lat + d, z.lon).y - p.y);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: p.x,
							cy: p.y,
							r: Math.max(4, r),
							fill: "none",
							stroke: z.kind === "test-site" ? "#fbbf24" : "#f472b6",
							strokeWidth: "0.7",
							strokeDasharray: "3 2"
						}, z.id);
					})
				}),
				seismic.slice(0, 45).map((e) => {
					const p = project(e.lat, e.lon);
					const relevant = e.nuclearRelevance !== "background";
					if (!relevant && e.mag < 5) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: p.x,
						cy: p.y,
						r: 1.3 + e.mag * .55,
						fill: e.nuclearRelevance === "elevated" ? "#f87171" : e.nuclearRelevance === "watch" ? "#fbbf24" : "#64748b",
						opacity: relevant ? .95 : .4,
						pointerEvents: "none"
					}, e.id);
				}),
				showAis && ais.map((a) => {
					const p = project(a.lat, a.lon);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: p.x,
						cy: p.y,
						r: a.militaryLikely ? 2.4 : 1.15,
						fill: a.militaryLikely ? "#fbbf24" : "#475569",
						opacity: a.militaryLikely ? .95 : .45,
						pointerEvents: "none"
					}, `ais-${a.mmsi}`);
				}),
				showSubs && homePorts.map((hp) => {
					const p = project(hp.lat, hp.lon);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: p.x - 3.5,
						y: p.y - 3.5,
						width: 7,
						height: 7,
						fill: "none",
						stroke: "#2dd4bf",
						strokeWidth: "1",
						pointerEvents: "none"
					}, hp.id);
				}),
				showSubs && subs.map((s) => {
					const p = project(s.lat, s.lon);
					const selected = selectedSubId === s.id;
					const color = NATION_COLORS[s.nationId] ?? "#a78bfa";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${p.x},${p.y}) rotate(${s.heading})`,
						style: { cursor: "pointer" },
						onClick: (e) => {
							e.stopPropagation();
							onSelectSub?.(selected ? null : s.id);
							onSelect(s.nationId);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: 11,
								fill: "transparent"
							}),
							selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: 9,
								fill: "none",
								stroke: "#f8fafc",
								strokeWidth: "1.2",
								className: "crt-pulse"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 0 -6 L 4 5 L 0 2.5 L -4 5 Z",
								fill: color,
								stroke: "#f8fafc",
								strokeWidth: "0.6",
								filter: s.status === "patrol" ? "url(#glow)" : void 0
							})
						]
					}, s.id);
				}),
				showConflicts && conflicts.map((cf) => {
					const p = project(cf.lat, cf.lon);
					const meta = CONFLICT_INTENSITY_META[cf.intensity];
					const selected = selectedConflictId === cf.id;
					const r = selected ? 7 : 4 + meta.rank * .4;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${p.x},${p.y})`,
						style: { cursor: "pointer" },
						onClick: (e) => {
							e.stopPropagation();
							onSelectConflict?.(selected ? null : cf.id);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: r + 4,
								fill: `${meta.color}33`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r,
								fill: meta.color,
								stroke: selected ? "#f8fafc" : "#0f172a",
								strokeWidth: selected ? 1.4 : .7,
								className: meta.rank >= 4 ? "crt-pulse" : void 0
							}),
							selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								y: -r - 6,
								textAnchor: "middle",
								fill: "#fecdd3",
								fontSize: "9",
								fontFamily: "system-ui, sans-serif",
								fontWeight: "700",
								children: cf.shortName
							})
						]
					}, cf.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
					pointerEvents: "none",
					children: arcs.map((arc, i) => {
						const delay = i * .06;
						const local = Math.max(0, Math.min(1, (progress - delay) / Math.max(.35, 1 - delay)));
						const tip = pointOnArc(arc.from, arc.to, local);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: arc.path,
							fill: "none",
							stroke: "#f472b6",
							strokeWidth: "1.6",
							opacity: animating ? .5 + local * .5 : .15,
							strokeDasharray: `${local * 900} 900`
						}), animating && local > .02 && local < 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: tip.x,
							cy: tip.y,
							r: "3.2",
							fill: "#f9a8d4"
						})] }, arc.id);
					})
				}),
				nations.map((n) => {
					const p = project(n.lat, n.lon);
					const selected = selectedId === n.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
						transform: `translate(${p.x},${p.y})`,
						style: { cursor: "pointer" },
						onClick: () => onSelect(n.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: selected ? 4 : 2.5,
							fill: NATION_COLORS[n.id] ?? "#94a3b8",
							stroke: "#f8fafc",
							strokeWidth: "0.7"
						})
					}, n.id);
				}),
				selectedSites.map((s) => {
					const p = project(s.lat, s.lon);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: p.x,
						cy: p.y,
						r: 2.2,
						fill: "none",
						stroke: "#a5f3fc",
						strokeWidth: "0.8",
						pointerEvents: "none"
					}, s.name);
				}),
				searchPin && searchedPlace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `translate(${searchPin.x},${searchPin.y})`,
					pointerEvents: "none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: 14,
							fill: "#38bdf833",
							stroke: "#38bdf8",
							strokeWidth: "1.2",
							className: "crt-pulse"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: 5,
							fill: "#38bdf8",
							stroke: "#f8fafc",
							strokeWidth: "1.2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M 0 5 L 0 14",
							stroke: "#38bdf8",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							y: -18,
							textAnchor: "middle",
							fill: "#e0f2fe",
							fontSize: "10",
							fontFamily: "system-ui, sans-serif",
							fontWeight: "700",
							children: searchedPlace.name.length > 18 ? `${searchedPlace.name.slice(0, 17)}…` : searchedPlace.name
						})
					]
				}),
				hover && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					pointerEvents: "none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: Math.min(hover.x + 8, 860),
						y: Math.max(hover.y - 22, 8),
						rx: 6,
						width: Math.min(132, hover.name.length * 6.5 + 28),
						height: 18,
						fill: "#0f172a",
						stroke: "#38bdf8",
						strokeWidth: "1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: Math.min(hover.x + 14, 868),
						y: Math.max(hover.y - 9, 20),
						fill: "#e0f2fe",
						fontSize: "9",
						fontFamily: "system-ui, sans-serif",
						children: [
							hover.iso,
							" · ",
							hover.name.length > 14 ? `${hover.name.slice(0, 13)}…` : hover.name
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					pointerEvents: "none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: 10,
						y: 8,
						width: 460,
						height: 22,
						rx: 6,
						fill: "#0f172acc"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: 18,
						y: 22,
						fill: "#cbd5e1",
						fontSize: "9",
						fontFamily: "system-ui, sans-serif",
						children: [
							"LIVE MAP · ",
							countries.length || "…",
							" countries · ",
							conflicts.length,
							" conflicts",
							selectedConflictId ? ` · ${conflicts.find((c) => c.id === selectedConflictId)?.shortName ?? ""}` : "",
							searchedPlace ? ` · PIN: ${searchedPlace.name}` : "",
							watchSeismic.length ? ` · ${watchSeismic.length} seismic watch` : ""
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute bottom-2 left-2 flex flex-wrap gap-1.5",
			children: [
				["Nuclear state", "#3b82f6"],
				["Conflict", "#f43f5e"],
				["Your place", "#38bdf8"],
				["SSBN est.", "#a78bfa"],
				["AIS", "#fbbf24"]
			].map(([label, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full px-2 py-0.5 text-[10px] font-semibold text-white/90",
				style: { background: `${color}cc` },
				children: label
			}, label))
		})]
	});
}
var LEARN_KEY = "ontas-saw-learn";
function WoprApp() {
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [selectedId, setSelectedId] = (0, import_react.useState)("us");
	const [newsFilterId, setNewsFilterId] = (0, import_react.useState)(null);
	const [scenarioId, setScenarioId] = (0, import_react.useState)(scenarios[0].id);
	const [animating, setAnimating] = (0, import_react.useState)(false);
	const [clock, setClock] = (0, import_react.useState)(() => formatZulu(/* @__PURE__ */ new Date()));
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [rightTab, setRightTab] = (0, import_react.useState)("conflicts");
	const [bottomTab, setBottomTab] = (0, import_react.useState)(() => {
		try {
			return sessionStorage.getItem(LEARN_KEY) === "1" ? "news" : "learn";
		} catch {
			return "learn";
		}
	});
	const [news, setNews] = (0, import_react.useState)([]);
	const [newsMeta, setNewsMeta] = (0, import_react.useState)({
		feedCount: 0,
		fetchedAt: null
	});
	const [seismic, setSeismic] = (0, import_react.useState)([]);
	const [official, setOfficial] = (0, import_react.useState)([]);
	const [sources, setSources] = (0, import_react.useState)([]);
	const [disclaimer, setDisclaimer] = (0, import_react.useState)("Educational open-source system. Unofficial DEFCON from public OSINT. Not a life-safety alert.");
	const [intelAt, setIntelAt] = (0, import_react.useState)(null);
	const [osint, setOsint] = (0, import_react.useState)(null);
	const [subs, setSubs] = (0, import_react.useState)(() => estimateSubPositions());
	const [units, setUnits] = (0, import_react.useState)(() => seedSsbnUnits());
	const [ais, setAis] = (0, import_react.useState)([]);
	const [aisSource, setAisSource] = (0, import_react.useState)("…");
	const [maritimeAt, setMaritimeAt] = (0, import_react.useState)(null);
	const [selectedSubId, setSelectedSubId] = (0, import_react.useState)(null);
	const [showSubs, setShowSubs] = (0, import_react.useState)(true);
	const [showAis, setShowAis] = (0, import_react.useState)(true);
	const [showConflicts, setShowConflicts] = (0, import_react.useState)(true);
	const [linkLive, setLinkLive] = (0, import_react.useState)(false);
	const [searchedPlace, setSearchedPlace] = (0, import_react.useState)(null);
	const [survivalProfile, setSurvivalProfile] = (0, import_react.useState)(null);
	const [selectedConflictId, setSelectedConflictId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => {
			const n = Date.now();
			setNow(n);
			setClock(formatZulu(new Date(n)));
			const next = estimateSubPositions(n);
			setSubs(next);
			setUnits((prev) => {
				const byId = new Map(next.map((s) => [s.id, s]));
				if (!prev.some((u) => u.category === "ssbn")) {
					const seeded = seedSsbnUnits(n);
					const aisUnits = prev.filter((u) => u.trackSource === "ais-live");
					return [...seeded, ...aisUnits];
				}
				return prev.map((u) => {
					if (u.category !== "ssbn") return u;
					const s = byId.get(u.id);
					if (!s) return u;
					return {
						...u,
						lat: s.lat,
						lon: s.lon,
						heading: s.heading,
						status: s.status,
						updatedAt: n
					};
				});
			});
		}, 1e3);
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const pull = async () => {
			try {
				const d = await fetchOsintDefcon();
				if (!cancelled) setOsint(d);
			} catch {}
		};
		pull();
		const t = window.setInterval(pull, 12e4);
		return () => {
			cancelled = true;
			clearInterval(t);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const pull = async () => {
			try {
				const data = await fetchThreatIntel();
				if (cancelled) return;
				setNews(data.news);
				setNewsMeta({
					feedCount: data.newsFeedCount,
					fetchedAt: data.fetchedAt
				});
				setSeismic(data.seismic);
				setOfficial(data.official);
				setSources(data.sources);
				setDisclaimer(data.disclaimer);
				setIntelAt(data.fetchedAt);
				setLinkLive(true);
			} catch {
				if (!cancelled) setLinkLive(false);
			}
		};
		pull();
		const t = window.setInterval(pull, 6e4);
		return () => {
			cancelled = true;
			clearInterval(t);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const pull = async () => {
			try {
				const data = await fetchMaritimeSnapshot();
				if (cancelled) return;
				setSubs(data.subs);
				setUnits(data.units.length ? data.units : seedSsbnUnits());
				setAis(data.ais);
				setAisSource(data.aisSource);
				setMaritimeAt(data.fetchedAt);
				setSources((prev) => prev.map((s) => s.id === "ais-fi" ? {
					...s,
					status: data.aisCount > 0 ? "ok" : "degraded",
					detail: data.aisCount > 0 ? `${data.aisCount} surface contacts · ${data.aisSource}` : `AIS empty · ${data.aisSource}`
				} : s));
			} catch {
				setUnits((prev) => prev.length ? prev : seedSsbnUnits());
			}
		};
		pull();
		const t = window.setInterval(pull, 4e4);
		return () => {
			cancelled = true;
			clearInterval(t);
		};
	}, []);
	const scenario = (0, import_react.useMemo)(() => scenarios.find((s) => s.id === scenarioId) ?? scenarios[0], [scenarioId]);
	const defcon = (0, import_react.useMemo)(() => computeDefcon({
		scenario,
		news,
		seismic,
		osint,
		now
	}), [
		scenario,
		news,
		seismic,
		osint,
		now
	]);
	const selected = (0, import_react.useMemo)(() => nations.find((n) => n.id === selectedId) ?? null, [selectedId]);
	const onBootDone = (0, import_react.useCallback)(() => setBooted(true), []);
	const openLearn = (0, import_react.useCallback)(() => {
		setBottomTab("learn");
		try {
			sessionStorage.setItem(LEARN_KEY, "1");
		} catch {}
		window.requestAnimationFrame(() => {
			document.getElementById("ontas-learn")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		});
	}, []);
	const onRun = (0, import_react.useCallback)(() => {
		if (scenario.trajectories.length === 0) {
			setAnimating(false);
			return;
		}
		setAnimating(true);
		window.setTimeout(() => setAnimating(false), 4500);
	}, [scenario.trajectories.length]);
	const onScenarioSelect = (0, import_react.useCallback)((id) => {
		setScenarioId(id);
		setAnimating(false);
		setRightTab("scenario");
		const sc = scenarios.find((s) => s.id === id);
		if (sc?.actors[0]) setSelectedId(sc.actors[0]);
	}, []);
	if (!booted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, { onDone: onBootDone });
	const tabs = [
		{
			id: "conflicts",
			label: "Conflicts"
		},
		{
			id: "search",
			label: "Survivability"
		},
		{
			id: "naval",
			label: "Ships & Subs"
		},
		{
			id: "intel",
			label: "Live Intel"
		},
		{
			id: "nation",
			label: "Country"
		},
		{
			id: "scenario",
			label: "Scenarios"
		}
	];
	const selectedConflictName = ARMED_CONFLICTS.find((c) => c.id === selectedConflictId)?.shortName;
	const liveBits = [
		news.length ? `${news.length} news` : null,
		seismic.length ? `${seismic.length} quakes` : null,
		ais.length ? `${ais.length} AIS` : null,
		official.length ? `${official.length} wires` : null
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b px-3 py-2 text-center text-xs font-semibold sm:text-sm",
				style: {
					background: `${defcon.color}22`,
					borderColor: defcon.color,
					color: defcon.color
				},
				children: [
					"Unofficial OSINT DEFCON ",
					defcon.level,
					" (",
					defcon.label,
					") · public data only",
					selectedConflictName ? ` · Focus: ${selectedConflictName}` : "",
					" ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: openLearn,
						className: "underline decoration-dotted underline-offset-2 hover:text-bright",
						children: "What does DEFCON mean?"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border bg-[#0b1220ee] backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-3 py-3 sm:px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-sky-400/90",
							children: "ONTAS · Unclassified open-source fusion"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-lg font-bold text-bright sm:text-xl",
							children: "Live public sensors · Conflicts · Nuclear awareness"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "soft-btn active",
								onClick: openLearn,
								children: "Beginner guide"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip tabular text-fg",
								children: clock
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "chip",
								children: [formatNum(GLOBAL_TOTAL_INVENTORY), " warheads"]
							}),
							liveBits && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip",
								style: {
									borderColor: "#34d399",
									color: "#6ee7b7"
								},
								children: liveBits
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "chip",
								style: {
									borderColor: linkLive ? "#34d399" : "#fbbf24",
									color: linkLive ? "#6ee7b7" : "#fcd34d"
								},
								children: linkLive ? "● LIVE" : "○ reconnecting"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-[1600px] space-y-3 p-3 sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStatusBar, { now }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 lg:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 lg:col-span-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefconBadge, {
								state: defcon,
								onExplain: openLearn
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "crt-panel flex min-w-0 flex-wrap items-center gap-2 px-3 py-3 lg:col-span-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted",
									children: "Map layers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `soft-btn ${showConflicts ? "active" : ""}`,
									onClick: () => setShowConflicts((v) => !v),
									children: ["Conflicts ", showConflicts ? "on" : "off"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `soft-btn ${showSubs ? "active" : ""}`,
									onClick: () => setShowSubs((v) => !v),
									children: ["SSBN ", showSubs ? "on" : "off"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `soft-btn ${showAis ? "active" : ""}`,
									onClick: () => setShowAis((v) => !v),
									children: ["AIS ", showAis ? "on" : "off"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ml-auto flex max-w-full flex-wrap gap-1.5",
									children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: `soft-btn ${rightTab === t.id ? "active" : ""}`,
										onClick: () => setRightTab(t.id),
										children: t.label
									}, t.id))
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 lg:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-0 min-w-0 overflow-hidden lg:col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-[2/1] w-full min-h-[220px] lg:min-h-[400px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldMap, {
									nations,
									selectedId,
									onSelect: (id) => {
										setSelectedId(id);
										setRightTab("nation");
									},
									scenario,
									animating,
									showSites: true,
									showSubs,
									showAis,
									showConflicts,
									subs,
									homePorts: HOME_PORTS,
									ais,
									selectedSubId,
									onSelectSub: (id) => {
										setSelectedSubId(id);
										if (id) setRightTab("naval");
									},
									seismic,
									searchedPlace,
									selectedConflictId,
									onSelectConflict: (id) => {
										setSelectedConflictId(id);
										setRightTab("conflicts");
									},
									conflicts: ARMED_CONFLICTS
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 min-h-[380px] min-w-0 lg:col-span-7 lg:min-h-[400px]",
							children: [
								rightTab === "conflicts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConflictsPanel, {
									selectedId: selectedConflictId,
									onSelect: setSelectedConflictId,
									now
								}),
								rightTab === "search" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceSearch, {
									selectedPlace: searchedPlace,
									profile: survivalProfile,
									onSelectPlace: (place, profile) => {
										setSearchedPlace(place);
										setSurvivalProfile(profile);
									}
								}),
								rightTab === "naval" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavalPanel, {
									units,
									subs,
									ais,
									aisSource,
									fetchedAt: maritimeAt,
									selectedSubId,
									onSelectSub: setSelectedSubId,
									now
								}),
								rightTab === "intel" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelPanel, {
									seismic,
									official,
									sources,
									fetchedAt: intelAt,
									now,
									disclaimer
								}),
								rightTab === "nation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NationPanel, { nation: selected }),
								rightTab === "scenario" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenarioPanel, {
									scenarios,
									active: scenario,
									onSelect: onScenarioSelect,
									animating,
									onRun
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "ontas-learn",
						className: "flex flex-wrap items-center gap-2 scroll-mt-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `soft-btn ${bottomTab === "learn" ? "active" : ""}`,
								onClick: openLearn,
								children: "Beginner guide"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `soft-btn ${bottomTab === "news" ? "active" : ""}`,
								onClick: () => setBottomTab("news"),
								children: ["Live news ", news.length ? `(${news.length})` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `soft-btn ${bottomTab === "forces" ? "active" : ""}`,
								onClick: () => setBottomTab("forces"),
								children: "Nuclear forces"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `soft-btn ${bottomTab === "climate" ? "active" : ""}`,
								onClick: () => setBottomTab("climate"),
								children: "Strategic climate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-xs text-muted",
								children: [
									"OSINT D",
									defcon.osintLevel,
									" → display D",
									defcon.level,
									newsMeta.feedCount ? ` · ${newsMeta.feedCount} news feeds` : "",
									ais.length ? ` · ${ais.length} AIS` : ""
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-[320px] lg:min-h-[380px]",
						children: [
							bottomTab === "learn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnPanel, {}),
							bottomTab === "news" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreatNewsFeed, {
								filterNationId: newsFilterId,
								onSelectNation: (id) => {
									if (!id) {
										setNewsFilterId(null);
										return;
									}
									setNewsFilterId(id);
									setSelectedId(id);
									setRightTab("nation");
								},
								externalItems: news,
								externalFetchedAt: newsMeta.fetchedAt,
								externalFeedCount: newsMeta.feedCount
							}),
							bottomTab === "forces" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForceTable, {
								nations,
								selectedId,
								onSelect: (id) => {
									setSelectedId(id);
									setRightTab("nation");
								}
							}),
							bottomTab === "climate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClimatePanel, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "crt-panel px-4 py-3 text-xs leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-bright",
							children: "Unclassified realtime scope"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1",
							children: [
								"Live: USGS earthquakes, UN/DoD/IAEA RSS, multi-region news mesh, BBC/UN conflict wires, Finnish open AIS, OSM geocoding, independent DEFCON OSINT. Not live: official DEFCON, submerged SSBN tracks, classified C2. Educational only — emergencies use IPAWS/EAS/WEA.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sky-300 underline",
									onClick: openLearn,
									children: "Beginner guide"
								})
							]
						})]
					})
				]
			})
		]
	});
}
function formatZulu(d) {
	const iso = d.toISOString();
	return `${iso.slice(0, 10)} ${iso.slice(11, 19)}Z`;
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WoprApp, {});
}
//#endregion
export { HomePage as component };
