import json
import logging

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.site_config import SiteConfig
from app.routers.admin import get_current_admin
from app.utils.response import success

logger = logging.getLogger(__name__)

router = APIRouter(tags=["site-config"])

DEFAULTS = {
    # ─── Company Info ───
    "company_name": "SHD Casting Co., Ltd",
    "address": "No.88 Casting Road, Fengxian Industrial Zone, Shanghai",
    "zipcode": "201499",
    "phone": "+86 21 1234 5678",
    "phone_sales": "+86 135 0000 1234",
    "email": "info@shdcasting.com",
    "email_sales": "sales@shdcasting.com",
    "work_hours": "08:30 - 17:30",
    "work_hours_weekend": "09:00 - 12:00",
    "company_intro": "Founded in 2004, SHD Casting Co., Ltd is a professional casting manufacturer integrating R&D, production, and sales. Located in Shanghai Fengxian Industrial Zone, covering approximately 50,000 square meters.",

    # ─── Hero ───
    "hero_tag": "Professional Casting Manufacturer · 20 Years of Quality Assurance",
    "hero_title": "Precision Casting\nForging Quality",
    "hero_subtitle": "Specializing in gray iron, ductile iron, cast steel, and aluminum alloy castings. Serving global industrial manufacturing with an annual capacity exceeding 50,000 tons.",

    # ─── Stats ───
    "stat_years": "20+",
    "stat_years_label": "Years of Experience",
    "stat_clients": "5,000+",
    "stat_clients_label": "Partner Clients",
    "stat_countries": "30+",
    "stat_countries_label": "Export Countries",
    "stat_cert": "ISO9001",
    "stat_cert_label": "Quality Certifications",

    # ─── Factory ───
    "factory_area": "50,000㎡",
    "factory_lines": "5 Lines",
    "factory_capacity": "50,000 Tons",
    "factory_staff": "200+",

    # ─── Advantages ───
    "advantages": json.dumps([
        {"title": "Strict Quality Control", "desc": "ISO 9001:2015 certified quality management system with full batch traceability for every casting."},
        {"title": "Advanced Equipment", "desc": "State-of-the-art imported casting equipment and automated production lines ensuring consistency and precision."},
        {"title": "Fast Delivery", "desc": "Mature supply chain management — standard parts in 3-7 days, custom parts in 15-30 days."},
        {"title": "Global Export Experience", "desc": "Products sold to over 30 countries across Europe, Americas, and Southeast Asia with full international trade compliance."},
    ], ensure_ascii=False),

    # ─── Certifications ───
    "certifications": json.dumps([
        {"name": "ISO 9001:2015", "desc": "Quality Management System Certification"},
        {"name": "CE Certification", "desc": "European Product Compliance Certification"},
        {"name": "SGS Certification", "desc": "World-leading Testing Organization Certification"},
        {"name": "BV Inspection", "desc": "Bureau Veritas International Inspection Certification"},
        {"name": "TÜV Certification", "desc": "German Technical Supervision Association Certification"},
    ], ensure_ascii=False),

    # ─── Milestones ───
    "milestones": json.dumps([
        {"year": "2004", "title": "Company Founded", "desc": "SHD Casting officially established in Fengxian District, Shanghai, with an initial team of 50 employees."},
        {"year": "2007", "title": "ISO Certification", "desc": "Obtained ISO 9001 quality management system certification, marking a new era of standardized quality management."},
        {"year": "2010", "title": "Capacity Exceeded 10,000 Tons", "desc": "Added new production lines. Annual capacity exceeded 10,000 tons. Began exporting to Southeast Asian markets."},
        {"year": "2015", "title": "European & American Markets", "desc": "Products entered European and North American markets. Export revenue exceeded 40% of total revenue."},
        {"year": "2019", "title": "Smart Manufacturing Upgrade", "desc": "Introduced intelligent casting production lines. Automation rate reached 75% with significantly improved efficiency."},
        {"year": "2024", "title": "20th Anniversary", "desc": "Annual capacity reached 50,000 tons with 500+ employees, serving customers in over 30 countries worldwide."},
    ], ensure_ascii=False),

    # ─── Team ───
    "team": json.dumps([
        {"name": "Zhang Jianguo", "title": "Chairman & General Manager", "exp": "30 years of casting industry experience"},
        {"name": "Li Minghua", "title": "Technical Director", "exp": "Senior engineer with 12 invention patents"},
        {"name": "Wang Xiufang", "title": "Quality Director", "exp": "ISO certified internal auditor, 25 years of experience"},
        {"name": "Chen Zhiyuan", "title": "Sales Director", "exp": "Overseas market expansion expert"},
    ], ensure_ascii=False),

    # ─── FAQs ───
    "faqs": json.dumps([
        {"q": "What is the minimum order quantity?", "a": "Our MOQ varies by product specifications. Generally, the minimum is 1 ton or 50 pieces per item (whichever is greater). Sample orders are negotiable."},
        {"q": "What is the typical lead time?", "a": "Standard products: 3-7 working days. Custom products: 15-30 working days depending on complexity. Bulk orders are negotiated separately."},
        {"q": "Do you provide sample services?", "a": "Yes, we offer paid sample services. Sample fees can be deducted from the first order payment after signing a formal contract."},
        {"q": "Do you accept custom orders?", "a": "We accept all types of custom casting orders, including special materials, dimensions, and processes. Please provide drawings or detailed specifications for evaluation and quotation."},
    ], ensure_ascii=False),

    # ─── Navbar ───
    "navbar_tag": "Professional Casting Manufacturer · 20 Years of Experience",
}


def _get_value(db: Session, key: str) -> str:
    row = db.query(SiteConfig).filter(SiteConfig.key == key).first()
    return row.value if row and row.value else DEFAULTS.get(key, "")


@router.get("/site-config")
def get_site_config(db: Session = Depends(get_db)):
    config = {}
    for key in DEFAULTS:
        config[key] = _get_value(db, key)
    return success(data=config)


class SiteConfigUpdate(BaseModel):
    config: dict[str, str]


@router.put("/admin/site-config")
def admin_update_site_config(body: SiteConfigUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    # 1. Save user-submitted config
    saved = {}
    for key, value in body.config.items():
        if key not in DEFAULTS:
            continue
        row = db.query(SiteConfig).filter(SiteConfig.key == key).first()
        if row:
            row.value = value
        else:
            db.add(SiteConfig(key=key, value=value))
        saved[key] = value
    db.commit()
    return success(message="Updated successfully")
