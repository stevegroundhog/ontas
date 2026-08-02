import { ALERT_CHANNELS, ALERT_STEPS, CIVILIAN_VS_WEAPONS } from "@/data/alert-literacy";
import { PanelFrame } from "./AppNav";

export function AlertLiteracyPanel() {
  return (
    <PanelFrame
      title="Alert literacy"
      subtitle="How official warnings work — and why ONTAS is not one"
    >
      <div className="space-y-4 p-4 text-[12px] leading-relaxed">
        <ol className="space-y-2">
          {ALERT_STEPS.map((s) => (
            <li
              key={s.step}
              className="flex gap-3 rounded-xl border border-border bg-bg/40 px-3 py-2.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
                {s.step}
              </span>
              <div>
                <div className="font-semibold text-bright">{s.title}</div>
                <p className="mt-0.5 text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="space-y-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-dim">
            Official channels
          </h3>
          {ALERT_CHANNELS.map((c) => (
            <article key={c.id} className="rounded-xl border border-border bg-bg/40 px-3 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-bright">{c.name}</h4>
                <span className="chip">{c.region}</span>
              </div>
              <p className="mt-1 text-muted">
                <span className="font-semibold text-fg">What · </span>
                {c.whatItIs}
              </p>
              <p className="mt-1 text-muted">
                <span className="font-semibold text-fg">How you get it · </span>
                {c.howYouGetIt}
              </p>
              <p className="mt-1 text-muted">
                <span className="font-semibold text-fg">Verify · </span>
                {c.verify}
              </p>
              <p className="mt-1 text-[11px] text-warn">
                <span className="font-semibold">Not this · </span>
                {c.notThis}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-border bg-bg/40 px-3 py-3">
          <h3 className="text-sm font-bold text-bright">{CIVILIAN_VS_WEAPONS.title}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-muted">
            {CIVILIAN_VS_WEAPONS.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </div>
    </PanelFrame>
  );
}
