# Fox ITC brand system (living draft)

Parallel, non-destructive brand system for the Fox ITC website. **Nothing here is wired into live pages or deployed.** Established vs proposed vs approved is tracked in `APPROVAL_LOG.md`.

## In this folder now (Phase 0 + Phase 1)
- `PHASE0_AUDIT.md` — repository audit / inventory (verified existing).
- `FOX_ARC_MASTER.md` — the three-arc geometry, extraction workflow, geometry proof.
- `FOX_ARC_COMPONENTS.md` — the `FoxArcMedia` component API & usage rules.
- `DESIGN_TOKENS_DRAFT.json` — colour/type/shape tokens (established vs proposed).
- `APPROVAL_LOG.md` — what is established / done / proposed / gated.
- `components/fox-arc-media.js` — the one canonical component.
- `assets/masks/*` — exact per-arc alpha masks (+ outline rings). `assets/proof/*` — proof images.
- `preview/` — self-contained previews:
  - `hero-treatment.html` — **photo-in-arcs hero + watermark cards (the intended look)**
  - `foxarc-demo.html` — all component modes & orientations
  - `geometry-proof.html` — extraction proof (colour used only to prove the masks)

Master artwork (supplied, untouched): `../assets/fox-arcs-original.png`, `../assets/fox-wordmark-original.png`, `../assets/orientation-reference.png`.

## Previewing locally
From the repo root: `python3 -m http.server 8232` then open
`http://127.0.0.1:8232/brand-system/preview/hero-treatment.html` (and the other two).

## Pending (later phases, after approval)
Phase 2 three homepage concepts → Phase 3 component library + responsive upgrade on staging → Phase 4 hospitality & freight landing pages → Phase 5 full brand kit docs (`BRAND_GUIDELINES_DRAFT.md`, `TYPOGRAPHY.md`, `PHOTOGRAPHY.md`, `COMPONENT_LIBRARY.md`, `WEBSITE_UI_RULES.md`, `INDUSTRY_LANDING_PAGES.md`, `SOCIAL_MEDIA.md`, `PRINT_AND_BEER_MATS.md`, `EMAIL_AND_NEWSLETTERS.md`, `POWERPOINT_AND_PRESENTATIONS.md`, `WEB_DEMOS.md`, `VIDEO_AND_MOTION.md`, `AI_CONTENT_GOVERNANCE.md`, `AI_DESIGN_PROMPT.md`) + templates → Phase 6 owner approval + controlled deploy. **Stop before deployment.**
