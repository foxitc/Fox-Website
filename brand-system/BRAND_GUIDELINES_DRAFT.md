# Fox ITC — brand guidelines (DRAFT)

Master index for the Fox ITC brand system. **DRAFT** — established items are live brand; everything else is proposed and gated (`APPROVAL_LOG.md`). Nothing here is deployed.

## Essence
- **Fox ITC** · product platform **Fox 360**. UK (Leicester) managed IT & cyber security for SMEs.
- Positioning: *IT that just works. People who actually care.* Values: Do It · Care 4 It · Own It · Simplify It (verify live wording before publishing).
- Voice: clear British English, plainspoken, outcome-led; no invented metrics or superlatives.

## Colour (established)
- Fox Orange `#FB471B` · Slate `#444B53`. Dark/ink and neutral tokens are **proposed/under decision** — see `RECONCILIATION.md` and `DESIGN_TOKENS_DRAFT.json`. Restrained orange; AA contrast everywhere.

## The signature (locked geometry)
Three Wi-Fi arcs from `assets/fox-arcs-original.png`. Exact masks only — photo window, watermark, solid, pulse (reduced-motion safe), cautious outline. Group transforms only. Proof + rules: `FOX_ARC_MASTER.md`, `FOX_ARC_COMPONENTS.md`, `fox-itc-v2/standards/FOX_ARC_SIGNATURE.md`.

## Build on
- **Web:** `assets/fox-ui.css` + `components/fox-arc-media.js`. Rules in `WEBSITE_UI_RULES.md`, `COMPONENT_LIBRARY.md`.
- **Pages:** homepage `preview/homepage.html`; industries `preview/industry-template.html` + `data/industries.json` (`INDUSTRY_LANDING_PAGES.md`).
- **Collateral (templates/):** `email-signature.html` (Outlook-safe), `flyer-a5.html` (bleed + QR), `social-pack.html` (LinkedIn/square/Fox Bytes).
- **Format recipes:** `fox-itc-v2/templates/*` (email/print/social/PowerPoint/web/demos/other).

## Quality & governance
- Pre-delivery score ≥ 18/20, no hard fail (`fox-itc-v2/standards/QUALITY_GATE.md`).
- Governance: `fox-itc-v2/standards/AI_AND_LEGAL.md`, `COPY_AND_FACTS.md`. Human sign-off for public claims, new case studies, legal/privacy, synthetic media. Verified case-study/testimonial slots hidden until supplied.

## Still to build (Phase 5 remaining, then Phase 6 deploy)
Beer-mat die-line template, PowerPoint 16:9 master, web-demo shell, demo-video/motion spec, newsletter template, TYPOGRAPHY/PHOTOGRAPHY docs — all to the kit's recipes. Then owner approval → controlled deploy with rollback.
