# INDUSTRY_LANDING_PAGES

Status: **PROPOSED / staging** (Phase 4). Built on `fox-ui.css` + `FoxArcMedia`.

## Data-driven — add a page with no layout code
- **Template:** `preview/industry-template.html` (renders any industry).
- **Config:** `data/industries.json`. Add an industry = add one entry; the template renders it. No new markup.
- Preview: `preview/industry-template.html?industry=hospitality` · `?industry=freight-logistics`.
  Proposed production URLs: `/industries/hospitality`, `/industries/freight-logistics` (server-side meta at deploy time).

## Each page (per brief)
Sector hero → grounded challenge/solution modules (each links to a **real existing service**) → service links → **verified case-study slot (hidden until supplied — currently null)** → people-first trust → grounded FAQs (+ FAQ structured data) → Book-a-free-IT-review CTA.

## Config fields
`slug, label, seo{title,description,ogImage}, canonical, hero{eyebrow,h1,p,image,focal}, intro, modules[]{icon,challenge,solution,service,href}, caseStudy(null|{title,body}), faqs[]{q,a}, cta{h,p}`.
Icons: `server, wifi, plug, shield, mail, phone`.

## Grounding & integrity (hard rules)
- Copy describes **real Fox services** applied to the sector — no "we have N years in X" claims, no invented clients/stats/testimonials.
- Services link to existing routes; pages never duplicate service content.
- `caseStudy: null` ⇒ slot omitted entirely.

## Campaign tracking & SEO
- **UTM** (`utm_source/medium/campaign/term/content`) are allow-listed, length-capped, URI-encoded and appended only to the booking link — **never injected into HTML**. `?industry=` is validated against an allowlist.
- **Canonical** is always the clean `/industries/{slug}` URL — UTM variants are not separately indexable (no duplicate pages).
- Per-page `<title>`, meta description and Open Graph/Twitter image for social previews.

## Only hospitality & freight are developed
Professional-services and construction remain **unpublished drafts** until content is approved (add entries to the config when ready).
