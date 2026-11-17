# Cyber Essentials gap-closure — plan reconciled to the real repo

**Source brief:** `FOX-CYBER-GAP-SPEC.md` (benchmark: getcybercertified.uk).
**This doc:** how to actually build it in `foxitc/Fox-Website` as it is today.
Read this first — several of the spec's assumptions don't match the live repo.

---

## 1. The big reconciliation (spec ≠ this repo)

The spec was written for a different setup. Before building, translate it:

| The spec assumes… | The real `Fox-Website` is… | So we… |
|---|---|---|
| Repo `Fox-Tech-Solutions`, React **source** (`src/data/*.ts`, `Blog.tsx`) | **Compiled** React SPA bundle (no source) + **standalone HTML pages** + a thin FastAPI, deployed by GitHub Actions on push to `main` | Build new pages as **standalone HTML using the shared site chrome** (`site-chrome.js`), new tools as standalone HTML + vanilla JS, new backends as **FastAPI routes**. Avoid editing the compiled bundle. |
| **Odoo** lead capture (Phase 0 = fix Odoo) | **Odoo retired (PR #16).** Every lead goes to **Fox 360** `POST /api/pipeline/public/capture` via `send_to_360()`, with spam protection + UTM attribution already built | **Skip all Odoo work.** All tool/form leads use the existing 360 capture + spam guard. Phase 0's lead-capture task is already done. |
| **Postgres + Alembic + systemd timers** on the website VPS | **Stateless** FastAPI (`main.py`, `seo.py`, `seo_faq.json`) — no DB, no schedulers | Stateful/scheduled features (members accounts, renewal reminders, saved checklists, device lists, result caching) should live in **Fox 360** (it owns data + journeys + scheduling), with the website as UI/forwarder. *Decision for Ian (§4).* |
| `/opt/foxitc-site`, `deploy-live.sh`, port 8058 | GitHub Actions → VPS on push to `main`; Ian approves deploys | Ignore those paths. One branch per chunk, preview, deploy on Ian's OK. |

**Also:** this build session has no outbound network to third parties, so DNS /
HIBP / endoflife.date tools can be **written and unit-tested with mocks here**,
but must be **verified against live services on the VPS** (which needs egress).

## 2. Already done (big head start — not in the spec's view)

- **/tools hub** + **password checker/generator/passphrase** (spec 3.3 / 4.3) and **downtime cost calculator** — live standalone tools.
- **GEO/structured data + alt/aria** across standalone pages; the SPA routes already get a full server-side graph via `seo.py` (spec §11 largely covered).
- **Lead capture → Fox 360** + **spam protection** + **UTM attribution** (spec Phase 0 §1.1 — done, via 360 not Odoo).
- **FSF campaign page** with a 6-question readiness check wired to `POST /api/readiness` → 360 (spec 4.4, partial).
- **FSF page now uses the shared site header/nav** (this change) — it was a separate-looking micro-site; now it's part of foxitc.co.uk.

## 3. One structural constraint to plan around

Content lives in two places:
- **Existing marketing pages** (`/`, `/services/*`, `/pricing`, `/resources`) are in the **compiled SPA bundle** → editing their copy is brittle (no source).
- **New pages** are **standalone HTML** → easy, safe, in-pattern.

So: **build new things as standalone pages; minimise edits to the SPA bundle.**
Where the spec needs a fix to an existing SPA page (e.g. the broken "five
controls" list on `/services/cyber-security`, the "certified provider" wording),
the cleaner route is usually to **rebuild that page as a standalone HTML page**
served by a FastAPI route (overriding the SPA) rather than patch minified JS.

## 4. Recommended build order (adapted to this repo)

Buildable-here = standalone HTML/JS + FastAPI, deployable now. Needs-infra =
needs egress or 360-side work. Needs-decision = waiting on Ian.

### Step 1 — CE foundation + quick trust fixes *(buildable here)*
- **FSF header fix** — ✅ done (this change).
- **`<LastChecked>` + v3.3 "what changed in April 2026" block** as a reusable standalone snippet; add to the FSF page and the future CE hub (sourced + dated, `needsReview` for Mark).
- **Wording sweep**: no "certified provider / we certify / assessor" implying Fox certifies. (Audit standalone pages now; SPA strings flagged for a bundle pass or page rebuild.)
- **Shared stats source**: one `stats` JSON + render, with a source line (spec 1.3).
- **Certificate-search + Google-reviews links** (external, link-out only).

### Step 2 — the CE hub + packages *(buildable here; prices need Ian)*
- **`/cyber-essentials`** standalone page: what CE is (5 controls), what changed in 2026, who needs it, Fox's 5-step route, packages, FSF, CE+ explainer, FAQ (FAQPage schema). Make clear **certification is issued by an IASME-licensed Certification Body; Fox prepares/supports**.
- **Packages** from a config list, prices `[TBC]` rendered from config (never invented).

### Step 3 — the lead-gen tools *(buildable here; some need egress)*
- **Readiness self-check v2** (6 → 13 questions, per-control traffic light, printable PDF) — extends the working FSF tool → 360. *(here)*
- **Package finder** — client-side → 360 lead. *(here)*
- **Password checker + HIBP breach check + CE password rules** — enhance the existing tool (k-anonymity range API). *(needs egress to verify)*
- **Email security check** (SPF/DKIM/DMARC/MTA-STS) — standalone UI + FastAPI DNS backend with SSRF guards + tests. *(needs egress to verify)*
- **Version checker** (endoflife.date) — UI + backend sync + small cache. *(needs egress + a store)*

### Step 4 — renewal tracker + members area *(needs-decision: where state lives)*
The best retention tools, but they need storage + scheduled email + double
opt-in + accounts. Recommend building these in **Fox 360** (data + journeys +
scheduling), with the website providing the sign-up/login UI and forwarding via
API — consistent with "360 is the source of truth." Alternative: give the
website its own small DB + scheduler. **Ian to choose.**

### Step 5 — sector pages + resource hub *(sector pages here; hub touches SPA)*
- **Sector pages** (`/sectors/{slug}`: hospitality, logistics, professional services, …) as standalone HTML driven by a config — strong SEO, buildable now.
- **Resource hub** restructure touches the SPA blog → plan as a standalone `/resources`-style hub or a bundle change (bigger).

## 5. Decisions needed from Ian

1. **Where does CE state + scheduled comms live** — Fox 360 (recommended) or a new website DB? (Gates the renewal tracker + members area.)
2. **Package prices** (spec 8.2) — set in 360 or in website config.
3. **Certification Body partner** + referral URL (spec §9) — partner or not.
4. **Members area** — separate, or merged with the existing `/client-portal`.
5. **Content sign-off** — Mark Hutchinson for CE rules; who signs the legal/terms.
6. **Existing SPA-page fixes** (five-controls list, wording) — accept a careful bundle patch, or rebuild those pages as standalone HTML?
7. **PDF guides** — gated behind the email modal or open download.

## 6. What I'd do next (recommendation)

Ship **Step 1 + Step 2** first (CE hub + FSF polish + trust fixes) — all
buildable here with no infra, and they turn the FSF campaign into a proper CE
section of the site. In parallel, confirm **Decision #1** so the renewal tracker
(the strongest lead/retention tool) can start on the right foundation.

---
*Grounded in the live repo on 2026-11-17. Spec intent preserved; mechanics
adapted to `Fox-Website` (compiled SPA + standalone HTML + FastAPI→Fox 360).*
