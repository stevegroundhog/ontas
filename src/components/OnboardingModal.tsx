const SEEN_KEY = "ontas-onboard-v1";

export function hasSeenOnboarding(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

export function markOnboardingSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function OnboardingModal({
  open,
  onClose,
  onLearn,
  onMethod,
}: {
  open: boolean;
  onClose: () => void;
  onLearn: () => void;
  onMethod: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-3 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ontas-onboard-title"
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-panel p-5 shadow-2xl"
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-400">
          ONTAS
        </div>
        <h2 id="ontas-onboard-title" className="mt-1 text-lg font-bold text-bright">
          This is not a siren
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          ONTAS is an educational open-source desk for nuclear forces, conflicts, and public
          sensors. Official U.S. DEFCON is classified. Life-safety alerts use IPAWS / EAS / WEA —
          not this app.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted">
          <li>Live map + Quick find for every desk</li>
          <li>Shareable links: <code className="text-sky-300">?desk=intel</code></li>
          <li>Methodology explains every number</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="soft-btn active" onClick={onClose}>
            Enter Live map
          </button>
          <button
            type="button"
            className="soft-btn"
            onClick={() => {
              onLearn();
              onClose();
            }}
          >
            Beginner guide
          </button>
          <button
            type="button"
            className="soft-btn"
            onClick={() => {
              onMethod();
              onClose();
            }}
          >
            Methodology
          </button>
        </div>
      </div>
    </div>
  );
}
