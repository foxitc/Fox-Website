# FOX_ARC_MASTER — the signature three-arc geometry

Status: geometry **VERIFIED_EXISTING** (extracted from the supplied master); treatments **PROPOSED**.

## Source of truth
- **Master artwork:** `assets/fox-arcs-original.png` (236×236, orange `#FB471B` on white, no alpha).
- **Official logo:** `assets/fox-wordmark-original.png`. **Orientation board** (exploratory, *not* the master): `assets/orientation-reference.png`.
- The arcs are **never** approximated with CSS borders or SVG strokes. All treatments use the exact extracted masks.

## Extraction workflow (non-destructive, reproducible)
1. Un-multiply the shape over white to recover an anti-aliased alpha: `a = max((255-G)/(255-71), (255-B)/(255-31))`, guarded to reddish pixels only → `fox-arc-full.png`.
2. Label the binary core (alpha>0.5, 8-connectivity) → exactly **3 components**.
3. Assign every remaining shape pixel to its nearest arc by multi-source BFS (so masks recompose exactly).
4. Export per-arc alpha masks on one shared 236×236 coordinate box.
5. Outline masks = `mask − erode(mask)` (geometry-true rings), for `mode="outline"`.

Scripts and the master live in-repo; if a cleaner **vector** source is supplied, re-run and re-verify before use.

## Geometry facts (measured)
Three concentric quarter-arcs centred on the **bottom-right corner**:

| Arc | Mask | Radius band (from corner) | Area (px) |
|---|---|---|---|
| outer | `fox-arc-outer.png` | 179.9 – 238.1 | 15,808 |
| middle | `fox-arc-middle.png` | 86.1 – 141.9 | 8,380 |
| inner | `fox-arc-inner.png` | 6.4 – 54.7 | 1,923 |

Relative spacing, end caps and proportions are preserved exactly — only the **group** may rotate, mirror, crop, scale or be filled.

## Geometry proof
`preview/geometry-proof.html` overlays source vs extracted at equal dimensions with a diff image.
**Recompose (outer ∪ middle ∪ inner) is byte-identical to the source — 0 mismatched pixels, 100.0000%.**

## Correct use (important)
- ✅ **Photo mask** — one photo shows through the arc shapes (hero imagery).
- ✅ **Watermark** — low-contrast, behind text, never obscuring it.
- ✅ Solid / outline / pulse, in brand colours only.
- ❌ **Not** multi-colour "rainbow" arcs — the orange/blue/green view exists *only* in the geometry proof to show the three masks are distinct.
