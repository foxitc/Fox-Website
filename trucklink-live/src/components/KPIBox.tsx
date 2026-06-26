import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function KPIBox({
  label,
  value,
  icon: Icon,
  tone = "slate",
  hint,
  dark,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "brand" | "green" | "amber" | "red" | "blue" | "slate";
  hint?: string;
  dark?: boolean;
}) {
  const toneMap = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
  };
  const darkToneMap = {
    brand: "bg-brand-500/15 text-brand-400",
    green: "bg-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/15 text-amber-400",
    red: "bg-red-500/15 text-red-400",
    blue: "bg-blue-500/15 text-blue-400",
    slate: "bg-white/10 text-slate-300",
  };
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-soft transition hover:shadow-lift",
        dark
          ? "border-white/10 bg-ink-800/60"
          : "border-slate-200/80 bg-white",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              dark ? "text-slate-400" : "text-slate-500",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-semibold tracking-tight",
              dark ? "text-white" : "text-slate-900",
            )}
          >
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl",
            dark ? darkToneMap[tone] : toneMap[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint && (
        <p className={cn("mt-3 text-xs", dark ? "text-slate-500" : "text-slate-400")}>
          {hint}
        </p>
      )}
    </div>
  );
}
