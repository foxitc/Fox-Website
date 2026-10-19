# WEBSITE_UI_RULES

Status: **PROPOSED / staging** (Phase 3). Rules for applying Concept A "Clarity" across the site.

## Layout & rhythm
- Content column `.fx-wrap` (max 1160px), 24px side gutter, 16px on phones; **no horizontal scroll**.
- Vertical rhythm on a 4-point scale (4/8/12/16/24/32/48/64). Sections = 64px top/bottom.
- One idea per section: eyebrow → H2 → lead → content.

## Colour
- **Established:** Fox Orange `#FB471B` (actions, accents), slate `#444B53` (nav/body ink), ink navy `#15213A` (dark bands/headings).
- Neutrals (`#F7F8FA`, `#F2F4F7`, `#E6E8EC`, text `#1A1D21`/`#667085`) are **proposed** — logged in `DESIGN_TOKENS_DRAFT.json`, not yet approved.
- Orange is for emphasis, not large fills (except buttons/CTA). Text-on-orange and text-on-ink must stay AA (4.5:1).

## Typography
- `DESIGN_SPEC` proposes Geist/Inter; the **live site currently ships Inter + Syne (headings)**. Until reconciled, staging uses the system Inter stack. **Flagged for approval — do not switch the live font without sign-off.**
- Headings 700–800, tracking −0.02em on large sizes.

## The arc motif
- Lead with **photo masks** and **watermarks**; solid/outline sparingly. **Never** multi-colour arcs.
- Tasteful density — not one motif in every card; watermarks ≤ ~16% opacity and never reduce text contrast.
- Rotation/mirroring applies to the group; geometry is never redrawn (see `FOX_ARC_MASTER.md`).

## Content integrity (hard rules from the brief)
- Preserve existing service pages, descriptions, packages, **pricing**, canonical URLs, metadata and copy. Homepage copy unchanged without approval.
- No invented clients, stats, testimonials, certifications or employee photos. Case-study / testimonial slots stay **hidden until verified**.
- Industry pages link to existing services, never duplicate them.

## Accessibility & performance
- Keyboard-reachable nav and controls; visible focus ring (`:focus-visible`).
- `prefers-reduced-motion` respected (arc `pulse` becomes static).
- Decorative arcs are `aria-hidden`; meaningful images get real `alt`.
- Optimise/resize photography; set width/height; lazy-load below the fold. Target good Core Web Vitals before any rollout.

## Rollout (gated)
Staging only. No production deploy until Phase 6 owner approval + rollback plan. The live site is a compiled React SPA; applying this library to production is a separate, approved step.
