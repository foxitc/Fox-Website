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

## Needs an owner decision (3 genuine conflicts)
| Token | `DESIGN_SPEC.md` (360-supplied) | AI Brain Kit v2 | Live site today | Recommendation |
|---|---|---|---|---|
| **Dark / ink** | `#15213A` (navy) | `#15191E` (charcoal) | n/a | Pick one. I've built with **#15213A**; switch to #15191E if you prefer charcoal sections. |
| **Typography** | Geist / Inter | Inter / Manrope (+"inspect & preserve current") | **Inter body + Syne headings** | **Keep live Inter + Syne** (kit says preserve current if appropriate); don't adopt Geist/Manrope without sign-off. |
| **Primary CTA** | "Book a free IT review" (always) | "Talk to our team" / "Book a conversation" / adjust to existing flow | "Get in touch" | I've used **"Book a free IT review"** (it has a working `/book` destination). Confirm or pick. |

Minor: page background `#F7F8FA` (spec) vs `#F5F6F7` (kit) — immaterial; staying on the spec value.

## Once you decide
I'll set the chosen values in `DESIGN_TOKENS_DRAFT.json` + `fox-ui.css`, update `APPROVAL_LOG.md`, and keep both docs in step (website leads design per the contract; the kit adopts).
