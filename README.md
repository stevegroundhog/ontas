# ONTAS — Open Nuclear Threat Awareness System

Educational, **unclassified**, open-source dashboard for nuclear awareness, global conflicts, and public sensors.

> **Not an official warning system.** Official U.S. DEFCON is classified. Real emergencies use **FEMA IPAWS / EAS / Wireless Emergency Alerts** and local authorities.

## Features

- **Live map** — world countries, nuclear-armed states, conflict markers, seismic watch, open AIS
- **Unofficial DEFCON OSINT** — public estimate only (clearly labeled)
- **Conflicts desk** — major wars/conflicts with neutral fact sheets + live open reports (UN, BBC, news RSS)
- **Nuclear forces** — open-source arsenal estimates for nine nuclear-armed states
- **Ships & subs** — educational SSBN patrol estimates + regional open AIS (Finnish Digitraffic)
- **Survivability search** — any city/town via OpenStreetMap → readiness kit suggestions
- **Beginner guide** — plain-language geopolitics, nuclear basics, DEFCON levels
- **Source health board** — probes legal public feeds and shows OK / LIMITED / DOWN

## Stack

- React 19 · TypeScript · Vite · TanStack Start / Router
- Tailwind CSS v4
- Server functions for RSS / USGS / AIS / geocoding (no API keys required for core features)

## Quick start

```bash
# Node 22+ recommended
npm install
npm run dev          # http://0.0.0.0:8080
```

```bash
npm run typecheck
npm run build
npm run preview      # production build on :8080
```

## Public data sources (unclassified)

| Source | What it provides |
|--------|------------------|
| USGS Earthquake GeoJSON | M2.5+ seismicity |
| U.S. DoD news RSS | Unclassified releases |
| IAEA Top News RSS | Agency news |
| UN Peace & Security RSS | Conflict / security wires |
| Google News search RSS | Multi-region nuclear headlines |
| BBC World RSS | Independent wire |
| Finnish Digitraffic AIS | Open Baltic surface traffic |
| OpenStreetMap Nominatim | Place search |
| defconlevel.com (OSINT) | **Unofficial** DEFCON estimate |

**Not available publicly (by design):** official DEFCON, real submerged SSBN tracks, classified C2 / missile warning networks.

## Educational disclaimers

- ONTAS is for **learning and open-source awareness**, not life-safety decisions.
- Conflict descriptions use neutral framing; always open original articles.
- SSBN positions are **patrol-zone estimates**, not live classified tracks.
- Survival kits are general readiness education, not medical advice.

## License

MIT — see [LICENSE](./LICENSE).

## Contributing

Issues and PRs welcome. Please keep data sources **public/unclassified** only, preserve disclaimers, and avoid adding propaganda or unverified “official DEFCON” claims.

## Deploy

Builds for Vercel via Nitro (`nitro({ preset: "vercel" })` on production build). Any Node host that can run `npm run build` + `npm run preview` works for demos.
