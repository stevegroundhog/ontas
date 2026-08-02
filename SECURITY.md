# Security policy

## What ONTAS is

An **educational** open-source dashboard using **public, unclassified** feeds and open literature estimates.

It is **not**:

- A government warning system  
- Connected to IPAWS / EAS / national missile warning  
- A source of classified readiness (official DEFCON is not public)

## Reporting vulnerabilities

If you find a **software** vulnerability in this repository (XSS, SSRF via server proxies, dependency issues, etc.):

1. Open a private security advisory on GitHub if available, **or**  
2. Open a public issue **without** exploit details if disclosure must be limited, **or**  
3. Contact the repository owner via GitHub.

Please do **not** file issues that request classified data, real SSBN tracks, or targeting products — those are out of scope by design.

## Scope notes

- Server routes proxy **public** RSS / seismic / AIS / space-weather endpoints. Prefer least privilege and timeouts.
- Place search uses public Nominatim-class geocoding — respect usage policies.
- No secrets are required for a basic deploy. Do not commit API keys.
