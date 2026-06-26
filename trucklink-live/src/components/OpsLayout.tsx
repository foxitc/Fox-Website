"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Truck,
  Map,
  BarChart3,
  Settings,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const nav = [
  { href: "/ops", label: "Control Centre", icon: LayoutDashboard },
  { href: "/ops/email-requests", label: "Email Requests", icon: Mail, badge: 3 },
  { href: "/ops#board", label: "Jobs Board", icon: Truck },
  { href: "/ops#map", label: "Live Map", icon: Map },
  { href: "/ops#reports", label: "Reports", icon: BarChart3 },
];

export function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-ink-900 text-slate-200">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-ink-900 lg:flex">
        <div className="flex h-16 items-center px-6">
          <Logo dark />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeftRight className="h-5 w-5" />
            Customer Portal
          </Link>
          <div className="mt-1 flex items-center gap-3 px-3 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-semibold text-white">
              SC
            </span>
            <div>
              <p className="text-sm font-medium text-white">Steven Clarke</p>
              <p className="text-xs text-slate-500">Transport Planner</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-ink-900/80 px-4 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Logo dark compact />
          </div>
          <div className="relative ml-auto hidden max-w-sm flex-1 lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              placeholder="Search jobs, drivers, customers…"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <span className="ml-auto flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 lg:ml-0">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
            Qargo sync active
          </span>
          <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-white/5">
            <Settings className="h-5 w-5" />
          </button>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
