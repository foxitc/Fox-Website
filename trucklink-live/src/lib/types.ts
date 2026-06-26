// Shared domain types for TruckLink Live.
// These intentionally mirror a TMS-style data model so the Qargo integration
// layer can map onto them with minimal friction later.

export type JobStatus =
  | "Request Received"
  | "Awaiting Planning"
  | "Planning"
  | "Awaiting Customer Info"
  | "Collection Scheduled"
  | "Vehicle Allocated"
  | "Driver Confirmed"
  | "Collection Complete"
  | "In Transit"
  | "Delayed"
  | "Delivered"
  | "POD Uploaded"
  | "Complete"
  | "Exception";

export interface Location {
  company: string;
  contact?: string;
  address: string;
  city: string;
  postcode: string;
  windowStart?: string; // ISO datetime
  windowEnd?: string; // ISO datetime
  lat?: number;
  lng?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  rating: number;
}

export interface Vehicle {
  id: string;
  reg: string;
  type: string; // e.g. "18t Curtainsider"
  capacityPallets: number;
}

export interface TimelineEvent {
  status: JobStatus;
  label: string;
  at?: string; // ISO datetime; absent = not yet reached
  note?: string;
}

export interface JobDocument {
  id: string;
  name: string;
  type: "POD" | "Invoice" | "CMR" | "Photo" | "Other";
  uploadedAt: string;
  sizeKb: number;
}

export interface JobNote {
  id: string;
  author: string;
  role: "Customer" | "Ops" | "Driver" | "System";
  at: string;
  body: string;
}

export interface Job {
  id: string;
  reference: string;
  customerReference: string;
  customer: string;
  status: JobStatus;
  collection: Location;
  delivery: Location;
  palletCount: number;
  weightKg: number;
  goodsDescription: string;
  specialInstructions?: string;
  driver?: Driver;
  vehicle?: Vehicle;
  eta?: string; // ISO datetime
  lastUpdate: string; // ISO datetime
  progressPercent: number;
  timeline: TimelineEvent[];
  documents: JobDocument[];
  notes: JobNote[];
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  jobReference?: string;
  title: string;
  detail: string;
  at: string;
}

export interface EmailRequest {
  id: string;
  from: string;
  subject: string;
  receivedAt: string;
  confidence: number; // 0-1 extraction confidence
  status: "Pending" | "Approved" | "Rejected";
  parsed: {
    customerReference?: string;
    collection?: Partial<Location>;
    delivery?: Partial<Location>;
    palletCount?: number;
    weightKg?: number;
    goodsDescription?: string;
    requiredCollection?: string;
    requiredDelivery?: string;
  };
  rawSnippet: string;
}

export interface Message {
  id: string;
  jobReference?: string;
  from: "Customer" | "Ops";
  author: string;
  at: string;
  body: string;
  unread?: boolean;
}
