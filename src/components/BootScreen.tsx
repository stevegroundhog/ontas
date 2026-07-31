import { useEffect, useState } from "react";

const LINES = [
  "ONTAS — Open Nuclear Threat Awareness System",
  "Educational fusion · public data only",
  "New here? Open the Beginner guide anytime",
  "Unofficial OSINT DEFCON (not classified)",
  "Life-safety alerts: FEMA IPAWS / EAS / WEA only",
  "",
  "Fusion online.",
];

const SKIP_KEY = "ontas-boot-seen";

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [visible, setVisible] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SKIP_KEY) === "1") {
        onDone();
        return;
      }
    } catch {
      /* private mode */
    }
  }, [onDone]);

  useEffect(() => {
    if (skip) {
      try {
        sessionStorage.setItem(SKIP_KEY, "1");
      } catch {
        /* ignore */
      }
      onDone();
      return;
    }
    if (visible >= LINES.length) {
      try {
        sessionStorage.setItem(SKIP_KEY, "1");
      } catch {
        /* ignore */
      }
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 160);
    return () => clearTimeout(t);
  }, [visible, skip, onDone]);

  return (
    <button
      type="button"
      className="fixed inset-0 z-40 flex flex-col items-start justify-center bg-[#0b1220] px-6 text-left sm:px-16"
      onClick={() => setSkip(true)}
      aria-label="Skip boot sequence"
    >
      <div className="mx-auto w-full max-w-2xl font-sans text-sm leading-relaxed text-fg sm:text-base">
        <div className="mb-6 text-xs font-semibold tracking-[0.25em] text-sky-400">
          ONTAS · LEARN · WATCH · PREPARE
        </div>
        {LINES.slice(0, visible).map((line, i) => (
          <div
            key={i}
            className={
              line.includes("Fusion online")
                ? "mt-4 text-xl font-bold text-bright sm:text-2xl"
                : line.startsWith("Life-safety") || line.startsWith("Unofficial")
                  ? "text-amber-300"
                  : line.includes("Beginner")
                    ? "text-sky-300"
                    : "text-slate-300"
            }
          >
            {line || "\u00A0"}
          </div>
        ))}
        <div className="mt-8 text-xs tracking-wide text-muted">Tap anywhere to enter</div>
      </div>
    </button>
  );
}
