/**
 * Arms-control & nuclear-order timeline (public historical facts).
 * Educational only — not legal advice.
 */

export type TreatyStatus =
  | "in-force"
  | "expired"
  | "suspended"
  | "not-in-force"
  | "withdrawn"
  | "historical"
  | "ongoing";

export interface TreatyEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  parties: string;
  status: TreatyStatus;
  summary: string;
  category: "bilateral" | "multilateral" | "test-ban" | "nonproliferation" | "export" | "regional";
}

export const TREATY_STATUS_META: Record<
  TreatyStatus,
  { label: string; color: string }
> = {
  "in-force": { label: "In force", color: "#34d399" },
  expired: { label: "Expired", color: "#f87171" },
  suspended: { label: "Suspended", color: "#fbbf24" },
  "not-in-force": { label: "Not in force", color: "#94a3b8" },
  withdrawn: { label: "Withdrawn", color: "#fb923c" },
  historical: { label: "Historical", color: "#64748b" },
  ongoing: { label: "Ongoing regime", color: "#38bdf8" },
};

export const TREATY_TIMELINE: TreatyEvent[] = [
  {
    id: "npt-1968",
    year: 1968,
    title: "Nuclear Non-Proliferation Treaty (NPT)",
    parties: "Near-universal (NWS + NNWS)",
    status: "in-force",
    category: "nonproliferation",
    summary:
      "Cornerstone non-proliferation bargain: non-nuclear states forgo weapons; nuclear states pursue disarmament and peaceful uses. Review conferences remain politically strained.",
  },
  {
    id: "salt-i",
    year: 1972,
    title: "SALT I / ABM Treaty era",
    parties: "US–USSR",
    status: "historical",
    category: "bilateral",
    summary:
      "First strategic arms limitation framework and ABM Treaty constrained defensive systems. ABM later collapsed as a binding bilateral regime.",
  },
  {
    id: "inf-1987",
    year: 1987,
    title: "INF Treaty",
    parties: "US–USSR/Russia",
    status: "withdrawn",
    category: "bilateral",
    summary:
      "Eliminated ground-launched missiles 500–5,500 km. US and Russia withdrew 2019 after mutual accusations of non-compliance; class of systems re-emerged.",
  },
  {
    id: "start-i",
    year: 1991,
    title: "START I",
    parties: "US–USSR/Russia",
    status: "historical",
    category: "bilateral",
    summary:
      "Deep cuts and intrusive verification after the Cold War; set the template for later New START counting rules.",
  },
  {
    id: "ctbt-1996",
    year: 1996,
    title: "Comprehensive Nuclear-Test-Ban Treaty (CTBT)",
    parties: "Multilateral (not all Annex 2 ratified)",
    status: "not-in-force",
    category: "test-ban",
    summary:
      "Bans all nuclear explosions. Not yet in force pending key ratifications. International Monitoring System operates; nuclear testing by non-parties remains a flashpoint.",
  },
  {
    id: "fmct-debate",
    year: 1990,
    title: "Fissile Material Cut-off Treaty (FMCT) talks",
    parties: "CD / multilateral (no treaty text in force)",
    status: "not-in-force",
    category: "multilateral",
    summary:
      "Long-stalled negotiations on banning production of fissile material for weapons. No completed treaty.",
  },
  {
    id: "new-start-2010",
    year: 2010,
    title: "New START",
    parties: "US–Russia",
    status: "expired",
    category: "bilateral",
    summary:
      "Last bilateral strategic arms-control treaty: ceilings on deployed strategic warheads and delivery vehicles with on-site inspection. Russia suspended participation 2023; treaty expired February 2026 with no successor.",
  },
  {
    id: "jcpoa-2015",
    year: 2015,
    title: "JCPOA (Iran nuclear deal)",
    parties: "Iran + E3/EU+3 (US later withdrew)",
    status: "suspended",
    category: "regional",
    summary:
      "Limits on Iran’s enrichment and monitoring in exchange for sanctions relief. US withdrawal (2018) and subsequent Iranian rollbacks left the deal effectively non-operational; IAEA reporting remains central.",
  },
  {
    id: "tpnw-2017",
    year: 2017,
    title: "Treaty on the Prohibition of Nuclear Weapons (TPNW)",
    parties: "Non-nuclear-weapon states (nuclear-armed states not parties)",
    status: "in-force",
    category: "multilateral",
    summary:
      "Comprehensive ban among parties. No nuclear-armed state is a party; political rather than operational constraint on existing arsenals.",
  },
  {
    id: "aukus-npt",
    year: 2021,
    title: "AUKUS naval nuclear propulsion debates",
    parties: "AU–UK–US / NPT community",
    status: "ongoing",
    category: "nonproliferation",
    summary:
      "SSN cooperation raised non-proliferation process questions under NPT Article IV / IAEA safeguards for naval fuel — monitored in diplomatic channels.",
  },
  {
    id: "new-start-suspend",
    year: 2023,
    month: 2,
    title: "Russia suspends New START participation",
    parties: "Russia (vs US)",
    status: "suspended",
    category: "bilateral",
    summary:
      "Russia halted inspections/notifications while claiming remaining treaty limits; US responses limited reciprocal transparency. Set stage for 2026 expiry without replacement.",
  },
  {
    id: "new-start-expire",
    year: 2026,
    month: 2,
    title: "New START expires — no bilateral ceilings",
    parties: "US–Russia",
    status: "expired",
    category: "bilateral",
    summary:
      "First time since the early 1970s without a bilateral US–Russia strategic arms-control treaty in force. Arsenal trajectories driven by national modernization, not treaty caps.",
  },
];

export function treatiesSortedNewestFirst(): TreatyEvent[] {
  return [...TREATY_TIMELINE].sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));
}
