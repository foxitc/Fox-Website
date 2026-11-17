# EMAIL_AND_NEWSLETTERS

Status: **PROPOSED / staging**. Built to `fox-itc-v2/templates/EMAIL_BLOG_NEWSLETTER.md`.

## Deliverables
- `templates/email-signature.html` — Outlook-safe signature: table-based, inline CSS, live selectable text, logo linked to homepage, small arc motif (image + alt), CTA "Book a conversation". No animation.
- `templates/newsletter.html` — "Fox Bytes" customer newsletter: table-based, ~600px, preheader, ink header with arc mark (watermark not repeated behind articles), intro, 3 story modules (Security / Hospitality / Microsoft 365), **one** main CTA, footer with contact + **unsubscribe + manage-preferences** (`%%unsubscribe%%` / `%%preferences%%` merge tags).

## Production checklist
- Swap all image `src`s to absolute `https://www.foxitc.co.uk/...` URLs (email clients won't load relative or local paths).
- Email fonts stay web-safe (Arial/Helvetica) — do **not** rely on Geist in email; it won't load in most clients.
- Populate name/role/phone from the approved staff directory; populate stories from the website/CMS — no invented claims.
- **UK GDPR / PECR:** send only to consented recipients; working unsubscribe + preference links; sender identity and postal address in the footer.
- Test in Outlook desktop/web/mobile + Gmail (light/dark) before sending.

Still to do: blog/Fox Bytes LinkedIn editorial cover template, email banner.
