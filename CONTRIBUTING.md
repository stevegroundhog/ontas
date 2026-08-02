# Contributing to ONTAS

Thanks for helping keep this educational and honest.

## Rules of the road

1. **Public / unclassified sources only** — no classified, leaked, or private operational data.
2. **Never claim official DEFCON** — any readiness badge must stay labeled unofficial / OSINT.
3. **Not a warning system** — keep disclaimers (FEMA IPAWS / EAS / WEA for U.S. life-safety).
4. **No targeting manuals** — open range estimates and yield bands are educational, not aim points.
5. **Conflicts stay neutral** — parties, open fatality ranges with sources, no scoreboard propaganda.

## Dev setup

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
npm ci
npm run dev
```

Open http://localhost:8080

- Node **22+** (see `.nvmrc`)
- Typecheck: `npm run typecheck`
- Self-host build: `npm run build:node`
- Vercel-style build: `npm run build`

## Pull requests

- Prefer small, focused PRs.
- Update **Methodology** / beginner guide if you change how numbers are made.
- Run typecheck (and build if you touch deploy/config) before opening a PR.
- CI runs typecheck + Node build + Vercel preset build on every PR.

## One-click deploy for testers

Share the **Vercel Deploy** button in the README so reviewers can spin up a live copy without cloning.

## Code of conduct (short)

Be kind. Assume good faith. Educational nuclear topics can be heavy — no harassment, no spam, no attempts to use this project for harm.
