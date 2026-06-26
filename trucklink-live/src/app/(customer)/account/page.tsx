import {
  Building2,
  Mail,
  Phone,
  UserCircle,
  Bell,
  CreditCard,
  ChevronRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CUSTOMER } from "@/lib/data";

export default function AccountPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Account</h1>

      <Card>
        <CardContent className="flex items-center gap-4 pt-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500 text-xl font-semibold text-white">
            {CUSTOMER.name.split(" ").map((n) => n[0]).join("")}
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">{CUSTOMER.name}</p>
            <p className="text-sm text-slate-500">{CUSTOMER.company}</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Active account
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 pt-5">
            <h3 className="font-semibold text-slate-900">Company details</h3>
            <Detail icon={Building2} label="Company" value={CUSTOMER.company} />
            <Detail icon={Mail} label="Email" value="ian@foxdistribution.co.uk" />
            <Detail icon={Phone} label="Phone" value="03300 581 877" />
            <Detail icon={UserCircle} label="Account manager" value={CUSTOMER.accountManager} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <h3 className="mb-3 font-semibold text-slate-900">Settings</h3>
            <SettingRow icon={Bell} label="Notifications" hint="Email & SMS updates" />
            <SettingRow icon={CreditCard} label="Billing & invoices" hint="View statements" />
            <SettingRow icon={UserCircle} label="Team members" hint="3 users" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-5">
          <Link
            href="/ops"
            className="flex items-center gap-3 rounded-xl bg-ink-900 px-4 py-3.5 text-white transition hover:bg-ink-800"
          >
            <LayoutDashboard className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium">Open Ops Control Centre</p>
              <p className="text-xs text-slate-400">Internal staff view (demo)</p>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-slate-500" />
          </Link>
          <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50">
            <LogOut className="h-5 w-5" /> Sign out
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof Bell;
  label: string;
  hint: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition hover:bg-slate-50">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
    </button>
  );
}
