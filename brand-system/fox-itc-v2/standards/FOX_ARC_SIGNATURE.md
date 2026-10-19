# Fox ITC signature: the exact three Wi-Fi arcs

## Non-negotiable geometry
The source-of-truth image is `assets/fox-arcs-original-236px.png` (236 × 236 pixels). The alpha source-derived image and the three individual masks are derivatives of this image. They are NOT new shapes. Do not approximate with circular CSS borders, stroke arcs, clip-path circles or generic Wi-Fi icons. Preserve each contour, cap, spacing, proportions and relative alignment.

## Allowed transformations
Rotate or reflect the **entire group** (including its three masks) for left/right/up/down variants. Uniform scaling and deliberate viewport cropping are allowed. For hero use, scale the symbol beyond the container and crop at edges; do not stretch non-uniformly. Never independently rotate, warp, shear or reposition a constituent arc.

## Treatments
- **Original:** original orange, for logos and graphic emphasis.
- **Watermark:** whole symbol at approx 3–9% visual opacity on light surfaces or 6–14% on dark, adjusted for legibility; never beneath dense text at distracting contrast.
- **Photo windows:** each arc gets an independently cropped, properly licensed image, clipped to its own original-source alpha mask. Three images can differ; their edges must match the mask exactly. Ensure recognisable content at small scale, or use solid version.
- **Pulse:** animate inner → middle → outer by opacity only, then ease out; avoid geometry morphing. Suggested cycle 2.4–3.6 seconds, paused/disabled for reduced-motion preference. Decorative only.
- **Outline:** permitted only if an exact contour offset can be derived from original shape without changing the overall silhouette; otherwise avoid.
- **Print:** prefer an approved vector master; the 236px raster source is insufficient for large-format, high-resolution production. Request/derive and approve vector first.

## Composition principles
Use a signature treatment in one or two major locations per page, not every card. Vary orientation across sections: hero right-facing, service banner left-facing, footer upward pulse, cropped background watermark. Treat original Fox ITC full logo as separate locked brand artwork; do not replace it with a decorative arc crop.

## Validation checklist
Overlay source and transformed-back masks at identical coordinates; inspect differences. Check image transparency, exact cap curvature, bounding boxes and separation of the three shapes. Verify at mobile/desktop and on light/dark backgrounds. If any mismatch, do not release.

## Implementation note
For web: render original PNG-derived alpha masks or an approved traced vector with `mask-image` / SVG masks. Store all three masks in one canonical coordinate system. Host assets locally; do not rely on hotlinked images. Provide `prefers-reduced-motion` fallback.
