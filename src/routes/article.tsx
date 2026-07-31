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
          "A plain-language essay on public nuclear and conflict data, DEFCON myths, and the open-source ONTAS educational map. Not an official warning system.",
      },
      {
        property: "og:title",
        content: "What Public Data Can (and Can’t) Tell You About Nuclear Risk",
      },
      {
        property: "og:description",
        content:
          "Why most “live DEFCON” sites overclaim — and how an open educational map can still be useful.",
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
          <a
            href="https://github.com/stevegroundhog/ontas"
            target="_blank"
            rel="noopener noreferrer"
            className="soft-btn"
          >
            GitHub
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Essay · Education · Open source
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-bright sm:text-4xl">
          What public data can (and can’t) tell you about nuclear risk
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          And why I built an open educational map instead of another “live DEFCON”
          hype site.
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
            The live dashboard is free and open source. Official U.S. DEFCON is
            classified. Real U.S. emergencies use FEMA IPAWS / EAS / Wireless
            Emergency Alerts — not this app.
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

        <div className="prose-article mt-10 space-y-6 text-[1.05rem] leading-[1.75] text-fg/95">
          <p>
            Every few months, the internet rediscovers nuclear anxiety.
          </p>
          <p>
            A missile test. A speech. A map colored red. Someone posts “we’re at
            DEFCON 2” with a screenshot of a random website. The replies fill with
            panic, jokes, and confident wrong answers.
          </p>
          <p>
            I got tired of two extremes:{" "}
            <strong className="text-bright">doom theater</strong> on one side, and{" "}
            <strong className="text-bright">opaque jargon</strong> on the other.
          </p>
          <p>
            So I built <strong className="text-bright">ONTAS</strong> — the{" "}
            <em>Open Nuclear Threat Awareness System</em> — a free, open-source
            dashboard that does something unfashionable:
          </p>
          <p>
            It shows what you <strong className="text-bright">can</strong> see from{" "}
            <strong className="text-bright">public, unclassified</strong> sources…
            and it is honest about what you{" "}
            <strong className="text-bright">cannot</strong>.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">
            The problem with most “nuclear trackers”
          </h2>
          <p>
            A lot of tools blur three different things into one scary interface:
          </p>
          <ol className="list-decimal space-y-2 pl-6 text-fg/95">
            <li>
              <strong className="text-bright">News</strong> — often messy, sometimes
              biased, always incomplete in the first hour.
            </li>
            <li>
              <strong className="text-bright">Military readiness language</strong> —
              DEFCON, postures, deterrence, “strategic messaging.”
            </li>
            <li>
              <strong className="text-bright">Actual emergency alerts</strong> — in
              the United States, systems like IPAWS, EAS, and Wireless Emergency
              Alerts on your phone.
            </li>
          </ol>
          <p>Those are not the same thing.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>A loud headline is not a launch.</li>
            <li>
              An open-source “DEFCON estimate” is not the U.S. government’s
              classified readiness condition.
            </li>
            <li>A map is not a warning siren.</li>
          </ul>
          <p>
            If a site won’t say that clearly, I don’t trust it — and neither
            should you.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">
            What is actually public?
          </h2>
          <p>
            More than people think — and less than influencers pretend.
          </p>

          <h3 className="text-xl font-semibold text-bright">
            Public, legal, and useful
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-bright">Earthquakes</strong> from the USGS —
              sometimes relevant near known test sites; usually ordinary geology.
            </li>
            <li>
              <strong className="text-bright">Public agency wires</strong> — for
              example DoD news releases, IAEA updates, UN peace and security
              reporting.
            </li>
            <li>
              <strong className="text-bright">Open news</strong> — multi-region
              headline mesh, BBC World, and similar public RSS.
            </li>
            <li>
              <strong className="text-bright">Some ship tracking</strong> — open AIS
              in limited regions (ONTAS uses a Finnish open Baltic feed for surface
              traffic).
            </li>
            <li>
              <strong className="text-bright">Open estimates</strong> of nuclear
              forces from long-running research communities.
            </li>
            <li>
              <strong className="text-bright">Independent OSINT guesses</strong>{" "}
              about readiness — with huge caveats, always labeled.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-bright">
            Not public (and anyone serious will admit it)
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-bright">Official U.S. DEFCON</strong> in real
              time — classified.
            </li>
            <li>
              <strong className="text-bright">True patrol positions</strong> of
              ballistic-missile submarines — they are designed{" "}
              <em>not</em> to broadcast.
            </li>
            <li>
              <strong className="text-bright">Classified command-and-control</strong>{" "}
              and national missile-warning networks — not on GitHub, not on a hobby
              dashboard.
            </li>
          </ul>
          <p>
            ONTAS is built on the first list. It{" "}
            <strong className="text-bright">labels</strong> the second list as
            unavailable — on purpose. That honesty is a feature, not a missing
            checkbox.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">What ONTAS is</h2>
          <p>ONTAS is an educational web application:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              A <strong className="text-bright">world map</strong> with
              nuclear-armed states, conflict markers, seismic context, and optional
              maritime layers.
            </li>
            <li>
              A <strong className="text-bright">Conflicts desk</strong> — major wars
              and crises in neutral language, plus live reports from open sources.
            </li>
            <li>
              <strong className="text-bright">Nuclear force cards</strong> —
              open-source-style inventory context for nuclear-armed states.
            </li>
            <li>
              <strong className="text-bright">Unofficial DEFCON OSINT</strong> —
              shown as an estimate, never as “official.”
            </li>
            <li>
              A <strong className="text-bright">source health board</strong> — which
              public feeds are OK, limited, or down.
            </li>
            <li>
              <strong className="text-bright">Survivability search</strong> — type a
              city or town for general readiness ideas (not medical advice).
            </li>
            <li>
              A <strong className="text-bright">Beginner guide</strong> — geopolitics,
              nuclear basics, and DEFCON without assuming prior knowledge.
            </li>
          </ul>
          <p>
            No secret APIs. No claim of government authority. The code is open so
            you can inspect how feeds are pulled and how labels are written.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">What ONTAS is not</h2>
          <p>Please read this twice:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Not NORAD</li>
            <li>Not USSTRATCOM</li>
            <li>Not FEMA</li>
            <li>Not a life-safety alert system</li>
            <li>Not a propaganda channel for any government</li>
          </ul>
          <p>
            If your phone issues a real emergency alert,{" "}
            <strong className="text-bright">that</strong> is the channel. Not a
            hobby map. Not a social media post. Not this essay.
          </p>
          <p>
            In the United States, public life-safety paths include{" "}
            <strong className="text-bright">FEMA IPAWS</strong>,{" "}
            <strong className="text-bright">EAS</strong>, and{" "}
            <strong className="text-bright">Wireless Emergency Alerts</strong>.
            Local authorities still matter.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">
            DEFCON in plain English
          </h2>
          <p>
            <strong className="text-bright">DEFCON</strong> stands for Defense
            Readiness Condition. It is a U.S. military alert scale.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="bg-black/30 text-muted">
                <tr>
                  <th className="px-3 py-2 font-semibold">Level</th>
                  <th className="px-3 py-2 font-semibold">Name (classic)</th>
                  <th className="px-3 py-2 font-semibold">Plain meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  ["5", "FADE OUT", "Normal peacetime baseline"],
                  ["4", "DOUBLE TAKE", "Increased intelligence watch / security"],
                  ["3", "ROUND HOUSE", "Forces above normal readiness"],
                  ["2", "FAST PACE", "Further increase; next step to maximum"],
                  ["1", "COCKED PISTOL", "Maximum readiness"],
                ].map(([n, name, mean]) => (
                  <tr key={n}>
                    <td className="px-3 py-2 font-mono font-bold text-bright">{n}</td>
                    <td className="px-3 py-2 text-sky-300">{name}</td>
                    <td className="px-3 py-2 text-muted">{mean}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="pt-2">Three facts that prevent a lot of nonsense:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Higher readiness does <strong className="text-bright">not</strong>{" "}
              automatically mean “nuclear weapons are launching.”
            </li>
            <li>
              The <strong className="text-bright">real</strong> current DEFCON is{" "}
              <strong className="text-bright">not</strong> a public live feed.
            </li>
            <li>
              Websites that “show live DEFCON” are, at best, educated guesses from
              open signals.
            </li>
          </ul>
          <p>
            ONTAS uses an unofficial OSINT estimate and says so on the screen. If
            that bothers you because you wanted secret certainty: good.{" "}
            <strong className="text-bright">Uncertainty is the honest product.</strong>
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">
            Why a conflicts desk belongs next to nuclear context
          </h2>
          <p>
            Most wars stay conventional. Nuclear risk becomes more relevant when
            nuclear-armed states are parties, alliances tighten, or crises spiral
            beyond local control.
          </p>
          <p>
            So ONTAS tracks major conflicts with dry, factual cards:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Named parties — without mythologizing</li>
            <li>Type and intensity (war, insurgency, tension, and so on)</li>
            <li>Open notes on harm where public reporting allows</li>
            <li>Live open reports you can open at the original source</li>
          </ul>
          <p>
            The goal is not to tell you who is “right.” The goal is{" "}
            <strong className="text-bright">situational literacy</strong> without a
            narrative machine.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">
            How to use tools like this without frying your nervous system
          </h2>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Open the Beginner guide first if you are new.</li>
            <li>Check the source board — know what is actually live.</li>
            <li>
              Read a conflict card, then open original articles. Headlines are not
              finished intelligence.
            </li>
            <li>
              Treat OSINT DEFCON as “public chatter pressure,” not gospel.
            </li>
            <li>
              For personal readiness, prefer boring basics — water, medications, a
              radio, a plan — not movie bunkers.
            </li>
            <li>
              When overwhelmed, step away. Understanding risk is not the same as
              living in constant alarm.
            </li>
          </ol>

          <h2 className="pt-4 text-2xl font-bold text-bright">
            Why open source matters here
          </h2>
          <p>Nuclear and war topics attract grifters, panic merchants, and confident fakes.</p>
          <p>Open source is a partial antidote:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>You can see what the app claims to fetch.</li>
            <li>You can run it yourself (Vercel one-click, Docker, or Node).</li>
            <li>You can fork it and change anything you dislike.</li>
            <li>You can challenge the methodology in public.</li>
          </ul>
          <p>
            Repository:{" "}
            <a
              className="text-sky-300 underline-offset-2 hover:underline"
              href="https://github.com/stevegroundhog/ontas"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/stevegroundhog/ontas
            </a>
          </p>

          <h2 className="pt-4 text-2xl font-bold text-bright">The honest pitch</h2>
          <p>I did not build a button that tells you if the world ends.</p>
          <p>
            I built a <strong className="text-bright">classroom globe with a news desk</strong>
            :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>public sensors</li>
            <li>open wires</li>
            <li>clear limits</li>
            <li>a door for beginners</li>
          </ul>
          <p>
            If that sounds useful, open the live app and break it. Tell me what is
            confusing. Tell me what is missing. Tell me if a label is too strong or
            too soft.
          </p>
          <p className="text-muted">
            Educational only. Public data only. Not an official warning system.
          </p>
        </div>

        <div className="crt-panel mt-12 space-y-4 px-5 py-5">
          <h2 className="text-lg font-bold text-bright">Next steps</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/"
              className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-100 hover:bg-sky-500/20"
            >
              Open the live ONTAS dashboard →
            </Link>
            <a
              href="https://github.com/stevegroundhog/ontas"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-bright hover:bg-white/5"
            >
              Star / fork on GitHub →
            </a>
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fstevegroundhog%2Fontas"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-bright hover:bg-white/5"
            >
              One-click deploy your own copy →
            </a>
            <Link
              to="/"
              className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-bright hover:bg-white/5"
            >
              Start with the Beginner guide in-app →
            </Link>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Share this page: add <span className="font-mono text-sky-300">/article</span>{" "}
            to your deployed site URL. Example:{" "}
            <span className="font-mono">https://your-app.vercel.app/article</span>
          </p>
        </div>

        <footer className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted">
          <p>
            © ONTAS contributors · MIT License · This essay is educational commentary,
            not legal, medical, or emergency advice.
          </p>
          <p className="mt-2">
            <Link to="/" className="text-sky-300 hover:underline">
              ← Back to app
            </Link>
          </p>
        </footer>
      </article>
    </div>
  );
}
