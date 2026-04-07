"""
Fox ITC Website Backend
- Serves static frontend
- Handles contact form submissions → Odoo CRM leads
- Odoo live chat integration ready
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import httpx
import os
from pathlib import Path
from datetime import datetime

app = FastAPI(title="Fox ITC Website")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Odoo Configuration
ODOO_URL = "https://foxitc.odoo.com"
ODOO_DB = "foxitc"
ODOO_USERNAME = "todd@foxitc.co.uk"
ODOO_API_KEY = os.getenv("ODOO_API_KEY", "993ae991f853b2a7a2ce734a6ec9d07346b4c9c0")

# Microsoft Clarity - Set up at https://clarity.microsoft.com and add your project ID
CLARITY_PROJECT_ID = os.getenv("CLARITY_PROJECT_ID", "")

# Paths
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    company: str = ""
    message: str
    source: str = "website_contact"


class AuditForm(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    company: str = ""
    headcount: str = ""
    current_platform: str = ""
    ai_usage: str = ""
    primary_goal: str = ""
    biggest_barrier: str = ""
    timeline: str = ""
    quiz_score: int = 0
    source: str = "ai_readiness_quiz"


async def get_odoo_uid() -> int:
    """Authenticate with Odoo and get user ID"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ODOO_URL}/jsonrpc",
            json={
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "common",
                    "method": "authenticate",
                    "args": [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {}]
                },
                "id": 1
            }
        )
        result = response.json()
        if "error" in result:
            raise HTTPException(status_code=500, detail=f"Odoo auth error: {result['error']}")
        return result.get("result")


async def create_crm_lead(data: dict) -> int:
    """Create a lead in Odoo CRM"""
    uid = await get_odoo_uid()
    if not uid:
        raise HTTPException(status_code=500, detail="Failed to authenticate with Odoo")
    
    lead_data = {
        "name": f"Website Lead: {data.get('company') or data.get('name', 'Unknown')}",
        "contact_name": data.get("name", ""),
        "email_from": data.get("email", ""),
        "phone": data.get("phone", ""),
        "partner_name": data.get("company", ""),
        "description": data.get("message", ""),
        "type": "lead",
    }
    
    # Add quiz data if present
    if data.get("quiz_score"):
        lead_data["description"] = f"""AI Readiness Quiz Submission

Score: {data.get('quiz_score')}/100
Headcount: {data.get('headcount', 'N/A')}
Current Platform: {data.get('current_platform', 'N/A')}
AI Usage: {data.get('ai_usage', 'N/A')}
Primary Goal: {data.get('primary_goal', 'N/A')}
Biggest Barrier: {data.get('biggest_barrier', 'N/A')}
Timeline: {data.get('timeline', 'N/A')}

Original Message:
{data.get('message', '')}
"""
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ODOO_URL}/jsonrpc",
            json={
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "object",
                    "method": "execute_kw",
                    "args": [
                        ODOO_DB,
                        uid,
                        ODOO_API_KEY,
                        "crm.lead",
                        "create",
                        [lead_data]
                    ]
                },
                "id": 2
            }
        )
        result = response.json()
        if "error" in result:
            raise HTTPException(status_code=500, detail=f"Odoo create error: {result['error']}")
        return result.get("result")


@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    """Handle contact form submission"""
    try:
        lead_id = await create_crm_lead(form.dict())
        return {"success": True, "lead_id": lead_id, "message": "Thanks! We'll be in touch within 24 hours."}
    except Exception as e:
        print(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/audit")
async def submit_audit(form: AuditForm):
    """Handle AI readiness audit form submission"""
    try:
        lead_id = await create_crm_lead(form.dict())
        return {"success": True, "lead_id": lead_id, "message": "Thanks! We'll review your results and be in touch."}
    except Exception as e:
        print(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


def get_index_html() -> str:
    """Read index.html and inject tracking scripts"""
    index_path = FRONTEND_DIR / "index.html"
    with open(index_path, "r") as f:
        html = f.read()
    
    # Microsoft Clarity tracking script
    clarity_script = ""
    if CLARITY_PROJECT_ID:
        clarity_script = f"""
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){{
            c[a]=c[a]||function(){{(c[a].q=c[a].q||[]).push(arguments)}};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        }})(window, document, "clarity", "script", "{CLARITY_PROJECT_ID}");
    </script>
"""
    
    # Odoo Live Chat widget
    odoo_livechat = f"""
    <!-- Odoo Live Chat -->
    <script>
        window.odoo_livechat_options = {{
            url: '{ODOO_URL}',
            db: '{ODOO_DB}',
        }};
    </script>
    <script src="{ODOO_URL}/im_livechat/loader/{ODOO_DB}" async></script>
"""
    
    # Inject before </head>
    tracking_scripts = clarity_script + odoo_livechat
    html = html.replace("</head>", f"{tracking_scripts}</head>")
    
    return html


@app.get("/", response_class=HTMLResponse)
async def serve_index():
    """Serve the main page with injected tracking"""
    return get_index_html()


# Serve static files
app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
app.mount("/guides", StaticFiles(directory=FRONTEND_DIR / "guides"), name="guides")


@app.get("/favicon.svg")
async def serve_favicon():
    return FileResponse(FRONTEND_DIR / "favicon.svg")


@app.get("/opengraph.jpg")
async def serve_og_image():
    return FileResponse(FRONTEND_DIR / "opengraph.jpg")


# Catch-all for SPA routing
@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_spa(path: str):
    """Serve index.html for all routes (SPA)"""
    file_path = FRONTEND_DIR / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    return get_index_html()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8055)
