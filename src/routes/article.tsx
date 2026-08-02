import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/article")({
  head: () => ({
    meta: [
      {
        title:
          "What Public Data Can (and Can’t) Tell You About Nuclear Risk — ONTAS",
      },
      {
        name: "description",
        content:
          "Current ONTAS essay: public nuclear data, deep links, range bands, methodology, alert literacy, crisis timeline, yields, and honest limits. Not an official warning system.",
      },
      {
        property: "og:title",
        content: "What Public Data Can (and Can’t) Tell You About Nuclear Risk",
      },
      {
        property: "og:description",
        content:
          "Open educational nuclear desk — Quick find, range bands, methodology, IPAWS literacy — without fake official DEFCON.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "author", content: "ONTAS contributors" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  return (
    <div className="min-h-dvh text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-[#0b1220ee] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-wider text-sky-400 hover:text-sky-300"
          >
            ← Open ONTAS app
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="soft-btn hidden sm:inline-flex">
              Dashboard
            </Link>
            <a
              href="https://github.com/stevegroundhog/ontas"
              target="_blank"
              rel="noopener noreferrer"
              className="soft-btn"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Essay · Education · Open source · Updated August 2026
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-bright sm:text-4xl">
          What public data can (and can’t) tell you about nuclear risk
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          A guide to ONTAS as it exists today — open map, arsenals, literacy desks, range bands, and
          honest limits.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="chip">ONTAS</span>
          <span className="chip">~12 min read</span>
          <span className="chip">Educational only</span>
          <span className="chip" style={{ borderColor: "#fbbf24", color: "#fcd34d" }}>
            Not an official warning system
          </span>
        </div>

        <div className="crt-panel mt-8 space-y-3 px-4 py-4 text-sm leading-relaxed">
          <p className="font-semibold text-bright">Try it while you read</p>
          <p className="text-muted">
            Free open-source dashboard. Official U.S. DEFCON is classified. Real U.S. emergencies use
            FEMA IPAWS / EAS / Wireless Emergency Alerts — not this app.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link to="/" className="soft-btn active">
              Open live app
            </Link>
            <a
              href="https://github.com/stevegroundhog/ontas"
              target="_blank"
              rel="noopener noreferrer"
              className="soft-btn"
            >
              View source on GitHub
            </a>
          </div>
        </div>

        <nav className="crt-panel mt-6 px-4 py-3 text-sm">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            On this page
          </div>
          <ul className="mt-2 grid gap-1.5 text-sky-300 sm:grid-cols-2">
            {[
              ["#problem", "The tracker problem"],
              ["#public", "What is public"],
              ["#desks", "What’s in ONTAS"],
              ["#ranges", "Range bands"],
              ["#terror", "Terrorism & public history"],
              ["#yields", "Yields (kt / Mt)"],
              ["#defcon", "DEFCON myths"],
              ["#not", "What ONTAS is not"],
              ["#remember", "Three things to remember"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="prose-article mt-10 space-y-6 text-[1.05rem] leading-[1.75] text-fg/95">
          <p>Every few months, the internet rediscovers nuclear anxiety.</p>
          <p>
            A missile test. A speech. A map colored red. Someone posts “we’re at DEFCON 2” with a
            screenshot of a random website. The replies fill with panic, jokes, and confident wrong
            answers.
          </p>
          <p>
            I got tired of two extremes:{" "}
            <strong className="text-bright">doom theater</strong> on one side, and{" "}
            <strong className="text-bright">opaque jargon</strong> on the other.
          </p>
          <p>
            So I built <strong className="text-bright">ONTAS</strong> — the{" "}
            <em>Open Nuclear Threat Awareness System</em> — a free, open-source dashboard that does
            something unfashionable:
          </p>
          <p>
            It shows what you <strong className="text-bright">can</strong> see from{" "}
            <strong className="text-bright">public, unclassified</strong> sources… and it is honest
            about what you <strong className="text-bright">cannot</strong>.
          </p>
          <p>
            This essay matches the <strong className="text-bright">current product</strong>: Quick
            find navigation, shareable deep links, Live map with arms-control clock and range bands,
            Methodology, Alert literacy, Crisis timeline, humanitarian conflict wires, warheads and
            aircraft, terror history, Rad/CBRN, climate-aware survivability exports, and a PWA shell.
          </p>

          <h2 id="problem" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            The problem with most “nuclear trackers”
          </h2>
          <p>A lot of tools blur three different things into one scary interface:</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              <strong className="text-bright">News</strong> — messy, incomplete in the first hour.
            </li>
            <li>
              <strong className="text-bright">Military readiness language</strong> — DEFCON, postures,
              deterrence.
            </li>
            <li>
              <strong className="text-bright">Actual emergency alerts</strong> — IPAWS, EAS, Wireless
              Emergency Alerts on your phone.
            </li>
          </ol>
          <ul className="list-disc space-y-2 pl-6">
            <li>A loud headline is not a launch.</li>
            <li>An open-source “DEFCON estimate” is not the classified U.S. readiness condition.</li>
            <li>A map is not a warning siren.</li>
            <li>A range ring is not a targeting product.</li>
          </ul>

          <h2 id="public" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            What is actually public?
          </h2>
          <h3 className="text-xl font-semibold text-bright">Public, legal, and useful</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-bright">Earthquakes</strong> from the USGS.
            </li>
            <li>
              <strong className="text-bright">Public agency wires</strong> — DoD, IAEA, UN, BBC World.
            </li>
            <li>
              <strong className="text-bright">Open news meshes</strong> and nuclear-security RSS.
            </li>
            <li>
              <strong className="text-bright">Regional open AIS</strong> (e.g. Baltic surface traffic).
            </li>
            <li>
              <strong className="text-bright">Open force estimates</strong>, yield bands, dual-capable
              aircraft.
            </li>
            <li>
              <strong className="text-bright">Humanitarian headlines</strong> (ReliefWeb / UN-class
              public feeds).
            </li>
            <li>
              <strong className="text-bright">NOAA space weather (Kp)</strong> — radio/GPS context, not
              fallout.
            </li>
            <li>
              <strong className="text-bright">Historical open cases</strong> of non-state nuclear
              interest or radiological plots.
            </li>
            <li>
              <strong className="text-bright">Independent OSINT readiness guesses</strong> — always
              labeled unofficial.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-bright">Not public</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>Official U.S. DEFCON in real time.</li>
            <li>True SSBN patrol positions.</li>
            <li>Exact official warhead loadings on specific missiles.</li>
            <li>Classified command-and-control and national missile-warning networks.</li>
          </ul>
          <p>
            ONTAS is built on the first list. It{" "}
            <strong className="text-bright">labels</strong> the second as unavailable — on purpose.
            Open the in-app <strong className="text-bright">Methodology</strong> desk for the full
            provenance map.
          </p>

          <h2 id="desks" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            What’s in ONTAS today
          </h2>
          <p>
            Use <strong className="text-bright">Quick find</strong> on Live map,{" "}
            <strong className="text-bright">Jump to…</strong>, or{" "}
            <strong className="text-bright">Share link</strong> deep URLs (
            <code className="text-sky-300">?desk=intel&nation=ru</code>).
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-black/30 text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Group</th>
                  <th className="px-3 py-2">Desks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[13px]">
                <tr>
                  <td className="px-3 py-2 font-semibold text-sky-300">Situational</td>
                  <td className="px-3 py-2 text-muted">
                    Live map · Conflicts · Live intel · News · Crisis timeline
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-sky-300">Arsenals</td>
                  <td className="px-3 py-2 text-muted">
                    Warheads & yields · Country cards · Compare · Ships, subs & aircraft
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-sky-300">Strategic</td>
                  <td className="px-3 py-2 text-muted">
                    Launches · Treaties · Scenarios · Climate brief
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-sky-300">Protect</td>
                  <td className="px-3 py-2 text-muted">
                    Rad / CBRN · Terror history · Survivability · Alert literacy · Methodology ·
                    Beginner guide
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-bright">Live map</strong> — nuclear states, conflicts, seismic,
              SSBN estimates, Baltic AIS, range bands, arms-control clock, space weather, headline
              tick.
            </li>
            <li>
              <strong className="text-bright">Conflicts</strong> — open fatality ranges, live reports,
              humanitarian wire.
            </li>
            <li>
              <strong className="text-bright">Literacy</strong> — Methodology, Alert literacy
              (IPAWS/EAS/WEA), Crisis timeline, Rad/CBRN, Terror history.
            </li>
            <li>
              <strong className="text-bright">Survivability</strong> — any city, climate-aware kits,
              copy/export.
            </li>
          </ul>

          <h2 id="ranges" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            Range bands (read this once)
          </h2>
          <p>
            Range bands use published open maximum ranges for ICBM, SLBM, bomber, and theater
            systems, drawn as <strong className="text-bright">great circles</strong> from a capital
            / C2 pin.
          </p>
          <p>
            They are <strong className="text-bright">illustrative</strong>. They are not aim points,
            MIRV footprints, or flight-time tables. Flat-map projection makes long rings look warped
            near the poles — that is geometry, not a doom score.
          </p>

          <h2 id="terror" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            Nuclear terrorism — what public history supports
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-bright">State arsenals</strong> dominate strategic nuclear risk.
            </li>
            <li>
              <strong className="text-bright">Non-state nuclear weapons</strong> have never been
              confirmed.
            </li>
            <li>
              <strong className="text-bright">Radiological</strong> plots and materials security appear
              more often than true nuclear bombs.
            </li>
            <li>
              Many “threats” are <strong className="text-bright">rhetoric or hoaxes</strong>.
            </li>
          </ul>
          <p>
            ONTAS lists public cases for education — not as a tip feed and not as instructions. Report
            real threats to authorities.
          </p>

          <h2 id="yields" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            Yields: why kt and Mt matter
          </h2>
          <p>
            Yield is a rough measure of energy. Open sources often give{" "}
            <strong className="text-bright">bands</strong>, not secrets. ONTAS shows ranges with
            uncertainty so the interface cannot be mistaken for a targeting manual.
          </p>
          <p>
            1 kiloton ≈ 1,000 tons of TNT. 1 megaton = 1,000 kt. Modern strategic RVs are often modeled
            in the tens to few hundreds of kt; some heavy or older designs are discussed in megaton
            ranges.
          </p>

          <h2 id="defcon" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            DEFCON myths, quickly
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-black/30 text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Myth</th>
                  <th className="px-3 py-2">Reality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[13px]">
                <tr>
                  <td className="px-3 py-2">“A website shows the real DEFCON”</td>
                  <td className="px-3 py-2 text-muted">
                    Official U.S. DEFCON is not published live.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">“DEFCON 1 means missiles are flying”</td>
                  <td className="px-3 py-2 text-muted">
                    It means maximum readiness, not automatic launch.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">“If the map is red, evacuate”</td>
                  <td className="px-3 py-2 text-muted">
                    Official phone/siren/TV alerts are the life-safety channel.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="not" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            What ONTAS is not
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Not FEMA, not NORAD, not a missile-warning feed.</li>
            <li>Not medical advice; not a substitute for local civil defense.</li>
            <li>Not a complete encyclopedia of every warhead variant.</li>
            <li>Not propaganda for any side in a conflict.</li>
          </ul>
          <p>
            Why open source? If a map claims authority, you should see{" "}
            <strong className="text-bright">how</strong> it works: which feeds, which estimates, which
            labels. Fork it, fix it, or throw it away.
          </p>

          <h2 id="remember" className="scroll-mt-20 pt-4 text-2xl font-bold text-bright">
            If you only remember three things
          </h2>
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              <strong className="text-bright">Public data is real — and limited.</strong> Use it;
              don’t worship it.
            </li>
            <li>
              <strong className="text-bright">Official U.S. DEFCON is classified.</strong> Treat any
              “live DEFCON” as unofficial.
            </li>
            <li>
              <strong className="text-bright">Life-safety alerts come from official systems</strong>,
              not hobby dashboards.
            </li>
          </ol>
          <p>
            Open the <strong className="text-bright">Beginner guide</strong> in the app for the short
            version. Use <strong className="text-bright">Methodology</strong>,{" "}
            <strong className="text-bright">Alert literacy</strong>,{" "}
            <strong className="text-bright">Crisis timeline</strong>, and{" "}
            <strong className="text-bright">Warheads & yields</strong> when you want depth without
            doom theater.
          </p>
          <p className="text-muted">
            <em>ONTAS is education. Stay curious. Stay calm. Check primary sources.</em>
          </p>
        </div>

        <div className="crt-panel mt-12 flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold text-bright">Ready to explore?</div>
            <p className="text-xs text-muted">
              Start with the Beginner guide, then Methodology, Range bands, or Conflicts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="soft-btn active">
              Open ONTAS
            </Link>
            <a
              href="https://github.com/stevegroundhog/ontas"
              target="_blank"
              rel="noopener noreferrer"
              className="soft-btn"
            >
              Star / fork on GitHub
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-dim">
          Educational open-source project · Not affiliated with any government
        </p>
      </article>
    </div>
  );
}
