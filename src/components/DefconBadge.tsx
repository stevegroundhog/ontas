import type { DefconState } from "@/lib/defcon";

export function DefconBadge({
  state,
  onExplain,
}: {
  state: DefconState;
  onExplain?: () => void;
}) {
  return (
    <div
      className="crt-panel overflow-hidden"
      style={{
        borderColor: state.color,
        boxShadow: `0 0 0 1px ${state.color}33, 0 12px 40px ${state.color}22`,
      }}
    >
      <div
        className="flex items-center gap-4 px-4 py-3"
        style={{
          background: `linear-gradient(90deg, ${state.color}33, transparent 70%)`,
        }}
      >
        <div
          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center shadow-lg"
          style={{ background: state.color, color: state.level === 3 ? "#111" : "#fff" }}
        >
          <div className="text-[10px] font-bold tracking-widest opacity-80">DEFCON</div>
          <div className="text-3xl font-black leading-none">{state.level}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-bright">{state.label}</span>
            <span className="chip bg-black/20 text-muted">UNOFFICIAL OSINT</span>
          </div>
          <div className="mt-0.5 text-sm text-muted">{state.officialName}</div>
          <div className="mt-1 text-xs text-muted">
            Source:{" "}
            <a
              href={state.osintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
              style={{ color: "#38bdf8" }}
            >
              {state.osintSource}
            </a>
            {state.nuclearRisk != null && (
              <span className="ml-2 chip" style={{ borderColor: "#fbbf24", color: "#fbbf24" }}>
                NUCLEAR RISK {state.nuclearRisk}
              </span>
            )}
          </div>
          {onExplain && (
            <button
              type="button"
              onClick={onExplain}
              className="mt-2 text-xs font-semibold text-sky-300 underline decoration-dotted underline-offset-2 hover:text-sky-200"
            >
              New here? What DEFCON means →
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border px-4 py-3">
        {state.bands.map((b) => {
          const pct = Math.min(100, (b.value / b.max) * 100);
          return (
            <div key={b.id}>
              <div className="mb-1 truncate text-[11px] font-medium text-muted">{b.label}</div>
              <div className="h-2 overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: b.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border px-4 py-2 text-xs leading-snug text-muted">
        {state.reasons[0]}
      </div>
    </div>
  );
}
