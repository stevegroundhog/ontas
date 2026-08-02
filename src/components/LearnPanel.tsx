import { useState } from "react";

type SectionId =
  | "start"
  | "nav"
  | "geo"
  | "nuclear"
  | "yields"
  | "defcon"
  | "delivery"
  | "map"
  | "conflicts"
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
    blurb: "A plain-language educational dashboard — not a warning siren.",
    body: [
      {
        p: "ONTAS (Open Nuclear Threat Awareness System) is a free, open-source classroom for public nuclear and conflict information. It combines a live world map with desks for arsenals, wars, radiation education, historical terrorism cases, treaties, and city readiness — using only public, unclassified sources.",
      },
      {
        p: "It is not a government warning system. It cannot tell you if a missile has launched. If there is a real emergency in the United States, you will hear from FEMA, Wireless Emergency Alerts on your phone, sirens, or TV/radio — not from this app.",
      },
      {
        p: "Think of it as a globe, a news desk, and a study guide in one place: useful for understanding risk, never for life-or-death decisions.",
      },
    ],
  },
  {
    id: "nav",
    title: "How to get around",
    blurb: "Menu button, jump search, and when the map appears.",
    body: [
      {
        h: "Quick find + deep links",
        p: "Every desk is under Quick find (Situational / Arsenals / Strategic / Protect). Share link copies ?desk=…&nation=… URLs. Methodology explains every number; Alert literacy covers IPAWS/EAS/WEA; Crisis timeline covers close calls. Header: Live map, Beginner guide, Essay.",
      },
      {
        h: "Jump search",
        p: "Type in the top “Jump to…” box (or the mobile search field) to open any desk by name — e.g. yields, terror, treaties, survive.",
      },
      {
        h: "Map layers",
        p: "On map-linked desks you can toggle Conflicts, SSBN estimates, and AIS surface tracks. Click a nuclear country → Countries desk. Click a conflict marker → Conflicts desk.",
      },
      {
        h: "Phone and desktop",
        p: "Same Menu drawer on every screen size. One desk at a time keeps the view uncluttered.",
      },
    ],
  },
  {
    id: "geo",
    title: "Geopolitics in 60 seconds",
    blurb: "How countries compete, ally, and sometimes fight.",
    body: [
      {
        h: "What “geopolitics” means",
        p: "Geopolitics is how geography, power, trade, and military force shape relations between countries. Mountains, oceans, oil, shipping lanes, and borders matter because they affect what states can protect or threaten.",
      },
      {
        h: "Power is not only tanks",
        p: "Countries also use alliances (like NATO), trade, technology, sanctions, and information. Nuclear weapons are one extreme form of military power: mainly for deterrence — discouraging attack by making the cost unbearable — not for everyday fighting.",
      },
      {
        h: "Why conflicts appear on this map",
        p: "Wars and crises change risk for ordinary people and can raise military readiness worldwide. Tracking them helps explain why news about missiles or DEFCON estimates sometimes spikes — without treating every war as a countdown to nuclear use.",
      },
    ],
  },
  {
    id: "nuclear",
    title: "Nuclear weapons — basics",
    blurb: "What they are, who has them, and why numbers matter.",
    body: [
      {
        h: "What a nuclear weapon is",
        p: "A nuclear weapon releases energy from splitting atoms (fission) or combining them (fusion). Yield is often measured in kilotons (kt) or megatons (Mt) of TNT equivalent. Even a “small” nuclear explosion is vastly more destructive than ordinary bombs and creates deadly radiation and fallout.",
      },
      {
        h: "Who has them",
        p: "Nine states are widely assessed to possess nuclear weapons: the United States, Russia, China, France, the United Kingdom, India, Pakistan, Israel (undeclared but widely assessed), and North Korea. Others may host allied weapons or pursue related technology under scrutiny.",
      },
      {
        h: "Stockpile vs deployed",
        p: "“Total inventory” includes warheads in storage. “Deployed” means ready or on delivery systems. Open estimates (FAS, SIPRI, Arms Control Association-class research) are educated counts — not secret official tallies.",
      },
      {
        h: "Deterrence, not a video game",
        p: "Nuclear strategy is about preventing use. Accidents, miscalculation, and escalation are the main public fears. That is why treaties, hotlines, and clear command systems matter. See each country’s Strategy field and the Compare desk.",
      },
    ],
  },
  {
    id: "yields",
    title: "Yields (kt/Mt) & aircraft",
    blurb: "Open-estimate warhead power and nuclear-capable planes.",
    body: [
      {
        h: "Kiloton and megaton",
        p: "1 kiloton (kt) ≈ 1,000 tons of TNT. 1 megaton (Mt) = 1,000 kt. Modern deployed strategic warheads are often tens to a few hundred kilotons; some older or heavy designs are discussed in megaton ranges in open literature.",
      },
      {
        h: "Yields & aircraft desk",
        p: "Open Yields & aircraft in the sidebar for tables of representative warhead families (e.g. W76, W88, B61, Yars-class estimates) and dual-capable bombers/fighters (B-52, B-2, Tu-160, Rafale, F-35 DCA, H-6, and more). Ranges are open estimates with uncertainty — not official loadings.",
      },
      {
        h: "Country cards",
        p: "Selecting a nation also shows that country’s yield chips and aircraft list next to doctrine and delivery systems.",
      },
    ],
  },
  {
    id: "defcon",
    title: "DEFCON levels explained",
    blurb: "What each number means — and why the real one is secret.",
    body: [
      {
        h: "What DEFCON is",
        p: "DEFCON stands for Defense Readiness Condition. It is a U.S. military alert scale from 5 (lowest readiness / peacetime baseline) to 1 (maximum readiness). Higher readiness means more forces prepared for combat — it does not by itself mean “nukes are launching.”",
      },
      {
        h: "The five levels (official names)",
        p: "DEFCON 5 FADE OUT — normal peacetime. DEFCON 4 DOUBLE TAKE — increased intelligence watch and security. DEFCON 3 ROUND HOUSE — increase in force readiness above normal. DEFCON 2 FAST PACE — further increase; next step to max. DEFCON 1 COCKED PISTOL — maximum readiness.",
      },
      {
        h: "Important: the real level is classified",
        p: "The U.S. government does not publish the current DEFCON in real time. Websites (including the OSINT estimate shown here) are educated guesses from open signals. They can be wrong. This app always labels DEFCON as unofficial.",
      },
      {
        h: "How to read our badge",
        p: "We combine a public OSINT estimate with open sensors (news pressure, quakes near test sites). A yellow DEFCON 3 means “elevated public concern in open sources,” not an official order. Never evacuate based on this display alone.",
      },
    ],
  },
  {
    id: "delivery",
    title: "ICBMs, submarines, and the triad",
    blurb: "How nuclear weapons can be delivered.",
    body: [
      {
        h: "The nuclear triad",
        p: "Many nuclear powers keep three legs: land-based missiles, sea-based missiles on submarines, and aircraft. Spreading forces makes a complete surprise attack harder.",
      },
      {
        h: "ICBM",
        p: "Intercontinental Ballistic Missile — a long-range land-based rocket that flies into space on an arc and re-enters at high speed. Flight times between major powers are often measured in tens of minutes.",
      },
      {
        h: "SLBM & SSBN",
        p: "Submarine-Launched Ballistic Missiles ride on ballistic-missile submarines (SSBNs). Submerged boats are hard to find; tracks on this map are educational estimates, not live GPS of secret patrols. Real SSBNs do not broadcast AIS while hidden.",
      },
      {
        h: "Bombers & dual-capable fighters",
        p: "Aircraft can carry nuclear bombs or long-range cruise missiles. They are slower than ICBMs but flexible. See Yields & aircraft for named types.",
      },
    ],
  },
  {
    id: "map",
    title: "How to read the live map",
    blurb: "Colors, markers, and layers without the jargon.",
    body: [
      {
        h: "Countries",
        p: "Nuclear-armed states are tinted. Click one to open its force card (warheads, systems, strategy, yields, aircraft).",
      },
      {
        h: "Rose / red conflict markers",
        p: "Major wars and armed conflicts. Click a marker or use Conflicts for a neutral fact sheet, open fatality ranges, and live reports.",
      },
      {
        h: "SSBN chevrons",
        p: "Estimated patrol or in-port positions for ballistic-missile submarines. Educational modeling only.",
      },
      {
        h: "AIS dots",
        p: "Live surface ships where open maritime data exists (strongest in some coastal feeds such as the Baltic). Not a global military tracker.",
      },
      {
        h: "Quake dots",
        p: "Earthquakes from USGS. Ones near known nuclear test areas are flagged for watch — most quakes are natural geology.",
      },
    ],
  },
  {
    id: "conflicts",
    title: "Wars & conflicts — reading neutrally",
    blurb: "Fact sheets, death-toll ranges, and live reports without propaganda.",
    body: [
      {
        p: "Conflict cards list parties by name, intensity, and open casualty ranges with sources. Language is deliberately dry: who is fighting, where, since when — not who is “right.” Fatality figures are contested open estimates (e.g. UN/OHCHR-class reporting), shown as ranges.",
      },
      {
        p: "Live reports come from public RSS feeds. Headlines can be imperfect or biased; always open the original article. We do not invent battlefield scores.",
      },
      {
        p: "A conflict on the list does not mean nuclear war is imminent. Most wars stay conventional. Nuclear risk rises mainly when nuclear-armed states are direct parties or when crises spin out of control.",
      },
    ],
  },
  {
    id: "terror",
    title: "Terrorism: nuclear threats & attempts",
    blurb: "Historical public record — rhetoric vs real plots.",
    body: [
      {
        h: "Bottom line first",
        p: "No terrorist group is known to possess nuclear weapons. Confirmed nuclear arsenals remain state-held. Open security work focuses on materials security, radiological dispersal devices (RDDs), and facility protection.",
      },
      {
        h: "What the Terror history desk lists",
        p: "Widely cited open cases: al-Qaeda interest and disrupted plots, Aum Shinrikyo’s WMD ambition (chemical attack succeeded; nuclear did not), Chechen-related radiological episodes, ISIS-era rhetoric, smuggling networks tracked in IAEA-class public data, domestic extremist cases, and hoaxes. Filter by type or “beyond rhetoric.”",
      },
      {
        h: "What it is not",
        p: "Not a tip line, not a how-to, not classified intelligence. Report credible threats to local authorities.",
      },
    ],
  },
  {
    id: "rad",
    title: "Radiation, dirty bombs & explosion steps",
    blurb: "Civil-defense education from the Rad / CBRN desk.",
    body: [
      {
        h: "Threat categories",
        p: "Open literature discusses improvised nuclear devices (extremely hard), RDDs (“dirty bombs”), hidden exposure devices, facility sabotage, materials theft, and hoaxes — each with different effects and likelihood notes.",
      },
      {
        h: "Types of radiation",
        p: "Alpha is stopped by skin but dangerous if inhaled. Beta can burn skin. Gamma penetrates and is the main external fallout hazard. Neutrons matter mainly in the prompt pulse of a detonation. Decontamination is mostly about removing radioactive dust — you cannot wash off pure gamma rays.",
      },
      {
        h: "Stay time",
        p: "Stay time is how long you can remain at a measured dose rate before hitting a dose limit. Fallout dose rates drop over time (educational 7/10 rule). Officials use real instruments; this app cannot set your stay time.",
      },
      {
        h: "Nuclear detonation sequence (public themes)",
        p: "Flash → prompt radiation → blast → fires → fallout → medical/social disruption → decay and recovery decisions. The Rad / CBRN desk walks each step with damage, health, and protective-action notes.",
      },
    ],
  },
  {
    id: "survive",
    title: "Survivability kits",
    blurb: "Climate-aware readiness for any city or village — not medical advice.",
    body: [
      {
        p: "Search any city or town for a starter list: water, food, radio, medicine, shelter-in-place ideas. The list tightens to climate (arctic, cold, temperate, hot, tropical, arid) and notes distance to large strategic sites on our open map.",
      },
      {
        h: "Shelter vs evacuate",
        p: "For radioactive fallout, the usual public advice is go in, stay in, tune in — use thick walls and distance from windows unless officials order evacuation. Follow your country’s civil-defense instructions first.",
      },
      {
        h: "Potassium iodide (KI)",
        p: "Only helps protect the thyroid from radioactive iodine, and only if public health officials say to take it. It is not an anti-radiation pill for everything.",
      },
    ],
  },
  {
    id: "limits",
    title: "Limits, trust, and good habits",
    blurb: "How to stay informed without panic.",
    body: [
      {
        h: "What we never claim",
        p: "We do not claim access to classified DEFCON, real-time missile warning, or secret submarine tracks. Yields, fatality ranges, and terror cases are open estimates or historical summaries. Anything labeled OSINT or estimate can be wrong.",
      },
      {
        h: "Also on the app",
        p: "Launches calendar (public tests/space-style notes), Treaties timeline, Compare two countries, Strategic climate brief, Essay page, and Live intel source health.",
      },
      {
        h: "Healthy habits",
        p: "Use multiple reputable sources. Prefer primary agencies (UN, IAEA, national seismic services, civil defense). Be wary of viral maps with no sources.",
      },
      {
        h: "If you feel overwhelmed",
        p: "Global news can be heavy. Limit doomscrolling, talk to people you trust, and remember that understanding risk is different from living in constant alarm.",
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
          No prior knowledge needed. Short chapters in any order — written for curious readers, not
          specialists. Updated for the full ONTAS feature set.
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
                  basics → DEFCON → Methodology → Alert literacy → Crisis timeline → Yields →
                  Conflicts → Survivability → Limits. Use Quick find or Share link deep URLs.
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
                    {x.title.split("—")[0]!.trim().slice(0, 22)}
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
