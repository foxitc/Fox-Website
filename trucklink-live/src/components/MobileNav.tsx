"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Package },
  { href: "/new-booking", label: "New", icon: Plus, primary: true },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/account", label: "Account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-slate-200 bg-white/90 px-2 py-2 shadow-lift backdrop-blur">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="grid h-12 w-12 -translate-y-3 place-items-center rounded-2xl bg-brand-500 text-white shadow-lift transition active:scale-95"
                aria-label={item.label}
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-medium transition",
                active ? "text-brand-600" : "text-slate-400",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-brand-600")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
