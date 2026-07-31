import { useState } from "react";

type SectionId =
  | "start"
  | "geo"
  | "nuclear"
  | "defcon"
  | "delivery"
  | "map"
  | "conflicts"
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
    title: "Start here — what is this app?",
    blurb: "A plain-language map of public nuclear and conflict information.",
    body: [
      {
        p: "ONTAS (Open Nuclear Threat Awareness System) is an educational dashboard. It pulls public data — news, earthquake sensors, open ship tracking, and open-source estimates of nuclear forces — and shows them on one screen.",
      },
      {
        p: "It is not a government warning system. It cannot tell you if a missile has been launched. If there is a real emergency in the United States, you will hear from FEMA, Wireless Emergency Alerts on your phone, sirens, or TV/radio — not from this app.",
      },
      {
        p: "Think of it as a classroom globe plus a news desk: useful for understanding the world, not for making life-or-death decisions.",
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
        p: "Geopolitics is how geography, power, trade, and military force shape relations between countries. Mountains, oceans, oil, shipping lanes, and borders all matter because they affect what states can protect or threaten.",
      },
      {
        h: "Power is not only tanks",
        p: "Countries also use alliances (like NATO), trade, technology, sanctions, and information. Nuclear weapons are one extreme form of military power: they are mainly for deterrence — discouraging attack by making the cost unbearable — not for everyday fighting.",
      },
      {
        h: "Why conflicts appear on this map",
        p: "Wars and crises change risk for ordinary people and can raise military readiness worldwide. Tracking them helps explain why news about missiles or DEFCON estimates sometimes spikes.",
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
        p: "A nuclear weapon releases energy from splitting atoms (fission) or combining them (fusion). Yield is often measured in kilotons or megatons of TNT equivalent. Even a “small” nuclear explosion is vastly more destructive than ordinary bombs and creates deadly radiation and fallout.",
      },
      {
        h: "Who has them",
        p: "Nine states are widely assessed to possess nuclear weapons: the United States, Russia, China, France, the United Kingdom, India, Pakistan, Israel (undeclared but widely assessed), and North Korea. Others host allied weapons or pursue related technology under tight scrutiny.",
      },
      {
        h: "Stockpile vs deployed",
        p: "“Total inventory” includes warheads in storage. “Deployed” means ready or on delivery systems. Open estimates (groups like FAS or SIPRI) are educated counts — not secret official tallies.",
      },
      {
        h: "Deterrence, not a video game",
        p: "Nuclear strategy is about preventing use. Accidents, miscalculation, and escalation are the main public fears. That is why treaties, hotlines, and clear command systems matter.",
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
        p: "Submarine-Launched Ballistic Missiles ride on ballistic-missile submarines (SSBNs). Submerged boats are hard to find; their tracks on this map are educational estimates, not live GPS of secret patrols. Real SSBNs do not broadcast AIS while hidden.",
      },
      {
        h: "Bombers & cruise missiles",
        p: "Aircraft can carry nuclear bombs or long-range cruise missiles. They are slower than ICBMs but flexible and can be recalled after takeoff in many doctrines.",
      },
    ],
  },
  {
    id: "map",
    title: "How to read this map",
    blurb: "Colors, dots, and layers without the jargon.",
    body: [
      {
        h: "Countries",
        p: "Nuclear-armed states are tinted by country color. Click one to open its force card (warheads, systems, doctrine notes).",
      },
      {
        h: "Rose / red conflict markers",
        p: "Major wars and armed conflicts. Click a marker or use the Conflicts desk for a neutral fact sheet and live news from UN, BBC, and other open wires.",
      },
      {
        h: "Purple chevrons (SSBN)",
        p: "Estimated patrol or in-port positions for ballistic-missile submarines. Educational modeling only.",
      },
      {
        h: "Yellow AIS dots",
        p: "Live surface ships where open maritime data exists (strongest in some coastal feeds like the Baltic). Not a global military tracker.",
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
    blurb: "How we describe fighting without propaganda.",
    body: [
      {
        p: "Conflict cards list parties by name, intensity (from tension to war-level), and open casualty notes. Language is deliberately dry: who is fighting, where, since when — not who is “right.”",
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
    id: "survive",
    title: "Survivability kits — what they are for",
    blurb: "Everyday emergency readiness, not doomsday fantasy.",
    body: [
      {
        p: "Search any city or town to get a starter list: water, food, radio, medicine, shelter-in-place ideas. The list adjusts for climate, city vs village, and distance to large strategic sites on our open map.",
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
        p: "We do not claim access to classified DEFCON, real-time missile warning, or secret submarine tracks. Anything labeled estimate or OSINT can be wrong.",
      },
      {
        h: "Healthy habits",
        p: "Use multiple reputable sources. Prefer primary agencies (UN, IAEA, national meteorological/seismic services, civil defense). Be wary of viral maps with no sources.",
      },
      {
        h: "If you feel overwhelmed",
        p: "Global news can be heavy. Limit doomscrolling, talk to people you trust, and remember that understanding risk is different from living in constant alarm. For U.S. emergencies, rely on official alerts on your phone and local authorities.",
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
    <div className="crt-panel flex h-full min-h-[360px] flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
          Learn · beginner guide
        </div>
        <h2 className="mt-0.5 text-lg font-bold text-bright">
          Geopolitics, nuclear threats & DEFCON — explained simply
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">
          No prior knowledge needed. Short chapters you can open in any order. Written for curious
          readers, not specialists.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-12">
        <nav className="min-h-0 overflow-y-auto border-b border-border p-2 lg:col-span-4 lg:border-b-0 lg:border-r">
          <ul className="space-y-1">
            {SECTIONS.map((s) => {
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
                    {block.h && (
                      <h4 className="text-sm font-bold text-bright">{block.h}</h4>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-fg/90">{block.p}</p>
                  </div>
                ))}
              </div>

              {s.id === "start" && (
                <div className="mt-6 rounded-xl border border-border bg-black/25 p-3 text-xs leading-relaxed text-muted">
                  <strong className="text-bright">Quick tour:</strong> Conflicts desk = wars &
                  live reports · Survivability = city readiness kit · Ships & Subs = naval picture ·
                  Live Intel = sensors & official RSS · Country = nuclear force cards · Scenarios =
                  educational what-ifs.
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
