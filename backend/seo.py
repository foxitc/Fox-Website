"""
Server-side SEO / AEO layer for the Fox ITC website.

The front-end is a client-rendered React app: without this layer every route
would return the same near-empty HTML shell with one generic <title>, which is
invisible to answer engines (ChatGPT, Perplexity, Google AI Overviews) and weak
for classic search. This module injects, per route and into the *raw* HTML:

  * a unique <title> and meta description
  * a canonical URL and robots directive
  * Open Graph + Twitter Card tags (rich link previews)
  * JSON-LD structured data: Organization / ProfessionalService, WebSite,
    WebPage, BreadcrumbList, per-service Service, and FAQPage where the page
    has visible FAQ content.

All business facts and FAQ text are real, taken from the live site.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
INDEX_HTML = FRONTEND_DIR / "index.html"

# --- Business facts -------------------------------------------------------
BASE_URL = "https://www.foxitc.co.uk"
SITE_NAME = "Fox ITC"
PHONE_E164 = "+443300581877"
PHONE_DISPLAY = "03300 581 877"
EMAIL = "hello@foxitc.co.uk"
LOGO_URL = f"{BASE_URL}/fox_logo.png"
OG_IMAGE = f"{BASE_URL}/opengraph.jpg"
SAME_AS = ["https://www.linkedin.com/company/fox-itc"]
ORG_DESCRIPTION = (
    "Fox ITC provides straight-talking managed IT support, cyber security, "
    "Microsoft 365 and connectivity for businesses in Leicester, Leicestershire "
    "and across the UK."
)

# Registered office (legal NAP address).
REGISTERED_ADDRESS = {
    "@type": "PostalAddress",
    "addressLocality": "Castle Donington",
    "addressRegion": "Leicestershire",
    "postalCode": "DE74 2UZ",
    "addressCountry": "GB",
}
# Priority service area centred on Leicester (LE9). Radius ~40km covers
# Leicester, Leicestershire and the registered office to the north.
PRIMARY_GEO = {"@type": "GeoCoordinates", "latitude": 52.6293, "longitude": -1.2467}
SERVICE_RADIUS_M = 40000
# Ordered by priority — Leicester first.
AREA_SERVED = [
    {"@type": "City", "name": "Leicester"},
    {"@type": "AdministrativeArea", "name": "Leicestershire"},
    {"@type": "City", "name": "Loughborough"},
    {"@type": "City", "name": "Hinckley"},
    {"@type": "City", "name": "Coalville"},
    {"@type": "City", "name": "Castle Donington"},
    {"@type": "AdministrativeArea", "name": "East Midlands"},
    {"@type": "Country", "name": "United Kingdom"},
]
KNOWS_ABOUT = [
    "Managed IT Support", "Cyber Security", "Cyber Essentials",
    "Microsoft 365", "Business Connectivity", "Business Mobile",
    "Business WiFi", "PAT Testing", "Artificial Intelligence",
]

# --- Per-route metadata ---------------------------------------------------
# title: aim ~50-60 chars; description: ~150-160 chars. service: Service schema.
ROUTES: dict[str, dict] = {
    "/": {
        "title": "Fox ITC | Managed IT Support & Cyber Security UK",
        "description": "Straight-talking managed IT support, cyber security, Microsoft 365 and connectivity for UK businesses. Friendly experts, fast response. Call 03300 581 877.",
    },
    "/about": {
        "title": "About Fox ITC | Your UK Managed IT Partner",
        "description": "Meet the Fox ITC team — UK IT specialists delivering managed support, cyber security and Microsoft 365 with a no-jargon, people-first approach.",
    },
    "/contact": {
        "title": "Contact Fox ITC | Talk to a UK IT Specialist",
        "description": "Get in touch with Fox ITC for managed IT support, cyber security or a free consultation. Call 03300 581 877 — we reply within one working day.",
    },
    "/pricing": {
        "title": "IT Support Pricing | Secure, Protect & Defend | Fox ITC",
        "description": "Simple per-user IT support pricing. Choose Secure, Protect or Defend — from reliable helpdesk to full cyber security and IT strategy. See what's included.",
    },
    "/resources": {
        "title": "Free IT Resources & Guides | Fox ITC",
        "description": "Free guides, checklists and an IT health-check for UK businesses — cyber security, Microsoft 365, backups and more from the Fox ITC team.",
    },
    "/client-portal": {
        "title": "Client Portal | Fox ITC",
        "description": "Secure client portal login for Fox ITC customers.",
        "robots": "noindex, follow",
    },
    "/ai-readiness": {
        "title": "Free AI Readiness Audit & Quiz | Fox ITC",
        "description": "How AI-ready is your business? Take the free Fox ITC AI Readiness Quiz and get practical next steps for adopting AI safely and effectively.",
    },
    "/services/managed-it": {
        "title": "Managed IT Support for UK Business | Fox ITC",
        "description": "Proactive managed IT support — helpdesk, monitoring, patching and strategy. Fast, friendly and jargon-free support for UK businesses. Call 03300 581 877.",
        "service": "Managed IT Support",
    },
    "/services/cyber-security": {
        "title": "Cyber Security Services for Business | Fox ITC",
        "description": "Protect your business with Fox ITC cyber security — Cyber Essentials, email security, phishing training and threat monitoring for UK organisations.",
        "service": "Cyber Security",
    },
    "/services/cyber-essentials": {
        "title": "Cyber Essentials Certification | Fox ITC",
        "description": "Get Cyber Essentials certified with Fox ITC. We guide UK businesses through certification quickly and affordably — win more contracts and stay secure.",
        "service": "Cyber Essentials Certification",
    },
    "/services/microsoft-365": {
        "title": "Microsoft 365 Management & Migration | Fox ITC",
        "description": "Expert Microsoft 365 setup, migration, security and management for UK businesses. Get more from Teams, SharePoint and Outlook with Fox ITC.",
        "service": "Microsoft 365 Management",
    },
    "/services/connectivity": {
        "title": "Business Broadband & Leased Lines | Fox ITC",
        "description": "Fast, reliable business connectivity — broadband and dedicated leased lines with UK support from Fox ITC. Keep your business always online.",
        "service": "Business Connectivity",
    },
    "/services/mobile": {
        "title": "Business Mobile — O2, Vodafone & EE | Fox ITC",
        "description": "Business mobile plans on O2, Vodafone and EE, managed by Fox ITC. Flexible tariffs and one point of contact for all your connectivity.",
        "service": "Business Mobile",
    },
    "/services/wifi": {
        "title": "Business WiFi Installation — UniFi | Fox ITC",
        "description": "Reliable business WiFi design and installation with Ubiquiti UniFi from Fox ITC — seamless, secure coverage for offices, sites and hospitality.",
        "service": "Business WiFi",
    },
    "/services/pat-testing": {
        "title": "PAT Testing for Business — FoxPAT | Fox ITC",
        "description": "Professional PAT testing for UK businesses with FoxPAT as a Service. Stay compliant and safe with flexible scheduling and clear digital reporting.",
        "service": "PAT Testing",
    },
    "/services/ai": {
        "title": "Practical AI Services for Business | Fox ITC",
        "description": "Practical AI for real businesses — readiness audits, Copilot, workflow automation and small app builds. No hype, just useful outcomes. Fox ITC.",
        "service": "AI Consulting & Automation",
    },
}

DEFAULT = {
    "title": "Fox ITC | Managed IT Support & Cyber Security UK",
    "description": ORG_DESCRIPTION,
}

# --- FAQ data (verbatim from the live site) -------------------------------
try:
    _FAQ = json.loads((Path(__file__).parent / "seo_faq.json").read_text(encoding="utf-8"))
except Exception:
    _FAQ = {}


def _org_node() -> dict:
    return {
        "@type": ["Organization", "ProfessionalService"],
        "@id": f"{BASE_URL}/#organization",
        "name": SITE_NAME,
        "url": f"{BASE_URL}/",
        "logo": {"@type": "ImageObject", "url": LOGO_URL},
        "image": OG_IMAGE,
        "description": ORG_DESCRIPTION,
        "telephone": PHONE_E164,
        "email": EMAIL,
        "priceRange": "££",
        "address": REGISTERED_ADDRESS,
        "geo": PRIMARY_GEO,
        "areaServed": AREA_SERVED,
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": PRIMARY_GEO,
            "geoRadius": SERVICE_RADIUS_M,
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": PHONE_E164,
            "email": EMAIL,
            "contactType": "customer service",
            "areaServed": AREA_SERVED,
            "availableLanguage": "English",
        },
        "sameAs": SAME_AS,
        "knowsAbout": KNOWS_ABOUT,
    }


def _website_node() -> dict:
    return {
        "@type": "WebSite",
        "@id": f"{BASE_URL}/#website",
        "url": f"{BASE_URL}/",
        "name": SITE_NAME,
        "inLanguage": "en-GB",
        "publisher": {"@id": f"{BASE_URL}/#organization"},
    }


def _breadcrumb_node(path: str, canonical: str, title: str) -> dict:
    items = [{
        "@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/",
    }]
    if path != "/":
        crumb = title.split("|")[0].split("—")[0].strip()
        items.append({"@type": "ListItem", "position": 2, "name": crumb, "item": canonical})
    return {"@type": "BreadcrumbList", "@id": f"{canonical}#breadcrumb", "itemListElement": items}


def _webpage_node(canonical: str, title: str, desc: str) -> dict:
    return {
        "@type": "WebPage",
        "@id": f"{canonical}#webpage",
        "url": canonical,
        "name": title,
        "description": desc,
        "inLanguage": "en-GB",
        "isPartOf": {"@id": f"{BASE_URL}/#website"},
        "about": {"@id": f"{BASE_URL}/#organization"},
        "breadcrumb": {"@id": f"{canonical}#breadcrumb"},
    }


def _service_node(canonical: str, service: str) -> dict:
    return {
        "@type": "Service",
        "@id": f"{canonical}#service",
        "name": service,
        "serviceType": service,
        "url": canonical,
        "provider": {"@id": f"{BASE_URL}/#organization"},
        "areaServed": AREA_SERVED,
    }


def _faq_node(path: str, canonical: str) -> dict | None:
    qa = _FAQ.get(path)
    if not qa:
        return None
    return {
        "@type": "FAQPage",
        "@id": f"{canonical}#faq",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["q"],
                "acceptedAnswer": {"@type": "Answer", "text": item["a"]},
            }
            for item in qa
        ],
    }


def _build_graph(path: str, canonical: str, title: str, desc: str) -> str:
    graph = [_org_node(), _website_node(),
             _webpage_node(canonical, title, desc),
             _breadcrumb_node(path, canonical, title)]
    meta = ROUTES.get(path, {})
    if meta.get("service"):
        graph.append(_service_node(canonical, meta["service"]))
    faq = _faq_node(path, canonical)
    if faq:
        graph.append(faq)
    data = {"@context": "https://schema.org", "@graph": graph}
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def _normalise(path: str) -> str:
    path = "/" + path.strip().lstrip("/")
    path = path.split("?")[0].split("#")[0]
    if len(path) > 1:
        path = path.rstrip("/")
    return path or "/"


_TITLE_RE = re.compile(r"<title>.*?</title>", re.DOTALL)
_DESC_RE = re.compile(r'<meta\s+name="description"[^>]*>', re.IGNORECASE)
_ROBOTS_RE = re.compile(r'<meta\s+name="robots"[^>]*>', re.IGNORECASE)


def render_index(path: str) -> str:
    """Return index.html with SEO/AEO tags injected for the given route."""
    path = _normalise(path)
    meta = ROUTES.get(path, DEFAULT)
    title = meta.get("title", DEFAULT["title"])
    desc = meta.get("description", DEFAULT["description"])
    robots = meta.get("robots", "index, follow")
    canonical = f"{BASE_URL}/" if path == "/" else f"{BASE_URL}{path}"

    doc = INDEX_HTML.read_text(encoding="utf-8")

    e_title = html.escape(title, quote=True)
    e_desc = html.escape(desc, quote=True)

    doc = _TITLE_RE.sub(f"<title>{e_title}</title>", doc, count=1)
    if _DESC_RE.search(doc):
        doc = _DESC_RE.sub(f'<meta name="description" content="{e_desc}" />', doc, count=1)
    if _ROBOTS_RE.search(doc):
        doc = _ROBOTS_RE.sub(f'<meta name="robots" content="{robots}" />', doc, count=1)

    jsonld = _build_graph(path, canonical, title, desc)

    block = f"""    <link rel="canonical" href="{html.escape(canonical, quote=True)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{SITE_NAME}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:title" content="{e_title}" />
    <meta property="og:description" content="{e_desc}" />
    <meta property="og:url" content="{html.escape(canonical, quote=True)}" />
    <meta property="og:image" content="{OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{e_title}" />
    <meta name="twitter:description" content="{e_desc}" />
    <meta name="twitter:image" content="{OG_IMAGE}" />
    <script type="application/ld+json">{jsonld}</script>
"""
    doc = doc.replace("</head>", block + "  </head>", 1)
    return doc
