# Fox ITC — AI Brand Brain Kit v2.0 (DRAFT)

**Purpose:** provide an AI content/design engine with machine-readable rules and actionable format recipes while keeping the current site content, services, pricing, routes and positioning unchanged.

**Approval status:** Brand signature geometry and direction are owner-supplied; varying whole-symbol orientation has been positively received. Layouts, font candidates, photography treatments, copy variants, new neutrals and template compositions are **PROPOSED**, not yet individually approved. This kit is operational for generating **drafts**. Unsupervised publication is NOT enabled until asset rights, claims and design templates have been approved and tested.

## Start here
1. Load `ai/SYSTEM_PROMPT.md` as the persistent instruction.
2. Load `ai/FORMAT_ROUTER.json` and `design-tokens.json`.
3. Load `standards/FOX_ARC_SIGNATURE.md`, `standards/QUALITY_GATE.md`, and the relevant `templates/*.md` for the requested asset.
4. Provide the asset folder (including the original PNG and the three source-derived masks). If you have a verified vector master, substitute it **only after** visual comparison.
5. Provide actual approved Fox ITC service/case-study/product facts from the current website or your content database. Never invent them.
6. Produce a brief + draft + QA report + editable source, and mark status DRAFT.

**Important:** These are detailed design recipes, not a set of fully designed, visually approved production templates. HTML, PPTX, print PDFs, and social images still need implementation and visual approval. `examples/` contains structured briefs, not finished creative.

## Contents
- `assets/` source-derived arc master, individual arc masks, original wordmark
- `design-tokens.json` machine-readable design system
- `standards/` logo/arc system, copy, accessibility, governance and QA
- `templates/` format-by-format composition and production instructions
- `ai/` system prompt, router, request schema, approval policy
- `examples/` example jobs for content generation
- `APPROVAL_REGISTER.json` decision status, version control
