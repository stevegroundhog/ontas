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

- **Sidebar navigation + Jump search** — Situational / Arsenals / Strategic / Protect  
- **Live map** — nuclear states, conflicts, seismic, SSBN estimates, open AIS  
- **Unofficial DEFCON OSINT** — public estimate only (clearly labeled)  
- **Conflicts desk** — neutral facts, open fatality ranges, live reports  
- **Countries / Compare** — force cards, strategy notes, delivery systems  
- **Yields & aircraft** — open kt/Mt bands + nuclear-capable aircraft  
- **Terror history** — public nuclear/radiological threats & attempts  
- **Rad / CBRN** — radiation types, decon, stay time, detonation steps  
- **Survivability search** — climate-aware kits for any place  
- **Launches, Treaties, Scenarios, Climate brief, News, Live intel**  
- **Beginner guide + Essay** (`/article`) — plain-language education  

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
