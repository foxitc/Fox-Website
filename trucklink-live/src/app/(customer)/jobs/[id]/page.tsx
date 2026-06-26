import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Phone,
  Star,
  Package,
  Weight,
  FileText,
  Download,
  Share2,
  Clock,
  Boxes,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { qargoService } from "@/lib/qargoService";
import { DEMO_NOW } from "@/lib/data";
import { cn, formatDateTime, formatDate, relativeFrom } from "@/lib/utils";
import { TONE_CLASSES } from "@/lib/statuses";
import type { Job, JobNote } from "@/lib/types";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await qargoService.getJobById(decodeURIComponent(params.id));
  if (!job) notFound();
  const isLive = job.status === "In Transit" || job.status === "Delayed";

  return (
    <div className="space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {job.reference}
            </h1>
            <StatusBadge status={job.status} pulse={isLive} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Your reference {job.customerReference} · Last update{" "}
            {relativeFrom(job.lastUpdate, DEMO_NOW)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="pt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Journey progress</span>
            <span className="text-slate-500">
              {job.eta ? `ETA ${formatDateTime(job.eta)}` : "ETA pending"}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                job.status === "Delayed" ? "bg-amber-400" : "bg-brand-500",
              )}
              style={{ width: `${job.progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: route, load, notes */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <RouteCard title="Collection" loc={job.collection} accent="brand" />
            <RouteCard title="Delivery" loc={job.delivery} accent="slate" />
          </div>

          <Card>
            <CardContent className="pt-5">
              <h3 className="mb-4 font-semibold text-slate-900">Load details</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric icon={Boxes} label="Pallets" value={String(job.palletCount)} />
                <Metric icon={Weight} label="Weight" value={`${(job.weightKg / 1000).toFixed(1)}t`} />
                <Metric icon={Package} label="Goods" value={job.goodsDescription} wide />
              </div>
              {job.specialInstructions && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <span className="font-medium">Special instructions: </span>
                  {job.specialInstructions}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <h3 className="mb-4 font-semibold text-slate-900">Notes & updates</h3>
              <NotesThread notes={job.notes} />
            </CardContent>
          </Card>
        </div>

        {/* Right: timeline, driver, docs */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-5">
              <h3 className="mb-4 font-semibold text-slate-900">Live progress</h3>
              <Timeline events={job.timeline} />
            </CardContent>
          </Card>

          {job.driver && job.vehicle && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="mb-4 font-semibold text-slate-900">Driver & vehicle</h3>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full text-base font-semibold text-white"
                    style={{ backgroundColor: job.driver.avatarColor }}
                  >
                    {job.driver.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{job.driver.name}</p>
                    <p className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="h-3 w-3 fill-amber-400" /> {job.driver.rating.toFixed(1)}
                    </p>
                  </div>
                  <a
                    href={`tel:${job.driver.phone.replace(/\s/g, "")}`}
                    className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                    aria-label="Call driver"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-slate-700 ring-1 ring-slate-200">
                    <Truck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{job.vehicle.reg}</p>
                    <p className="text-xs text-slate-500">{job.vehicle.type}</p>
                  </div>
                  {isLive && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
                      Tracking
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Documents</h3>
                <span className="text-xs text-slate-400">{job.documents.length} files</span>
              </div>
              {job.documents.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                  PODs and paperwork appear here once available.
                </p>
              ) : (
                <ul className="space-y-2">
                  {job.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                    >
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-lg",
                          doc.type === "POD"
                            ? TONE_CLASSES.purple.soft + " " + TONE_CLASSES.purple.text
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{doc.name}</p>
                        <p className="text-xs text-slate-400">
                          {doc.type} · {doc.sizeKb} KB · {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                      <Download className="h-4 w-4 text-slate-400" />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RouteCard({
  title,
  loc,
  accent,
}: {
  title: string;
  loc: Job["collection"];
  accent: "brand" | "slate";
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg",
              accent === "brand" ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-700",
            )}
          >
            <MapPin className="h-4 w-4" />
          </span>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="font-medium text-slate-900">{loc.company}</p>
        <p className="text-sm text-slate-500">{loc.address}</p>
        <p className="text-sm text-slate-500">
          {loc.city}, {loc.postcode}
        </p>
        {loc.contact && <p className="mt-2 text-sm text-slate-500">Contact: {loc.contact}</p>}
        {loc.windowStart && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
            <Clock className="h-3.5 w-3.5" />
            {formatDateTime(loc.windowStart)}
            {loc.windowEnd ? ` – ${formatDateTime(loc.windowEnd).split(", ")[1] ?? ""}` : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  wide,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && "col-span-2")}>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

const roleStyle: Record<JobNote["role"], string> = {
  Customer: "bg-brand-500 text-white",
  Ops: "bg-slate-900 text-white",
  Driver: "bg-blue-500 text-white",
  System: "bg-slate-200 text-slate-600",
};

function NotesThread({ notes }: { notes: JobNote[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-slate-400">No updates yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {notes.map((n) => (
        <li key={n.id} className="flex gap-3">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold",
              roleStyle[n.role],
            )}
          >
            {n.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-medium text-slate-900">{n.author}</p>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {n.role}
              </span>
              <span className="ml-auto text-xs text-slate-400">
                {formatDateTime(n.at)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
