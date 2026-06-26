"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  Paperclip,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input, Label, Select, Textarea } from "./ui/field";
import { qargoService } from "@/lib/qargoService";
import type { Job } from "@/lib/types";

function SectionTitle({ icon: Icon, title }: { icon: typeof MapPin; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
  );
}

export function BookingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Job | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string) ?? "";
    setSubmitting(true);
    const job = await qargoService.createBooking({
      customerReference: get("customerReference") || "—",
      collection: {
        company: get("colCompany"),
        contact: get("colContact"),
        address: get("colAddress"),
        city: get("colCity"),
        postcode: get("colPostcode"),
        windowStart: get("colDate") || undefined,
      },
      delivery: {
        company: get("delCompany"),
        contact: get("delContact"),
        address: get("delAddress"),
        city: get("delCity"),
        postcode: get("delPostcode"),
        windowStart: get("delDate") || undefined,
      },
      palletCount: Number(get("pallets")) || 0,
      weightKg: Number(get("weight")) || 0,
      goodsDescription: get("goods"),
      specialInstructions: get("instructions") || undefined,
    });
    setCreated(job);
    setSubmitting(false);
  }

  if (created) {
    return (
      <Card className="mx-auto max-w-lg animate-fade-in text-center">
        <CardContent className="pt-8">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Booking received</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            We&apos;ve logged your job and our planning team has been notified.
            You&apos;ll get a notification the moment it&apos;s scheduled.
          </p>
          <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Job reference</span>
              <span className="font-semibold text-slate-900">{created.reference}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {created.status}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => router.push(`/jobs/${created.reference}`)}
            >
              Track this job <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setCreated(null)}>
              Book another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardContent className="pt-5">
          <SectionTitle icon={Package} title="Job details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerReference">Your reference</Label>
              <Input id="customerReference" name="customerReference" placeholder="PO-00000" />
            </div>
            <div>
              <Label htmlFor="goods">Goods description</Label>
              <Input id="goods" name="goods" placeholder="e.g. Palletised retail stock" required />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <SectionTitle icon={MapPin} title="Collection" />
            <div className="space-y-4">
              <Field label="Company" name="colCompany" required />
              <Field label="Contact name" name="colContact" />
              <Field label="Address" name="colAddress" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Town/City" name="colCity" required />
                <Field label="Postcode" name="colPostcode" required />
              </div>
              <div>
                <Label htmlFor="colDate">Required collection</Label>
                <Input id="colDate" name="colDate" type="datetime-local" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <SectionTitle icon={Truck} title="Delivery" />
            <div className="space-y-4">
              <Field label="Company" name="delCompany" required />
              <Field label="Contact name" name="delContact" />
              <Field label="Address" name="delAddress" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Town/City" name="delCity" required />
                <Field label="Postcode" name="delPostcode" required />
              </div>
              <div>
                <Label htmlFor="delDate">Required delivery</Label>
                <Input id="delDate" name="delDate" type="datetime-local" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-5">
          <SectionTitle icon={Package} title="Load & instructions" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="pallets">Pallet count</Label>
              <Input id="pallets" name="pallets" type="number" min={0} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" min={0} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="service">Service level</Label>
              <Select id="service" name="service" defaultValue="standard">
                <option value="standard">Standard</option>
                <option value="next-day">Next day</option>
                <option value="timed">Timed / AM</option>
                <option value="dedicated">Dedicated vehicle</option>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="instructions">Special instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="Tail-lift, booking-in references, access notes…"
            />
          </div>
          <div className="mt-4">
            <Label>Attachments</Label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 transition hover:border-brand-400 hover:bg-brand-50/40">
              <Paperclip className="h-4 w-4" />
              Drag files here or browse
              <input type="file" multiple className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <p className="mr-auto text-xs text-slate-400">
          Submitting creates a job in the planning queue and notifies our ops team.
        </p>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Submit booking <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required={required} />
    </div>
  );
}
