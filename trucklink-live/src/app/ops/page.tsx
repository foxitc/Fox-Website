import { Activity, CheckCircle2, AlertTriangle, Siren } from "lucide-react";
import { KPIBox } from "@/components/KPIBox";
import { AlertsPanel } from "@/components/AlertsPanel";
import { OperationsMap } from "@/components/OperationsMap";
import { OpsJobsBoard } from "@/components/OpsJobsBoard";
import { qargoService } from "@/lib/qargoService";
import { alerts } from "@/lib/data";

export default async function OpsPage() {
  const jobs = await qargoService.getJobs();
  const active = jobs.filter((j) => !["Complete"].includes(j.status));
  const delayed = jobs.filter((j) => j.status === "Delayed" || j.status === "Exception");
  const onTime = active.length - delayed.length;
  const exceptions = jobs.filter((j) => j.status === "Exception").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Control Centre</h1>
          <p className="text-sm text-slate-400">
            Live operational view across every customer and vehicle.
          </p>
        </div>
        <p className="text-sm text-slate-500">Thursday, 26 June · 12:30</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPIBox dark label="Active jobs" value={active.length} icon={Activity} tone="brand" hint="Across all customers" />
        <KPIBox dark label="On-time" value={onTime} icon={CheckCircle2} tone="green" hint="Within slot" />
        <KPIBox dark label="Delayed" value={delayed.length} icon={AlertTriangle} tone="amber" hint="Running late" />
        <KPIBox dark label="Exceptions" value={exceptions} icon={Siren} tone="red" hint="Need intervention" />
      </div>

      <div id="map" className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OperationsMap jobs={jobs} />
        </div>
        <AlertsPanel alerts={alerts} />
      </div>

      <OpsJobsBoard jobs={jobs} />
    </div>
  );
}
