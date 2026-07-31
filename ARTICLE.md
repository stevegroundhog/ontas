# What public data can (and can’t) tell you about nuclear risk

### And why I built an open educational map instead of another “live DEFCON” hype site

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

More than people think — and less than influencers pretend.

### Public, legal, and useful

- **Earthquakes** from the USGS — sometimes relevant near known test sites; usually ordinary geology.  
- **Public agency wires** — for example DoD news releases, IAEA updates, UN peace and security reporting.  
- **Open news** — multi-region headline mesh, BBC World, and similar public RSS.  
- **Some ship tracking** — open AIS in limited regions (ONTAS uses a Finnish open Baltic feed for surface traffic).  
- **Open estimates** of nuclear forces from long-running research communities.  
- **Independent OSINT guesses** about readiness — with huge caveats, always labeled.

### Not public (and anyone serious will admit it)

- **Official U.S. DEFCON** in real time — classified.  
- **True patrol positions** of ballistic-missile submarines — they are designed *not* to broadcast.  
- **Classified command-and-control** and national missile-warning networks — not on GitHub, not on a hobby dashboard.

ONTAS is built on the first list. It **labels** the second list as unavailable — on purpose. That honesty is a feature, not a missing checkbox.

---

## What ONTAS is

ONTAS is an educational web application:

- A **world map** with nuclear-armed states, conflict markers, seismic context, and optional maritime layers.  
- A **Conflicts desk** — major wars and crises in neutral language, plus live reports from open sources.  
- **Nuclear force cards** — open-source-style inventory context for nuclear-armed states.  
- **Unofficial DEFCON OSINT** — shown as an estimate, never as “official.”  
- A **source health board** — which public feeds are OK, limited, or down.  
- **Survivability search** — type a city or town for general readiness ideas (not medical advice).  
- A **Beginner guide** — geopolitics, nuclear basics, and DEFCON without assuming prior knowledge.

No secret APIs. No claim of government authority. The code is open so you can inspect how feeds are pulled and how labels are written.

---

## What ONTAS is not

Please read this twice:

- Not NORAD  
- Not USSTRATCOM  
- Not FEMA  
- Not a life-safety alert system  
- Not a propaganda channel for any government  

If your phone issues a real emergency alert, **that** is the channel. Not a hobby map. Not a social media post. Not this essay.

In the United States, public life-safety paths include **FEMA IPAWS**, **EAS**, and **Wireless Emergency Alerts**. Local authorities still matter.

---

## DEFCON in plain English

**DEFCON** stands for Defense Readiness Condition. It is a U.S. military alert scale.

| Level | Name (classic) | Plain meaning |
|------:|----------------|---------------|
| 5 | FADE OUT | Normal peacetime baseline |
| 4 | DOUBLE TAKE | Increased intelligence watch / security |
| 3 | ROUND HOUSE | Forces above normal readiness |
| 2 | FAST PACE | Further increase; next step to maximum |
| 1 | COCKED PISTOL | Maximum readiness |

Three facts that prevent a lot of nonsense:

1. Higher readiness does **not** automatically mean “nuclear weapons are launching.”  
2. The **real** current DEFCON is **not** a public live feed.  
3. Websites that “show live DEFCON” are, at best, educated guesses from open signals.

ONTAS uses an unofficial OSINT estimate and says so on the screen. If that bothers you because you wanted secret certainty: good. **Uncertainty is the honest product.**

---

## Why a conflicts desk belongs next to nuclear context

Most wars stay conventional. Nuclear risk becomes more relevant when nuclear-armed states are parties, alliances tighten, or crises spiral beyond local control.

So ONTAS tracks major conflicts with dry, factual cards:

- Named parties — without mythologizing  
- Type and intensity (war, insurgency, tension, and so on)  
- Open notes on harm where public reporting allows  
- Live open reports you can open at the original source  

The goal is not to tell you who is “right.” The goal is **situational literacy** without a narrative machine.

---

## How to use tools like this without frying your nervous system

1. Open the Beginner guide first if you are new.  
2. Check the source board — know what is actually live.  
3. Read a conflict card, then open original articles. Headlines are not finished intelligence.  
4. Treat OSINT DEFCON as “public chatter pressure,” not gospel.  
5. For personal readiness, prefer boring basics — water, medications, a radio, a plan — not movie bunkers.  
6. When overwhelmed, step away. Understanding risk is not the same as living in constant alarm.

---

## Why open source matters here

Nuclear and war topics attract grifters, panic merchants, and confident fakes.

Open source is a partial antidote:

- You can see what the app claims to fetch.  
- You can run it yourself (Vercel one-click, Docker, or Node).  
- You can fork it and change anything you dislike.  
- You can challenge the methodology in public.

Repository: https://github.com/stevegroundhog/ontas

---

## The honest pitch

I did not build a button that tells you if the world ends.

I built a **classroom globe with a news desk**:

- public sensors  
- open wires  
- clear limits  
- a door for beginners  

If that sounds useful, open the live app and break it. Tell me what is confusing. Tell me what is missing. Tell me if a label is too strong or too soft.

**Live app:** https://YOUR-APP.vercel.app  
**Essay page:** https://YOUR-APP.vercel.app/article  
**Code:** https://github.com/stevegroundhog/ontas  

Educational only. Public data only. Not an official warning system.

---

*© ONTAS contributors · MIT License · Educational commentary only — not legal, medical, or emergency advice.*
