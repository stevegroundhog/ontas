//#region node_modules/.nitro/vite/services/ssr/assets/conflicts-D5AgD6d3.js
var CONFLICT_INTENSITY_META = {
	war: {
		label: "War-level",
		color: "#ef4444",
		rank: 5
	},
	"limited-war": {
		label: "Limited war",
		color: "#f97316",
		rank: 4
	},
	"major-violence": {
		label: "Major violence",
		color: "#fbbf24",
		rank: 3
	},
	insurgency: {
		label: "Insurgency",
		color: "#a78bfa",
		rank: 2
	},
	tension: {
		label: "Heightened tension",
		color: "#38bdf8",
		rank: 1
	}
};
var CONFLICT_TYPE_LABEL = {
	interstate: "Interstate",
	civil: "Civil / internal",
	"internationalized-civil": "Internationalized civil",
	"non-state": "Non-state armed",
	insurgency: "Insurgency",
	territorial: "Territorial dispute",
	occupation: "Occupation / control dispute"
};
/**
* Snapshot of major conflicts widely tracked by UCDP, CrisisWatch-class
* reporting, UN Security Council agenda items, and major wire services (2024–2026).
* Not exhaustive of every local clash; selected for global visibility & reporting density.
*/
var ARMED_CONFLICTS = [
	{
		id: "ukraine-russia",
		name: "Russia–Ukraine war",
		shortName: "Ukraine",
		summary: "Full-scale interstate war since February 2022 following Russia’s invasion of Ukraine; high-intensity combat, territorial control disputes, and large-scale displacement continue.",
		type: "interstate",
		intensity: "war",
		region: "Europe",
		lat: 49,
		lon: 32,
		countries: ["UA", "RU"],
		parties: [
			"Russian Federation",
			"Ukraine",
			"Western military assistance to Ukraine (material)"
		],
		startYear: 2022,
		fatalitiesNote: "Tens of thousands of combatant and civilian deaths (open estimates vary widely).",
		status: "active",
		newsQueries: [
			"Ukraine Russia war",
			"Ukraine frontline",
			"UN Security Council Ukraine"
		],
		keywords: [
			"ukraine",
			"russia",
			"kyiv",
			"donbas",
			"crimea",
			"putin",
			"zelensky"
		],
		nuclearRisk: "elevated",
		sources: [{
			label: "UN News — Peace & Security",
			url: "https://news.un.org/en/news/topic/peace-and-security"
		}, {
			label: "UCDP conflict data (academic)",
			url: "https://ucdp.uu.se/"
		}]
	},
	{
		id: "gaza-israel",
		name: "Israel–Hamas / Gaza war",
		shortName: "Gaza",
		summary: "High-intensity war in and around the Gaza Strip after the 7 October 2023 Hamas attack on Israel; ongoing hostilities, civilian harm, and regional spillover remain under UN and ICRC reporting.",
		type: "interstate",
		intensity: "war",
		region: "Middle East",
		lat: 31.5,
		lon: 34.45,
		countries: ["PS", "IL"],
		parties: [
			"Israel",
			"Hamas",
			"Other Gaza armed groups"
		],
		startYear: 2023,
		fatalitiesNote: "Very high civilian and combatant tolls reported by local health authorities and international agencies; figures contested.",
		status: "active",
		newsQueries: [
			"Gaza war",
			"Israel Hamas",
			"UNRWA Gaza"
		],
		keywords: [
			"gaza",
			"hamas",
			"israel",
			"rafah",
			"unrwa",
			"hostage"
		],
		nuclearRisk: "latent",
		sources: [{
			label: "UN News",
			url: "https://news.un.org/en/news/topic/middle-east"
		}, {
			label: "ICRC updates",
			url: "https://www.icrc.org/"
		}]
	},
	{
		id: "israel-hezbollah",
		name: "Israel–Hezbollah / Lebanon front",
		shortName: "Lebanon",
		summary: "Cross-border military exchanges between Israel and Hezbollah expanded after late 2023; large-scale Israeli operations in Lebanon and reciprocal fire have been extensively documented by UNIFIL and wire services.",
		type: "interstate",
		intensity: "limited-war",
		region: "Middle East",
		lat: 33.4,
		lon: 35.5,
		countries: ["LB", "IL"],
		parties: ["Israel", "Hezbollah"],
		startYear: 2023,
		fatalitiesNote: "Thousands reported killed/displaced across Lebanon and northern Israel (open tallies).",
		status: "active",
		newsQueries: ["Israel Hezbollah", "Lebanon conflict UNIFIL"],
		keywords: [
			"hezbollah",
			"lebanon",
			"beirut",
			"unifil",
			"litani"
		],
		nuclearRisk: "latent",
		sources: [{
			label: "UNIFIL",
			url: "https://unifil.unmissions.org/"
		}]
	},
	{
		id: "sudan-civil",
		name: "Sudan civil war (SAF–RSF)",
		shortName: "Sudan",
		summary: "Civil war between the Sudanese Armed Forces and Rapid Support Forces since April 2023; mass displacement, urban fighting, and famine risk dominate humanitarian reporting.",
		type: "civil",
		intensity: "war",
		region: "Africa",
		lat: 15.5,
		lon: 32.5,
		countries: ["SD"],
		parties: ["Sudanese Armed Forces (SAF)", "Rapid Support Forces (RSF)"],
		startYear: 2023,
		fatalitiesNote: "Among the world’s largest displacement crises; death toll estimates are incomplete.",
		status: "active",
		newsQueries: [
			"Sudan civil war",
			"RSF SAF Khartoum",
			"Sudan famine"
		],
		keywords: [
			"sudan",
			"rsf",
			"darfur",
			"khartoum",
			"port sudan"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN OCHA Sudan",
			url: "https://www.unocha.org/sudan"
		}]
	},
	{
		id: "myanmar-civil",
		name: "Myanmar civil conflict",
		shortName: "Myanmar",
		summary: "Nationwide armed conflict after the 2021 military coup; junta forces fight multiple ethnic armed organizations and People’s Defence Forces across large parts of the country.",
		type: "civil",
		intensity: "war",
		region: "Asia",
		lat: 21.9,
		lon: 96.1,
		countries: ["MM"],
		parties: [
			"Myanmar military (SAC/Tatmadaw)",
			"NUG/PDF",
			"Ethnic armed organizations"
		],
		startYear: 2021,
		fatalitiesNote: "Tens of thousands of conflict-related deaths reported by monitors since 2021.",
		status: "active",
		newsQueries: ["Myanmar civil war", "Myanmar junta conflict"],
		keywords: [
			"myanmar",
			"burma",
			"junta",
			"rohingya",
			"sac"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN Special Rapporteur Myanmar",
			url: "https://www.ohchr.org/"
		}]
	},
	{
		id: "yemen",
		name: "Yemen conflict",
		shortName: "Yemen",
		summary: "Protracted multi-party conflict involving Ansar Allah (Houthis), the internationally recognized government, and southern forces; Red Sea shipping attacks and Saudi–Houthi dynamics remain active issues.",
		type: "internationalized-civil",
		intensity: "limited-war",
		region: "Middle East",
		lat: 15.3,
		lon: 44.2,
		countries: ["YE"],
		parties: [
			"Ansar Allah (Houthis)",
			"Yemeni government",
			"Southern Transitional Council",
			"External naval coalitions (Red Sea)"
		],
		startYear: 2014,
		fatalitiesNote: "One of the decade’s deadliest humanitarian crises; direct battle deaths plus indirect deaths.",
		status: "active",
		newsQueries: [
			"Yemen conflict",
			"Houthi Red Sea",
			"UN Yemen"
		],
		keywords: [
			"yemen",
			"houthi",
			"sanaa",
			"aden",
			"red sea"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN Yemen",
			url: "https://news.un.org/en/tags/yemen"
		}]
	},
	{
		id: "sahel-jihadist",
		name: "Central Sahel insurgencies",
		shortName: "Sahel",
		summary: "Islamist insurgencies and counter-insurgency campaigns across Burkina Faso, Mali, and Niger; juntas, Wagner/Africa Corps presence, and JNIM/ISGS activity drive high civilian harm.",
		type: "insurgency",
		intensity: "major-violence",
		region: "Africa",
		lat: 14,
		lon: -1.5,
		countries: [
			"BF",
			"ML",
			"NE"
		],
		parties: [
			"JNIM",
			"Islamic State Sahel",
			"National armies / juntas",
			"Local militias"
		],
		startYear: 2015,
		fatalitiesNote: "Among Africa’s deadliest ongoing armed conflicts by annual deaths (ACLED/UCDP-class data).",
		status: "active",
		newsQueries: [
			"Sahel conflict",
			"Burkina Faso jihadist",
			"Mali JNIM"
		],
		keywords: [
			"sahel",
			"burkina",
			"mali",
			"niger",
			"jnim",
			"aes"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN peace & security Africa",
			url: "https://news.un.org/en/news/region/africa"
		}]
	},
	{
		id: "drc-east",
		name: "Eastern DRC conflict (M23 / ADF)",
		shortName: "DRC East",
		summary: "Recurrent wars in North Kivu and Ituri; M23 advances, ADF attacks, and regional state involvement (notably Rwanda–DRC tensions) generate large displacement.",
		type: "internationalized-civil",
		intensity: "major-violence",
		region: "Africa",
		lat: -1.7,
		lon: 29.2,
		countries: [
			"CD",
			"RW",
			"UG"
		],
		parties: [
			"DRC armed forces (FARDC)",
			"M23",
			"ADF",
			"Other armed groups",
			"Regional actors"
		],
		startYear: 2021,
		fatalitiesNote: "High civilian toll layered on decades of Kivu conflict.",
		status: "active",
		newsQueries: [
			"DRC M23",
			"North Kivu conflict",
			"Goma fighting"
		],
		keywords: [
			"congo",
			"m23",
			"goma",
			"kivu",
			"adf"
		],
		nuclearRisk: "none",
		sources: [{
			label: "MONUSCO / UN DRC",
			url: "https://monusco.unmissions.org/"
		}]
	},
	{
		id: "somalia",
		name: "Somalia conflict (Al-Shabaab)",
		shortName: "Somalia",
		summary: "Protracted conflict between the Federal Government of Somalia (with ATMIS/AU and partner support) and Al-Shabaab; urban attacks and rural control contests continue.",
		type: "insurgency",
		intensity: "major-violence",
		region: "Africa",
		lat: 5.2,
		lon: 46.2,
		countries: ["SO"],
		parties: [
			"Federal Government of Somalia",
			"Al-Shabaab",
			"Clan militias",
			"AU / partner forces"
		],
		startYear: 2006,
		fatalitiesNote: "Thousands of annual conflict deaths in peak years (open monitors).",
		status: "active",
		newsQueries: ["Somalia Al-Shabaab", "Mogadishu attack"],
		keywords: [
			"somalia",
			"shabaab",
			"mogadishu",
			"atmis"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UNSOM",
			url: "https://unsom.unmissions.org/"
		}]
	},
	{
		id: "syria",
		name: "Syria multi-party conflict",
		shortName: "Syria",
		summary: "Post-Assad transition and residual multi-actor conflict: Turkish operations, SDF/Autonomous Administration issues, Israeli strikes, and ISIS remnants keep violence intermittent but serious.",
		type: "internationalized-civil",
		intensity: "limited-war",
		region: "Middle East",
		lat: 35,
		lon: 38.5,
		countries: ["SY"],
		parties: [
			"Syrian authorities (post-2024 transition)",
			"HTS / other factions",
			"SDF",
			"Türkiye",
			"Israel (airstrikes)",
			"ISIS remnants"
		],
		startYear: 2011,
		fatalitiesNote: "Civil war peak deaths far higher historically; residual violence still lethal.",
		status: "active",
		newsQueries: [
			"Syria conflict",
			"Syria SDF Turkey",
			"Israel strikes Syria"
		],
		keywords: [
			"syria",
			"damascus",
			"idlib",
			"sdf",
			"hts"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN Syria",
			url: "https://news.un.org/en/tags/syria"
		}]
	},
	{
		id: "ethiopia-amhara",
		name: "Ethiopia Amhara / residual conflicts",
		shortName: "Ethiopia",
		summary: "After the Tigray war’s formal end, armed conflict in Amhara (Fano) and other regions continues to produce significant casualties and displacement per UN and local reporting.",
		type: "civil",
		intensity: "major-violence",
		region: "Africa",
		lat: 11.5,
		lon: 38,
		countries: ["ET"],
		parties: [
			"Ethiopian federal forces",
			"Fano militias",
			"Other regional actors"
		],
		startYear: 2023,
		fatalitiesNote: "Thousands reported since Amhara conflict intensification (open estimates).",
		status: "active",
		newsQueries: ["Ethiopia Amhara conflict", "Fano Ethiopia"],
		keywords: [
			"ethiopia",
			"amhara",
			"fano",
			"tigray"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN Ethiopia",
			url: "https://ethiopia.un.org/"
		}]
	},
	{
		id: "haiti-gangs",
		name: "Haiti armed gang crisis",
		shortName: "Haiti",
		summary: "Armed gangs control large parts of Port-au-Prince and corridors; state collapse dynamics and the Multinational Security Support mission dominate security reporting.",
		type: "non-state",
		intensity: "major-violence",
		region: "Americas",
		lat: 18.5,
		lon: -72.3,
		countries: ["HT"],
		parties: [
			"Armed gangs (e.g. G9/Viv Ansanm coalitions)",
			"Haitian National Police",
			"MSS mission partners"
		],
		startYear: 2021,
		fatalitiesNote: "Thousands killed annually in peak years of gang violence.",
		status: "active",
		newsQueries: ["Haiti gangs", "Port-au-Prince violence UN"],
		keywords: [
			"haiti",
			"port-au-prince",
			"gang",
			"mss"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN Haiti",
			url: "https://news.un.org/en/tags/haiti"
		}]
	},
	{
		id: "mexico-cartels",
		name: "Mexico organized crime violence",
		shortName: "Mexico",
		summary: "High-intensity non-state armed violence among cartels and with security forces; not a classic interstate war but meets major-violence thresholds in many municipalities.",
		type: "non-state",
		intensity: "major-violence",
		region: "Americas",
		lat: 24,
		lon: -102.5,
		countries: ["MX"],
		parties: ["Multiple cartels", "Mexican federal/state forces"],
		startYear: 2006,
		fatalitiesNote: "Tens of thousands of homicide deaths yearly in peak periods (national statistics).",
		status: "active",
		newsQueries: ["Mexico cartel violence", "Mexico homicide conflict"],
		keywords: [
			"mexico",
			"cartel",
			"sinaloa",
			"jalisco",
			"cjng"
		],
		nuclearRisk: "none",
		sources: [{
			label: "Open government homicide stats (INEGI)",
			url: "https://www.inegi.org.mx/"
		}]
	},
	{
		id: "kashmir",
		name: "India–Pakistan Kashmir tensions",
		shortName: "Kashmir",
		summary: "Long-running territorial dispute with periodic kinetic incidents along the LoC/IB; nuclear-armed adversaries make even limited clashes strategically significant.",
		type: "territorial",
		intensity: "tension",
		region: "Asia",
		lat: 34,
		lon: 75,
		countries: ["IN", "PK"],
		parties: [
			"India",
			"Pakistan",
			"Militant groups (variable)"
		],
		startYear: 1947,
		fatalitiesNote: "Lower annual battle deaths than major wars, but recurrent spikes.",
		status: "active",
		newsQueries: ["Kashmir conflict", "India Pakistan LoC"],
		keywords: [
			"kashmir",
			"loc",
			"jammu",
			"pakistan",
			"india"
		],
		nuclearRisk: "elevated",
		sources: [{
			label: "UNMOGIP",
			url: "https://unmogip.unmissions.org/"
		}]
	},
	{
		id: "korea-peninsula",
		name: "Korean Peninsula standoff",
		shortName: "Korea",
		summary: "Armistice without peace treaty since 1953; DPRK nuclear/missile tests and ROK–US exercises sustain high military readiness and periodic crises.",
		type: "interstate",
		intensity: "tension",
		region: "Asia",
		lat: 38,
		lon: 127,
		countries: ["KP", "KR"],
		parties: [
			"DPRK",
			"ROK",
			"United States (alliance)"
		],
		startYear: 1950,
		fatalitiesNote: "Korean War historical deaths enormous; current phase is primarily deterrence/tension.",
		status: "active",
		newsQueries: [
			"North Korea missile",
			"Korean peninsula tensions",
			"DPRK nuclear"
		],
		keywords: [
			"north korea",
			"dprk",
			"pyongyang",
			"dmz",
			"hwasong"
		],
		nuclearRisk: "elevated",
		sources: [{
			label: "UN Security Council DPRK",
			url: "https://www.un.org/securitycouncil/"
		}]
	},
	{
		id: "taiwan-strait",
		name: "Taiwan Strait tensions",
		shortName: "Taiwan",
		summary: "Unresolved sovereignty dispute; PLA exercises, grey-zone pressure, and US–Taiwan security ties keep risk of great-power conflict elevated without daily ground combat.",
		type: "territorial",
		intensity: "tension",
		region: "Asia",
		lat: 24.5,
		lon: 120,
		countries: ["TW", "CN"],
		parties: [
			"People’s Republic of China",
			"Taiwan (ROC)",
			"United States (security commitments)"
		],
		startYear: 1949,
		fatalitiesNote: "Not a continuous shooting war; crisis risk is strategic.",
		status: "active",
		newsQueries: [
			"Taiwan Strait",
			"PLA Taiwan exercises",
			"China Taiwan tensions"
		],
		keywords: [
			"taiwan",
			"strait",
			"pla",
			"taipei",
			"xi"
		],
		nuclearRisk: "elevated",
		sources: [{
			label: "Open military transparency reporting",
			url: "https://www.iiss.org/"
		}]
	},
	{
		id: "iran-regional",
		name: "Iran regional military confrontations",
		shortName: "Iran theater",
		summary: "Recurring direct and proxy confrontations involving Iran, Israel, and the United States across the region (strikes, naval incidents, militia activity). Public reporting in 2025–2026 has included periods of open hostilities.",
		type: "interstate",
		intensity: "limited-war",
		region: "Middle East",
		lat: 32,
		lon: 53,
		countries: [
			"IR",
			"IL",
			"IQ",
			"SY"
		],
		parties: [
			"Iran",
			"Israel",
			"United States",
			"Regional proxy/militia networks"
		],
		startYear: 2019,
		fatalitiesNote: "Casualty figures spike during direct exchange periods; baseline is lower-intensity.",
		status: "active",
		newsQueries: [
			"Iran Israel strikes",
			"US Iran military",
			"Iran nuclear tensions"
		],
		keywords: [
			"iran",
			"tehran",
			"centcom",
			"irgc",
			"strait of hormuz"
		],
		nuclearRisk: "elevated",
		sources: [{
			label: "IAEA / UN reporting",
			url: "https://www.iaea.org/"
		}]
	},
	{
		id: "afghanistan",
		name: "Afghanistan (Taliban rule & IS-K)",
		shortName: "Afghanistan",
		summary: "After the 2021 Taliban takeover, large-scale civil war ended but Islamic State Khorasan and other violence, plus humanitarian crisis, continue under international monitoring.",
		type: "insurgency",
		intensity: "insurgency",
		region: "Asia",
		lat: 33.9,
		lon: 66,
		countries: ["AF"],
		parties: [
			"Taliban authorities",
			"Islamic State Khorasan (IS-K)",
			"Other armed opposition (limited)"
		],
		startYear: 2021,
		fatalitiesNote: "Lower than 2001–2021 war peaks; IS-K attacks remain deadly.",
		status: "active",
		newsQueries: ["Afghanistan IS-K", "Taliban Afghanistan conflict"],
		keywords: [
			"afghanistan",
			"taliban",
			"isk",
			"kabul"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UNAMA",
			url: "https://unama.unmissions.org/"
		}]
	},
	{
		id: "libya",
		name: "Libya political-military fragmentation",
		shortName: "Libya",
		summary: "Eastern–western political split with armed groups and foreign influence; violence is episodic compared with 2011–2020 peaks but still triggers UN mediation.",
		type: "civil",
		intensity: "insurgency",
		region: "Africa",
		lat: 27,
		lon: 17,
		countries: ["LY"],
		parties: [
			"Government of National Unity (west)",
			"LNA / eastern authorities",
			"Militias"
		],
		startYear: 2014,
		fatalitiesNote: "Variable yearly deaths; below major active wars.",
		status: "active",
		newsQueries: ["Libya conflict", "Libya LNA"],
		keywords: [
			"libya",
			"tripoli",
			"benghazi",
			"lna"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UNSMIL",
			url: "https://unsmil.unmissions.org/"
		}]
	},
	{
		id: "colombia",
		name: "Colombia residual armed conflict",
		shortName: "Colombia",
		summary: "Peace process with FARC reduced major civil war, but ELN, FARC dissidents, and criminal groups sustain organized violence in several departments.",
		type: "insurgency",
		intensity: "insurgency",
		region: "Americas",
		lat: 4,
		lon: -73,
		countries: ["CO"],
		parties: [
			"Colombian state",
			"ELN",
			"FARC dissident groups",
			"Criminal armed groups"
		],
		startYear: 1964,
		fatalitiesNote: "Far below historical peaks; still multi-hundred to thousand-scale annual conflict deaths in bad years.",
		status: "active",
		newsQueries: ["Colombia ELN", "Colombia armed conflict"],
		keywords: [
			"colombia",
			"eln",
			"farc",
			"catatumbo"
		],
		nuclearRisk: "none",
		sources: [{
			label: "UN Verification Mission Colombia",
			url: "https://colombia.unmissions.org/"
		}]
	}
];
function conflictById(id) {
	return ARMED_CONFLICTS.find((c) => c.id === id);
}
function sortConflictsByIntensity(list) {
	return [...list].sort((a, b) => CONFLICT_INTENSITY_META[b.intensity].rank - CONFLICT_INTENSITY_META[a.intensity].rank || a.name.localeCompare(b.name));
}
//#endregion
export { sortConflictsByIntensity as a, conflictById as i, CONFLICT_INTENSITY_META as n, CONFLICT_TYPE_LABEL as r, ARMED_CONFLICTS as t };
