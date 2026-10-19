# Todd → website publishing — design & contract

**Status: proposal for review.** How **Todd** (the AI assistant in Fox 360,
`360.foxitc.co.uk`) creates and edits pages on the public website
(`foxitc.co.uk`) safely, on-brand, and without a developer in the loop for
everyday content.

This extends — it does not replace — the model already in
[`INTEGRATION.md`](./INTEGRATION.md): **360 is the content authority, the
website consumes 360 APIs.** Blog posts, newsletters and industry verticals are
*already* authored in 360 and rendered by the website from feeds
(`/api/blog/feed`, `/api/newsletters/feed`, `/api/marketing/verticals-manifest`).
Todd publishing is the same pattern, generalised to arbitrary pages.

---

## 1. The core principle

**Todd writes content; the website renders it. Todd never edits website code.**

The website is a compiled React app plus server-rendered pages. Hand-editing the
compiled bundle or raw HTML is brittle (Tailwind purging, minified JS, a prod
deploy per change) and unsafe to hand to an autonomous assistant. So:

- Todd authors a **Page** as structured data (JSON) in a 360 content store.
- The website has **one generic, server-rendered page renderer** that turns that
  data into a real page — site header/nav/footer, brand CSS, SEO/JSON-LD — on the
  fly, with no deploy and no code change.
- Pages are composed from a **fixed library of pre-built, brand-locked blocks**.
  Todd picks blocks and fills in copy/images; Todd cannot emit raw HTML or JS.

That one constraint (blocks, not markup) is what makes this safe: no XSS, no
brand drift, no broken layouts.

## 2. Two kinds of "change to the site" — keep them separate

| | **Content** (Todd's job) | **Code/structure** (dev's job) |
|---|---|---|
| Examples | New landing/campaign/service/industry page, blog post, announcement, editing copy & images on a Todd-authored page | Global nav/footer, pricing logic, new interactive tools, the design system, React components |
| Mechanism | Page data in 360 → rendered by the website | Normal dev workflow (this website chat / PR / review) |
| Deploy needed | **No** | Yes |
| Who ships it | Todd (within guardrails) | Human/dev. Todd may *propose*, a human applies |

Todd owns the left column. Everything in the right column stays with the dev
workflow — Todd can draft a proposal, but a person ships it.

## 3. The content model — what a "Page" is

A Page is a JSON document:

```jsonc
{
  "slug": "manufacturing-it-support",      // url-safe; namespaced (see §6)
  "status": "draft",                        // draft | published | unpublished
  "title": "IT Support for Manufacturers | Fox ITC",
  "description": "…150–160 chars for SEO…",
  "ogImage": "media://hero-manufacturing",  // from the 360 media library only
  "blocks": [                                // ordered, from the allow-list (§4)
    { "type": "hero",        "props": { "eyebrow": "Manufacturing", "heading": "IT that keeps the line running", "sub": "…", "cta": {"label":"Book a conversation","href":"/book"}, "image":"media://…", "arc":"corner" } },
    { "type": "feature-grid","props": { "items": [ … ] } },
    { "type": "faq",         "props": { "items": [ {"q":"…","a":"…"} ] } },
    { "type": "cta-band",    "props": { "heading":"…", "cta":{…} } }
  ],
  "seo":      { "noindex": false, "canonical": null },
  "nav":      { "show": false, "group": null },   // opt-in, gated (§6)
  "meta":     { "author": "todd", "version": 7, "updatedAt": "…", "publishedAt": "…" }
}
```

- **Blocks are the only way to build a page.** Each block type maps to a
  pre-built website component (the brand-system component library). Copy is plain
  text (escaped on render); images are references into the 360 **media library**,
  never arbitrary URLs.
- **Validated before publish:** known block types only, required props present,
  slug format + namespace legal, not a reserved route (§6).

## 4. The block library (the allow-list)

Start small, grow deliberately. v1 blocks (all already designed in the brand
system):

`hero` (incl. the arc-photo treatment ①) · `rich-text` · `feature-grid` ·
`stats` · `cta-band` · `faq` · `logos` · `image` · `quote` ·
`pricing-table` (renders live tiers from `/api/tiers/public` — never hard-coded) ·
`booking-cta` (deep-links `/book`).

Each block has a typed props schema. Todd composes pages only from these, so
every Todd page inherits the site's type, colour, spacing and the Fox arc
treatment automatically — on-brand by construction.

## 5. The API contract (add to INTEGRATION.md once agreed)

**360 exposes (website consumes), base `https://360.foxitc.co.uk`:**

| Purpose | Endpoint | Notes |
|---|---|---|
| List published pages | `GET /api/pages/feed` | slug, title, updatedAt, nav flags → drives sitemap + optional nav |
| Get a published page | `GET /api/pages/by-slug/{slug}` | the Page JSON; 404 if not published |
| Preview a draft | `GET /api/pages/preview/{slug}?token=` | token-gated; lets a human see a draft before it goes live |
| Media asset | `GET /api/media/{id}` | resolves `media://` refs to real image URLs on `foxitc.co.uk`'s CDN/path |

**Inside 360 (Todd's authenticated context — not public):** create / update /
publish / unpublish / revert a Page. Todd already runs inside 360, so authoring
is an internal 360 operation; the website only ever *reads*. This mirrors the
existing CORS-open read pattern — no new public write surface.

## 6. Guardrails (the important part)

- **Draft → preview → publish.** Todd creates drafts. A token preview URL shows
  the rendered page. Publish makes it live. **Recommended: a human approval gate**
  on publish for anything Todd generates autonomously (one click in 360).
- **Namespaced slugs.** Todd pages live under a reserved namespace (proposed:
  `/p/{slug}`, or `/campaigns/{slug}`). A **reserved-route list** (`/`, `/pricing`,
  `/services/*`, `/book`, `/za`, `/tools/*`, `/contact`, …) is rejected at
  validation, so Todd can **never** overwrite a core page.
- **Blocks only, no raw HTML/JS.** Eliminates XSS and off-brand markup. Text is
  escaped; images come from the media library only.
- **Versioned + reversible.** Every publish is a version; one-click rollback; full
  audit log (actor, timestamp, diff). Nothing is destructive.
- **Scope-limited.** Todd can create/edit content pages. Todd cannot touch code,
  global nav/footer, pricing logic, or the design system.
- **SEO/GEO automatic.** The renderer injects the same Organization / WebSite /
  WebPage / BreadcrumbList graph as the rest of the site (via `backend/seo.py`),
  plus block-derived schema (an `faq` block → `FAQPage`, a `pricing-table` →
  `Offer`s). Todd pages get our new AEO treatment for free.
- **Discoverable.** `sitemap.xml` reads `/api/pages/feed`.

## 7. How it renders (website side)

Server-rendered in FastAPI for GEO (no JS needed to see content):

1. Request hits `/p/{slug}` (or the catch-all checks the pages feed).
2. Backend fetches the Page JSON from `/api/pages/by-slug/{slug}` (short cache).
3. Renders site chrome + maps each block → its component → full HTML.
4. `seo.py` injects canonical, OG/Twitter, and the JSON-LD graph.
5. 404 if the slug is unpublished/unknown.

This is the same shape as the industry-landing template already in the repo —
one template, driven by a 360 document.

## 8. Ownership (fits INTEGRATION.md's split)

- **360 (data authority):** the content store, the publishing API, Todd, the
  media library, the approval gate.
- **Website (design authority):** the generic renderer, the block component
  library (brand-locked), `seo.py`, the reserved-route list.

## 9. Phased rollout

- **Phase 0 — Contract.** Agree the Page model + block schemas + API in
  INTEGRATION.md (both chats). *No code yet.*
- **Phase 1 — Walking skeleton.** 360: `pages/feed` + `by-slug` + `preview`.
  Website: generic renderer at `/p/{slug}` + 4 core blocks (hero, rich-text,
  feature-grid, cta-band) + sitemap + SEO. Todd can create → preview → publish a
  real page, live, no deploy.
- **Phase 2 — Block library.** Arc-photo hero ①, pricing-table (live tiers),
  faq, stats, logos, quote; the 360 media library.
- **Phase 3 — Safety UX.** Approval-gate UI, versioning/rollback, audit log,
  per-page analytics; optional nav opt-in (gated).
- **Phase 4 (optional) — Editable slots** on core pages (e.g. hero copy on the
  homepage) as tightly-scoped editable regions — never free code.

## 10. Decisions needed before Phase 1

1. **Route namespace** for Todd pages — `/p/{slug}` (clean, safe) vs
   `/campaigns/{slug}` vs arbitrary top-level slugs (riskier).
2. **Approval gate** — human-approves-before-live (recommended for autonomous
   Todd) vs Todd auto-publishes.
3. **Scope** — content pages only (recommended) vs also editable slots on core
   pages (Phase 4).
4. **Nav** — can Todd pages appear in the main menu, or campaign/QR-linked only?
5. **Media** — a 360 media library (recommended) vs an allowed-domain image list.

---

*This file lives in the website repo. Once agreed, copy the API contract section
into `INTEGRATION.md` and sync to the 360 repo (`foxitc/todd-v2`).*
