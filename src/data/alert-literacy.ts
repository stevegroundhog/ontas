/** How official public alerts work — educational, not a warning service. */

export type AlertChannel = {
  id: string;
  name: string;
  region: string;
  whatItIs: string;
  howYouGetIt: string;
  verify: string;
  notThis: string;
};

export const ALERT_CHANNELS: AlertChannel[] = [
  {
    id: "ipaws",
    name: "IPAWS",
    region: "United States",
    whatItIs:
      "Integrated Public Alert & Warning System — the federal framework that lets authorized officials send alerts through multiple pathways.",
    howYouGetIt:
      "You usually never “see IPAWS” itself. You receive messages via Wireless Emergency Alerts (phone), EAS (TV/radio), NOAA Weather Radio, and some apps/sirens tied to the same backbone.",
    verify:
      "Authorized originators only. Cross-check local emergency management social accounts and broadcast media. Look for official cancellation messages if an alert was erroneous.",
    notThis:
      "A random dashboard, screenshot, or influencer post is not IPAWS. ONTAS is not connected to IPAWS.",
  },
  {
    id: "eas",
    name: "EAS (Emergency Alert System)",
    region: "United States",
    whatItIs:
      "Broadcast interrupt system on radio and TV for presidential messages and other authorized emergency information.",
    howYouGetIt: "TV and radio interruptions with distinctive tones and crawl text.",
    verify: "National or state/local originators. Stations rebroadcast authenticated messages.",
    notThis: "YouTube clips and social reposts can be old or faked — prefer live broadcast.",
  },
  {
    id: "wea",
    name: "Wireless Emergency Alerts (WEA)",
    region: "United States",
    whatItIs:
      "Geo-targeted messages to compatible mobile phones (Amber, imminent threats, presidential alerts, etc.).",
    howYouGetIt:
      "Phone vibration + loud attention signal + short text. Works without an app if the carrier and handset support WEA.",
    verify:
      "Comes from the wireless network as a government alert class. Settings can limit some categories; presidential alerts cannot be disabled on compliant phones.",
    notThis:
      "SMS from unknown numbers, chat apps, or “forward this warning” chain messages are not WEA.",
  },
  {
    id: "generic",
    name: "National civil protection (non-US)",
    region: "International",
    whatItIs:
      "Most countries run their own public warning systems (cell broadcast, sirens, apps, broadcasters).",
    howYouGetIt: "Varies: cell broadcast, national apps, radio/TV, outdoor sirens.",
    verify: "Prefer your government’s emergency management / interior ministry channels.",
    notThis: "Foreign social media trends do not replace your national alert authority.",
  },
];

export const ALERT_STEPS: { step: number; title: string; body: string }[] = [
  {
    step: 1,
    title: "Prefer official channels",
    body: "Phone WEA / cell broadcast, radio/TV EAS-class interrupts, and your local emergency management accounts beat viral posts.",
  },
  {
    step: 2,
    title: "Check for cancellation",
    body: "False alerts happen (e.g. Hawaii 2018). Official systems issue cancellations — wait for those rather than rumor.",
  },
  {
    step: 3,
    title: "Do not rely on ONTAS for sirens",
    body: "This app fuses public OSINT for education. It does not receive IPAWS messages and cannot warn your neighborhood.",
  },
  {
    step: 4,
    title: "Screenshots are weak evidence",
    body: "Image editors and old clips circulate during crises. Confirm live official sources before acting on a picture.",
  },
];

export const CIVILIAN_VS_WEAPONS = {
  title: "Civilian nuclear power ≠ nuclear weapons",
  points: [
    "Nuclear power plants use low-enriched fuel for electricity; they are not warhead stockpiles.",
    "A reactor accident (radiological) is a different problem from a nuclear detonation (blast, thermal, fallout).",
    "ONTAS arsenal desks cover weapons states and dual-capable systems. Power-plant incidents belong to nuclear safety / IAEA civil reporting — linked only when relevant to security news.",
    "Dirty bombs and radiological dispersal are not nuclear explosions; see the Rad/CBRN desk.",
  ],
};
