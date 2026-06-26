import { AlertTriangle, Info, Siren } from "lucide-react";
import { cn, relativeFrom } from "@/lib/utils";
import { DEMO_NOW } from "@/lib/data";
import type { Alert } from "@/lib/types";

const severityMap = {
  info: { icon: Info, ring: "bg-blue-500/15 text-blue-300", label: "Info" },
  warning: { icon: AlertTriangle, ring: "bg-amber-500/15 text-amber-300", label: "Warning" },
  critical: { icon: Siren, ring: "bg-red-500/15 text-red-300", label: "Critical" },
};

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Live alerts</h3>
        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-300">
          {alerts.length} active
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {alerts.map((a) => {
          const s = severityMap[a.severity];
          const Icon = s.icon;
          return (
            <li
              key={a.id}
              className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
            >
              <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", s.ring)}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">{a.title}</p>
                  {a.jobReference && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                      {a.jobReference}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{a.detail}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {relativeFrom(a.at, DEMO_NOW)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
