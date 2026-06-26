"use client";

import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";

// Simple equirectangular projection of GB lat/lng into the SVG viewbox.
// Bounds chosen to frame mainland Great Britain.
const LAT_MAX = 59;
const LAT_MIN = 49.8;
const LNG_MIN = -8.2;
const LNG_MAX = 2.2;
const W = 300;
const H = 380;

function project(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
  return { x, y };
}

// A deliberately stylised (not survey-accurate) GB silhouette — enough to read
// as "the UK" behind the live markers. A real tile map (Mapbox/Leaflet) drops
// in here later via getVehicleTracking().
const GB_PATH =
  "M150 18 C168 32 172 52 158 64 C176 78 172 98 158 108 C170 124 168 142 172 156 C200 160 232 174 246 196 C270 228 282 254 262 272 C236 286 206 286 190 300 C202 314 176 322 158 324 C150 340 138 352 118 358 C104 362 96 352 102 338 C92 322 90 306 102 298 C86 284 94 266 110 260 C98 244 106 226 120 220 C106 204 112 186 128 178 C116 160 124 138 136 130 C122 108 130 76 142 64 C134 46 142 30 150 18 Z";

export function OperationsMap({ jobs }: { jobs: Job[] }) {
  const tracked = jobs.filter(
    (j) => j.collection.lat && j.delivery.lat && (j.status === "In Transit" || j.status === "Delayed"),
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <h3 className="font-semibold text-white">Fleet — live positions</h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
          {tracked.length} vehicles moving
        </span>
      </div>

      <div className="relative h-[420px] w-full bg-[radial-gradient(circle_at_50%_30%,rgba(249,116,21,0.08),transparent_60%)]">
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 mx-auto h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={GB_PATH} className="fill-white/[0.04] stroke-white/15" strokeWidth={1} />

          {tracked.map((job) => {
            const c = project(job.collection.lat!, job.collection.lng!);
            const d = project(job.delivery.lat!, job.delivery.lng!);
            const t = job.progressPercent / 100;
            const vx = c.x + (d.x - c.x) * t;
            const vy = c.y + (d.y - c.y) * t;
            const delayed = job.status === "Delayed";
            return (
              <g key={job.id}>
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={d.x}
                  y2={d.y}
                  className="stroke-white/15"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={vx}
                  y2={vy}
                  className={delayed ? "stroke-amber-400/70" : "stroke-brand-400/80"}
                  strokeWidth={1.5}
                />
                <circle cx={c.x} cy={c.y} r={2.5} className="fill-brand-400" />
                <circle cx={d.x} cy={d.y} r={2.5} className="fill-white/70" />
                <circle
                  cx={vx}
                  cy={vy}
                  r={6}
                  className={cn(delayed ? "fill-amber-400/30" : "fill-brand-400/30", "animate-pulse-dot")}
                />
                <circle
                  cx={vx}
                  cy={vy}
                  r={3}
                  className={delayed ? "fill-amber-400" : "fill-brand-400"}
                />
              </g>
            );
          })}
        </svg>

        {/* marker labels */}
        {tracked.map((job) => {
          const c = project(job.collection.lat!, job.collection.lng!);
          const d = project(job.delivery.lat!, job.delivery.lng!);
          const t = job.progressPercent / 100;
          const vx = (c.x + (d.x - c.x) * t) / W;
          const vy = (c.y + (d.y - c.y) * t) / H;
          return (
            <div
              key={job.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-[150%]"
              style={{ left: `calc(50% + ${(vx - 0.5) * W}px)`, top: `${vy * 100}%` }}
            >
              <span className="flex items-center gap-1 rounded-md bg-ink-800 px-1.5 py-0.5 text-[10px] font-medium text-white shadow ring-1 ring-white/10">
                <Truck className="h-3 w-3 text-brand-400" />
                {job.reference}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
