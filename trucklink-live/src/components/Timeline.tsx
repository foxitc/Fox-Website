import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import { TONE_CLASSES, toneFor } from "@/lib/statuses";
import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  // The active step is the last one that has a timestamp.
  const lastDoneIdx = events.reduce(
    (acc, e, i) => (e.at ? i : acc),
    -1,
  );

  return (
    <ol className="relative">
      {events.map((e, i) => {
        const done = !!e.at;
        const isCurrent = i === lastDoneIdx;
        const tone = toneFor(e.status);
        const c = TONE_CLASSES[tone];
        const isLast = i === events.length - 1;
        return (
          <li key={e.label} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5",
                  done ? "bg-brand-200" : "bg-slate-200",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-white",
                done
                  ? isCurrent
                    ? cn(c.dot, "text-white")
                    : "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-300",
              )}
            >
              {done && !isCurrent ? (
                <Check className="h-4 w-4" />
              ) : (
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    isCurrent ? "bg-white animate-pulse-dot" : "bg-slate-300",
                  )}
                />
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  done ? "text-slate-900" : "text-slate-400",
                )}
              >
                {e.label}
              </p>
              <p className="text-xs text-slate-400">
                {done ? formatDateTime(e.at) : "Pending"}
              </p>
              {e.note && <p className="mt-1 text-xs text-slate-500">{e.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
