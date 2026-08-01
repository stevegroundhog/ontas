import { useEffect, useState } from "react";
import {
  NUCLEAR_EXPLOSION_TIMELINE,
  RAD_PANEL_DISCLAIMER,
  RAD_THREAT_TYPES,
  RADIATION_TYPES,
  STAY_TIME_EDUCATION,
  THREAT_ACTOR_CLASSES,
  type RadiationType,
} from "@/data/radiological";
import { fetchRadNews, type RadNewsItem } from "@/server/rad-news";

type Tab =
  | "threats"
  | "actors"
  | "radiation"
  | "stay"
  | "explosion"
  | "news";

const TABS: { id: Tab; label: string }[] = [
  { id: "threats", label: "Threat types" },
  { id: "actors", label: "Actor classes" },
  { id: "radiation", label: "Radiation & decon" },
  { id: "stay", label: "Stay time" },
  { id: "explosion", label: "Explosion steps" },
  { id: "news", label: "Live security news" },
];

export function RadiologicalPanel() {
  const [tab, setTab] = useState<Tab>("threats");
  const [rad, setRad] = useState<RadiationType>(RADIATION_TYPES[0]!);
  const [stepId, setStepId] = useState(NUCLEAR_EXPLOSION_TIMELINE[0]!.id);
  const [news, setNews] = useState<RadNewsItem[]>([]);
  const [newsMeta, setNewsMeta] = useState({ ok: false, at: null as string | null, note: "" });
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    if (tab !== "news") return;
    let cancelled = false;
    const pull = async () => {
      setLoadingNews(true);
      try {
        const data = await fetchRadNews();
        if (cancelled) return;
        setNews(data.items);
        setNewsMeta({ ok: data.feedOk, at: data.fetchedAt, note: data.disclaimer });
      } catch {
        if (!cancelled) setNewsMeta((m) => ({ ...m, ok: false }));
      } finally {
        if (!cancelled) setLoadingNews(false);
      }
    };
    void pull();
    const t = window.setInterval(pull, 180_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [tab]);

  const step =
    NUCLEAR_EXPLOSION_TIMELINE.find((s) => s.id === stepId) ?? NUCLEAR_EXPLOSION_TIMELINE[0]!;

  return (
    <div className="crt-panel flex h-full min-h-[420px] flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
          Radiological & nuclear terrorism awareness
        </div>
        <div className="mt-0.5 text-sm font-bold text-bright">
          Public education · not a classified threat feed
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted">{RAD_PANEL_DISCLAIMER}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`soft-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {tab === "threats" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted">
              Categories used in open nuclear-security literature (IAEA / civil defense). Severity
              is about potential consequence, not a forecast that an attack is underway.
            </p>
            {RAD_THREAT_TYPES.map((t) => (
              <article
                key={t.id}
                className="rounded-xl border border-border bg-bg/40 px-3 py-3 text-[11px] leading-relaxed"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-bright">{t.name}</h3>
                  <span className="chip" style={{ borderColor: t.color, color: t.color }}>
                    {t.severity}
                  </span>
                </div>
                <p className="mt-1 text-fg/90">{t.summary}</p>
                <p className="mt-2">
                  <span className="font-semibold text-muted">Effects: </span>
                  {t.effects}
                </p>
                <p className="mt-1 text-dim">{t.likelihoodNote}</p>
              </article>
            ))}
          </div>
        )}

        {tab === "actors" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted">
              Actor <em>classes</em> from open assessments — not a kill list, not capabilities
              training. Confirmed nuclear weapons remain a state monopoly in public knowledge.
            </p>
            {THREAT_ACTOR_CLASSES.map((a) => (
              <article
                key={a.id}
                className="rounded-xl border border-border bg-bg/40 px-3 py-3 text-[11px] leading-relaxed"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-bright">{a.name}</h3>
                  <span className="chip" style={{ borderColor: a.color, color: a.color }}>
                    {a.capability}
                  </span>
                </div>
                <p className="mt-1 text-fg/90">{a.summary}</p>
                <p className="mt-2">
                  <span className="font-semibold text-muted">Public assessment: </span>
                  {a.publicAssessment}
                </p>
                <p className="mt-1 text-dim">{a.examplesNote}</p>
              </article>
            ))}
          </div>
        )}

        {tab === "radiation" && (
          <div className="grid gap-3 lg:grid-cols-[200px_1fr]">
            <div className="flex flex-row flex-wrap gap-1.5 lg:flex-col">
              {RADIATION_TYPES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`soft-btn text-left ${rad.id === r.id ? "active" : ""}`}
                  onClick={() => setRad(r)}
                >
                  <span style={{ color: rad.id === r.id ? undefined : r.color }}>{r.symbol}</span>{" "}
                  {r.name}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-bg/40 px-4 py-3 text-[12px] leading-relaxed">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: rad.color }}>
                  {rad.symbol}
                </span>
                <h3 className="text-base font-bold text-bright">{rad.name}</h3>
              </div>
              <p className="mt-2 text-fg/90">{rad.whatItIs}</p>
              <dl className="mt-3 space-y-2 text-[11px]">
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-muted">Range</dt>
                  <dd>{rad.range}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-muted">Stopped by</dt>
                  <dd>{rad.stoppedBy}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-muted">Health</dt>
                  <dd>{rad.health}</dd>
                </div>
              </dl>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-sky-400">
                Decontamination / protection (civil defense)
              </div>
              <ol className="mt-1 list-decimal space-y-1 pl-4 text-[11px] text-fg/90">
                {rad.decon.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
              <p className="mt-3 text-[10px] text-dim">{rad.notes}</p>
            </div>
          </div>
        )}

        {tab === "stay" && (
          <div className="space-y-3 text-[12px] leading-relaxed">
            <section className="rounded-xl border border-border bg-bg/40 px-4 py-3">
              <h3 className="text-sm font-bold text-bright">What stay time means</h3>
              <p className="mt-1 text-fg/90">{STAY_TIME_EDUCATION.definition}</p>
              <p className="mt-2 text-muted">{STAY_TIME_EDUCATION.whyItMatters}</p>
            </section>
            <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <h3 className="text-sm font-bold text-amber-200">7/10 rule (teaching aid)</h3>
              <p className="mt-1 text-fg/90">{STAY_TIME_EDUCATION.sevenTen}</p>
            </section>
            <section className="grid gap-2 sm:grid-cols-3">
              {STAY_TIME_EDUCATION.rules.map((r) => (
                <div key={r.title} className="rounded-xl border border-border bg-bg/40 px-3 py-2">
                  <div className="text-xs font-bold text-sky-300">{r.title}</div>
                  <p className="mt-1 text-[11px] text-muted">{r.body}</p>
                </div>
              ))}
            </section>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Practical public points
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[11px] text-fg/90">
                {STAY_TIME_EDUCATION.practical.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Caveats</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[11px] text-dim">
                {STAY_TIME_EDUCATION.caveats.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === "explosion" && (
          <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
            <ol className="space-y-1">
              {NUCLEAR_EXPLOSION_TIMELINE.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`soft-btn w-full text-left ${stepId === s.id ? "active" : ""}`}
                    onClick={() => setStepId(s.id)}
                  >
                    {s.order}. {s.phase.replace(/^\d+\s*—\s*/, "").slice(0, 28)}
                    {s.phase.length > 40 ? "…" : ""}
                  </button>
                </li>
              ))}
            </ol>
            <article className="rounded-xl border border-border bg-bg/40 px-4 py-3 text-[12px] leading-relaxed">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-rose-300">
                Step {step.order} of {NUCLEAR_EXPLOSION_TIMELINE.length}
              </div>
              <h3 className="mt-1 text-base font-bold text-bright">{step.phase}</h3>
              <div className="mt-1 text-[11px] text-muted">Time scale: {step.timeScale}</div>
              <div className="mt-3 space-y-3 text-[11px]">
                <div>
                  <div className="font-semibold text-sky-300">What happens</div>
                  <p className="text-fg/90">{step.whatHappens}</p>
                </div>
                <div>
                  <div className="font-semibold text-amber-300">Damage</div>
                  <p className="text-fg/90">{step.damage}</p>
                </div>
                <div>
                  <div className="font-semibold text-rose-300">Health implications</div>
                  <p className="text-fg/90">{step.health}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                  <div className="font-semibold text-emerald-300">Public protective action</div>
                  <p className="text-fg/90">{step.publicAction}</p>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-dim">
                Hypothetical educational sequence. Yield, burst height, weather, and city structure
                change every ring of damage. Not a targeting or weapons manual.
              </p>
            </article>
          </div>
        )}

        {tab === "news" && (
          <div className="space-y-2">
            <div className="text-[11px] text-muted">
              {loadingNews
                ? "Refreshing open security headlines…"
                : newsMeta.ok
                  ? `${news.length} headlines · nuclear security / radiological topics`
                  : "Feed limited — try again later"}
              {newsMeta.at ? ` · ${new Date(newsMeta.at).toISOString().slice(11, 19)}Z` : ""}
            </div>
            <ul className="space-y-2">
              {news.map((n) => (
                <li key={n.id}>
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-border bg-bg/35 px-3 py-2 text-[11px] leading-snug hover:border-sky-500/40 hover:bg-sky-500/10"
                  >
                    <div className="font-semibold text-bright">{n.title}</div>
                    <div className="mt-0.5 text-[10px] text-muted">
                      {n.source}
                      {n.publishedAt ? ` · ${n.publishedAt}` : ""}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            {newsMeta.note && <p className="text-[10px] text-dim">{newsMeta.note}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
