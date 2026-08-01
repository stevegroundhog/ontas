# What public data can (and can’t) tell you about nuclear risk

### An updated guide to ONTAS — open map, arsenals, conflicts, radiation education, and honest limits

**Live app:** https://YOUR-APP.vercel.app  
**This essay (after deploy):** https://YOUR-APP.vercel.app/article  
**Open source:** https://github.com/stevegroundhog/ontas  

*Educational only. Not an official warning system. Official U.S. DEFCON is classified. Real U.S. emergencies use FEMA IPAWS / EAS / Wireless Emergency Alerts.*

---

Every few months, the internet rediscovers nuclear anxiety.

A missile test. A speech. A map colored red. Someone posts “we’re at DEFCON 2” with a screenshot of a random website. The replies fill with panic, jokes, and confident wrong answers.

I got tired of two extremes: **doom theater** on one side, and **opaque jargon** on the other.

So I built **ONTAS** — the *Open Nuclear Threat Awareness System* — a free, open-source dashboard that does something unfashionable:

It shows what you **can** see from **public, unclassified** sources…  
and it is honest about what you **cannot**.

This essay matches the **current app**: sidebar navigation, live map, force cards, **warhead yields (kt/Mt)** and **nuclear-capable aircraft**, **terror history**, **Rad / CBRN** education, conflicts with **open fatality ranges**, launches, treaties, compare, and climate-aware survivability search.

---

## The problem with most “nuclear trackers”

A lot of tools blur three different things into one scary interface:

1. **News** — often messy, sometimes biased, always incomplete in the first hour.  
2. **Military readiness language** — DEFCON, postures, deterrence, “strategic messaging.”  
3. **Actual emergency alerts** — in the United States, systems like IPAWS, EAS, and Wireless Emergency Alerts on your phone.

Those are not the same thing.

- A loud headline is not a launch.  
- An open-source “DEFCON estimate” is not the U.S. government’s classified readiness condition.  
- A map is not a warning siren.

If a site won’t say that clearly, I don’t trust it — and neither should you.

---

## What is actually public?

### Public, legal, and useful

- **Earthquakes** from the USGS — sometimes relevant near known test sites; usually ordinary geology.  
- **Public agency wires** — DoD news, IAEA, UN peace and security reporting.  
- **Open news** — multi-region headline mesh and similar public RSS (including a nuclear-security news mesh for radiological topics).  
- **Some ship tracking** — open AIS in limited regions (e.g. Finnish Baltic surface traffic).  
- **Open estimates** of nuclear forces, **representative yields**, and **dual-capable aircraft** from long-running research communities (FAS / SIPRI / ACA-class literature).  
- **Historical open cases** of non-state nuclear *interest*, threats, or radiological plots (court records, government releases, academic summaries).  
- **Independent OSINT guesses** about readiness — with huge caveats, always labeled.

### Not public (and anyone serious will admit it)

- **Official U.S. DEFCON** in real time — classified.  
- **True patrol positions** of ballistic-missile submarines — they are designed *not* to broadcast.  
- **Exact warhead loadings and yields** on specific missiles — not official public tables.  
- **Classified command-and-control** and national missile-warning networks.

ONTAS is built on the first list. It **labels** the second list as unavailable — on purpose.

---

## What’s in ONTAS today (tour of the desks)

Use the **left sidebar** (Menu on mobile) or the **Jump to…** search.

| Group | Desks |
| --- | --- |
| **Situational** | Live map · Conflicts · Live intel · News desk |
| **Arsenals** | Countries · **Yields & aircraft** · Compare · Ships & subs |
| **Strategic** | Launches · Treaties · Scenarios · Climate brief |
| **Protect** | **Rad / CBRN** · **Terror history** · Survivability · Beginner guide |

### Live map
Nuclear-armed states, conflict markers, seismic context, optional SSBN *estimates* and AIS surface contacts, graticule, layer toggles.

### Countries & compare
Open inventory context, doctrine, **nuclear strategy** notes, delivery systems, and on the force card: **yield chips** and **nuclear-capable aircraft**. Compare two nations side by side.

### Yields & aircraft
Representative **kiloton / megaton** bands for major warhead families and a catalog of **strategic bombers and dual-capable fighters** (B-52, B-2, B-21 path, F-35 DCA, Tu-160, Rafale, H-6, and more). All open estimates.

### Conflicts
Neutral fact sheets: parties, intensity, **realistic open death-toll ranges** with sources, live reports from public wires — no scoreboard propaganda.

### Terror history
Public record of groups and cases involving **nuclear threats, interest, or radiological attempts** (e.g. al-Qaeda-related cases, Aum Shinrikyo, Chechen-era radiological episodes, ISIS-era rhetoric, smuggling networks, disrupted domestic plots, hoaxes). Filter by type. Bottom line stated clearly: **no terrorist group is known to possess nuclear weapons.**

### Rad / CBRN
Threat categories (IND, RDD, RED, sabotage, theft, hoax), actor *classes*, **alpha/beta/gamma/neutron** with decontamination themes, **radiological stay time** and the educational 7/10 rule, **step-by-step nuclear detonation sequence** (flash → blast → fallout → recovery), and open nuclear-security news.

### Ships & subs, launches, treaties
Educational SSBN modeling + limited AIS; public test/space-style launch notes; arms-control timeline (NPT, New START era, etc.).

### Survivability
Search any city/town/village for climate-aware kit ideas (arctic through arid). Not medical advice. Not a fallout map.

### Beginner guide + this essay
Plain-language onboarding for people who don’t know geopolitics, DEFCON, or radiation terms.

### Unofficial DEFCON OSINT
Shown as an **estimate**, never as “official.” Source health board shows which feeds are OK or degraded.

---

## Nuclear terrorism — what public history actually supports

Popular culture loves the stolen suitcase nuke. Open security literature is more careful:

- **State arsenals** dominate strategic nuclear risk.  
- **Non-state nuclear weapons** have never been confirmed. Barriers (fissile material, expertise, detection) are high.  
- **Radiological** threats (dispersal of radioactive material, stolen industrial sources) are more often discussed as realistic planning cases than true nuclear bombs.  
- Many “threats” are **rhetoric or hoaxes**; some cases go **beyond rhetoric** (procurement attempts, disrupted plots) and still fail to produce a nuclear explosion.

ONTAS lists **known public cases** for education — not to teach how to build anything, and not as a live tip feed. Report real threats to authorities.

---

## Yields: why kt and Mt matter (and why ranges are wide)

Yield is a rough measure of energy. Comparing **Hiroshima (~15 kt class)** to multi-hundred-kiloton strategic warheads is how students grasp scale. Open sources often give **bands**, not secrets:

- Low-yield options may be discussed in **single-digit to tens of kt**.  
- Many modern strategic RVs are modeled in the **tens to few hundreds of kt**.  
- Some heavy or older designs are discussed in **megaton** ranges.

ONTAS shows **ranges with uncertainty** so the interface cannot be mistaken for a targeting manual.

---

## DEFCON myths, quickly

| Myth | Reality |
| --- | --- |
| “A website shows the real DEFCON” | Official U.S. DEFCON is **not** published live. |
| “DEFCON 1 means missiles are flying” | It means **maximum readiness**, not automatic launch. |
| “If the map is red, evacuate” | **Official alerts** (phone, sirens, TV/radio) are the life-safety channel. |

---

## What ONTAS is *not*

- Not FEMA, not NORAD, not a missile-warning feed.  
- Not medical advice; not a substitute for local civil defense.  
- Not a complete encyclopedia of every war, hoax, or warhead variant.  
- Not propaganda for any side in a conflict.

---

## Why open source

If a map claims authority, you should be able to see **how** it works: which RSS URLs, which estimates, which labels. ONTAS is on GitHub so researchers, teachers, and skeptics can fork it, fix it, or throw it away.

---

## Who this is for

Students · journalists doing a first pass · policy-curious readers · people who want **less panic and more literacy** · anyone who has seen a viral DEFCON screenshot and felt lost.

---

## If you only remember three things

1. **Public data is real — and limited.** Use it; don’t worship it.  
2. **Official U.S. DEFCON is classified.** Treat any “live DEFCON” as **unofficial**.  
3. **Life-safety alerts come from official systems**, not hobby dashboards.

Open the **Beginner guide** in the app for the short version. Use **Rad / CBRN**, **Terror history**, and **Yields & aircraft** when you want depth without doom theater.

---

*ONTAS is education. Stay curious. Stay calm. Check primary sources.*
