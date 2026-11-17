# FOX_ARC_COMPONENTS — the FoxArcMedia component

Status: **PROPOSED** (implementation ready for review; treatments awaiting approval).

One canonical component: `brand-system/components/fox-arc-media.js` (dependency-free custom element `<fox-arc-media>`). It CSS-masks each layer with the exact arc masks; all three share one 1:1 coordinate box; rotation/mirroring is applied to the **group**.

## Attributes
| Attribute | Values | Default | Notes |
|---|---|---|---|
| `mode` | `solid` `photo` `watermark` `outline` `pulse` | `solid` | primary brand modes: **photo** and **watermark** |
| `fill` | CSS colour | `#FB471B` | solid/watermark/outline/pulse |
| `rotate` | `0` `90` `180` `270` | `0` | group transform |
| `flip` | `none` `h` `v` | `none` | group mirror |
| `opacity` | `0`–`1` | `1` (`0.06` for watermark) | whole motif |
| `src` | url | — | photo for all arcs (one image shows through) |
| `src-outer`/`src-middle`/`src-inner` | url | — | per-arc image (advanced) |
| `focal`/`focal-*` | `background-position` | `50% 50%` | focal point |
| `overlay` | CSS gradient | — | tint over photo |
| `base` | path | `/brand-system/assets/masks` | mask asset base |
| `label` | text | — | empty ⇒ decorative (`aria-hidden`); set ⇒ `role="img"` + `aria-label` |

## Usage
```html
<script src="/brand-system/components/fox-arc-media.js"></script>

<!-- hero photo inside the arcs -->
<fox-arc-media mode="photo" src="/img/support.jpg" focal="50% 40%" style="width:460px"></fox-arc-media>

<!-- low-contrast watermark behind a card -->
<fox-arc-media mode="watermark" fill="#15213A" opacity="0.06" style="position:absolute;right:-24px;top:-24px;width:120px"></fox-arc-media>

<!-- solid mark, rotated -->
<fox-arc-media mode="solid" rotate="90" style="width:120px"></fox-arc-media>
```

## Rules
- **Tasteful application** — not one motif in every card; lead with photo masks and watermarks.
- **Accessibility** — decorative by default (aria-hidden); watermarks stay low-contrast and never reduce text legibility; `pulse` animates layer opacity only (no geometry change) and is disabled under `prefers-reduced-motion`.
- **Fidelity** — only the masks define shape; never redraw with borders/strokes.

## Previews (self-contained, local assets)
- `preview/hero-treatment.html` — photo-mask hero + dark variant + watermark cards (the intended look).
- `preview/foxarc-demo.html` — all modes + orientations.
- `preview/geometry-proof.html` — extraction proof (colour used only to prove the three masks).
