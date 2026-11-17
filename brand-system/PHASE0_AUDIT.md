# Phase 0 — Repository audit & snapshot

Status: **VERIFIED_EXISTING** (facts about the current site; nothing here is a change).
Date: 2026-10-19. Branch: `claude/relaxed-albattani-pq5tmo` (off-production work branch).

## Framework & hosting
- **Backend:** FastAPI (`backend/main.py`) serves a compiled React SPA plus hand-built standalone HTML pages. SEO/meta injected by `backend/seo.py` (`render_index`). Lead capture posts to **Odoo CRM** (`crm.lead` via XML-RPC).
- **Frontend:** pre-compiled Vite/React bundle in `frontend/assets/index-*.js|css` (no editable React source in this repo). Static standalone pages live in `frontend/*.html`.
- **Deploy:** GitHub Actions `/.github/workflows/deploy.yml` → SSH/rsync to VPS `/opt/foxitc-site`; served by nginx + systemd (`foxitc-site.nginx`, `foxitc-site.service`). **`main` → production is automatic.** (This phase stays on a feature branch; nothing deploys.)
- **Analytics:** Google Analytics `G-PTJSGNL8J4` + Fox 360 analytics script. Support chat = Fox 360 iframe widget.

## Routes (served before the SPA catch-all)
| Route | Served by | Notes |
|---|---|---|
| `/` + SPA routes (`/services/*`, `/pricing`, `/about`, `/contact`, `/resources`, `/client-portal` …) | compiled bundle via `seo.render_index` | existing — **do not alter copy/pricing** |
| `/newsletters`, `/newsletters/{vertical}` | `newsletters.html` | Fox 360 feed |
| `/blog`, `/blog/{slug}` | `blog.html` / redirect | Fox 360 feed |
| `/industries`, `/industries/{vertical}` | `industries.html` | Fox 360 verticals manifest |
| `/ai-licence` | `ai-licence.html` | product page |
| `/tools`, `/tools/password-generator`, `/tools/downtime-calculator` | tool pages | client-side |
| `/book`, `/za` | `book.html`, `za.html` | Fox 360 booking API |
| `/{file}.png|jpg|svg|ico`, `/guides/{file}` | static | assets |

## Integrations (Fox 360 — `360.foxitc.co.uk`, CORS-open)
Blog/newsletter feeds, verticals manifest, booking (`/api/staff/booking/*`), calculator config, QR, chat. Contract in `INTEGRATION.md`; design authority in `DESIGN_SPEC.md`.

## Brand assets present
- Logos: `frontend/fox_logo.png`, favicons. Team headshots: `frontend/{ian,mark,lerato,Todd}.png`, `fabio navy.png`.
- **New (this phase):** `assets/fox-arcs-original.png`, `assets/fox-wordmark-original.png`, `assets/orientation-reference.png` (supplied masters, untouched).

## Tests / snapshot baseline
- No automated test suite in-repo. Baseline for this work = **visual previews + the geometry proof** under `brand-system/preview/` (self-contained, local assets). Recommend adding a smoke test (routes return 200, masks recompose identical) before any site-wide rollout.

## What this phase does NOT touch
Existing service pages, descriptions, packages, pricing, canonical URLs, metadata, copy, forms, analytics and deployment are **unchanged**. All new files are additive, under `assets/` and `brand-system/`, and are not wired into any live page.
