/** Realtime maritime unit taxonomy for map + naval panel */

export type UnitCategory =
  | "ssbn"
  | "ssn"
  | "ssgn"
  | "cvn"
  | "surface"
  | "tender"
  | "support"
  | "merchant"
  | "unknown";

export type UnitStatus = "patrol" | "in-port" | "transit" | "overhaul" | "underway" | "anchored";

export interface MaritimeUnit {
  id: string;
  name: string;
  hull?: string;
  className: string;
  category: UnitCategory;
  nationId: string | null;
  nationLabel: string;
  lat: number;
  lon: number;
  heading: number;
  speedKn: number;
  status: UnitStatus;
  missiles?: string;
  homePort?: string;
  /** live AIS | open-source patrol estimate */
  trackSource: "ais-live" | "osint-estimate";
  updatedAt: number;
  color: string;
  note?: string;
}

export const CATEGORY_META: Record<
  UnitCategory,
  { label: string; short: string; color: string; description: string }
> = {
  ssbn: {
    label: "Ballistic Missile Submarine",
    short: "SSBN",
    color: "#a78bfa",
    description: "Strategic nuclear deterrent patrol boats (estimated when submerged)",
  },
  ssn: {
    label: "Attack Submarine",
    short: "SSN",
    color: "#38bdf8",
    description: "Nuclear attack subs — rarely on AIS",
  },
  ssgn: {
    label: "Guided Missile Submarine",
    short: "SSGN",
    color: "#818cf8",
    description: "Cruise-missile subs (converted Ohio SSGN class, etc.)",
  },
  cvn: {
    label: "Aircraft Carrier",
    short: "CVN",
    color: "#f472b6",
    description: "Carrier strike group centerpiece",
  },
  surface: {
    label: "Surface Combatant",
    short: "SURF",
    color: "#fbbf24",
    description: "Destroyers, frigates, patrol — often AIS-visible",
  },
  tender: {
    label: "Submarine Tender / Base Craft",
    short: "TEND",
    color: "#34d399",
    description: "Support craft near SSBN bases",
  },
  support: {
    label: "Naval Support / Aux",
    short: "AUX",
    color: "#2dd4bf",
    description: "Replenishment, research, SAR",
  },
  merchant: {
    label: "Merchant / Civilian",
    short: "CIV",
    color: "#64748b",
    description: "Commercial AIS traffic",
  },
  unknown: {
    label: "Unclassified Contact",
    short: "UNK",
    color: "#94a3b8",
    description: "Type not resolved",
  },
};

export const NATION_COLORS: Record<string, string> = {
  us: "#3b82f6",
  ru: "#ef4444",
  cn: "#f59e0b",
  uk: "#8b5cf6",
  fr: "#06b6d4",
  in: "#22c55e",
  pk: "#84cc16",
  il: "#0ea5e9",
  kp: "#e11d48",
};

/** Map AIS shipType + name → category */
export function classifyAis(shipType: number, name: string): UnitCategory {
  const n = name.toUpperCase();
  if (/\b(SSBN|BALLISTIC)\b/.test(n)) return "ssbn";
  if (/\b(SSGN)\b/.test(n)) return "ssgn";
  if (/\b(SSN|SUBMARINE|U-BOOT|UBOAT)\b/.test(n)) return "ssn";
  if (/\b(CVN|CARRIER|NIMITZ|FORD|CHARLES DE GAULLE|LIAONING|SHANDONG|FUJIAN)\b/.test(n))
    return "cvn";
  if (/\b(TENDER|AS\s|SUBMARINE SUPPORT)\b/.test(n)) return "tender";
  if (shipType === 35 || /\b(HMS|USS|FS |RFS |DDG|FFG|CG |LHD|LHA|WARSHIP|NAVY|NAVAL)\b/.test(n))
    return "surface";
  if (shipType >= 70 && shipType < 90) return "merchant";
  if (shipType >= 50 && shipType < 60) return "support";
  return shipType === 0 ? "unknown" : "merchant";
}
