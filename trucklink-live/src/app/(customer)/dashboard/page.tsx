import Link from "next/link";
import { Activity, CheckCircle2, Clock, AlertTriangle, ArrowRight, PlusCircle } from "lucide-react";
import { KPIBox } from "@/components/KPIBox";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { qargoService } from "@/lib/qargoService";
import { CUSTOMER } from "@/lib/data";

export default async function DashboardPage() {
  const jobs = await qargoService.getJobs();
  const active = jobs.filter(
    (j) => !["Complete", "POD Uploaded"].includes(j.status),
  );
  const delayed = jobs.filter((j) => j.status === "Delayed" || j.status === "Exception");
  const completed = jobs.filter((j) =>
    ["Complete", "POD Uploaded", "Delivered"].includes(j.status),
  );
  const onTimePct = Math.round(
    ((jobs.length - delayed.length) / jobs.length) * 100,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Welcome back, {CUSTOMER.name.split(" ")[0]} 👋
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {CUSTOMER.company}
          </h1>
        </div>
        <Link href="/new-booking">
          <Button size="lg">
            <PlusCircle className="h-5 w-5" /> New booking
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIBox label="Active jobs" value={active.length} icon={Activity} tone="brand" hint="Currently in progress" />
        <KPIBox label="On-time" value={`${onTimePct}%`} icon={CheckCircle2} tone="green" hint="Last 30 days" />
        <KPIBox label="Delayed" value={delayed.length} icon={AlertTriangle} tone="amber" hint="Needs attention" />
        <KPIBox label="Completed" value={completed.length} icon={Clock} tone="blue" hint="Delivered & closed" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Active jobs</h2>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {active.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
