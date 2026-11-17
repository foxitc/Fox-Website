# Brand-kit reconciliation — website brand-system ↔ AI Brain Kit v2

The owner-supplied **AI Brand Brain Kit v2** is vendored at `brand-system/fox-itc-v2/` (unchanged). This note maps it to the website's `brand-system/` and lists the few points that need an owner decision. Per `INTEGRATION.md`, the **website owns the canonical design authority (`DESIGN_SPEC.md`)**; the kit is owner-supplied input, so conflicts are flagged, not silently resolved.

## Already in agreement (no action)
| Area | Both say |
|---|---|
| Arc geometry | Locked; transform whole group only; exact masks from the 236px master; no circle strokes; overlay/diff validation |
| Treatments | solid · watermark · photographic · pulse (+ cautious outline); reduced-motion required |
| Orientation | source/left/right/up/down via group transforms |
| Content policy | preserve existing services/copy/**pricing**/routes; no fabricated clients/stats/testimonials; human approval before publication |
| Direction | premium, people-first, restrained orange, generous whitespace, authentic photography |
| Industry pages | reusable config template; hospitality + freight first; link to existing services; UTM tracking with canonical URL |
| Governance | AI coding ≠ automatic AI label; don't strip provenance; label synthetic media; GDPR/PECR for forms/tracking |

The website's `FoxArcMedia`, `fox-ui.css`, homepage, industry template and governance docs already satisfy the kit's recipes. The kit's `QUALITY_GATE.md` (score ≥18/20, no hard fail) is adopted as the pre-delivery check.

## Owner decisions — RESOLVED 2026-10-19
| Token | Decision | Applied |
|---|---|---|
| **Dark / ink** | **`#15213A`** navy (over the kit's #15191E) | already canonical; no change |
| **Typography** | **Geist** (over keeping Inter+Syne, over Manrope) | `fox-ui.css` loads Geist (Inter fallback); live adoption is a Phase 6 deploy step (replaces today's Inter+Syne) |
| **Primary CTA** | **"Book a conversation"** → `/book` | updated in `DESIGN_SPEC.md`, homepage, industry template, flyer, email, social |

Minor: page background stays `#F7F8FA` (vs the kit's #F5F6F7 — immaterial).

Sandbox note: Google Fonts is blocked here, so staging screenshots fall back to Inter; Geist renders on the live site / at export.
