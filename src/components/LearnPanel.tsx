import { useState } from "react";

type SectionId =
  | "start"
  | "nav"
  | "geo"
  | "nuclear"
  | "defcon"
  | "delivery"
  | "map"
  | "ranges"
  | "conflicts"
  | "intel"
  | "method"
  | "alerts"
  | "history"
  | "yields"
  | "terror"
  | "rad"
  | "survive"
  | "limits";

const SECTIONS: {
  id: SectionId;
  title: string;
  blurb: string;
  body: { h?: string; p: string }[];
}[] = [
  {
    id: "start",
    title: "Start here — what is ONTAS?",
    blurb: "Educational open desk — not a siren, not official DEFCON.",
    body: [
      {
        p: "ONTAS (Open Nuclear Threat Awareness System) is a free, open-source dashboard for learning about nuclear forces, conflicts, and public sensors. It fuses a live world map with desks for arsenals, wars, radiation literacy, historical terrorism cases, treaties, crisis history, and city readiness — using only public, unclassified sources.",
      },
      {
        p: "It is not a government warning system. It cannot tell you if a missile has launched. In the United States, real emergencies use FEMA IPAWS, the Emergency Alert System (TV/radio), Wireless Emergency Alerts on your phone, and local authorities — not this app. Elsewhere, follow your national civil-protection channels.",
      },
      {
        p: "Think of ONTAS as a globe + news mesh + study guide: useful for understanding risk, never for life-or-death decisions.",
      },
    ],
  },
  {
    id: "nav",
    title: "How to get around",
    blurb: "Quick find, deep links, Share link, Jump search.",
    body: [
      {
        h: "Live map home",
        p: "The header Live map button always returns home. On Live map you see DEFCON (unofficial), the New START / arms-control clock, live source health, space weather (NOAA Kp), a headline tick, and Quick find.",
      },
      {
        h: "Quick find",
        p: "Every desk is listed under Situational, Arsenals, Strategic, and Protect. There is no permanent sidebar clutter — open what you need from Quick find (full on home, compact when another desk is open).",
      },
      {
        h: "Deep links & Share link",
        p: "URLs like ?desk=intel&nation=ru&compare=us,ru&conflict=… are shareable. Use Share link in the header to copy the current desk with an as-of timestamp. Bookmark Methodology, Alerts, or a compare pair.",
      },
      {
        h: "Jump search",
        p: "Type in Jump to… (desktop header or mobile field) to open any desk by name — yields, terror, treaties, alerts, history, survive.",
      },
      {
        h: "Map layers",
        p: "Toggle Conflicts, SSBN estimates, AIS Baltic, Seismic, and Range bands. On phones, open Layers first. Click a nuclear country to select it (Country cards if you were already on that desk). Click a conflict marker for the Conflicts desk.",
      },
      {
        h: "First visit",
        p: "A short “This is not a siren” screen appears once per session — then Live map. Beginner guide and Methodology are always one click away.",
      },
    ],
  },
  {
    id: "geo",
    title: "Geopolitics in 60 seconds",
    blurb: "How power, geography, and alliances interact.",
    body: [
      {
        h: "What geopolitics means",
        p: "How geography, power, trade, and military force shape relations between countries. Borders, resources, and shipping lanes matter because they affect what states can protect or threaten.",
      },
      {
        h: "Power is not only tanks",
        p: "Alliances (e.g. NATO), trade, technology, sanctions, and information all count. Nuclear weapons are extreme military power used mainly for deterrence — discouraging attack by making the cost unbearable — not for everyday fighting.",
      },
      {
        h: "Why conflicts are on the map",
        p: "Wars change risk for ordinary people and can raise readiness worldwide. Tracking them explains news spikes without treating every war as a countdown to nuclear use.",
      },
    ],
  },
  {
    id: "nuclear",
    title: "Nuclear weapons — basics",
    blurb: "Who has them, stockpile vs deployed, deterrence.",
    body: [
      {
        h: "What a nuclear weapon is",
        p: "Energy from splitting atoms (fission) or combining them (fusion). Yield is often in kilotons (kt) or megatons (Mt) of TNT equivalent. Even a “small” nuclear explosion is vastly more destructive than ordinary bombs and creates radiation and fallout.",
      },
      {
        h: "Who has them",
        p: "Nine states are widely assessed to possess nuclear weapons: United States, Russia, China, France, United Kingdom, India, Pakistan, Israel (undeclared but widely assessed), and North Korea. Others may host allied weapons or pursue related technology under scrutiny.",
      },
      {
        h: "Stockpile vs deployed",
        p: "Total inventory includes storage. Deployed means on or ready for delivery systems. ONTAS uses open estimates (FAS / SIPRI / ACA-class) with a vintage stamp — not secret official tallies. See Methodology for how numbers are made.",
      },
      {
        h: "Civilian power ≠ weapons",
        p: "Nuclear power plants produce electricity with low-enriched fuel. A reactor accident is not the same as a nuclear detonation. Alert literacy and Rad / CBRN explain the difference.",
      },
    ],
  },
  {
    id: "defcon",
    title: "DEFCON levels explained",
    blurb: "Official names — real level is classified.",
    body: [
      {
        h: "What DEFCON is",
        p: "Defense Readiness Condition — a U.S. military scale from 5 (peacetime baseline) to 1 (maximum readiness). Higher readiness means more forces prepared for combat; it does not by itself mean “nukes are launching.”",
      },
      {
        h: "The five levels",
        p: "5 FADE OUT — normal peacetime. 4 DOUBLE TAKE — increased intelligence watch. 3 ROUND HOUSE — force readiness above normal. 2 FAST PACE — further increase. 1 COCKED PISTOL — maximum readiness.",
      },
      {
        h: "The real level is classified",
        p: "The U.S. government does not publish live DEFCON. ONTAS shows an unofficial OSINT estimate, always labeled. Never evacuate based on this badge alone.",
      },
    ],
  },
  {
    id: "delivery",
    title: "ICBMs, submarines, and the triad",
    blurb: "How nuclear weapons can be delivered.",
    body: [
      {
        h: "The triad",
        p: "Many nuclear powers keep land missiles, sea-based missiles on submarines, and aircraft so no single strike can destroy the whole force.",
      },
      {
        h: "ICBM & SLBM",
        p: "Intercontinental and submarine-launched ballistic missiles. Flight times between major powers are often tens of minutes. Submerged SSBNs do not broadcast tracks — map chevrons are educational estimates only.",
      },
      {
        h: "Bombers & dual-capable fighters",
        p: "Aircraft can carry bombs or cruise missiles. See Warheads & yields and Ships, subs & aircraft for open catalogs.",
      },
    ],
  },
  {
    id: "map",
    title: "How to read the live map",
    blurb: "Layers, markers, clocks, and honesty labels.",
    body: [
      {
        h: "Always on Live map",
        p: "Unofficial DEFCON badge, arms-control clock (New START era), live unclassified source probes, NOAA space-weather Kp, and open news tick.",
      },
      {
        h: "Countries & conflicts",
        p: "Nuclear-armed states are tinted. Rose conflict markers open neutral fact sheets with open fatality ranges.",
      },
      {
        h: "SSBN, AIS, seismic",
        p: "SSBN = estimates. AIS = open regional surface tracks (Baltic feed). Seismic = USGS; watch flags near nuclear-related zones are not proof of a test.",
      },
      {
        h: "Range bands",
        p: "See the next chapter. Toggle Range bands, select a nuclear state, read ICBM/SLBM/bomber/theater open max ranges as great-circle rings.",
      },
    ],
  },
  {
    id: "ranges",
    title: "Range bands (illustrative)",
    blurb: "Great-circle open max ranges — not targeting.",
    body: [
      {
        h: "What they show",
        p: "For the selected nuclear-armed state, ONTAS draws great-circle rings from the capital/C2 pin using the longest open-estimate range for each leg: ICBM (pink), SLBM (violet), bomber (cyan), theater systems (amber).",
      },
      {
        h: "What they are not",
        p: "Not aim points, not MIRV footprints, not flight-time products, not classified reliability. Long ranges wrap the map oddly in flat projection — that is geometry, not a threat score.",
      },
      {
        h: "How to use them",
        p: "Turn on Range bands under Map layers. Pick a nation (defaults to US if none). The callout lists km per leg. Compare two countries on the Compare desk for doctrine side-by-side.",
      },
    ],
  },
  {
    id: "conflicts",
    title: "Wars, death tolls & humanitarian wires",
    blurb: "Neutral fact sheets + open feeds.",
    body: [
      {
        p: "Conflict cards list parties, intensity, and open casualty ranges with sources — dry language, not scoreboard propaganda. Live reports come from public RSS. A humanitarian wire (ReliefWeb / UN-class public feeds) sits above the list for context.",
      },
      {
        p: "Most wars stay conventional. Nuclear risk rises mainly when nuclear-armed states are direct parties or crises spin out of control.",
      },
    ],
  },
  {
    id: "intel",
    title: "Live intel, news & space weather",
    blurb: "USGS, agency wires, news mesh, NOAA Kp.",
    body: [
      {
        h: "Live intel desk",
        p: "Fuses multi-region nuclear news, USGS seismic watch, DoD / IAEA / UN / BBC public wires, and source health. Summaries are open headlines — not confirmed intelligence judgments.",
      },
      {
        h: "News desk",
        p: "Filterable nuclear-related headline mesh. Severity chips are keyword heuristics for sorting only.",
      },
      {
        h: "Space weather",
        p: "NOAA SWPC planetary K-index on Live map. Solar storms affect radio/GPS — they are not nuclear fallout.",
      },
    ],
  },
  {
    id: "method",
    title: "Methodology — how numbers are made",
    blurb: "Trust infrastructure for every desk.",
    body: [
      {
        p: "Open Methodology under Protect (or the header button). It explains inventories, yields, unofficial DEFCON, fatality bands, SSBN estimates, AIS, seismic, news severity, range bands, and space weather — plus an explicit list of what ONTAS will never show (official DEFCON, real SSBN tracks, targeting data, etc.).",
      },
      {
        p: "If a number has no public pedigree, it should not look authoritative. When in doubt, read Methodology and the estimate vintage on force cards.",
      },
    ],
  },
  {
    id: "alerts",
    title: "Alert literacy (IPAWS / EAS / WEA)",
    blurb: "How real public warnings work.",
    body: [
      {
        p: "Alert literacy explains IPAWS, the Emergency Alert System, Wireless Emergency Alerts, and generic national civil-protection systems. Prefer official channels, check cancellations after false alarms (e.g. Hawaii 2018), and treat screenshots as weak evidence.",
      },
      {
        p: "ONTAS is not connected to IPAWS. If your phone screams a government alert, that outranks any dashboard.",
      },
    ],
  },
  {
    id: "history",
    title: "Crisis timeline",
    blurb: "What was known then vs later.",
    body: [
      {
        p: "Crisis timeline covers close calls and signaling episodes (Cuban Missile Crisis, Able Archer, 1983 false alarm, Norwegian rocket, Kargil, DPRK tests, Hawaii false alert, Ukraine-war nuclear rhetoric, New START expiry) with known-then / known-later / lesson blocks — education, not nostalgia for danger.",
      },
    ],
  },
  {
    id: "yields",
    title: "Warheads, yields & aircraft",
    blurb: "kt/Mt open estimates + dual-capable planes.",
    body: [
      {
        h: "Kiloton and megaton",
        p: "1 kt ≈ 1,000 tons of TNT. 1 Mt = 1,000 kt. Modern strategic warheads are often modeled in tens to a few hundred kt; some heavy or older designs appear in megaton ranges in open literature.",
      },
      {
        h: "Warheads & yields desk",
        p: "Stockpile ranking table plus open kt/Mt catalog. Ships, subs & aircraft combines maritime units with dual-capable aircraft lists. Country cards and Compare add doctrine and strategy notes.",
      },
      {
        h: "Export",
        p: "Compare can Copy card / Export .txt. Survivability kits can be copied or downloaded the same way.",
      },
    ],
  },
  {
    id: "terror",
    title: "Terror history (public record)",
    blurb: "Threats and attempts — no known nuclear weapons.",
    body: [
      {
        h: "Bottom line",
        p: "No terrorist group is known to possess nuclear weapons. State arsenals dominate strategic nuclear risk. Open cases emphasize materials security, RDDs, and facility protection.",
      },
      {
        p: "The desk lists widely cited public cases and hoaxes for education — not a tip line or how-to. Report real threats to authorities.",
      },
    ],
  },
  {
    id: "rad",
    title: "Rad / CBRN education",
    blurb: "Radiation types, decon themes, detonation sequence.",
    body: [
      {
        p: "Threat categories (IND, RDD, RED, sabotage, theft, hoax), alpha/beta/gamma/neutron themes, stay-time and educational 7/10 fallout decay, and a step-by-step nuclear detonation sequence with damage and health implications — civil-defense literacy, not operational guidance.",
      },
    ],
  },
  {
    id: "survive",
    title: "Survivability kits",
    blurb: "Any city or village — climate-aware, not medical advice.",
    body: [
      {
        p: "Search any place for a starter list: water, food, radio, medicine, shelter-in-place ideas. Lists tighten to climate (arctic through arid) and note distance to large strategic sites on the open map. Copy kit / Export .txt for offline reading.",
      },
      {
        h: "Shelter vs evacuate",
        p: "Public fallout themes often stress go in, stay in, tune in unless officials order evacuation. Follow your country’s civil-defense instructions first. KI only protects the thyroid from radioactive iodine when public health says so.",
      },
    ],
  },
  {
    id: "limits",
    title: "Limits, trust & good habits",
    blurb: "Stay informed without panic.",
    body: [
      {
        h: "What we never claim",
        p: "No classified DEFCON, no real-time missile warning, no secret SSBN tracks, no targeting manuals. Yields, fatality ranges, and terror cases are open estimates or historical summaries.",
      },
      {
        h: "Also on the app",
        p: "Launches calendar, Treaties timeline, Scenarios, Climate brief, Essay page (/article), PWA install shell, GitHub source.",
      },
      {
        h: "Healthy habits",
        p: "Use multiple reputable sources. Prefer primary agencies. Be wary of viral maps with no methodology. If news feels heavy, limit doomscrolling — understanding risk is not living in constant alarm.",
      },
    ],
  },
];

const DEFCON_CARDS = [
  { n: 5, name: "FADE OUT", color: "#3b82f6", mean: "Normal peacetime readiness" },
  { n: 4, name: "DOUBLE TAKE", color: "#22c55e", mean: "Increased intelligence watch" },
  { n: 3, name: "ROUND HOUSE", color: "#eab308", mean: "Forces above normal readiness" },
  { n: 2, name: "FAST PACE", color: "#f97316", mean: "Further increase; next to max" },
  { n: 1, name: "COCKED PISTOL", color: "#ef4444", mean: "Maximum readiness" },
];

export function LearnPanel() {
  const [open, setOpen] = useState<SectionId>("start");

  return (
    <div className="crt-panel flex h-full min-h-[420px] flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
          Learn · beginner guide
        </div>
        <h2 className="mt-0.5 text-lg font-bold text-bright">
          Geopolitics, nuclear risk & how to use this app
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">
          No prior knowledge needed. Chapters match the current ONTAS build: Quick find, deep links,
          methodology, alerts, crisis timeline, range bands, and honest limits.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-12">
        <nav className="min-h-0 max-h-[40vh] overflow-y-auto border-b border-border p-2 lg:col-span-4 lg:max-h-none lg:border-b-0 lg:border-r">
          <ul className="space-y-1">
            {SECTIONS.map((s, idx) => {
              const active = open === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(s.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "bg-sky-500/20 text-bright ring-1 ring-sky-400/40"
                        : "text-muted hover:bg-white/5 hover:text-fg"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-dim">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="block text-sm font-semibold">{s.title}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug opacity-80">
                      {s.blurb}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-h-0 overflow-y-auto px-4 py-4 lg:col-span-8">
          {SECTIONS.filter((s) => s.id === open).map((s) => (
            <article key={s.id} className="max-w-2xl">
              <h3 className="text-xl font-bold text-bright">{s.title}</h3>
              <p className="mt-1 text-sm text-sky-300/90">{s.blurb}</p>

              {s.id === "defcon" && (
                <div className="mt-4 grid gap-2 sm:grid-cols-5">
                  {DEFCON_CARDS.map((d) => (
                    <div
                      key={d.n}
                      className="rounded-xl border px-2 py-2 text-center"
                      style={{ borderColor: d.color, background: `${d.color}18` }}
                    >
                      <div className="text-[10px] font-bold tracking-wide text-muted">DEFCON</div>
                      <div className="text-2xl font-black" style={{ color: d.color }}>
                        {d.n}
                      </div>
                      <div className="text-[10px] font-semibold text-bright">{d.name}</div>
                      <div className="mt-1 text-[10px] leading-snug text-muted">{d.mean}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-4">
                {s.body.map((block, i) => (
                  <div key={i}>
                    {block.h && <h4 className="text-sm font-bold text-bright">{block.h}</h4>}
                    <p className="mt-1 text-sm leading-relaxed text-fg/90">{block.p}</p>
                  </div>
                ))}
              </div>

              {s.id === "start" && (
                <div className="mt-6 rounded-xl border border-border bg-black/25 p-3 text-xs leading-relaxed text-muted">
                  <strong className="text-bright">Suggested path:</strong> How to get around → Nuclear
                  basics → DEFCON → Map & range bands → Methodology → Alert literacy → Crisis timeline
                  → Conflicts → Warheads → Survivability → Limits. Use Quick find or Share link.
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-1.5">
                {SECTIONS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    className={`soft-btn ${open === x.id ? "active" : ""}`}
                    onClick={() => setOpen(x.id)}
                  >
                    {x.title.split("—")[0]!.trim().slice(0, 24)}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
