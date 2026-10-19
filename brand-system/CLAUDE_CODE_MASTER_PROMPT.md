# FOX ITC — CLAUDE CODE MASTER IMPLEMENTATION BRIEF

You are working inside the EXISTING foxitc.co.uk repository. This is a UI/UX upgrade and an extension for industry campaign landing pages, NOT a rewrite of the business, services, pricing, copy or positioning. Read this whole brief before changing files.

## Absolute constraints
1. Audit the current framework, routes, content, SEO, forms, analytics, CRM, integrations and deployment before editing. Produce an inventory and snapshot/tests. Do not deploy or modify production without explicit approval.
2. Preserve existing service pages, service descriptions, packages, pricing, canonical URLs, metadata, functionality and existing copy. Do not replace existing headlines unless separately approved. No invented clients, statistics, testimonials, certifications, photos of purported employees or claims.
3. Use the ORIGINAL artwork in assets/fox-arcs-original.png as the sole geometric master for the signature three-arc motif; use assets/fox-wordmark-original.png for the official logo. Do not approximate the arcs with CSS borders, SVG stroke circles or newly drawn curves. Create a non-destructive, verifiable alpha-mask/vector workflow. If vector source exists in repository, prefer that after verifying shape alignment against the supplied reference. The three shapes must retain exact relative spacing, end caps and proportions. Rotations, mirroring, cropping, scaling and fills are allowed; do not reshape the arcs. Mirror/rotate the GROUP, not individual shapes.
4. Any new branding is PROPOSED, not approved. Maintain separate status fields for established, proposed, approved, rejected. Do not silently change established rules.
5. Implement accessible responsive design, keyboard access, reduced motion, proper alt text, performance budgets, image optimization, real metadata and structured data only where grounded.

## Signature visual system
Create a reusable FoxArcMedia component with: mode=solid|photo|watermark|outline|pulse, orientation=source|left|right|up|down|custom, scale, crop, per-arc media sources and focal points, optional overlay, opacity, responsive sizing, reduced-motion fallback. Each arc is a separately addressable mask but all share one fixed coordinate system. The photo variant places a separate photo INSIDE each exact arc. For pulse, animate opacity of inner, middle, outer arcs sequentially without changing the path geometry. Do not animate in a way that distorts shape. Watermarks should be low contrast and never obscure text. Support dark and light sections and varying orientation across pages. Use tasteful application, not one motif in every card.

Create a geometry-validation preview that overlays the source artwork and extracted masks at equal dimensions, with a difference image or pixel-comparison summary. If the result diverges from the source, stop and request a better vector source. Include a visual test at desktop and mobile. Keep a single canonical asset/component to avoid drift.

## Site design
Refresh spacing, layout, typography, iconography, buttons, photography treatment, nav presentation, footer, responsiveness and micro-interactions. Use Fox Orange #FB471B and existing slate #444B53; proposed neutrals must be logged for approval. Keep real logo and brand voice. Reference centralitsolutionsltd.com for quality, clarity, visual rhythm and conversion—not its proprietary triangles, content, imagery or layout. Produce 3 clearly distinct homepage UI concepts before broad implementation, each showing exact FoxArc masks. Do not overwrite existing homepage copy without approval.

## Industry landing pages
Create a reusable data-driven IndustryLandingPage template. Initial proposed URLs:
- /industries/hospitality
- /industries/freight-logistics
- /industries/professional-services
- /industries/construction

Only hospitality and freight/logistics require fully developed initial concept pages; the other two may remain unpublished drafts until relevant content is approved. Preserve all existing service routes. Each industry page links to existing services rather than duplicating them.

Each landing page includes: sector-relevant hero; tailored challenge/solution modules grounded in real services; service links; verified case study/testimonial slot (hide when unverified); people-first trust section; concise contact form or CTA; relevant FAQs only where fact-checked. Hospitality examples: EPOS, guest Wi-Fi, venue networking, audio, connectivity, support. Freight examples: multi-site support, warehouse Wi-Fi, connectivity, cybersecurity, Microsoft 365, mobility. Do not assert sector-specific experience without evidence from existing website or owner.

Support marketing source and campaign tracking via UTM parameters, privacy-conscious analytics and optional controlled headline/image variants. Never allow arbitrary URL parameters to inject HTML. Do not create duplicate indexable pages for each UTM combination; maintain canonical URLs. Create a config schema to add new industry pages without new layout code. Include form attribution fields with lawful privacy handling. Support SEO descriptions and social share previews for each approved landing page.

## Brand system maintained in parallel
Maintain brand-system/BRAND_GUIDELINES_DRAFT.md, DESIGN_TOKENS_DRAFT.json, FOX_ARC_MASTER.md, FOX_ARC_COMPONENTS.md, TYPOGRAPHY.md, PHOTOGRAPHY.md, COMPONENT_LIBRARY.md, WEBSITE_UI_RULES.md, INDUSTRY_LANDING_PAGES.md, SOCIAL_MEDIA.md, PRINT_AND_BEER_MATS.md, EMAIL_AND_NEWSLETTERS.md, POWERPOINT_AND_PRESENTATIONS.md, WEB_DEMOS.md, VIDEO_AND_MOTION.md, AI_CONTENT_GOVERNANCE.md, AI_DESIGN_PROMPT.md, APPROVAL_LOG.md. For each item distinguish VERIFIED_EXISTING vs PROPOSED vs APPROVED. Never imply draft templates are approved.

Coverage: A4/A5 flyers with bleed and QR placement; beer mats round/square; social/LinkedIn carousels; newsletters/blogs; Outlook-safe email signatures; PowerPoint 16:9 slide masters, title/section/data/case-study/closing slides; web demo presentation shells, product walkthrough frames, browser mockups, animated logo intros, transitions and lower thirds. Use the same canonical arc masks and orientation rules for all formats.

## AI transparency and content governance
The EU AI Act does NOT generally require labelling a standard website because AI helped code it. Do not build AI-detection evasion, metadata stripping or provenance obfuscation. Add editorial review workflow for public copy, claims, synthetic media and licences. Identify interactive AI chatbots clearly; assess deepfake disclosure and public-interest text disclosure where applicable. Preserve applicable content credentials and source metadata; don't fabricate provenance. Record human approval of public-facing claims. Consider UK and EU territorial/legal scope; flag issues for legal review rather than assuming blanket application.

## Work plan and acceptance criteria
Phase 0: repo audit, route/content snapshot, test baseline, verify logo assets.
Phase 1: exact arc extraction and geometry proof + orientation/pulse/photo demo, with all assets local and self-contained preview (no missing images or third-party image dependencies).
Phase 2: three desktop/mobile homepage UI concepts, existing content unchanged; approval gate.
Phase 3: approved UI component library, responsive site visual upgrade on staging; regression tests.
Phase 4: hospitality and freight landing pages on staging, tracked conversions, approved copy; no fabricated proof.
Phase 5: draft brand kit and reusable templates, visual QA, accessibility and performance tests.
Phase 6: owner approval, then controlled deployment and rollback plan.

At every phase provide: changed file list, preview URL or local instructions, screenshots, what remains unchanged, what is awaiting approval, and test results. Stop before deployment. Begin with Phase 0 and Phase 1, not an unreviewed full-site rewrite.
