import { EmailRequestsBoard } from "@/components/EmailRequestsBoard";
import { emailRequests } from "@/lib/data";

export default function EmailRequestsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Email Requests</h1>
        <p className="text-sm text-slate-400">
          Inbound bookings captured from email and parsed into draft jobs.
        </p>
      </div>
      <EmailRequestsBoard requests={emailRequests} />
    </div>
  );
}
