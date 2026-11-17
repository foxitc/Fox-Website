# TYPOGRAPHY

Status: **PROPOSED / staging**. Owner decision 2026-10-19: **Geist** (Inter fallback).

- **Primary:** `'Geist', Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`. Loaded from Google Fonts in `assets/fox-ui.css`. Install Geist for native apps/PowerPoint; it substitutes where unavailable.
- **Mono (numbers/metrics):** `'SF Mono','JetBrains Mono',monospace`.
- **Email:** web-safe only (Arial/Helvetica) — do not rely on Geist in email.
- **Scale:** headings 700–800, tracking −0.02em on large sizes; body min 16px; responsive clamp() on heroes.
- **Hierarchy:** one H1 per page; eyebrow (11–12px, 700, uppercase, +.14em, orange) → H2 → lead → body.
- **Accessibility:** AA contrast (4.5:1 text); visible `:focus-visible`; never set essential text as an image.
- **Logo lettering is locked artwork** — never re-set the wordmark in Geist.

Note: the **live site currently ships Inter + Syne headings**; adopting Geist there is a Phase 6 deploy step, not yet done.
