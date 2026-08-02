import { useMemo, useState } from "react";
import {
  CRISIS_ERA_META,
  crisesNewestFirst,
  type CrisisEra,
  type CrisisEvent,
} from "@/data/crisis-timeline";
import { PanelFrame } from "./AppNav";

const KINDS: Record<CrisisEvent["kind"], string> = {
  crisis: "Crisis",
  "false-alarm": "False alarm",
  "test-cycle": "Test cycle",
  accident: "Accident",
  signaling: "Signaling",
};

export function CrisisTimelinePanel() {
  const all = useMemo(() => crisesNewestFirst(), []);
  const [era, setEra] = useState<CrisisEra | "all">("all");
  const list = era === "all" ? all : all.filter((e) => e.era === era);

  return (
    <PanelFrame
      title="Crisis timeline"
      subtitle="What was known publicly then vs later — educational close calls"
      actions={
        <select
          className="soft-btn bg-bg text-xs"
          value={era}
          onChange={(e) => setEra(e.target.value as CrisisEra | "all")}
        >
          <option value="all">All eras</option>
          {(Object.keys(CRISIS_ERA_META) as CrisisEra[]).map((k) => (
            <option key={k} value={k}>
              {CRISIS_ERA_META[k].label}
            </option>
          ))}
        </select>
      }
    >
      <ul className="space-y-3 p-4">
        {list.map((ev) => {
          const meta = CRISIS_ERA_META[ev.era];
          return (
            <li
              key={ev.id}
              className="rounded-xl border border-border bg-bg/40 px-3 py-3 text-[12px] leading-relaxed"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="tabular font-bold text-bright">
                  {ev.year}
                  {ev.month ? `-${String(ev.month).padStart(2, "0")}` : ""}
                </span>
                <span className="chip" style={{ borderColor: meta.color, color: meta.color }}>
                  {meta.label}
                </span>
                <span className="chip">{KINDS[ev.kind]}</span>
              </div>
              <h3 className="mt-1 text-sm font-bold text-fg">{ev.title}</h3>
              <p className="mt-2 text-muted">
                <span className="font-semibold text-sky-300">Known then · </span>
                {ev.knownThen}
              </p>
              <p className="mt-1.5 text-muted">
                <span className="font-semibold text-violet-300">Known later · </span>
                {ev.knownLater}
              </p>
              <p className="mt-1.5 text-dim">
                <span className="font-semibold text-ok">Lesson · </span>
                {ev.lesson}
              </p>
            </li>
          );
        })}
      </ul>
    </PanelFrame>
  );
}
