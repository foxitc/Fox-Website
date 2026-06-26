import { JobsExplorer } from "@/components/JobsExplorer";
import { qargoService } from "@/lib/qargoService";

export default async function JobsPage() {
  const jobs = await qargoService.getJobs();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My jobs</h1>
        <p className="text-sm text-slate-500">
          Every booking across your account, live and historical.
        </p>
      </div>
      <JobsExplorer jobs={jobs} />
    </div>
  );
}
