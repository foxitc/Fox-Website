import { BookingForm } from "@/components/BookingForm";

export default function NewBookingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">New booking</h1>
        <p className="text-sm text-slate-500">
          Tell us what needs moving — we&apos;ll handle the planning and keep you updated.
        </p>
      </div>
      <BookingForm />
    </div>
  );
}
