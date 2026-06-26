import Link from "next/link";
import { Send, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateTime } from "@/lib/utils";
import { messages, CUSTOMER } from "@/lib/data";

export default function MessagesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500">
          Talk to the ops team without the email back-and-forth.
        </p>
      </div>

      <Card className="flex h-[60vh] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            FX
          </span>
          <div>
            <p className="font-medium text-slate-900">Fox Ops Team</p>
            <p className="text-xs text-emerald-600">● {CUSTOMER.accountManager} · online</p>
          </div>
          <MessageSquare className="ml-auto h-5 w-5 text-slate-300" />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5">
          {messages
            .slice()
            .reverse()
            .map((m) => {
              const mine = m.from === "Customer";
              return (
                <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div className="max-w-[78%]">
                    {m.jobReference && (
                      <Link
                        href={`/jobs/${m.jobReference}`}
                        className={cn(
                          "mb-1 inline-block text-[11px] font-medium",
                          mine ? "text-brand-100" : "text-brand-600",
                        )}
                      >
                        Re: {m.jobReference}
                      </Link>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                        mine
                          ? "rounded-br-md bg-brand-500 text-white"
                          : "rounded-bl-md bg-white text-slate-700",
                      )}
                    >
                      {m.body}
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-[11px]",
                        mine ? "text-right text-slate-400" : "text-slate-400",
                      )}
                    >
                      {m.author} · {formatDateTime(m.at)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        <CardContent className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <input
              placeholder="Write a message…"
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
