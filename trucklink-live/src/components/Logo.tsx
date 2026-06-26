import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact, dark }: { compact?: boolean; dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm">
        <Truck className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[15px] font-bold tracking-tight",
              dark ? "text-white" : "text-slate-900",
            )}
          >
            TruckLink<span className="text-brand-500"> Live</span>
          </span>
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-wider",
              dark ? "text-slate-400" : "text-slate-400",
            )}
          >
            Powered by Qargo
          </span>
        </span>
      )}
    </span>
  );
}
