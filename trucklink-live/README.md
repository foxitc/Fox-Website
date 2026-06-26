# TruckLink Live

A premium, investor-demo-ready prototype of a **transport customer portal + internal operations control centre** for a nationwide trucking company — the customer-facing front door that sits *on top of* the Qargo TMS rather than replacing it.

Built for Fox as the visual prototype described in the build spec. Everything runs on mock data today and is structured so the real Qargo Open API drops into a single integration file later.

```
Customer Email / Portal / API
        ↓
Fox Customer Booking Layer   ← this app (own DB in the middle)
        ↓
Qargo TMS API                ← src/lib/qargoService.ts
        ↓
Jobs / Orders / Drivers / Vehicles / PODs / Status
        ↓
Customer Dashboard + Notifications
```

## Run it

```bash
cd trucklink-live
npm install
npm run dev
# open http://localhost:3000
```

## What's in here

### Customer portal (light, mobile-first)
| Route | Screen |
|-------|--------|
| `/dashboard` | KPI cards (Active / On-time / Delayed / Completed) + active jobs |
| `/jobs` | Searchable, filterable job list (grid & table views) |
| `/jobs/[ref]` | Job detail — route, load, live timeline, driver/vehicle, notes, documents |
| `/new-booking` | Full booking form → creates a job → confirmation screen |
| `/messages` | Customer ↔ ops chat thread |
| `/account` | Company details & settings |

On mobile the same routes render with a floating bottom navigation (Home / Jobs / New / Messages / Account), Revolut/Instagram style.

### Internal operations (dark control centre)
| Route | Screen |
|-------|--------|
| `/ops` | KPIs, live UK fleet map, alerts panel, filterable jobs board |
| `/ops/email-requests` | AI-parsed inbound email → draft jobs with confidence scoring, approve / edit / reject |

Switch between the two worlds via the sidebar links ("Ops Control Centre" / "Customer Portal").

## Status system

`src/lib/statuses.ts` defines the full lifecycle and colour tones:
green = confirmed/on-time/delivered · blue = in progress · amber = delayed/waiting · red = exception · purple = POD/document stage.

## Qargo integration (the important bit)

Every screen reads/writes **only** through `src/lib/qargoService.ts` — never raw data. Today each method resolves against an in-memory mock store; to go live you replace the body of each method with a Qargo Open API call (JWT bearer auth) and the UI does not change.

```ts
qargoService.getJobs()
qargoService.getJobById(idOrRef)
qargoService.createBooking(input)
qargoService.updateJobStatus(idOrRef, status)
qargoService.getDocuments(idOrRef)
qargoService.getVehicleTracking(idOrRef)
```

### Suggested roadmap
- **Phase 1** — Email inbox → AI extracts job → ops dashboard → manual Qargo sync.
- **Phase 2** — Portal booking form → create booking directly in Qargo via API.
- **Phase 3** — Pull live Qargo status, driver, vehicle, POD and ETA back into the portal.
- **Phase 4** — Multi-customer/multi-tenant booking app: every customer logs jobs, tracks progress, messages ops, downloads PODs and sees reports.

Keeping our own database in the middle is deliberate — it owns customers, permissions, notifications, branding, comments, email history and reporting, so we're never locked into Qargo.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react. shadcn/ui-style primitives are hand-rolled in `src/components/ui` (no external Radix dependency) to keep the prototype self-contained.

> Prototype only — mock data, no real auth or backend. Branding uses the Fox palette (orange `#f97415` + dark navy).
