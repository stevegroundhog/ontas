# ONTAS — Open Nuclear Threat Awareness System

Educational **unclassified** dashboard for nuclear awareness, global conflicts, and public sensors.

> **Not an official warning system.** Official U.S. DEFCON is classified. Real emergencies use **FEMA IPAWS / EAS / Wireless Emergency Alerts** and local authorities.

---

## Read the essay

**[What public data can (and can’t) tell you about nuclear risk](./ARTICLE.md)** — also live at `/article` after you deploy.

---

## Install in one click (pick one)

### A) Free website in the cloud (easiest for sharing)

Click the button → log in with GitHub → **Deploy**.  
You get a public link anyone can open in a browser.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fstevegroundhog%2Fontas&project-name=ontas&repository-name=ontas)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/stevegroundhog/ontas)

Plain English walkthrough: **[HOW-TO-SHARE.md](./HOW-TO-SHARE.md)**

---

### B) Run on your own computer (Docker — recommended)

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
docker compose up --build
```

Then open **http://localhost:8080**

Stop with `Ctrl+C`, or if you used `-d`: `docker compose down`

---

### C) Super simple installer script

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
chmod +x install.sh
./install.sh
```

The script asks: **Docker** or **Node**, then does the rest.

---

### D) Node.js (no Docker)

**Requirements:** Node 22+ from [nodejs.org](https://nodejs.org)

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
npm install
npm run build:node
npm start
```

Open **http://localhost:8080**

---

## Features

- **Live map** — countries, nuclear states, conflict markers, seismic watch, open AIS  
- **Unofficial DEFCON OSINT** — public estimate only (clearly labeled)  
- **Conflicts desk** — major wars with neutral facts + live open reports  
- **Nuclear forces** — open-source arsenal estimates  
- **Ships & subs** — SSBN patrol estimates + regional open AIS  
- **Survivability search** — any place → readiness kit ideas  
- **Beginner guide** — geopolitics, nukes, DEFCON in plain language  
- **Source health board** — public feeds OK / LIMITED / DOWN  

## Public data sources

| Source | Role |
|--------|------|
| USGS | Earthquakes |
| DoD / IAEA / UN RSS | Official public wires |
| Google News + BBC | News mesh |
| Finnish Digitraffic AIS | Open Baltic ship tracks |
| OpenStreetMap Nominatim | Place search |
| defconlevel.com | **Unofficial** DEFCON OSINT only |

**Not public:** official DEFCON, real submerged SSBN tracks, classified networks.

## Stack

React 19 · TypeScript · Vite · TanStack Start · Tailwind v4 · Nitro (Vercel or Node server)

## Developer scripts

```bash
npm run dev          # development on :8080
npm run build        # Vercel production build
npm run build:node   # self-host / Docker production build
npm start            # run Node production server
npm run typecheck
```

## License

MIT — see [LICENSE](./LICENSE).

## Contributing

Keep sources **public/unclassified**, keep disclaimers, no fake “official DEFCON.” PRs welcome.
