import Link from "next/link";
import { ArrowRight, MapPin, Clock, Truck } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn, formatDateTime, relativeFrom } from "@/lib/utils";
import { DEMO_NOW } from "@/lib/data";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  const isLive = job.status === "In Transit" || job.status === "Delayed";
  return (
    <Link
      href={`/jobs/${job.reference}`}
      className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{job.reference}</p>
          <p className="text-xs text-slate-400">Ref {job.customerReference}</p>
        </div>
        <StatusBadge status={job.status} pulse={isLive} />
      </div>

      <div className="mt-4 space-y-2.5">
        <Leg
          dotClass="bg-brand-500"
          place={`${job.collection.company}, ${job.collection.city}`}
          sub={job.collection.postcode}
        />
        <div className="ml-[5px] h-4 w-0.5 bg-slate-200" />
        <Leg
          dotClass="bg-slate-900"
          place={`${job.delivery.company}, ${job.delivery.city}`}
          sub={job.delivery.postcode}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        {job.driver && (
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-slate-400" />
            {job.driver.name}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          {job.eta ? `ETA ${relativeFrom(job.eta, DEMO_NOW)}` : "Awaiting ETA"}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand-600 opacity-0 transition group-hover:opacity-100">
          View <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function Leg({
  dotClass,
  place,
  sub,
}: {
  dotClass: string;
  place: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", dotClass)} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">{place}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

// Compact row variant for dense tables (ops board / jobs list).
export function JobRow({ job }: { job: Job }) {
  const isLive = job.status === "In Transit" || job.status === "Delayed";
  return (
    <Link
      href={`/jobs/${job.reference}`}
      className="grid grid-cols-12 items-center gap-3 px-4 py-3.5 text-sm transition hover:bg-slate-50"
    >
      <div className="col-span-2">
        <p className="font-semibold text-slate-900">{job.reference}</p>
        <p className="text-xs text-slate-400">{job.customerReference}</p>
      </div>
      <div className="col-span-3 min-w-0">
        <p className="flex items-center gap-1.5 truncate text-slate-700">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" />
          {job.collection.city}
        </p>
        <p className="truncate text-xs text-slate-400">{job.collection.postcode}</p>
      </div>
      <div className="col-span-3 min-w-0">
        <p className="flex items-center gap-1.5 truncate text-slate-700">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-900" />
          {job.delivery.city}
        </p>
        <p className="truncate text-xs text-slate-400">{job.delivery.postcode}</p>
      </div>
      <div className="col-span-2 text-xs text-slate-500">
        {job.driver?.name ?? "Unassigned"}
        <p className="text-slate-400">{formatDateTime(job.eta)}</p>
      </div>
      <div className="col-span-2 flex justify-end">
        <StatusBadge status={job.status} pulse={isLive} />
      </div>
    </Link>
  );
}
