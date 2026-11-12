"""
Fox ITC Website Backend
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xmlrpc.client
import os
from pathlib import Path
from datetime import datetime

import seo

app = FastAPI(title="Fox ITC Website")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ODOO_URL = "https://foxitc.odoo.com"
ODOO_DB = "foxitc"
ODOO_USERNAME = "todd@foxitc.co.uk"
ODOO_API_KEY = os.getenv("ODOO_API_KEY", "547806ecd468c02344bfd73b554e8c900841a639")
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

def get_odoo_uid():
    common = xmlrpc.client.ServerProxy(f"{ODOO_URL}/xmlrpc/2/common")
    uid = common.authenticate(ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {})
    if not uid:
        raise Exception("Odoo authentication failed")
    return uid

def create_lead(lead_data: dict):
    uid = get_odoo_uid()
    models = xmlrpc.client.ServerProxy(f"{ODOO_URL}/xmlrpc/2/object")
    lead_id = models.execute_kw(
        ODOO_DB, uid, ODOO_API_KEY,
        "crm.lead", "create", [lead_data]
    )
    return lead_id

# ── Fox 360 lead capture ──────────────────────────────────────────────────────
# Mirror every website lead into Fox 360's pipeline (which also fires its journeys).
# Runs alongside Odoo for continuity; 360 is becoming the source of truth. Never
# raises — a 360 blip must not break the form.
FOX360_CAPTURE_URL = os.getenv("FOX360_CAPTURE_URL", "https://360.foxitc.co.uk/api/pipeline/public/capture")

def send_to_360(source: str, name: str = None, company: str = None, email: str = None,
                phone: str = None, message: str = None):
    import json as _json
    import urllib.request as _url
    payload = {k: v for k, v in {
        "source": source, "contact_name": name, "company_name": company,
        "contact_email": email, "contact_phone": phone, "message": message,
    }.items() if v}
    try:
        req = _url.Request(FOX360_CAPTURE_URL, data=_json.dumps(payload).encode("utf-8"),
                           headers={"Content-Type": "application/json"}, method="POST")
        _url.urlopen(req, timeout=8).read()
    except Exception as e:
        print(f"Fox 360 capture error: {e}")

class ContactForm(BaseModel):
    name: str
    email: str
    phone: str = ""
    company: str = ""
    service: str = ""
    message: str
    source: str = "website_contact"

class DownloadForm(BaseModel):
    name: str
    email: str
    company: str = ""
    guide: str
    source: str = "website_download"

class ReadinessForm(BaseModel):
    name: str
    email: str
    company: str = ""
    phone: str = ""
    employees: str = ""
    has_cert: str = ""
    updates: str = ""
    access: str = ""
    malware: str = ""
    timeline: str = ""
    score: str = ""
    band: str = ""
    source: str = "cyber_essentials_readiness"

@app.post("/api/contact")
async def contact(form: ContactForm):
    try:
        description = f"""Website Enquiry
Name: {form.name}
Email: {form.email}
Phone: {form.phone or 'Not provided'}
Company: {form.company or 'Not provided'}
Service Interest: {form.service or 'General'}
Message: {form.message}
Date: {datetime.now().strftime('%d/%m/%Y %H:%M')}"""

        lead_name = f"{form.service + ' Enquiry' if form.service else 'Website Enquiry'} — {form.name}"
        if form.company:
            lead_name += f" ({form.company})"

        send_to_360("website-contact", name=form.name, company=form.company,
                    email=form.email, phone=form.phone, message=description)

        create_lead({
            "name": lead_name,
            "contact_name": form.name,
            "email_from": form.email,
            "phone": form.phone,
            "partner_name": form.company or form.name,
            "description": description,
            "priority": "1",
        })

        return {"success": True, "message": "Thank you — we'll be in touch within one working day."}

    except Exception as e:
        print(f"Contact form error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit form")

@app.post("/api/download")
async def download_gate(form: DownloadForm):
    try:
        description = f"""Guide Download
Name: {form.name}
Email: {form.email}
Company: {form.company or 'Not provided'}
Guide: {form.guide}
Date: {datetime.now().strftime('%d/%m/%Y %H:%M')}"""

        send_to_360("guide-download", name=form.name, company=form.company,
                    email=form.email, message=description)

        create_lead({
            "name": f"Guide Download — {form.guide} — {form.name}",
            "contact_name": form.name,
            "email_from": form.email,
            "partner_name": form.company or form.name,
            "description": description,
            "priority": "0",
        })

        return {"success": True, "message": "Download ready."}

    except Exception as e:
        print(f"Download error: {e}")
        return {"success": True, "message": "Download ready."}

@app.post("/api/readiness")
async def readiness(form: ReadinessForm):
    # Cyber Essentials readiness check -> CRM lead (same pipeline as the
    # contact form). Captures the quiz answers and the computed readiness band
    # so the team can follow up with the right conversation.
    try:
        description = f"""Cyber Essentials Readiness Check
Name: {form.name}
Email: {form.email}
Phone: {form.phone or 'Not provided'}
Company: {form.company or 'Not provided'}
Employees: {form.employees or 'Not provided'}
Holds Cyber Essentials: {form.has_cert or 'Not provided'}
Automatic security updates: {form.updates or 'Not provided'}
User access control: {form.access or 'Not provided'}
Firewalls & malware protection: {form.malware or 'Not provided'}
Timeline: {form.timeline or 'Not provided'}
Readiness result: {form.band or 'Not provided'} ({form.score or '-'}/3 controls in place)
Date: {datetime.now().strftime('%d/%m/%Y %H:%M')}"""

        lead_name = f"CE Readiness — {form.band or 'Enquiry'} — {form.name}"
        if form.company:
            lead_name += f" ({form.company})"

        send_to_360("website-readiness", name=form.name, company=form.company,
                    email=form.email, phone=form.phone, message=description)

        create_lead({
            "name": lead_name,
            "contact_name": form.name,
            "email_from": form.email,
            "phone": form.phone,
            "partner_name": form.company or form.name,
            "description": description,
            "priority": "1",
        })

        return {"success": True, "message": "Thanks — your result is below, and we'll be in touch."}

    except Exception as e:
        print(f"Readiness form error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit")

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if FRONTEND_DIR.exists():
    @app.get("/guides/{filename}")
    async def serve_guide(filename: str):
        guide_path = FRONTEND_DIR / "guides" / filename
        if guide_path.exists():
            return FileResponse(guide_path, media_type="application/pdf")
        raise HTTPException(status_code=404)

    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

    # robots.txt / sitemap.xml — must be served as their real files with the
    # correct content type. Without these routes they fall through to the
    # catch-all below and return the HTML shell, so crawlers never see the
    # robots rules or the sitemap. These routes are defined before the
    # catch-all so they take precedence.
    @app.get("/robots.txt")
    async def robots_txt():
        p = FRONTEND_DIR / "robots.txt"
        if p.exists():
            return FileResponse(p, media_type="text/plain")
        raise HTTPException(status_code=404)

    @app.get("/sitemap.xml")
    async def sitemap_xml():
        p = FRONTEND_DIR / "sitemap.xml"
        if p.exists():
            return FileResponse(p, media_type="application/xml")
        raise HTTPException(status_code=404)

    def _image_media_type(p: Path) -> str:
        # Some .png files hold optimised JPEG bytes; serve the true type by sniffing magic bytes.
        try:
            with open(p, "rb") as fh:
                head = fh.read(3)
            if head[:3] == b"\xff\xd8\xff":
                return "image/jpeg"
        except OSError:
            pass
        return "image/png"

    # Serve static files (images, fonts, etc)
    @app.get("/{filename}.png")
    async def serve_png(filename: str):
        from urllib.parse import unquote
        p = FRONTEND_DIR / f"{unquote(filename)}.png"
        if p.exists(): return FileResponse(p, media_type=_image_media_type(p))
        return HTMLResponse(seo.render_index("/"))

    @app.get("/{filename}.jpg")
    async def serve_jpg(filename: str):
        p = FRONTEND_DIR / f"{filename}.jpg"
        if p.exists(): return FileResponse(p)
        return HTMLResponse(seo.render_index("/"))

    @app.get("/{filename}.svg")
    async def serve_svg(filename: str):
        p = FRONTEND_DIR / f"{filename}.svg"
        if p.exists(): return FileResponse(p, media_type="image/svg+xml")
        return HTMLResponse(seo.render_index("/"))

    @app.get("/{filename}.ico")
    async def serve_ico(filename: str):
        p = FRONTEND_DIR / f"{filename}.ico"
        if p.exists(): return FileResponse(p)
        return HTMLResponse(seo.render_index("/"))

    # Newsletters — standalone Fox-branded page reading the Fox 360 feed.
    def _render_newsletters(vertical: str = ""):
        import html as _html
        doc = (FRONTEND_DIR / "newsletters.html").read_text(encoding="utf-8")
        if vertical:
            v = _html.escape(vertical, quote=True)
            doc = doc.replace(
                '<div id="fox-newsletters" data-base="https://360.foxitc.co.uk"></div>',
                '<div id="fox-newsletters" data-base="https://360.foxitc.co.uk" data-vertical="%s"></div>' % v,
            )
            doc = doc.replace(
                'href="https://www.foxitc.co.uk/newsletters" />',
                'href="https://www.foxitc.co.uk/newsletters/%s" />' % v,
            )
        return HTMLResponse(doc)

    @app.get("/newsletters")
    async def newsletters():
        return _render_newsletters()

    @app.get("/newsletters/{vertical}")
    async def newsletters_vertical(vertical: str):
        import re as _re
        v = vertical if _re.fullmatch(r"[a-z0-9-]{1,64}", vertical or "") else ""
        return _render_newsletters(v)

    # Blog — standalone Fox-branded page reading the Fox 360 blog feed.
    @app.get("/blog")
    async def blog():
        return HTMLResponse((FRONTEND_DIR / "blog.html").read_text(encoding="utf-8"))

    @app.get("/blog/{slug}")
    async def blog_post(slug: str):
        # Shareable /blog/{slug} URL -> the Fox 360-hosted branded post.
        import re as _re
        if _re.fullmatch(r"[a-z0-9-]{1,120}", slug or ""):
            return RedirectResponse(f"https://360.foxitc.co.uk/api/blog/p/{slug}")
        return HTMLResponse((FRONTEND_DIR / "blog.html").read_text(encoding="utf-8"))

    # Industry pages — driven entirely by the Fox 360 verticals-manifest.
    # /industries          -> index of every industry
    # /industries/{slug}   -> that industry's landing page
    # New industries appear automatically; nothing is hard-coded per vertical.
    @app.get("/industries")
    async def industries_index():
        return HTMLResponse((FRONTEND_DIR / "industries.html").read_text(encoding="utf-8"))

    @app.get("/industries/{vertical}")
    async def industry(vertical: str):
        import re as _re, html as _html
        v = vertical if _re.fullmatch(r"[a-z0-9-]{1,64}", vertical or "") else ""
        doc = (FRONTEND_DIR / "industries.html").read_text(encoding="utf-8")
        doc = doc.replace('data-vertical=""', 'data-vertical="%s"' % _html.escape(v, quote=True))
        return HTMLResponse(doc)

    # Fox AI Licence — product / marketing landing page.
    @app.get("/ai-licence")
    async def ai_licence():
        return HTMLResponse((FRONTEND_DIR / "ai-licence.html").read_text(encoding="utf-8"))

    # Cyber Essentials First Step Fund — campaign landing page (LinkedIn/Meta).
    @app.get("/cyber-essentials-first-step-fund")
    async def cyber_essentials_first_step_fund():
        return HTMLResponse((FRONTEND_DIR / "cyber-essentials-first-step-fund.html").read_text(encoding="utf-8"))
    # AI Search Visibility — flagship GEO / marketing landing page.
    @app.get("/ai-search-visibility")
    async def ai_search_visibility():
        return HTMLResponse((FRONTEND_DIR / "ai-search-visibility.html").read_text(encoding="utf-8"))

    # Free security / IT tools (static, client-side).
    @app.get("/tools")
    async def tools_index():
        return HTMLResponse((FRONTEND_DIR / "tools.html").read_text(encoding="utf-8"))

    @app.get("/tools/password-generator")
    async def tool_password():
        return HTMLResponse((FRONTEND_DIR / "tool-password.html").read_text(encoding="utf-8"))

    @app.get("/tools/downtime-calculator")
    async def tool_downtime():
        return HTMLResponse((FRONTEND_DIR / "tool-downtime.html").read_text(encoding="utf-8"))

    # Booking — redirect to the Fox 360 booking page.
    # Every booking CTA on the site points at /book (the standalone pages, the
    # shared header in site-chrome.js, and the React app), so redirecting here
    # sends them all to the 360 booking page in one place. The query string
    # (e.g. ?type=discovery for the 15-minute discovery call) is preserved so
    # the meeting type carries through. book.html is kept in the repo but is no
    # longer served here — reversible by restoring the previous handler.
    @app.get("/book")
    async def book(request: Request):
        q = request.url.query
        target = "https://360.foxitc.co.uk/book"
        if q:
            target += "?" + q
        return RedirectResponse(target, status_code=302)

    # Campaign landing (South Africa flyer/QR → /za → book a review).
    @app.get("/za")
    async def landing_za():
        return HTMLResponse((FRONTEND_DIR / "za.html").read_text(encoding="utf-8"))

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return HTMLResponse(seo.render_index("/" + full_path))

    @app.get("/")
    async def root():
        return HTMLResponse(seo.render_index("/"))
