# Integrate into existing Fox ITC app and AI brain

1. Place this entire folder at `/brand-system/fox-itc-v2/` or your AI knowledge base, preserving relative asset paths.
2. Index markdown files for retrieval; ingest JSON as structured config. Load `ai/SYSTEM_PROMPT.md` persistently. Use the router to select the correct format instructions for each job.
3. Bind to the live Fox ITC service catalogue/CMS to avoid stale claims. Do not duplicate or overwrite the existing website services.
4. Implement a canonical `FoxArc` component that consumes source-derived masks and applies group transforms for left/right/up/down. Provide photo, watermark and pulse variants; verify against source with overlay/diff. Do not rebuild the arcs with circle strokes.
5. Implement editable templates for each requested channel using the kit specifications. Start with homepage, hospitality landing, freight landing, A5 flyer, LinkedIn post, PPTX theme, demo overlay and Outlook signature.
6. Build a generation pipeline: intake → source retrieval → layout/copy → preview/export → automated QA → review queue. Save approved templates and revisions with versions; do not auto-approve new concepts.
7. For all formats test actual output (browser screenshot, printed PDF proof, rendered PPTX, email client, video export) rather than assuming success from code.
8. Expose two operational states: DRAFT_GENERATION (allowed without user input) and PUBLICATION (requires explicit permissions and factual/legal review). After approved templates, low-risk routine variants can be auto-generated with no manual design direction.
