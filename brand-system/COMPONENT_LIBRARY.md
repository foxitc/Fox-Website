# COMPONENT_LIBRARY — fox-ui.css

Status: **PROPOSED / staging** (Phase 3). Direction = Concept A "Clarity" (owner-approved 2026-10-19). Nothing wired to live pages.

One stylesheet — `brand-system/assets/fox-ui.css` — plus the `FoxArcMedia` component. Add both, put `class="fx"` on `<body>`, compose with the classes below. Tokens mirror `DESIGN_TOKENS_DRAFT.json`.

```html
<link rel="stylesheet" href="/brand-system/assets/fox-ui.css">
<script src="/brand-system/components/fox-arc-media.js"></script>
<body class="fx"> … </body>
```

## Components
| Class | Purpose |
|---|---|
| `.fx-wrap` | 1160px max content column, 24px gutter |
| `.fx-header` / `.fx-header__in` / `.fx-nav` | sticky translucent header + nav |
| `.fx-btn` + `--pri` / `--ghost` / `--sm` | pill buttons (primary = Book a free IT review) |
| `.fx-eyebrow` | orange uppercase section label |
| `.fx-hero` / `.fx-hero__grid` / `.fx-stage` | split hero; `.fx-stage__main` = photo-in-arcs, `.fx-stage__accent` = solid accent arc |
| `.fx-section` + `--alt` / `--line` | section rhythm (64px), alt background, top divider |
| `.fx-grid` + `.fx-card` | auto-fit card grid; `.fx-card__wm` = arc watermark, `.fx-card__ic` = icon chip |
| `.fx-value` | "why us" tile |
| `.fx-team` / `.fx-person` | people-first trust row |
| `.fx-chips` | accreditation/logo row |
| `.fx-cta-band` | dark final CTA band with arc watermark |
| `.fx-footer` | footer |

## Arc usage (via FoxArcMedia)
- Hero imagery → `mode="photo"` (one photo through the arcs).
- Behind cards / bands → `mode="watermark"` at 6–16% opacity.
- Accent → `mode="solid"` low-opacity, rotated. Never multi-colour.

## Reference build
`preview/homepage.html` is the canonical Concept A homepage built entirely on this library. Other page types (service, industry, contact) adopt the same classes next.
