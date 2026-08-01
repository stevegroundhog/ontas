import type { ReactNode } from "react";

export type AppSection =
  | "map"
  | "conflicts"
  | "forces"
  | "arsenal"
  | "compare"
  | "maritime"
  | "launches"
  | "treaties"
  | "rad"
  | "terror"
  | "survive"
  | "intel"
  | "news"
  | "learn"
  | "scenarios"
  | "climate";

export type NavItem = {
  id: AppSection;
  label: string;
  group: string;
  hint: string;
  /** Hide from Quick find (e.g. map / learn live in header) */
  quickFind?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "map", label: "Live map", group: "Situational", hint: "World map & layers", quickFind: false },
  { id: "conflicts", label: "Conflicts", group: "Situational", hint: "Wars & death tolls" },
  { id: "intel", label: "Live intel", group: "Situational", hint: "Sensors & sources" },
  { id: "news", label: "News desk", group: "Situational", hint: "Nuclear news mesh" },
  {
    id: "arsenal",
    label: "Warheads & yields",
    group: "Arsenals",
    hint: "kt/Mt open estimates + force ranks",
  },
  {
    id: "forces",
    label: "Country cards",
    group: "Arsenals",
    hint: "Doctrine, strategy, systems",
  },
  { id: "compare", label: "Compare", group: "Arsenals", hint: "Two nations side-by-side" },
  {
    id: "maritime",
    label: "Ships, subs & aircraft",
    group: "Arsenals",
    hint: "SSBN, AIS, dual-capable aircraft",
  },
  { id: "launches", label: "Launches", group: "Strategic", hint: "Tests & space" },
  { id: "treaties", label: "Treaties", group: "Strategic", hint: "Arms control" },
  { id: "scenarios", label: "Scenarios", group: "Strategic", hint: "Educational arcs" },
  { id: "climate", label: "Climate brief", group: "Strategic", hint: "Strategic overview" },
  { id: "rad", label: "Rad / CBRN", group: "Protect", hint: "Radiation & decon" },
  { id: "terror", label: "Terror history", group: "Protect", hint: "Threats & attempts" },
  { id: "survive", label: "Survivability", group: "Protect", hint: "City kits" },
  { id: "learn", label: "Beginner guide", group: "Protect", hint: "Start here", quickFind: false },
];

export function navGroups(options?: { quickFindOnly?: boolean }): {
  group: string;
  items: NavItem[];
}[] {
  const order = ["Situational", "Arsenals", "Strategic", "Protect"];
  const items = options?.quickFindOnly
    ? NAV_ITEMS.filter((i) => i.quickFind !== false)
    : NAV_ITEMS;
  return order
    .map((group) => ({
      group,
      items: items.filter((i) => i.group === group),
    }))
    .filter((g) => g.items.length > 0);
}

export function NavButton({
  active,
  label,
  hint,
  onClick,
  compact,
}: {
  active: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav-item ${active ? "nav-item-active" : ""} ${compact ? "nav-item-compact" : ""}`}
      title={hint}
    >
      <span className="nav-item-label">{label}</span>
      {!compact && hint ? <span className="nav-item-hint">{hint}</span> : null}
    </button>
  );
}

export function PanelFrame({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="crt-panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-wide text-bright sm:text-base">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-[11px] leading-snug text-muted">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-1.5">{actions}</div> : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export function QuickFind({
  section,
  onGo,
  compact,
}: {
  section: AppSection;
  onGo: (id: AppSection) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg/40 ${compact ? "p-2.5" : "p-3"} text-[11px] leading-relaxed text-muted`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-semibold text-bright">Quick find</div>
        {!compact && (
          <span className="text-[10px] text-dim">All desks · grouped for scanning</span>
        )}
      </div>
      <div className={compact ? "mt-2 space-y-2" : "mt-3 space-y-3"}>
        {navGroups({ quickFindOnly: true }).map(({ group, items }) => (
          <div key={group}>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-dim">
              {group}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`soft-btn ${section === item.id ? "active" : ""}`}
                  title={item.hint}
                  onClick={() => onGo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
