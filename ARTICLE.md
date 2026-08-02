# What public data can (and can’t) tell you about nuclear risk

### A guide to ONTAS (current build) — open map, arsenals, conflicts, literacy desks, and honest limits

**Open source:** [github.com/stevegroundhog/ontas](https://github.com/stevegroundhog/ontas)  
**One-click deploy:** [Vercel](https://vercel.com/new/clone?repository-url=https://github.com/stevegroundhog/ontas) · [Render](https://render.com/deploy?repo=https://github.com/stevegroundhog/ontas) · [Codespaces](https://codespaces.new/stevegroundhog/ontas)  
**In-app essay:** `/article` after you deploy · **Share guide:** [HOW-TO-SHARE.md](./HOW-TO-SHARE.md)

*Educational only. Not an official warning system. Official U.S. DEFCON is classified. Real U.S. emergencies use FEMA IPAWS / EAS / Wireless Emergency Alerts.*

---

Every few months, the internet rediscovers nuclear anxiety.

A missile test. A speech. A map colored red. Someone posts “we’re at DEFCON 2” with a screenshot of a random website. The replies fill with panic, jokes, and confident wrong answers.

I got tired of two extremes: **doom theater** on one side, and **opaque jargon** on the other.

So I built **ONTAS** — the *Open Nuclear Threat Awareness System* — a free, open-source dashboard that does something unfashionable:

It shows what you **can** see from **public, unclassified** sources…  
and it is honest about what you **cannot**.

This essay matches the **current product**: Quick find navigation (no cluttered permanent ops wall), shareable deep links, Live map with arms-control clock and range bands, Methodology, Alert literacy, Crisis timeline, humanitarian conflict wires, warheads/yields, ships/subs/aircraft, terror history, Rad/CBRN, climate-aware survivability exports, and a PWA shell.

---

## The problem with most “nuclear trackers”

A lot of tools blur three different things into one scary interface:

1. **News** — messy, incomplete in the first hour.  
2. **Military readiness language** — DEFCON, postures, deterrence.  
3. **Actual emergency alerts** — IPAWS, EAS, Wireless Emergency Alerts.

Those are not the same thing.

- A loud headline is not a launch.  
- An open-source “DEFCON estimate” is not the U.S. government’s classified readiness condition.  
- A map is not a warning siren.  
- A **range ring** is not a targeting product.

If a site won’t say that clearly, I don’t trust it — and neither should you.

---

## What is actually public?

### Public, legal, and useful

- **Earthquakes** (USGS) — sometimes near test geography; usually ordinary geology.  
- **Public agency wires** — DoD, IAEA, UN peace & security, BBC World RSS.  
- **Open news meshes** — multi-region nuclear-related RSS; nuclear-security queries for Rad desk.  
- **Regional open AIS** — e.g. Finnish Digitraffic Baltic surface traffic.  
- **Open force estimates**, **yield bands**, **dual-capable aircraft** — FAS / SIPRI / ACA-class literature.  
- **Humanitarian headlines** — ReliefWeb / UN-class public feeds on the Conflicts desk.  
- **NOAA space weather (Kp)** — radio/GPS context, not fallout.  
- **Historical open cases** of non-state nuclear *interest*, threats, or radiological plots.  
- **Independent OSINT readiness guesses** — always labeled unofficial.

### Not public (and anyone serious will admit it)

- **Official U.S. DEFCON** in real time.  
- **True SSBN patrol positions**.  
- **Exact official warhead loadings** on specific missiles.  
- **Classified warning networks** and war plans.

ONTAS is built on the first list. It **labels** the second as unavailable — on purpose. See the in-app **Methodology** desk.

---

## What’s in ONTAS today

### Navigation

- **Live map** home with Quick find (Situational / Arsenals / Strategic / Protect).  
- **Share link** copies `?desk=&nation=&compare=&conflict=&asof=` deep links.  
- **Jump to…** search and **Beginner guide** / **Essay** / **Methodology** / **Alerts** in the header.  
- First-visit **“This is not a siren”** interstitial.

| Group | Desks |
| --- | --- |
| **Situational** | Live map · Conflicts · Live intel · News · Crisis timeline |
| **Arsenals** | Warheads & yields · Country cards · Compare · Ships, subs & aircraft |
| **Strategic** | Launches · Treaties · Scenarios · Climate brief |
| **Protect** | Rad / CBRN · Terror history · Survivability · Alert literacy · Methodology · Beginner guide |

### Live map

Nuclear-armed states, conflict markers, seismic context, SSBN *estimates*, Baltic AIS, **range bands** (great-circle open max ranges by leg), arms-control clock (post–New START), space weather, headline tick, layer toggles (including mobile Layers sheet).

### Arsenals

Open inventories, doctrine/strategy notes, kt/Mt catalogs, dual-capable aircraft, educational maritime units, side-by-side **Compare** with copy/export cards.

### Conflicts

Neutral fact sheets, **open fatality ranges** with sources, live reports, **humanitarian wire** — not scoreboard propaganda.

### Literacy desks

- **Methodology** — how every number is made; never-show list.  
- **Alert literacy** — IPAWS / EAS / WEA; civilian power vs weapons.  
- **Crisis timeline** — known-then / known-later / lessons.  
- **Rad / CBRN** — radiation types, stay time, detonation sequence.  
- **Terror history** — public threats/attempts; no known non-state nuclear weapons.  
- **Survivability** — any city, climate-tuned kits, export .txt.

---

## Range bands (read this once)

Range bands use published open maximum ranges for ICBM, SLBM, bomber, and theater systems, drawn as **great circles** from a capital/C2 pin.

They are **illustrative**. They are **not** aim points, MIRV footprints, or flight-time tables. Flat-map projection makes long rings look warped near the poles — that is geometry, not a doom score.

---

## Nuclear terrorism — what public history supports

- **State arsenals** dominate strategic nuclear risk.  
- **Non-state nuclear weapons** have never been confirmed.  
- **Radiological** plots and materials security appear more often than true nuclear bombs.  
- Many “threats” are rhetoric or hoaxes.

ONTAS lists public cases for education — not as a tip feed and not as instructions.

---

## Yields: why kt and Mt matter

Yield is a rough energy measure. Open sources often give **bands**. ONTAS shows ranges with uncertainty so the interface cannot be mistaken for a targeting manual.

1 kiloton ≈ 1,000 tons of TNT. 1 megaton = 1,000 kt.

---

## DEFCON myths, quickly

| Myth | Reality |
| --- | --- |
| “A website shows the real DEFCON” | Official U.S. DEFCON is not published live. |
| “DEFCON 1 means missiles are flying” | It means maximum readiness, not automatic launch. |
| “If the map is red, evacuate” | Official phone/siren/TV alerts are the life-safety channel. |

---

## What ONTAS is not

- Not FEMA, not NORAD, not a missile-warning feed.  
- Not medical advice; not a substitute for local civil defense.  
- Not a complete encyclopedia of every warhead variant.  
- Not propaganda for any side in a conflict.

Why open source? If a map claims authority, you should see **how** it works. Fork it, fix it, or one-click deploy it: https://github.com/stevegroundhog/ontas

---

## If you only remember three things

1. **Public data is real — and limited.** Use it; don’t worship it.  
2. **Official U.S. DEFCON is classified.** Treat any “live DEFCON” as unofficial.  
3. **Life-safety alerts come from official systems**, not hobby dashboards.

Open the **Beginner guide** in the app for the short version. Use **Methodology**, **Alert literacy**, **Crisis timeline**, **Rad / CBRN**, and **Warheads & yields** when you want depth without doom theater.

*ONTAS is education. Stay curious. Stay calm. Check primary sources.*
