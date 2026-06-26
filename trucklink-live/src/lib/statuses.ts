import type { JobStatus } from "./types";

// Tone drives the colour family used by StatusBadge / pills throughout the app.
//   green  -> confirmed / on-time / delivered
//   blue   -> in progress
//   amber  -> delayed / waiting on input
//   red    -> exception
//   purple -> POD / completed-document stage
export type StatusTone = "green" | "blue" | "amber" | "red" | "purple" | "slate";

interface StatusMeta {
  tone: StatusTone;
  // Order along the standard job lifecycle, used to render the timeline.
  step: number;
}

export const STATUS_META: Record<JobStatus, StatusMeta> = {
  "Request Received": { tone: "slate", step: 0 },
  "Awaiting Planning": { tone: "amber", step: 1 },
  Planning: { tone: "blue", step: 2 },
  "Awaiting Customer Info": { tone: "amber", step: 2 },
  "Collection Scheduled": { tone: "blue", step: 3 },
  "Vehicle Allocated": { tone: "blue", step: 4 },
  "Driver Confirmed": { tone: "green", step: 5 },
  "Collection Complete": { tone: "green", step: 6 },
  "In Transit": { tone: "blue", step: 7 },
  Delayed: { tone: "amber", step: 7 },
  Delivered: { tone: "green", step: 8 },
  "POD Uploaded": { tone: "purple", step: 9 },
  Complete: { tone: "green", step: 10 },
  Exception: { tone: "red", step: 7 },
};

// The canonical happy-path lifecycle shown on every job timeline.
export const LIFECYCLE: { status: JobStatus; label: string }[] = [
  { status: "Request Received", label: "Job Received" },
  { status: "Planning", label: "Planner Assigned" },
  { status: "Collection Scheduled", label: "Collection Booked" },
  { status: "Vehicle Allocated", label: "Vehicle Allocated" },
  { status: "Driver Confirmed", label: "Driver Confirmed" },
  { status: "Collection Complete", label: "Collection Complete" },
  { status: "In Transit", label: "In Transit" },
  { status: "Delivered", label: "Delivered" },
  { status: "POD Uploaded", label: "POD Uploaded" },
];

export const TONE_CLASSES: Record<
  StatusTone,
  { pill: string; dot: string; soft: string; text: string }
> = {
  green: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    dot: "bg-emerald-500",
    soft: "bg-emerald-50",
    text: "text-emerald-600",
  },
  blue: {
    pill: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    dot: "bg-blue-500",
    soft: "bg-blue-50",
    text: "text-blue-600",
  },
  amber: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    dot: "bg-amber-500",
    soft: "bg-amber-50",
    text: "text-amber-600",
  },
  red: {
    pill: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    dot: "bg-red-500",
    soft: "bg-red-50",
    text: "text-red-600",
  },
  purple: {
    pill: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
    dot: "bg-violet-500",
    soft: "bg-violet-50",
    text: "text-violet-600",
  },
  slate: {
    pill: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20",
    dot: "bg-slate-400",
    soft: "bg-slate-50",
    text: "text-slate-600",
  },
};

export function toneFor(status: JobStatus): StatusTone {
  return STATUS_META[status]?.tone ?? "slate";
}
