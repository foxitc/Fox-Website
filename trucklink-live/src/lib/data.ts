import type {
  Alert,
  Driver,
  EmailRequest,
  Job,
  Message,
  Vehicle,
} from "./types";
import { LIFECYCLE } from "./statuses";
import type { JobStatus, TimelineEvent } from "./types";

// Fixed reference point so the demo's relative times ("in 2h", "3h ago") are
// stable and reproducible rather than dependent on wall-clock at build time.
export const DEMO_NOW = new Date("2026-06-26T11:30:00Z");

export const CUSTOMER = {
  name: "Ian Fox",
  company: "Fox Distribution Ltd",
  accountManager: "Steven Clarke",
};

const drivers: Driver[] = [
  { id: "d1", name: "Tom Whitby", phone: "07700 900118", avatarColor: "#f97415", rating: 4.9 },
  { id: "d2", name: "Raj Patel", phone: "07700 900221", avatarColor: "#2563eb", rating: 4.8 },
  { id: "d3", name: "Sofia Nowak", phone: "07700 900337", avatarColor: "#7c3aed", rating: 5.0 },
  { id: "d4", name: "Dale Morgan", phone: "07700 900442", avatarColor: "#059669", rating: 4.7 },
];

const vehicles: Vehicle[] = [
  { id: "v1", reg: "FX21 TRK", type: "18t Curtainsider", capacityPallets: 16 },
  { id: "v2", reg: "LD70 VAN", type: "7.5t Box", capacityPallets: 10 },
  { id: "v3", reg: "FX19 ART", type: "44t Artic", capacityPallets: 26 },
  { id: "v4", reg: "MN22 RGD", type: "3.5t Luton", capacityPallets: 6 },
];

// Build a timeline up to (and including) the job's current status, stamping
// realistic times and leaving future steps un-dated.
function buildTimeline(current: JobStatus, base: Date): TimelineEvent[] {
  const currentIdx = LIFECYCLE.findIndex((s) => s.status === current);
  // "Delayed" / "Exception" sit at the In-Transit stage in the lifecycle.
  const effectiveIdx =
    currentIdx === -1
      ? LIFECYCLE.findIndex((s) => s.status === "In Transit")
      : currentIdx;
  return LIFECYCLE.map((step, i) => {
    if (i <= effectiveIdx) {
      const at = new Date(base.getTime() + i * 55 * 60000).toISOString();
      return { status: step.status, label: step.label, at };
    }
    return { status: step.status, label: step.label };
  });
}

function hoursFromNow(h: number) {
  return new Date(DEMO_NOW.getTime() + h * 3600000).toISOString();
}

export const jobs: Job[] = [
  {
    id: "j-1042",
    reference: "FX-1042",
    customerReference: "PO-88231",
    customer: "Fox Distribution Ltd",
    status: "In Transit",
    collection: {
      company: "Mercia Steel",
      contact: "Gary Hughes",
      address: "Unit 4, Holbrook Park",
      city: "Coventry",
      postcode: "CV5 9PA",
      windowStart: hoursFromNow(-4),
      windowEnd: hoursFromNow(-3),
      lat: 52.41,
      lng: -1.51,
    },
    delivery: {
      company: "Northgate Builders Merchants",
      contact: "Lisa Reid",
      address: "Tyne Industrial Estate",
      city: "Newcastle",
      postcode: "NE6 1AS",
      windowStart: hoursFromNow(2),
      windowEnd: hoursFromNow(3),
      lat: 54.97,
      lng: -1.6,
    },
    palletCount: 8,
    weightKg: 5200,
    goodsDescription: "Structural steel sections, banded",
    specialInstructions: "Moffett offload required on site.",
    driver: drivers[0],
    vehicle: vehicles[0],
    eta: hoursFromNow(2.5),
    lastUpdate: hoursFromNow(-0.4),
    progressPercent: 72,
    timeline: buildTimeline("In Transit", new Date(DEMO_NOW.getTime() - 7 * 3600000)),
    documents: [
      { id: "doc1", name: "Collection note FX-1042.pdf", type: "CMR", uploadedAt: hoursFromNow(-3.5), sizeKb: 142 },
    ],
    notes: [
      { id: "n1", author: "System", role: "System", at: hoursFromNow(-7), body: "Job created from portal booking." },
      { id: "n2", author: "Steven Clarke", role: "Ops", at: hoursFromNow(-6.2), body: "Allocated to Tom on the FX21 TRK, Moffett confirmed." },
      { id: "n3", author: "Tom Whitby", role: "Driver", at: hoursFromNow(-0.4), body: "Cleared the M62, running roughly 20 mins ahead of slot." },
    ],
  },
  {
    id: "j-1039",
    reference: "FX-1039",
    customerReference: "PO-88119",
    customer: "Fox Distribution Ltd",
    status: "Delayed",
    collection: {
      company: "Severn Packaging",
      address: "Gloucester Trading Estate",
      city: "Gloucester",
      postcode: "GL2 5DG",
      windowStart: hoursFromNow(-6),
      windowEnd: hoursFromNow(-5),
      lat: 51.86,
      lng: -2.24,
    },
    delivery: {
      company: "Harbour Retail Park",
      address: "Quay Road",
      city: "Plymouth",
      postcode: "PL1 3EH",
      windowStart: hoursFromNow(-1),
      windowEnd: hoursFromNow(0),
      lat: 50.37,
      lng: -4.14,
    },
    palletCount: 12,
    weightKg: 3100,
    goodsDescription: "Flat-pack retail fittings",
    specialInstructions: "Booking-in reference required at gatehouse.",
    driver: drivers[1],
    vehicle: vehicles[2],
    eta: hoursFromNow(1.2),
    lastUpdate: hoursFromNow(-0.6),
    progressPercent: 64,
    timeline: buildTimeline("Delayed", new Date(DEMO_NOW.getTime() - 8 * 3600000)),
    documents: [],
    notes: [
      { id: "n1", author: "Raj Patel", role: "Driver", at: hoursFromNow(-0.6), body: "Heavy traffic on the A38, delay ~70 mins. Customer notified." },
      { id: "n2", author: "Steven Clarke", role: "Ops", at: hoursFromNow(-0.5), body: "Rebooked delivery slot to 13:00. Exception cleared once moving." },
    ],
  },
  {
    id: "j-1045",
    reference: "FX-1045",
    customerReference: "PO-88340",
    customer: "Fox Distribution Ltd",
    status: "Driver Confirmed",
    collection: {
      company: "Lakeland Foods",
      address: "Kendal Business Park",
      city: "Kendal",
      postcode: "LA9 6NZ",
      windowStart: hoursFromNow(3),
      windowEnd: hoursFromNow(4),
      lat: 54.32,
      lng: -2.74,
    },
    delivery: {
      company: "Citywide Wholesale",
      address: "Trafford Park",
      city: "Manchester",
      postcode: "M17 1AB",
      windowStart: hoursFromNow(6),
      windowEnd: hoursFromNow(7),
      lat: 53.46,
      lng: -2.32,
    },
    palletCount: 6,
    weightKg: 2400,
    goodsDescription: "Ambient food, palletised",
    driver: drivers[2],
    vehicle: vehicles[1],
    eta: hoursFromNow(7),
    lastUpdate: hoursFromNow(-1.5),
    progressPercent: 40,
    timeline: buildTimeline("Driver Confirmed", new Date(DEMO_NOW.getTime() - 3 * 3600000)),
    documents: [],
    notes: [
      { id: "n1", author: "Steven Clarke", role: "Ops", at: hoursFromNow(-1.5), body: "Sofia confirmed for the morning slot." },
    ],
  },
  {
    id: "j-1048",
    reference: "FX-1048",
    customerReference: "PO-88401",
    customer: "Fox Distribution Ltd",
    status: "Awaiting Planning",
    collection: {
      company: "Pennine Tools",
      address: "Halifax Road",
      city: "Huddersfield",
      postcode: "HD2 2RH",
      windowStart: hoursFromNow(20),
      windowEnd: hoursFromNow(22),
    },
    delivery: {
      company: "Southern Fixings",
      address: "Eastleigh Industrial",
      city: "Southampton",
      postcode: "SO50 6AD",
      windowStart: hoursFromNow(28),
      windowEnd: hoursFromNow(30),
    },
    palletCount: 4,
    weightKg: 1800,
    goodsDescription: "Hand tools and fixings",
    lastUpdate: hoursFromNow(-2.2),
    progressPercent: 12,
    timeline: buildTimeline("Awaiting Planning", new Date(DEMO_NOW.getTime() - 2.2 * 3600000)),
    documents: [],
    notes: [
      { id: "n1", author: "System", role: "System", at: hoursFromNow(-2.2), body: "Booking received, in planning queue." },
    ],
  },
  {
    id: "j-1031",
    reference: "FX-1031",
    customerReference: "PO-87905",
    customer: "Fox Distribution Ltd",
    status: "POD Uploaded",
    collection: {
      company: "Anglia Print",
      address: "Norwich Airport Estate",
      city: "Norwich",
      postcode: "NR6 6EG",
      windowStart: hoursFromNow(-30),
      windowEnd: hoursFromNow(-29),
    },
    delivery: {
      company: "Capital Office Supplies",
      address: "Park Royal",
      city: "London",
      postcode: "NW10 7NA",
      windowStart: hoursFromNow(-24),
      windowEnd: hoursFromNow(-23),
    },
    palletCount: 10,
    weightKg: 4100,
    goodsDescription: "Printed media, shrink-wrapped",
    driver: drivers[3],
    vehicle: vehicles[0],
    eta: hoursFromNow(-23),
    lastUpdate: hoursFromNow(-22.5),
    progressPercent: 100,
    timeline: buildTimeline("POD Uploaded", new Date(DEMO_NOW.getTime() - 30 * 3600000)),
    documents: [
      { id: "doc1", name: "POD FX-1031 signed.pdf", type: "POD", uploadedAt: hoursFromNow(-22.5), sizeKb: 318 },
      { id: "doc2", name: "Delivery photo.jpg", type: "Photo", uploadedAt: hoursFromNow(-22.6), sizeKb: 880 },
    ],
    notes: [
      { id: "n1", author: "Dale Morgan", role: "Driver", at: hoursFromNow(-22.5), body: "Delivered in full, signed by R. Owens. POD uploaded." },
    ],
  },
  {
    id: "j-1028",
    reference: "FX-1028",
    customerReference: "PO-87840",
    customer: "Fox Distribution Ltd",
    status: "Complete",
    collection: {
      company: "Bristol Glassworks",
      address: "Avonmouth Way",
      city: "Bristol",
      postcode: "BS11 9YA",
      windowStart: hoursFromNow(-52),
      windowEnd: hoursFromNow(-51),
    },
    delivery: {
      company: "Edinburgh Interiors",
      address: "Sighthill Industrial",
      city: "Edinburgh",
      postcode: "EH11 4DH",
      windowStart: hoursFromNow(-40),
      windowEnd: hoursFromNow(-39),
    },
    palletCount: 5,
    weightKg: 2750,
    goodsDescription: "Glazed panels (fragile)",
    specialInstructions: "Fragile — do not stack.",
    driver: drivers[0],
    vehicle: vehicles[3],
    eta: hoursFromNow(-39),
    lastUpdate: hoursFromNow(-38),
    progressPercent: 100,
    timeline: buildTimeline("POD Uploaded", new Date(DEMO_NOW.getTime() - 52 * 3600000)),
    documents: [
      { id: "doc1", name: "POD FX-1028.pdf", type: "POD", uploadedAt: hoursFromNow(-38), sizeKb: 264 },
      { id: "doc2", name: "Invoice INV-2041.pdf", type: "Invoice", uploadedAt: hoursFromNow(-12), sizeKb: 98 },
    ],
    notes: [
      { id: "n1", author: "System", role: "System", at: hoursFromNow(-12), body: "Job invoiced and closed." },
    ],
  },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    severity: "warning",
    jobReference: "FX-1039",
    title: "Delivery slot at risk",
    detail: "FX-1039 running ~70 mins late on the A38 into Plymouth.",
    at: hoursFromNow(-0.6),
  },
  {
    id: "a2",
    severity: "info",
    jobReference: "FX-1042",
    title: "Running ahead of slot",
    detail: "FX-1042 is ~20 mins ahead of the Newcastle window.",
    at: hoursFromNow(-0.4),
  },
  {
    id: "a3",
    severity: "critical",
    jobReference: "FX-1048",
    title: "Unplanned > 2h",
    detail: "FX-1048 has been awaiting planning for over 2 hours.",
    at: hoursFromNow(-0.1),
  },
];

export const emailRequests: EmailRequest[] = [
  {
    id: "e1",
    from: "purchasing@merciasteel.co.uk",
    subject: "Collection needed Thurs — Coventry to Leeds",
    receivedAt: hoursFromNow(-0.8),
    confidence: 0.92,
    status: "Pending",
    parsed: {
      customerReference: "MS-5521",
      collection: { company: "Mercia Steel", city: "Coventry", postcode: "CV5 9PA" },
      delivery: { company: "Leeds Fabrication", city: "Leeds", postcode: "LS9 0SE" },
      palletCount: 6,
      weightKg: 4200,
      goodsDescription: "Steel beams",
      requiredCollection: hoursFromNow(26),
      requiredDelivery: hoursFromNow(32),
    },
    rawSnippet:
      "Hi, can you collect 6 pallets of steel beams (approx 4.2t) from our Coventry site Thursday AM and run them up to Leeds Fabrication? Ref MS-5521. Thanks.",
  },
  {
    id: "e2",
    from: "logistics@lakelandfoods.com",
    subject: "Weekly run — Kendal",
    receivedAt: hoursFromNow(-2.1),
    confidence: 0.74,
    status: "Pending",
    parsed: {
      collection: { company: "Lakeland Foods", city: "Kendal", postcode: "LA9 6NZ" },
      delivery: { city: "Manchester" },
      palletCount: 6,
      goodsDescription: "Ambient food",
    },
    rawSnippet:
      "Morning — same as last week please, 6 pallets ambient from Kendal down to the Manchester depot. Let me know the slot.",
  },
  {
    id: "e3",
    from: "sarah@harbourretail.co.uk",
    subject: "URGENT delivery Plymouth",
    receivedAt: hoursFromNow(-3.4),
    confidence: 0.58,
    status: "Pending",
    parsed: {
      delivery: { company: "Harbour Retail Park", city: "Plymouth", postcode: "PL1 3EH" },
      goodsDescription: "Retail fittings",
    },
    rawSnippet:
      "Need something moved to Plymouth ASAP, will call with the collection details. Sarah",
  },
];

export const messages: Message[] = [
  { id: "m1", jobReference: "FX-1042", from: "Ops", author: "Steven Clarke", at: hoursFromNow(-0.4), body: "Tom's ~20 mins ahead of the Newcastle slot — all looking good.", unread: true },
  { id: "m2", jobReference: "FX-1039", from: "Ops", author: "Steven Clarke", at: hoursFromNow(-0.5), body: "Heads up: FX-1039 delayed on the A38, rebooked for 13:00.", unread: true },
  { id: "m3", jobReference: "FX-1045", from: "Customer", author: "Ian Fox", at: hoursFromNow(-1.6), body: "Can we add a tail-lift for the Manchester drop?" },
  { id: "m4", jobReference: "FX-1045", from: "Ops", author: "Steven Clarke", at: hoursFromNow(-1.55), body: "Done — moved it onto the 7.5t box with a tail-lift." },
];

export { drivers, vehicles };
