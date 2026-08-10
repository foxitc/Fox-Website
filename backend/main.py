"""
Fox ITC Website Backend
"""
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
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

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return HTMLResponse(seo.render_index("/" + full_path))

    @app.get("/")
    async def root():
        return HTMLResponse(seo.render_index("/"))
