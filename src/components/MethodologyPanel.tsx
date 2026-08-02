import { LIFE_SAFETY, METHODOLOGY_BLOCKS, NEVER_SHOW } from "@/data/methodology";
import { DATA_AS_OF } from "@/data/nuclear-forces";
import { PanelFrame } from "./AppNav";

export function MethodologyPanel() {
  return (
    <PanelFrame
      title="How numbers are made"
      subtitle={`Source methodology · estimate vintage ${DATA_AS_OF} · educational only`}
    >
      <div className="space-y-4 p-4 text-[12px] leading-relaxed">
        <p className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-muted">
          ONTAS is an open educational fusion desk. Every live badge is public or clearly labeled
          estimate. <span className="text-bright">{LIFE_SAFETY}</span>
        </p>

        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-dim">
            What we will never show
          </h3>
          <ul className="mt-2 space-y-1.5">
            {NEVER_SHOW.map((line) => (
              <li
                key={line}
                className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-muted"
              >
                <span className="font-semibold text-danger">No · </span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-dim">
            Method by desk
          </h3>
          {METHODOLOGY_BLOCKS.map((b) => (
            <article
              key={b.id}
              className="rounded-xl border border-border bg-bg/40 px-3 py-3"
              id={`method-${b.id}`}
            >
              <h4 className="text-sm font-bold text-bright">{b.title}</h4>
              <p className="mt-1 text-muted">{b.body}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {b.sources.map((s) => (
                  <span key={s} className="chip text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </PanelFrame>
  );
}
