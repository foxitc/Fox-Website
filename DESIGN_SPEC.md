# Fox ITC — Shared Design Spec

**Single source of truth for anything with the Fox brand on it** — Fox 360 (this repo) *and* the foxitc.co.uk website. Both build sessions should read this first so pages come out consistent: same palette, type, components, voice and CTAs.

> How to use it: start each build session by pointing it at this file ("build to DESIGN_SPEC.md"). Keep a copy in the website repo too, and update this file (not a side note) whenever the brand language changes, so both stay in step.

---

## Brand

- **Name:** Fox ITC · product/platform: **Fox 360**.
- **What we are:** a UK-based (Leicester) IT managed service provider for SMEs.
- **Positioning line:** *IT that just works. People who actually care.*
- **Values (voice anchors):** Do It · Care 4 It · Own It · Simplify It.
- **Services (canonical wording):** Managed & ad-hoc IT support (per-user pricing) · Microsoft 365 migration · 3CX cloud phone systems · Supplier consultation · Reseller & procurement. Security-first, **ISO 27001** as the benchmark.
- **Contact / CTAs:** phone `0330 058 1877` · email `ian@foxitc.co.uk` · **primary CTA is always "Book a free IT review"** → the booking flow (`/book`) or a campaign landing page (e.g. `/za`).

## Colour (the actual tokens — don't invent new ones)

**Brand**
- Primary (Fox orange): `#FB471B`  — buttons, links, accents, active states.
- Accent (lighter orange): `#FC6C4C`  — hover/gradients.
- Gold: `#FFA800`  — sparingly, highlights.
- Ink / dark navy (headers, hero on marketing pages): `#15213A` (web) / `#1B4965` acceptable variant.

**Light theme**
- Page bg `#F7F8FA` · card `#FFFFFF` · input/muted-fill `#F2F4F7` · hover `#F7F8FA`
- Text: primary `#1A1D21` · secondary `#667085` · muted `#98A2B3`
- Border `#E6E8EC` · strong border `#D0D5DD`

**Dark theme** (support it; mirror the light tokens)
- Page bg `#0d1017` · card `#171a25` · input `#1e2130`
- Text: primary `#e8eaf0` · secondary `#a0a5b8` · muted `#636879`
- Border `#262a38` · strong `#323748`

> Define these as CSS variables on `:root` and redefine under a dark-mode block. Every surface sets an explicit background.

## Type & shape

- **Sans:** `'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`
- **Mono** (numbers/metrics): `'SF Mono', 'JetBrains Mono', monospace`
- **Headings:** 700–800 weight, tight letter-spacing (`-0.02em`) on big headings.
- **Radii:** sm `6px` · md `10px` · lg `16px` · xl `20px`. Pills/CTAs: fully rounded (`999px`).
- **Spacing:** 4-point scale (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).

## Components (match these so 360 and the site feel like one brand)

- **Primary button:** orange `#FB471B` bg, white text, radius `999px` (marketing) or `10px` (app), weight 600–700; hover → accent `#FC6C4C`.
- **Secondary button:** transparent/`#F2F4F7` fill, 1px border `#E6E8EC`, primary text.
- **Card:** white bg, 1px `#E6E8EC` border, radius `16px`, soft shadow (`0 2px 10px rgba(21,33,58,.04)`), 20–24px padding.
- **Pill/badge:** small, rounded `20px`, tinted bg of the status colour at ~12–18% + that colour as text.
- **Section eyebrow:** 10–11px, 700, uppercase, letter-spacing `.06em`, in muted or primary.
- **Status colours:** success `#16a34a` · warning `#d97706` · danger `#dc2626` · info `#2563eb`.

## Marketing / public-page pattern (the house style)

Reference implementation in this repo: **`frontend/src/pages/LandingZA.js`** (`/za`) and **`FlyerStudio.js`** — build website pages to match these.

1. **Top bar:** logo left, a primary **Book a free IT review** button right.
2. **Hero:** dark ink background (`#15213A` → `#22304f` gradient), white text, an orange eyebrow chip, an 800-weight headline (~46px, tight), one-line subhead, a big orange pill CTA.
3. **Services:** auto-fit card grid (`minmax(300px,1fr)`), each card = emoji/icon + 800 title + short benefit-led body.
4. **Why Fox:** 3 short value columns (per-user pricing · one point of contact · UK expertise).
5. **Final CTA band:** headline + orange pill CTA + fallback email.
6. **Footer:** `© year · Fox ITC · foxitc.co.uk`.
- Responsive: 16px side gutter, single column on phones, no horizontal scroll.
- Always print-safe if it can be a flyer/PDF (`print-color-adjust: exact`).

## Voice & copy

- Warm, direct, benefit-led, UK English. No jargon, no ticket-number coldness, no upselling nonsense.
- Lead with the customer's outcome ("IT that just works"), then how. StoryBrand framing: customer is the hero, Fox is the guide.
- Every marketing page ends with **Book a free IT review**.

## Domains & links — TWO SEPARATE SITES

- **`foxitc.co.uk`** — the public, customer-facing **website** (separate build/repo). All marketing, campaign landing pages and the public booking experience live here. **Every customer-facing link, QR code and CTA uses this domain.**
- **`360.foxitc.co.uk`** — the internal **Fox 360** business app (this repo). Staff-facing; not a customer destination. It exposes the public APIs the website consumes (see `INTEGRATION.md`).
- Booking: the public booking page + campaign landings live on the website — **`foxitc.co.uk/book`**, **`foxitc.co.uk/za`** — powered by the 360 booking API. (360 also hosts a working `/book` + `/za` as an internal/fallback reference, but customer assets point at `foxitc.co.uk`.)
- Primary CTA is always **Book a free IT review**.
