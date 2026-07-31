import type { Scenario } from "@/data/nuclear-forces";
import { nationById } from "@/data/nuclear-forces";

interface ScenarioPanelProps {
  scenarios: Scenario[];
  active: Scenario;
  onSelect: (id: string) => void;
  animating: boolean;
  onRun: () => void;
}

export function ScenarioPanel({
  scenarios,
  active,
  onSelect,
  animating,
  onRun,
}: ScenarioPanelProps) {
  return (
    <div className="crt-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-3 py-2">
        <div className="text-[10px] tracking-[0.25em] text-muted">GAME LIST — SCENARIOS</div>
        <div className="text-xs text-bright crt-glow">HOW ABOUT A NICE GAME OF...</div>
      </div>

      <div className="max-h-40 overflow-y-auto border-b border-border sm:max-h-48">
        {scenarios.map((s) => {
          const selected = s.id === active.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`flex w-full items-center gap-2 border-b border-border/50 px-3 py-2 text-left text-[11px] transition-colors ${
                selected
                  ? "bg-fg/10 text-bright"
                  : "text-fg hover:bg-fg/5"
              }`}
            >
              <span className={`tabular ${s.defcon <= 2 ? "text-danger" : "text-muted"}`}>
                D{s.defcon}
              </span>
              <span className="min-w-0 flex-1 truncate tracking-wide">{s.name}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs leading-relaxed">
        <h3 className="text-sm tracking-wide text-bright crt-glow">{active.name}</h3>
        <p className="mt-2 text-[11px] text-fg/90">{active.description}</p>

        <div className="mt-3 text-[10px] tracking-widest text-muted">ACTORS</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {active.actors.map((id) => {
            const n = nationById(id);
            return (
              <span
                key={id}
                className="border border-border px-1.5 py-0.5 text-[10px] text-fg"
              >
                {n?.short ?? id}
              </span>
            );
          })}
        </div>

        <div className="mt-3 text-[10px] tracking-widest text-muted">SYSTEMS IN PLAY</div>
        <ul className="mt-1 space-y-0.5 text-[10px] text-muted">
          {active.techInvolved.map((t) => (
            <li key={t}>· {t}</li>
          ))}
        </ul>

        <div className="mt-3 border border-border bg-bg/50 px-2 py-1.5">
          <div className="text-[9px] tracking-widest text-muted">ASSESSED OUTCOME</div>
          <p
            className={`mt-1 text-[11px] leading-snug ${
              active.defcon === 1 ? "text-danger crt-glow" : "text-fg"
            }`}
          >
            {active.outcome}
          </p>
        </div>
      </div>

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={onRun}
          disabled={active.trajectories.length === 0 && active.id !== "status-quo"}
          className="w-full border border-fg/40 bg-fg/10 px-3 py-2.5 text-xs tracking-[0.2em] text-bright transition-colors hover:bg-fg/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {animating
            ? "SIMULATION RUNNING..."
            : active.trajectories.length === 0
              ? "LOAD BASELINE POSTURE"
              : "RUN TRAJECTORY SIM"}
        </button>
      </div>
    </div>
  );
}
