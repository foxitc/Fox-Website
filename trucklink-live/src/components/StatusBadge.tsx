import { cn } from "@/lib/utils";
import { TONE_CLASSES, toneFor } from "@/lib/statuses";
import type { JobStatus } from "@/lib/types";

export function StatusBadge({
  status,
  className,
  pulse,
}: {
  status: JobStatus;
  className?: string;
  pulse?: boolean;
}) {
  const tone = toneFor(status);
  const c = TONE_CLASSES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        c.pill,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          c.dot,
          pulse && "animate-pulse-dot",
        )}
      />
      {status}
    </span>
  );
}
