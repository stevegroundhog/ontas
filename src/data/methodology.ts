/** Source methodology — what ONTAS will and will not show. */

export type MethodBlock = {
  id: string;
  title: string;
  body: string;
  sources: string[];
};

export const METHODOLOGY_BLOCKS: MethodBlock[] = [
  {
    id: "inventories",
    title: "Warhead & force inventories",
    body: "Military stockpile and total inventory figures are open estimates in the FAS / SIPRI / Arms Control Association class, not declassified official counts. Each nation card stamps an estimate vintage. Deployed strategic numbers track public ceilings and open reporting where available — they are not real-time force accounting.",
    sources: ["Federation of American Scientists", "SIPRI Yearbook", "Arms Control Association"],
  },
  {
    id: "yields",
    title: "Yields (kt / Mt)",
    body: "Yield ranges are open literature estimates for named systems or classes. Exact deployed yields are often classified. ONTAS never invents a single “official” yield when sources disagree — it shows ranges.",
    sources: ["Open technical literature", "Historical test records where public"],
  },
  {
    id: "defcon",
    title: "Unofficial OSINT DEFCON",
    body: "Official U.S. DEFCON is classified. ONTAS displays an independent open estimate (scraped/public composite) labeled unofficial. It is not NORAD, USSTRATCOM, or any government product. A green or red badge here is educational context only.",
    sources: ["defconlevel.com-style OSINT composites", "Public news/sensor fusion (ONTAS)"],
  },
  {
    id: "fatalities",
    title: "Conflict death tolls",
    body: "Fatality bands use low/high ranges with as-of dates and named public sources (UN, OHCHR-class, reputable monitors). Single-point propaganda numbers are rejected. Absence of a number means reliable public data is insufficient.",
    sources: ["UN / OHCHR-class reporting", "Independent conflict monitors", "National statistical releases when credible"],
  },
  {
    id: "ssbn",
    title: "SSBN / submarine positions",
    body: "Submerged ballistic-missile submarines do not broadcast public tracks. Map markers are educational patrol estimates from open home-port and basing knowledge — never real-time classified tracks.",
    sources: ["Open basing / class inventories", "Public naval reference works"],
  },
  {
    id: "ais",
    title: "AIS maritime layer",
    body: "Live surface contacts come from open regional AIS (currently Finnish Digitraffic Baltic coverage). Merchant thinning is deterministic. Military likelihood is heuristic from ship type/name — not identity confirmation.",
    sources: ["digitraffic.fi open AIS"],
  },
  {
    id: "seismic",
    title: "Seismic watch",
    body: "USGS public GeoJSON (M2.5+ day feed). “Watch” tags mean geography near nuclear test / facility watch zones — most events are ordinary geology. Not a CTBTO substitute.",
    sources: ["U.S. Geological Survey public earthquake feeds"],
  },
  {
    id: "news",
    title: "News mesh",
    body: "Multi-region Google News RSS and institutional wires (DoD, IAEA, UN, BBC). Severity is a keyword heuristic for sorting — not an intelligence judgment. Headlines are not confirmed facts.",
    sources: ["Google News RSS", "Agency public RSS"],
  },
  {
    id: "ranges",
    title: "Delivery range bands",
    body: "Map range rings use published open estimates for named systems (e.g. ICBM/SLBM max range). They are illustrative great-circle bands from capital/C2 pins — not operational targeting, not time-of-flight products, not MIRV footprints.",
    sources: ["Open system characteristics tables"],
  },
  {
    id: "space-wx",
    title: "Space weather (Kp)",
    body: "NOAA SWPC planetary K-index. Solar storms affect radio/GPS — they are not nuclear fallout or a nuclear alert.",
    sources: ["NOAA Space Weather Prediction Center"],
  },
];

export const NEVER_SHOW: string[] = [
  "Official real-time U.S. DEFCON from DoD",
  "Real-time tracks of submerged SSBNs",
  "Target packages, aim points, or war plans",
  "Classified yields, reliability, or penetration-aid details",
  "Gray-market or leaked “intel dump” feeds",
  "Anything presented as a life-safety siren for your city",
];

export const LIFE_SAFETY =
  "In the United States, nuclear attack life-safety warnings come through FEMA IPAWS / EAS / Wireless Emergency Alerts and local emergency management — not third-party dashboards. Outside the U.S., follow your national civil-protection authority.";
