/**
 * qargoService — integration abstraction layer for the Qargo TMS.
 *
 * RIGHT NOW: every method resolves against the local mock dataset so the
 * prototype is fully interactive with zero external dependencies.
 *
 * LATER: swap the body of each method for a real Qargo Open API call. Qargo
 * authenticates with JWT access tokens and exposes endpoints to push/fetch
 * jobs, orders and documents plus real-time visibility. Because every screen
 * in the app talks ONLY to this service (never to raw data), wiring up the
 * live API is a change confined to this one file — the UI does not move.
 *
 * Suggested live shape (kept here as a guide, intentionally not wired up):
 *
 *   const QARGO_BASE = process.env.QARGO_API_BASE_URL;
 *   async function authHeader() {
 *     const token = await getQargoAccessToken(); // JWT, cached until expiry
 *     return { Authorization: `Bearer ${token}` };
 *   }
 *   // getJobs -> GET  {base}/v1/orders
 *   // createBooking -> POST {base}/v1/orders
 *   // updateJobStatus -> PATCH {base}/v1/orders/{id}
 *   // getDocuments -> GET  {base}/v1/orders/{id}/documents
 *   // getVehicleTracking -> GET {base}/v1/vehicles/{id}/positions
 */

import type {
  Job,
  JobDocument,
  JobStatus,
  Location,
} from "./types";
import { jobs as seedJobs } from "./data";
import { LIFECYCLE } from "./statuses";

// In-memory store so createBooking / updateJobStatus persist within a session.
let store: Job[] = seedJobs.map((j) => ({ ...j }));

const LATENCY_MS = 280; // simulate a network round-trip for realism
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export interface BookingInput {
  customerReference: string;
  collection: Location;
  delivery: Location;
  palletCount: number;
  weightKg: number;
  goodsDescription: string;
  specialInstructions?: string;
}

export interface VehicleTracking {
  vehicleReg: string;
  lat: number;
  lng: number;
  headingDeg: number;
  speedMph: number;
  updatedAt: string;
}

export const qargoService = {
  /** Fetch all jobs/bookings for the current customer. */
  async getJobs(): Promise<Job[]> {
    return delay(store.map((j) => ({ ...j })));
  },

  /** Fetch a single job by reference or id. */
  async getJobById(idOrRef: string): Promise<Job | undefined> {
    const job = store.find((j) => j.id === idOrRef || j.reference === idOrRef);
    return delay(job ? { ...job } : undefined);
  },

  /** Create a new booking. Returns the newly created job. */
  async createBooking(input: BookingInput): Promise<Job> {
    const seq = 1049 + store.length;
    const ref = `FX-${seq}`;
    const nowIso = new Date().toISOString();
    const job: Job = {
      id: `j-${seq}`,
      reference: ref,
      customerReference: input.customerReference,
      customer: "Fox Distribution Ltd",
      status: "Request Received",
      collection: input.collection,
      delivery: input.delivery,
      palletCount: input.palletCount,
      weightKg: input.weightKg,
      goodsDescription: input.goodsDescription,
      specialInstructions: input.specialInstructions,
      lastUpdate: nowIso,
      progressPercent: 5,
      timeline: LIFECYCLE.map((step, i) =>
        i === 0
          ? { status: step.status, label: step.label, at: nowIso }
          : { status: step.status, label: step.label },
      ),
      documents: [],
      notes: [
        {
          id: "n1",
          author: "System",
          role: "System",
          at: nowIso,
          body: "Booking received via customer portal.",
        },
      ],
    };
    store = [job, ...store];
    return delay(job);
  },

  /** Update the status of a job. */
  async updateJobStatus(idOrRef: string, status: JobStatus): Promise<Job | undefined> {
    const job = store.find((j) => j.id === idOrRef || j.reference === idOrRef);
    if (job) {
      job.status = status;
      job.lastUpdate = new Date().toISOString();
    }
    return delay(job ? { ...job } : undefined);
  },

  /** Fetch documents (PODs, CMRs, invoices) attached to a job. */
  async getDocuments(idOrRef: string): Promise<JobDocument[]> {
    const job = store.find((j) => j.id === idOrRef || j.reference === idOrRef);
    return delay(job ? [...job.documents] : []);
  },

  /** Fetch live vehicle tracking for a job's allocated vehicle. */
  async getVehicleTracking(idOrRef: string): Promise<VehicleTracking | undefined> {
    const job = store.find((j) => j.id === idOrRef || j.reference === idOrRef);
    if (!job?.vehicle || !job.collection.lat || !job.delivery.lat) {
      return delay(undefined);
    }
    // Interpolate a position along the collection→delivery line by progress.
    const t = job.progressPercent / 100;
    return delay({
      vehicleReg: job.vehicle.reg,
      lat: job.collection.lat + (job.delivery.lat - job.collection.lat) * t,
      lng: job.collection.lng! + (job.delivery.lng! - job.collection.lng!) * t,
      headingDeg: 12,
      speedMph: job.status === "Delayed" ? 8 : 54,
      updatedAt: new Date().toISOString(),
    });
  },
};

export type QargoService = typeof qargoService;
