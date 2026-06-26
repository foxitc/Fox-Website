"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { JobCard, JobRow } from "./JobCard";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";

type Filter = "all" | "active" | "in-transit" | "delayed" | "completed";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "in-transit", label: "In transit" },
  { key: "delayed", label: "Delayed" },
  { key: "completed", label: "Completed" },
];

export function JobsExplorer({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesQuery =
        !query ||
        [j.reference, j.customerReference, j.collection.city, j.delivery.city, j.driver?.name]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(query.toLowerCase()));
      if (!matchesQuery) return false;
      switch (filter) {
        case "active":
          return !["Complete", "POD Uploaded"].includes(j.status);
        case "in-transit":
          return j.status === "In Transit";
        case "delayed":
          return j.status === "Delayed" || j.status === "Exception";
        case "completed":
          return ["Complete", "POD Uploaded", "Delivered"].includes(j.status);
        default:
          return true;
      }
    });
  }, [jobs, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, city or driver…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 sm:flex">
          <button
            onClick={() => setView("list")}
            className={cn("grid h-9 w-9 place-items-center rounded-lg", view === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={cn("grid h-9 w-9 place-items-center rounded-lg", view === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
              filter === f.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-slate-400">
          {filtered.length} job{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
          No jobs match your filters.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-400 sm:grid">
            <div className="col-span-2">Reference</div>
            <div className="col-span-3">Collection</div>
            <div className="col-span-3">Delivery</div>
            <div className="col-span-2">Driver / ETA</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
