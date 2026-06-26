"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { TONE_CLASSES, toneFor } from "@/lib/statuses";
import type { Job, JobStatus } from "@/lib/types";

function DarkBadge({ status }: { status: JobStatus }) {
  const c = TONE_CLASSES[toneFor(status)];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-inset ring-white/10">
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {status}
    </span>
  );
}

export function OpsJobsBoard({ jobs }: { jobs: Job[] }) {
  const [status, setStatus] = useState<string>("all");
  const [driver, setDriver] = useState<string>("all");

  const drivers = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.driver?.name).filter(Boolean))) as string[],
    [jobs],
  );
  const statuses = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.status))),
    [jobs],
  );

  const filtered = jobs.filter(
    (j) =>
      (status === "all" || j.status === status) &&
      (driver === "all" || j.driver?.name === driver),
  );

  const selectClass =
    "h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none";

  return (
    <div id="board" className="rounded-2xl border border-white/10 bg-ink-800/60">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3.5">
        <h3 className="font-semibold text-white">Jobs board</h3>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
          {filtered.length} of {jobs.length}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={driver} onChange={(e) => setDriver(e.target.value)} className={selectClass}>
            <option value="all">All drivers</option>
            {drivers.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-2.5 font-medium">Ref</th>
              <th className="px-5 py-2.5 font-medium">Route</th>
              <th className="px-5 py-2.5 font-medium">Driver / Vehicle</th>
              <th className="px-5 py-2.5 font-medium">ETA</th>
              <th className="px-5 py-2.5 font-medium">Progress</th>
              <th className="px-5 py-2.5 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((job) => (
              <tr key={job.id} className="group transition hover:bg-white/5">
                <td className="px-5 py-3">
                  <Link href={`/jobs/${job.reference}`} className="font-semibold text-white hover:text-brand-300">
                    {job.reference}
                  </Link>
                  <p className="text-xs text-slate-500">{job.customer}</p>
                </td>
                <td className="px-5 py-3 text-slate-300">
                  {job.collection.city} <span className="text-slate-600">→</span> {job.delivery.city}
                </td>
                <td className="px-5 py-3 text-slate-400">
                  {job.driver?.name ?? <span className="text-slate-600">Unassigned</span>}
                  <p className="text-xs text-slate-600">{job.vehicle?.reg ?? "—"}</p>
                </td>
                <td className="px-5 py-3 text-slate-400">{formatDateTime(job.eta)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          job.status === "Delayed" ? "bg-amber-400" : "bg-brand-500",
                        )}
                        style={{ width: `${job.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{job.progressPercent}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <DarkBadge status={job.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
