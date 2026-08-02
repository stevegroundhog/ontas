# ONTAS — Open Nuclear Threat Awareness System

Educational **unclassified** dashboard for nuclear awareness, global conflicts, and public sensors.

> **Not an official warning system.** Official U.S. DEFCON is classified. Real emergencies use **FEMA IPAWS / EAS / Wireless Emergency Alerts** and local authorities.

**Repo:** [github.com/stevegroundhog/ontas](https://github.com/stevegroundhog/ontas) · **Essay:** [ARTICLE.md](./ARTICLE.md) (also `/article` after deploy)

---

## One-click install (pick one)

### A) Free public website (best for sharing)

Click → sign in with GitHub → **Deploy**. You get a link anyone can open in a browser.  
No API keys required for the basic educational app.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fstevegroundhog%2Fontas&project-name=ontas&repository-name=ontas&envDescription=No%20secrets%20required%20for%20basic%20run)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/stevegroundhog/ontas)

| Host | What happens | Notes |
| --- | --- | --- |
| **Vercel** | `npm ci` + `npm run build` (Nitro `vercel` preset) | Fastest shareable URL |
| **Render** | `npm ci` + `npm run build:node` then `npm start` | Free tier may sleep when idle |

Plain English walkthrough: **[HOW-TO-SHARE.md](./HOW-TO-SHARE.md)**

---

### B) Docker on your computer (recommended self-host)

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
docker compose up --build
```

Open **http://localhost:8080**  
Stop: `Ctrl+C` (or `docker compose down` if you used `-d`).

```bash
# Detached
docker compose up --build -d
docker compose down
```

---

### C) One-command installer script

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
chmod +x install.sh
./install.sh
```

Menu: **Docker** or **Node**. Non-interactive:

```bash
./install.sh docker
./install.sh node
```

---

### D) Node.js (no Docker)

**Requirements:** Node **22+** ([nodejs.org](https://nodejs.org))

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
npm ci          # or: npm install
npm run build:node
npm start
```

Open **http://localhost:8080**

---

### E) GitHub Codespaces (browser IDE)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/stevegroundhog/ontas)

In the terminal after the codespace starts:

```bash
npm ci
npm run dev
```

Then use the **Ports** tab → open **8080**.

---

## Features (current)

- **Quick find** navigation (Situational / Arsenals / Strategic / Protect) + Jump search + **Share link** deep URLs  
- **Live map** — nuclear states, conflicts, seismic, SSBN *estimates*, open Baltic AIS, **range bands**  
- **Unofficial DEFCON OSINT** + **arms-control clock** + NOAA space weather (Kp)  
- **Conflicts** — neutral facts, open fatality ranges, live reports, humanitarian wire  
- **Warheads & yields** · **Country cards** · **Compare** · **Ships, subs & aircraft**  
- **Launches**, **Treaties**, **Scenarios**, **Climate brief**, **News**, **Live intel**  
- **Rad / CBRN**, **Terror history**, **Survivability** (climate-aware kits, export)  
- **Methodology**, **Alert literacy** (IPAWS / EAS / WEA), **Crisis timeline**  
- **Beginner guide** + **Essay** (`/article`) · PWA shell  

## Public data sources

| Source | Role |
|--------|------|
| USGS | Earthquakes |
| DoD / IAEA / UN / BBC RSS | Public wires |
| Open news meshes | Nuclear-related headlines |
| ReliefWeb-class public feeds | Humanitarian headlines |
| Finnish Digitraffic AIS | Open Baltic surface tracks |
| NOAA SWPC | Planetary K-index |
| OpenStreetMap Nominatim | Place search |
| FAS / SIPRI / ACA-class literature | Open force / yield estimates |
| defconlevel.com | **Unofficial** DEFCON OSINT only |

**Not public:** official DEFCON, real submerged SSBN tracks, classified networks, targeting data.

## Stack

React 19 · TypeScript · Vite · TanStack Start · Tailwind v4 · Nitro (**Vercel** or **node-server**)

| Command | Use |
|---------|-----|
| `npm run dev` | Development on `0.0.0.0:8080` |
| `npm run build` | Production build for **Vercel** |
| `npm run build:node` | Production build for **Docker / Render / self-host** |
| `npm start` | Run Node production server (after `build:node`) |
| `npm run typecheck` | TypeScript check |

## License

MIT — see [LICENSE](./LICENSE).

## Contributing

Keep sources **public/unclassified**, keep disclaimers, no fake “official DEFCON.” PRs welcome.
