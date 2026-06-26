import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

// "in 2h 15m" / "3h ago" relative phrasing against a fixed demo "now".
export function relativeFrom(iso: string | undefined, now: Date) {
  if (!iso) return "—";
  const diffMs = new Date(iso).getTime() - now.getTime();
  const past = diffMs < 0;
  const mins = Math.round(Math.abs(diffMs) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const span = h > 0 ? `${h}h ${m}m` : `${m}m`;
  return past ? `${span} ago` : `in ${span}`;
}
