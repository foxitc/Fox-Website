# POWERPOINT_AND_PRESENTATIONS

Status: **PROPOSED / staging**. Built to `fox-itc-v2/templates/POWERPOINT_AND_DEMOS.md`.

## Deliverable
`templates/fox-itc-master.pptx` — editable 16:9 master (13.333 × 7.5 in). Not rasterised slides; native editable text, shapes and chart.

- **Theme:** Geist (owner decision; falls back if not installed). Brand colours — ink `#15213A`, orange `#FB471B`, slate `#444B53`.
- **Layouts (reusable):** Cover (dark), Section divider (dark, opposite arc orientation), Content (light, footer + slide number + arc corner), Closing (dark).
- **12 slide types:** cover · agenda · section divider · problem/solution split · services overview (6) · industry use case · process/timeline · data/chart (native, **sample data labelled illustrative**) · case study (**placeholder — verified story only**) · team (real staff photos) · managed-support tiers (**prices pulled from Fox 360, not typed in**) · closing/contact. Primary CTA "Book a conversation".
- **Arc usage:** oversized crop on cover/closing, opposite-orientation watermark on the section divider, small corner mark on content — exact raster masks (`assets/fox-arcs-*.png`), never redrawn.

## QA
Schema/relationship/chart validation: **PASSED** (`scripts/office/validate.py`). Content/order: checked (`markitdown`), no stray placeholders beyond the intentional case-study slots. **Visual QA to be done in PowerPoint** — LibreOffice→image rendering is unavailable in this build environment, so slide images weren't generated here; open the file to review.

## Edit / regenerate
Generator: see the session's `build_pptx.js` (pptxgenjs). Edit text in PowerPoint directly, or rebuild from the generator. Charts stay native — replace the sample data with the client's real figures. Install Geist for exact typography; otherwise it substitutes.

Still to do: web-demo shell + demo-video/motion spec (`fox-itc-v2/templates/POWERPOINT_AND_DEMOS.md` covers both).
