/** Arms-control clock — public treaty milestones (educational). */

export type ArmsClockEvent = {
  id: string;
  label: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  status: "past" | "upcoming" | "open-ended";
  summary: string;
  color: string;
};

/** New START expired Feb 5, 2026 (public record of treaty end date). */
export const NEW_START_END = "2026-02-05";

export const ARMS_CLOCK: ArmsClockEvent[] = [
  {
    id: "new-start-suspend",
    label: "Russia suspends New START participation",
    date: "2023-02-21",
    status: "past",
    summary: "Inspections/notifications halted; mutual transparency degraded.",
    color: "#fbbf24",
  },
  {
    id: "new-start-expire",
    label: "New START expires — no bilateral ceilings",
    date: NEW_START_END,
    status: "past",
    summary:
      "Last US–Russia strategic warhead/delivery ceilings lapsed with no successor treaty in force.",
    color: "#f87171",
  },
  {
    id: "post-new-start",
    label: "Post–New START era (no successor)",
    date: NEW_START_END,
    status: "open-ended",
    summary:
      "Open estimates (FAS/SIPRI-class) and national statements fill the gap. Not a use-of-force alert.",
    color: "#fb923c",
  },
];

export function daysSince(isoDate: string, nowMs = Date.now()): number {
  const t = new Date(isoDate + "T00:00:00Z").getTime();
  return Math.floor((nowMs - t) / 86_400_000);
}

export function armsClockHeadline(nowMs = Date.now()): {
  title: string;
  detail: string;
  days: number;
  color: string;
} {
  const days = daysSince(NEW_START_END, nowMs);
  if (days >= 0) {
    return {
      title: "New START expired",
      detail: `${days} day${days === 1 ? "" : "s"} without US–Russia bilateral strategic ceilings`,
      days,
      color: "#f87171",
    };
  }
  return {
    title: "New START ends soon",
    detail: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} until expiry (${NEW_START_END})`,
    days,
    color: "#fbbf24",
  };
}
