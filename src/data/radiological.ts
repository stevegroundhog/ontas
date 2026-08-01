/**
 * Educational radiological / CBRN awareness content (public civil-defense knowledge).
 * Not medical advice. Not operational guidance for weapons. Not a threat to build devices.
 */

export type RadiationTypeId = "alpha" | "beta" | "gamma" | "neutron" | "xray";

export interface RadiationType {
  id: RadiationTypeId;
  name: string;
  symbol: string;
  color: string;
  whatItIs: string;
  range: string;
  stoppedBy: string;
  health: string;
  decon: string[];
  notes: string;
}

export const RADIATION_TYPES: RadiationType[] = [
  {
    id: "alpha",
    name: "Alpha particles",
    symbol: "α",
    color: "#f87171",
    whatItIs:
      "Heavy, positively charged particles (helium nuclei) emitted by some radioactive materials such as plutonium, americium, or radon progeny.",
    range: "A few centimeters in air; stopped by paper or the outer dead layer of skin.",
    stoppedBy: "Paper, clothing, skin surface (external).",
    health:
      "Low external hazard. High internal hazard if inhaled, swallowed, or entering wounds — densely ionizing damage to nearby cells.",
    decon: [
      "Remove outer clothing carefully (can remove large fraction of external contamination).",
      "Wash exposed skin with lukewarm water and mild soap; do not scrub abrasively.",
      "Avoid eating/drinking/smoking until hands and face are clean.",
      "Seek official guidance for nasal swabs / medical evaluation if inhalation is suspected.",
      "Bag contaminated clothes as directed by responders (sealed bags).",
    ],
    notes:
      "Alpha emitters on surfaces are mainly a contamination-control problem, not a penetrating dose through air at distance.",
  },
  {
    id: "beta",
    name: "Beta particles",
    symbol: "β",
    color: "#fb923c",
    whatItIs:
      "High-energy electrons (or positrons) emitted by many fission products (e.g. strontium-90, iodine-131, cesium-137).",
    range: "Meters in air depending on energy; can penetrate skin to cause “beta burns.”",
    stoppedBy: "Plastic, light metals, thick clothing, glass.",
    health:
      "External skin and eye dose possible. Internal hazard if ingested/inhaled. Iodine-131 concentrates in the thyroid (hence KI policy under official orders only).",
    decon: [
      "Remove outer clothing and shoes outdoors if possible.",
      "Wash skin thoroughly; flush eyes if contaminated (clean water).",
      "Do not use harsh chemicals or abrasives that break skin.",
      "Follow public-health orders for potassium iodide (KI) — only if told to, and only for radioactive iodine risk.",
      "Wash or dispose of contaminated clothing per official instructions.",
    ],
    notes:
      "Beta contamination often coexists with gamma-emitting isotopes on fallout dust.",
  },
  {
    id: "gamma",
    name: "Gamma rays",
    symbol: "γ",
    color: "#fbbf24",
    whatItIs:
      "High-energy photons (like very energetic X-rays) from nuclear de-excitation. Common from fallout and many industrial sources (Co-60, Cs-137).",
    range: "Hundreds of meters to kilometers depending on source strength and shielding; penetrates deeply.",
    stoppedBy: "Dense material: lead, steel, concrete, earth (thickness matters).",
    health:
      "Whole-body penetrating dose; primary external hazard from fallout and many sealed sources. High doses cause acute radiation syndrome (ARS).",
    decon: [
      "Decontamination of people mainly removes radioactive dust that emits gamma (you cannot “wash off” pure gamma rays).",
      "Time, distance, shielding: leave hot zones when ordered; stay indoors away from windows; use basement/interior rooms.",
      "Remove clothing + wash to cut dose rate from particles on you and your gear.",
      "Evacuate or shelter based on official monitoring — not social media maps alone.",
    ],
    notes:
      "Stay-time planning and shelter quality are about reducing gamma dose rate from fallout fields.",
  },
  {
    id: "neutron",
    name: "Neutrons",
    symbol: "n",
    color: "#a78bfa",
    whatItIs:
      "Uncharged particles from fission/fusion reactions. Important in the prompt radiation pulse of a nuclear detonation and in reactors/accelerators.",
    range: "Can travel far in air; interact via collisions; activate materials (make them radioactive).",
    stoppedBy: "Hydrogen-rich materials (water, polyethylene, concrete) for slowing; then absorbers.",
    health:
      "Highly penetrating biological damage during the prompt pulse; not the main long-term fallout particle type on people days later.",
    decon: [
      "Personal decon after a detonation focuses on fallout dust (alpha/beta/gamma emitters), not “washing off neutrons.”",
      "Neutron exposure is a dose already delivered during the pulse; medical care is about symptoms and supportive treatment under professionals.",
      "Do not handle unknown metallic debris from a blast area (possible activation / contamination).",
    ],
    notes:
      "For civil readiness after a ground/near-ground burst, fallout gamma/beta dominate later phases; neutrons matter most in the first seconds near ground zero.",
  },
  {
    id: "xray",
    name: "X-rays (for comparison)",
    symbol: "X",
    color: "#38bdf8",
    whatItIs:
      "Electromagnetic radiation similar to lower-energy gamma; produced by machines or secondary processes. Mentioned so medical/security X-ray is not confused with fallout.",
    range: "Depends on energy; medical X-rays are controlled beams.",
    stoppedBy: "Lead aprons, distance, engineered shielding.",
    health: "Occupational/medical risk when uncontrolled; not the same as nuclear fallout fields.",
    decon: [
      "No special “nuclear decon” for ordinary medical imaging.",
      "If a malicious radiological source is involved, treat as gamma/beta contamination guidance from responders.",
    ],
    notes: "Machine-produced X-rays stop when the machine is off; radioactive sources do not.",
  },
];

export interface StayTimeRule {
  title: string;
  body: string;
}

export const STAY_TIME_EDUCATION: {
  definition: string;
  whyItMatters: string;
  sevenTen: string;
  practical: string[];
  caveats: string[];
  rules: StayTimeRule[];
} = {
  definition:
    "Radiological stay time is how long a person can remain in a contaminated area (or at a given dose rate) before accumulating a specified radiation dose limit. Civil-defense and emergency responders use dose-rate measurements (e.g. mSv/h or R/h) to estimate safe work times.",
  whyItMatters:
    "Fallout dose rates drop over time as short-lived isotopes decay. Leaving shelter too early or staying outdoors in a hot zone increases cumulative dose. Officials use monitoring — not fixed calendars alone — to decide when it is safer to move.",
  sevenTen:
    "Classic fallout rule of thumb (approximate, educational): from 1 hour after a nuclear detonation, dose rate falls by a factor of about 10 for every sevenfold increase in time (the “7/10 rule”). Example: if the rate is R at H+1, it is ~R/10 at H+7, ~R/100 at H+49 (~2 days). Real environments vary with weather, rainout, and mix of isotopes.",
  practical: [
    "Go in, stay in, tune in: sturdy shelter reduces dose while rates fall.",
    "Stay time for responders is calculated from measured dose rate and allowed mission dose.",
    "Public guidance may say “shelter at least 24 hours” or longer depending on the event — follow live official instructions.",
    "Removing contaminated clothing and washing reduces the dose you carry with you when you must move.",
  ],
  caveats: [
    "The 7/10 rule is a teaching approximation for early fallout, not a precise forecast for every scenario (including RDDs, which may involve different isotopes).",
    "Rain can concentrate fallout in spots (“hot spots”); averages mislead.",
    "This app does not measure dose rates and cannot assign your personal stay time.",
  ],
  rules: [
    {
      title: "Time",
      body: "Less time near a source → lower dose. Delay non-essential outdoor trips while rates are high.",
    },
    {
      title: "Distance",
      body: "Dose rate falls quickly with distance from a concentrated source (inverse-square for point-like sources).",
    },
    {
      title: "Shielding",
      body: "Earth, concrete, and distance from exterior walls/roof cut gamma. Interior basement rooms are often better than upper floors under a fallout plume.",
    },
  ],
};

export interface ExplosionStep {
  id: string;
  order: number;
  phase: string;
  timeScale: string;
  whatHappens: string;
  damage: string;
  health: string;
  publicAction: string;
}

/** Educational sequence for a hypothetical nuclear detonation (civil-defense framing). */
export const NUCLEAR_EXPLOSION_TIMELINE: ExplosionStep[] = [
  {
    id: "zero",
    order: 1,
    phase: "0 — Instant of detonation",
    timeScale: "Microseconds–milliseconds",
    whatHappens:
      "A fission (and possibly fusion) chain reaction releases enormous energy as heat, light, pressure, and ionizing radiation. A fireball forms hotter than the surface of the sun.",
    damage:
      "Near ground zero, almost everything is vaporized or destroyed within the fireball radius (size scales with yield).",
    health:
      "Anyone at or very near ground zero is killed almost immediately by extreme heat, blast, and radiation. There is no practical personal protection inside that zone.",
    publicAction:
      "Prevention and deterrence are the only real protections at this range. Everyday readiness cannot change outcomes inside the fireball.",
  },
  {
    id: "flash",
    order: 2,
    phase: "1 — Thermal flash / light pulse",
    timeScale: "Milliseconds to ~1 second (varies with yield)",
    whatHappens:
      "An intense pulse of ultraviolet, visible, and infrared light races outward at light speed — faster than the blast.",
    damage:
      "Ignites fires, chars surfaces, damages eyes (flash blindness / retinal burns) for those looking toward the burst, especially at night.",
    health:
      "Flash burns on exposed skin; temporary or permanent eye injury. Light-colored, loose clothing and shade can reduce burns at intermediate distances — but not near ground zero.",
    publicAction:
      "If you see a sudden unnatural bright flash: do not stare; duck behind cover away from windows; cover skin if you have a second.",
  },
  {
    id: "prompt-rad",
    order: 3,
    phase: "2 — Prompt nuclear radiation",
    timeScale: "First seconds",
    whatHappens:
      "A pulse of neutrons and gamma rays is emitted directly from the reaction. Significant mainly relatively close to the burst compared with blast/thermal for larger yields.",
    damage:
      "Electronics and materials can be affected; biological damage is the main concern for people in range.",
    health:
      "High prompt doses can cause acute radiation syndrome (nausea, immune failure, etc.) over hours to weeks. At lethal ranges for prompt radiation, blast/thermal often already dominate.",
    publicAction:
      "Distance and any dense shielding between you and the burst help, but this phase is over before most people can react. Later actions focus on fallout.",
  },
  {
    id: "blast",
    order: 4,
    phase: "3 — Blast wave (shock)",
    timeScale: "Seconds; arrives after flash (speed of sound / shock)",
    whatHappens:
      "A wall of compressed air expands, reflecting off ground and structures. Overpressure and dynamic winds demolish buildings and throw debris.",
    damage:
      "Building collapse, flying glass, vehicle tumbling, infrastructure failure. Damage rings scale with yield and burst height (airburst vs surface).",
    health:
      "Trauma is the leading cause of injury and death outside the fireball: crush injuries, lacerations, lung damage from overpressure, secondary fires.",
    publicAction:
      "If you have any warning after the flash: get low, away from windows, under sturdy cover before the blast arrives. After blast: treat life-threatening bleeding if trained; avoid unstable structures.",
  },
  {
    id: "fires",
    order: 5,
    phase: "4 — Fires and urban firestorm risk",
    timeScale: "Minutes to hours",
    whatHappens:
      "Thermal ignition plus ruptured gas/electrical lines can start mass fires. In dense cities, firestorms are historically possible under worst conditions.",
    damage:
      "Secondary destruction of buildings that survived blast; toxic smoke; blocked roads.",
    health:
      "Burns, smoke inhalation, carbon monoxide, delayed medical access.",
    publicAction:
      "Evacuate only if authorities say so or if your shelter is on fire / collapsing. Moving into fallout without guidance can increase radiation dose.",
  },
  {
    id: "fallout",
    order: 6,
    phase: "5 — Fallout formation & arrival",
    timeScale: "Minutes to many hours (wind-dependent)",
    whatHappens:
      "Surface or near-surface bursts suck soil and debris into the fireball; radioactive particles condense and fall downwind as fallout. Airbursts produce less local fallout.",
    damage:
      "Contaminates land, water, vehicles, and buildings along the plume path. Not a second explosion — an invisible (or dusty) radiation hazard.",
    health:
      "External gamma from fallout fields; beta skin dose; internal dose if particles are inhaled/ingested. Dose rates highest early, then decay.",
    publicAction:
      "Shelter in the most protected interior space available; seal as practical; radio for official instructions. Remove outer clothes if you were outside; wash exposed skin.",
  },
  {
    id: "early-medical",
    order: 7,
    phase: "6 — Early medical & social disruption",
    timeScale: "Hours to days",
    whatHappens:
      "Hospitals overload; communications and power may fail; transportation breaks. Officials prioritize search/rescue, fire control, and radiation monitoring.",
    damage:
      "Cascading infrastructure failure can exceed the initial ring of physical destruction in societal impact.",
    health:
      "Combined injury (trauma + burns + radiation) is harder to treat. Infection risk rises. Psychological shock is widespread.",
    publicAction:
      "Conserve water/meds; stay put unless ordered; use radio (not rumors); reunite families via planned meeting points when safe.",
  },
  {
    id: "decay",
    order: 8,
    phase: "7 — Dose-rate decay & recovery decisions",
    timeScale: "Days to years",
    whatHappens:
      "Short-lived isotopes decay rapidly (see 7/10 educational rule). Long-lived contamination may restrict some areas for longer. Cleanup is specialist work.",
    damage:
      "Agricultural and economic disruption; restricted zones; expensive remediation.",
    health:
      "Lower residual doses for those who sheltered well; elevated cancer risk is a population-level long-term concern studied after past events — individual risk depends on dose.",
    publicAction:
      "Follow official re-entry and food/water advisories. Do not “self-clear” hot zones. Mental-health support matters in recovery.",
  },
];

export type RadThreatCategory =
  | "ind-nuclear"
  | "rdd"
  | "red"
  | "sabotage-facility"
  | "materials-theft"
  | "hoax";

export interface RadThreatType {
  id: RadThreatCategory;
  name: string;
  severity: "catastrophic" | "high" | "moderate" | "low-moderate";
  color: string;
  summary: string;
  effects: string;
  likelihoodNote: string;
}

export const RAD_THREAT_TYPES: RadThreatType[] = [
  {
    id: "ind-nuclear",
    name: "Improvised nuclear device (IND)",
    severity: "catastrophic",
    color: "#ef4444",
    summary:
      "A crude nuclear explosive built by non-state actors. Would require fissile material (HEU or plutonium), specialized skills, and industrial-scale secrecy.",
    effects:
      "If it worked, effects resemble a low-yield nuclear detonation: blast, thermal, prompt radiation, possible fallout. Yield and reliability highly uncertain.",
    likelihoodNote:
      "Open expert consensus: extremely difficult. No confirmed non-state nuclear detonation has ever occurred. Preventing fissile-material theft remains a top global security goal (IAEA / NTI-class concerns).",
  },
  {
    id: "rdd",
    name: "Radiological dispersal device (RDD / “dirty bomb”)",
    severity: "high",
    color: "#f97316",
    summary:
      "Conventional explosives used to spread radioactive material. Not a nuclear chain reaction.",
    effects:
      "Blast injuries plus contamination of an area; rarely a mass-casualty radiation event at city scale compared with a nuclear bomb, but severe disruption, fear, and costly cleanup.",
    likelihoodNote:
      "More technically plausible than an IND if sources are obtained, still constrained by source security and detection. Major governments plan specifically for RDD response.",
  },
  {
    id: "red",
    name: "Radiological exposure device (RED)",
    severity: "moderate",
    color: "#fbbf24",
    summary:
      "A hidden radioactive source intended to expose people without explosion (e.g. placed in a public space).",
    effects:
      "Localized high doses possible for people nearby for long periods; delayed discovery. Not city-destroying.",
    likelihoodNote:
      "Depends on access to strong sealed sources (industrial radiography, etc.). Source tracking and orphan-source recovery programs reduce risk.",
  },
  {
    id: "sabotage-facility",
    name: "Attack on nuclear facility / transport",
    severity: "high",
    color: "#fb923c",
    summary:
      "Sabotage or armed attack against reactors, spent fuel, or materials in transit aiming at release or theft.",
    effects:
      "Ranges from failed intrusion to severe radiological release (context-dependent). Reactor safety systems and security are designed against many scenarios.",
    likelihoodNote:
      "States and operators invest heavily in physical protection. Public reporting focuses on drills, insider threat mitigation, and IAEA nuclear security guidance.",
  },
  {
    id: "materials-theft",
    name: "Theft / trafficking of nuclear or radiological materials",
    severity: "moderate",
    color: "#a78bfa",
    summary:
      "Smuggling of radioactive sources or, rarely, nuclear material. Most seized cases involve industrial/medical sources or scams — not bomb-usable quantities.",
    effects:
      "Enabling step for RDD/RED or (in worst theoretical cases) IND pathways. Direct public harm often low until material is misused.",
    likelihoodNote:
      "IAEA Incident and Trafficking Database (ITDB) tracks confirmed incidents. Many reports are low-activity sources or fraud.",
  },
  {
    id: "hoax",
    name: "Hoax / false alarm",
    severity: "low-moderate",
    color: "#94a3b8",
    summary:
      "Threat calls, fake devices, or misidentified industrial sources. Consume responder time and cause panic.",
    effects: "Economic and psychological costs; opportunity cost for real emergencies.",
    likelihoodNote: "Common relative to real dispersal events. Still treated seriously until cleared.",
  },
];

/**
 * High-level, public open-source framing of actor types.
 * No operational details. No targeting guidance.
 */
export interface ThreatActorClass {
  id: string;
  name: string;
  capability: "none-known-nuclear" | "aspirational" | "radiological-concern" | "state-proxy-risk" | "criminal";
  color: string;
  summary: string;
  publicAssessment: string;
  examplesNote: string;
}

export const THREAT_ACTOR_CLASSES: ThreatActorClass[] = [
  {
    id: "states-only-nw",
    name: "Nuclear-armed states (only confirmed NW holders)",
    capability: "none-known-nuclear",
    color: "#38bdf8",
    summary:
      "Only a small set of states are assessed to possess nuclear weapons. Non-state groups are not confirmed to have nuclear weapons.",
    publicAssessment:
      "State arsenals are the basis of strategic nuclear risk. Terrorism risk is treated separately under nuclear security (materials, facilities, smuggling).",
    examplesNote:
      "See the Nuclear forces desk in this app for state inventories (open estimates).",
  },
  {
    id: "jihadist-networks",
    name: "Transnational violent extremist networks",
    capability: "aspirational",
    color: "#f87171",
    summary:
      "Some networks have publicly sought WMD prestige or expertise in open reporting over past decades; capability has remained limited relative to ambition.",
    publicAssessment:
      "Intelligence and academic open literature treat nuclear terrorism by such groups as low-probability / high-consequence. Radiological plots and interest appear more often than credible nuclear weaponization.",
    examplesNote:
      "Public cases more often involve disrupted plots, toxic chemicals, or conventional bombs than radiological dispersal — details belong to law enforcement history, not instruction.",
  },
  {
    id: "separatist-insurgent",
    name: "Regional insurgent / separatist groups",
    capability: "radiological-concern",
    color: "#fb923c",
    summary:
      "Capability varies widely. Most lack access to nuclear materials; a few conflict zones raise orphan-source and smuggling concerns.",
    publicAssessment:
      "Risk is highly local: weak governance + unsecured sources matter more than ideology labels alone.",
    examplesNote:
      "Open nuclear-security work focuses on locking down sources rather than listing “who can build a bomb.”",
  },
  {
    id: "criminal-smugglers",
    name: "Criminal smuggling networks",
    capability: "criminal",
    color: "#fbbf24",
    summary:
      "Profit-motivated traffickers sometimes move radioactive materials or claim to. Many offers are scams.",
    publicAssessment:
      "ITDB-type public statistics show trafficking incidents are real but often low-grade. Still a core target of customs/radiation portal monitoring.",
    examplesNote:
      "Stings and seizures are publicized precisely to deter markets for materials.",
  },
  {
    id: "insider-threat",
    name: "Insiders at facilities (trusted access risk)",
    capability: "radiological-concern",
    color: "#a78bfa",
    summary:
      "People with legitimate access can divert sources or aid adversaries. Nuclear security culture targets this pathway.",
    publicAssessment:
      "Insider threat is a standard pillar of IAEA nuclear security guidance — more realistic than cinematic “stolen warhead” plots.",
    examplesNote:
      "Mitigations: two-person rules, accounting, background checks, detection — not public DIY topics.",
  },
  {
    id: "lone-actors",
    name: "Lone actors / small cells",
    capability: "aspirational",
    color: "#94a3b8",
    summary:
      "Individuals may threaten radiological attacks. Practical barriers (source access, detection, self-harm from handling) remain high.",
    publicAssessment:
      "Law enforcement treats threats seriously; successful high-activity dispersal remains rare in public record.",
    examplesNote:
      "If you see a credible threat, contact authorities — do not investigate yourself.",
  },
];

export const RAD_PANEL_DISCLAIMER =
  "Educational civil-defense information only. Not medical advice, not classified intelligence, and not instructions for building or using weapons or radiological devices. In any real emergency follow official public alerts (e.g. IPAWS/EAS/WEA) and emergency services. Reporting suspicious nuclear/radiological activity: contact local authorities / national tip lines — never handle unknown sources.";
