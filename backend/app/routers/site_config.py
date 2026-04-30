from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.site_config import SiteConfig
from app.routers.admin import get_current_admin
from app.utils.response import success

router = APIRouter(tags=["site-config"])

# Default config values
DEFAULTS = {
    "company_name": "上海铸造有限公司",
    "company_name_en": "SHD Casting Co., Ltd",
    "address": "上海市奉贤区工业园区铸造路88号",
    "address_en": "No.88 Casting Road, Fengxian Industrial Zone, Shanghai",
    "zipcode": "201499",
    "phone": "+86 21 1234 5678",
    "phone_sales": "+86 135 0000 1234",
    "email": "info@shdcasting.com",
    "email_sales": "sales@shdcasting.com",
    "work_hours": "周一至周五：08:30 - 17:30",
    "work_hours_weekend": "周六：09:00 - 12:00",
    "company_intro": "上海铸造有限公司成立于2004年，是一家集研发、生产、销售于一体的专业铸件制造企业。",
    "factory_area": "50,000㎡",
    "annual_capacity": "50,000吨",
    "export_countries": "30+",
    "years_experience": "20+",
    "clients_count": "5,000+",
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
    for key, value in body.config.items():
        if key not in DEFAULTS:
            continue
        row = db.query(SiteConfig).filter(SiteConfig.key == key).first()
        if row:
            row.value = value
        else:
            db.add(SiteConfig(key=key, value=value))
    db.commit()
    return success(message="更新成功")
