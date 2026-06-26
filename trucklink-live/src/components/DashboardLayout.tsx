"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  PlusCircle,
  MessageSquare,
  User,
  LayoutDashboard,
  Search,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CUSTOMER } from "@/lib/data";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/jobs", label: "My Jobs", icon: Package },
  { href: "/new-booking", label: "New Booking", icon: PlusCircle },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/account", label: "Account", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <Link
            href="/ops"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            <LayoutDashboard className="h-5 w-5" />
            Ops Control Centre
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white">
              {CUSTOMER.name.split(" ").map((n) => n[0]).join("")}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {CUSTOMER.name}
              </p>
              <p className="truncate text-xs text-slate-400">{CUSTOMER.company}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="relative ml-auto hidden max-w-xs flex-1 lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search jobs, references…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <button className="relative ml-auto grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 lg:ml-0">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
          </button>
          <Link
            href="/account"
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white lg:hidden"
          >
            {CUSTOMER.name.split(" ").map((n) => n[0]).join("")}
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
