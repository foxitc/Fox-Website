# Fox ITC approval log

## Verified / supplied (established)
- Fox Orange #FB471B; secondary slate #444B53 (user-established)
- Supplied official Fox ITC wordmark and three-arc artwork (`assets/*-original.png`)
- UI/UX refresh only for existing website and service pages
- New industry-specific marketing landing pages are desired
- Signature arc group may rotate, mirror, crop, pulse and act as image mask or watermark; original geometry must be preserved
- Brand system must include web, print, beer mats, newsletters, social, PowerPoint, web demos and video

## Done & verified (this work — additive, off-production, not wired to live pages)
- **Phase 0** — repo audit/inventory: `PHASE0_AUDIT.md`
- **Phase 1** — exact arc extraction + geometry proof: 3 masks recompose **byte-identical** to the source (0 mismatched px). Component `fox-arc-media.js`; previews `preview/{geometry-proof,foxarc-demo,hero-treatment}.html`.
- Confirmed intended use = **photo mask + watermark** (the multi-colour view is proof-only, not a brand treatment).

## Phase 2 — three homepage concepts (PROPOSED, pick one)
Direction approved by owner 2026-10-19 (photo-mask + watermark). Concepts are mockups, not wired to live pages, nothing deployed. Existing homepage copy/services preserved.
- `preview/concepts/concept-a.html` — **Clarity**: light, editorial, photo hero + values grid + team row.
- `preview/concepts/concept-b.html` — **Bold Ink**: dark high-contrast hero, stats, dark split band.
- `preview/concepts/concept-c.html` — **Systemised**: modular bento grid, numbered services, people bar.
Awaiting owner pick (one concept, or a blend) before Phase 3 (component library + responsive build on staging).

## Phase 3 — component library + staging homepage (IN PROGRESS)
Concept A approved by owner 2026-10-19. Delivered on the work branch (staging; nothing deployed):
- `assets/fox-ui.css` — reusable component library (tokens + header/hero/cards/values/team/CTA/footer).
- `preview/homepage.html` — canonical Concept A homepage built entirely on the library.
- `COMPONENT_LIBRARY.md`, `WEBSITE_UI_RULES.md`.
Remaining in Phase 3: apply the library to other page types (service/industry/contact) + add regression smoke tests. Then Phase 4 (hospitality + freight landing pages). Still no production deploy (gated to Phase 6).

## Phase 4 — hospitality & freight landing pages (DELIVERED, staging)
Data-driven `IndustryLandingPage`: `preview/industry-template.html` + `data/industries.json` (`INDUSTRY_LANDING_PAGES.md`). Two pages built — `?industry=hospitality`, `?industry=freight-logistics` — grounded in real services, case-study slots hidden (none verified), FAQ structured data, UTM passthrough to booking with clean canonicals. Professional-services & construction left as unpublished drafts. Staging only; nothing deployed. Awaiting owner review of copy + real photography.

## Proposed, NOT approved
- Specific homepage layouts, typography changes (incl. Geist vs live Syne), photography, neutral palette, landing-page copy and visual treatments
- The photo/watermark hero treatments shown in `preview/hero-treatment.html`
- Proposed new industry pages beyond hospitality and freight
- Primary CTA wording "Book a free IT review" shown in concepts (spec direction; site-wide rollout still gated)

## Gate (unchanged)
No new design direction, replacement copy or production deployment is approved merely by appearing in the brief or in these drafts. **Next step requires explicit owner sign-off** before Phase 2 (3 homepage concepts) begins. Nothing in this work deploys.
