"use client";

import { useState } from "react";
import {
  Mail,
  Sparkles,
  Check,
  X,
  Pencil,
  MapPin,
  Package,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { cn, relativeFrom } from "@/lib/utils";
import { DEMO_NOW } from "@/lib/data";
import type { EmailRequest } from "@/lib/types";

function confidenceTone(c: number) {
  if (c >= 0.85) return { label: "High", cls: "text-emerald-400 bg-emerald-500/15" };
  if (c >= 0.65) return { label: "Medium", cls: "text-amber-400 bg-amber-500/15" };
  return { label: "Low", cls: "text-red-400 bg-red-500/15" };
}

export function EmailRequestsBoard({ requests }: { requests: EmailRequest[] }) {
  const [items, setItems] = useState(requests);

  function resolve(id: string, status: "Approved" | "Rejected") {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const pending = items.filter((r) => r.status === "Pending");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/10 to-transparent p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-white">AI inbox — jobs@foxdistribution.co.uk</h2>
            <p className="mt-0.5 text-sm text-slate-400">
              Incoming customer emails are parsed into draft jobs automatically.
              Review the extraction, edit if needed, then approve to push into
              planning. The customer sees the job once it&apos;s accepted.
            </p>
          </div>
          <span className="ml-auto hidden shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 sm:block">
            {pending.length} awaiting review
          </span>
        </div>
      </div>

      {items.map((req) => {
        const tone = confidenceTone(req.confidence);
        const resolved = req.status !== "Pending";
        return (
          <div
            key={req.id}
            className={cn(
              "rounded-2xl border border-white/10 bg-ink-800/60 transition",
              resolved && "opacity-60",
            )}
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300">
                <Mail className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{req.subject}</p>
                <p className="truncate text-xs text-slate-500">
                  {req.from} · {relativeFrom(req.receivedAt, DEMO_NOW)}
                </p>
              </div>
              <span className={cn("ml-auto rounded-full px-2.5 py-1 text-xs font-medium", tone.cls)}>
                {tone.label} · {Math.round(req.confidence * 100)}%
              </span>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Original email
                </p>
                <p className="rounded-xl border border-white/5 bg-black/20 p-3 text-sm italic text-slate-400">
                  “{req.rawSnippet}”
                </p>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-brand-400" /> Extracted booking
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Parsed icon={MapPin} label="Collection" value={loc(req.parsed.collection)} />
                  <Parsed icon={MapPin} label="Delivery" value={loc(req.parsed.delivery)} />
                  <Parsed icon={Package} label="Pallets" value={req.parsed.palletCount?.toString()} />
                  <Parsed icon={Package} label="Goods" value={req.parsed.goodsDescription} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3">
              {resolved ? (
                <span
                  className={cn(
                    "text-sm font-medium",
                    req.status === "Approved" ? "text-emerald-400" : "text-slate-500",
                  )}
                >
                  {req.status === "Approved" ? "✓ Pushed to planning" : "Rejected"}
                </span>
              ) : (
                <>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => resolve(req.id, "Rejected")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => resolve(req.id, "Approved")}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve & create job
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-slate-500">
          <Inbox className="mx-auto mb-2 h-8 w-8" />
          Inbox zero — no pending requests.
        </div>
      )}
    </div>
  );
}

function loc(l?: { city?: string; postcode?: string; company?: string }) {
  if (!l) return undefined;
  return [l.company, l.city].filter(Boolean).join(", ") || l.postcode;
}

function Parsed({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className={cn("mt-0.5 truncate", value ? "text-slate-200" : "text-slate-600")}>
        {value ?? "Not detected"}
      </p>
    </div>
  );
}
