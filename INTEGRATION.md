# Fox — 360 ↔ Website integration & coordination

**Two Claude build sessions, one brand.** This file is how the **Fox 360** repo
(`foxitc/todd-v2`, this chat) and the **foxitc.co.uk website** repo (the other
chat) stay in step. Both sessions read this file first, alongside
[`DESIGN_SPEC.md`](./DESIGN_SPEC.md) (the shared brand/design source of truth).

> Keep a copy of this file in the website repo too. When the contract changes,
> update it here first, then sync the copy.

---

## Two separate sites (don't conflate them)

- **`foxitc.co.uk`** = the public, customer-facing **website** (the website chat's repo). Marketing pages, campaign landings, the public booking page — everything a customer sees. All customer-facing links/QR/CTAs use this domain.
- **`360.foxitc.co.uk`** = the internal **Fox 360** app (this repo). Staff-facing. It is **not** a customer destination; it's the backend/source of truth that exposes the public APIs below for the website to consume.

Any tool/page that generates customer-facing output (flyers, emails, landing copy, QR codes) must target **`foxitc.co.uk`**, never `360.foxitc.co.uk`.

---

## Can the two chats be merged?

No — they're two separate Claude sessions and can't be fused into one
conversation, and neither can directly message the other. What makes them act
as one team is **shared files both sides build to** (this doc + `DESIGN_SPEC.md`)
and a **shared API contract** (below). That's the practical "merge": one source
of truth, two builders.

## How to direct a change (the convention)

When you ask for something, **say which side it's for**:

- **`[360]`** → changes in this repo (`foxitc/todd-v2`): the app, the backend
  APIs, the pricing/tiers source of truth, the `/za` and `/book` pages hosted at
  `360.foxitc.co.uk`. Handled in **this** chat.
- **`[website]`** → changes to `foxitc.co.uk` markup/pages/calculator wiring.
  Handled in the **website** chat.
- **`[both]`** → a brand/design or shared-contract change. Decide where the
  source of truth lives (usually: **design → website leads**, **prices/data →
  360 leads**), change it there, then tell the other chat to adopt it.

Default ownership:
- **Design/brand language** → website is authority → lives in `DESIGN_SPEC.md`.
- **Prices, tiers, bookings, leads, data** → 360 is authority → exposed via the
  public APIs below; the website consumes them.

---

## Shared API contract — what 360 exposes for the website to consume

All public, CORS-open (callable from `foxitc.co.uk`), no login/token unless noted.
Base: `https://360.foxitc.co.uk`

| Purpose | Endpoint | Notes |
|---|---|---|
| **Support tiers** (Essentials/Business/Complete — names, features, **price**) | `GET /api/tiers/public?region=` | Single source of truth for the tiers shown on the site + flyer. |
| **Quote calculator config** (per-user service prices) | `GET /api/analytics/calculator-config?key=` | Reads 360 `growth_pricing_lines`. Drives the website calculator. |
| Embeddable calculator widget | `GET /api/analytics/calculator.js` | `<script src=".../calculator.js" data-key="SITEKEY">` |
| Calculator lead capture | `POST /api/analytics/lead` | Lands a lead in the Growth pipeline. |
| **Booking — meeting types** | `GET /api/staff/booking/types` | `discovery` = 15-minute call. |
| **Booking — free slots** | `GET /api/staff/booking/slots?meeting_type=discovery` | Real calendar availability. |
| **Booking — book it** | `POST /api/staff/booking/book` | Creates a Teams invite + lead + notifies the team. |
| Hosted booking page (internal/fallback) | `GET 360.foxitc.co.uk/book?type=discovery` | Working reference. Customer buttons should use `foxitc.co.uk/book` (website), which embeds the booking API above. |
| **QR code** for any URL | `GET /api/marketing/qr?data=<url>&fmt=png&color=%23FB471B` | Used on flyers/print. |
| Website chat bridge | `POST /api/webchat/message` · `GET /api/webchat/poll?token=` | Visitor chat lands in the 360 Website Chat inbox. |
| Newsletter feed | `GET /api/newsletters/feed` | Published newsletters, generic + per-industry. |

**Price changes propagate automatically:** edit a tier or a pricing line in 360
→ the website's tiers/calculator and the flyer read the new value on next load.
Nobody re-types prices on the website.

---

## Todd publishing — pages API (agreed 2026-10-19)

Lets **Todd** create/edit public pages without a developer or a deploy. Full
design + guardrails in [`TODD_PUBLISHING.md`](./TODD_PUBLISHING.md) (website
repo). **360 is content authority** (authors + stores pages, owns the approval
gate + media); **website is design authority** (renders them from a brand-locked
block library, owns the reserved-route guard + SEO). Decisions locked: pages live
at **`/p/{slug}`**; **human approval gate ON** (draft→preview→publish); **content
pages only** (no core-page edits in v1); **not auto-added to nav**; **media via
the 360 library only** (no arbitrary image URLs).

**360 exposes (website consumes), CORS-open, published pages public / drafts token-gated:**

| Purpose | Endpoint | Notes |
|---|---|---|
| List published pages | `GET /api/pages/feed` | slug, title, updatedAt, nav flags → website sitemap (+ future nav opt-in) |
| Get a published page | `GET /api/pages/by-slug/{slug}` | the Page JSON (see model below); 404 if not published |
| Preview a draft | `GET /api/pages/preview/{slug}?token=` | token-gated; renders the draft before it's live |
| Resolve a media asset | `GET /api/media/{id}` | turns `media://` refs into real image URLs |

Authoring (create/update/publish/unpublish/revert) is **internal to 360** —
Todd's authenticated context — so there is **no new public write surface**; the
website only reads.

**Page model (360 owns the schema; website renders it):** `slug`, `status`
(draft|published|unpublished), `title`, `description`, `ogImage` (`media://`),
`blocks[]` (ordered, from the fixed block allow-list — `hero`, `rich-text`,
`feature-grid`, `stats`, `cta-band`, `faq`, `logos`, `image`, `quote`,
`pricing-table` [reads `/api/tiers/public`], `booking-cta` [→ `/book`]), `seo`,
`nav`, `meta` (author, version, timestamps). **Blocks only — never raw HTML/JS.**

**Build split / sequencing:** Phase 1 "walking skeleton" — **[360]** stands up
`pages/feed` + `by-slug` + `preview` + draft/publish + media; **[website]** builds
the `/p/{slug}` server-rendered renderer + the first 4 blocks (hero, rich-text,
feature-grid, cta-band) + sitemap + JSON-LD. Then grow the block library.

---

## Getting the code closer (options, not yet decided)

1. **Shared contract only (today).** Repos stay separate; both build to this
   file + `DESIGN_SPEC.md`; website consumes the 360 APIs. Lowest effort.
2. **Shared design tokens package.** Extract colours/type/components to one
   small package both repos import, so a token change updates both builds.
3. **Monorepo.** Website + 360 in one repo (shared components, one CI). Biggest
   move; strongest consistency.

---

## Status

- `DESIGN_SPEC.md` — shared, in this repo (website should hold a synced copy; website is design authority).
- Booking APIs — ✅ public + CORS; `/book?type=` deep-link live.
- QR — ✅ `/api/marketing/qr`.
- Support tiers source of truth + `/api/tiers/public` — being added in 360.
- Website adoption of the above — tracked in the website chat.
- Todd publishing (pages API) — ✅ contract agreed (2026-10-19); Phase 1 build not started. `[360]` builds the pages/media API + approval gate; `[website]` builds the `/p/{slug}` renderer + block library.
