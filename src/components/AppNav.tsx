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
};

export const NAV_ITEMS: NavItem[] = [
  { id: "map", label: "Live map", group: "Situational", hint: "World map & layers" },
  { id: "conflicts", label: "Conflicts", group: "Situational", hint: "Wars & death tolls" },
  { id: "intel", label: "Live intel", group: "Situational", hint: "Sensors & sources" },
  { id: "news", label: "News desk", group: "Situational", hint: "Nuclear news mesh" },
  { id: "forces", label: "Countries", group: "Arsenals", hint: "Nation force cards" },
  { id: "arsenal", label: "Yields & aircraft", group: "Arsenals", hint: "kt/Mt & DCA jets" },
  { id: "compare", label: "Compare", group: "Arsenals", hint: "Two nations" },
  { id: "maritime", label: "Ships & subs", group: "Arsenals", hint: "SSBN & AIS" },
  { id: "launches", label: "Launches", group: "Strategic", hint: "Tests & space" },
  { id: "treaties", label: "Treaties", group: "Strategic", hint: "Arms control" },
  { id: "scenarios", label: "Scenarios", group: "Strategic", hint: "Educational arcs" },
  { id: "climate", label: "Climate brief", group: "Strategic", hint: "Strategic overview" },
  { id: "rad", label: "Rad / CBRN", group: "Protect", hint: "Radiation & decon" },
  { id: "terror", label: "Terror history", group: "Protect", hint: "Threats & attempts" },
  { id: "survive", label: "Survivability", group: "Protect", hint: "City kits" },
  { id: "learn", label: "Beginner guide", group: "Protect", hint: "Start here" },
];

export function navGroups(): { group: string; items: NavItem[] }[] {
  const order = ["Situational", "Arsenals", "Strategic", "Protect"];
  return order.map((group) => ({
    group,
    items: NAV_ITEMS.filter((i) => i.group === group),
  }));
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
