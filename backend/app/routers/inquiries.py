import time
from datetime import datetime, timezone

from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryResponse, InquiryStatusResponse, STATUS_LABELS
from app.utils.response import success, error
from app.services.email import notify_sales_email, confirm_customer_email

router = APIRouter(prefix="/inquiries", tags=["inquiries"])

# Simple in-memory rate limiter: {ip: [timestamps]}
_rate_limit_store: dict[str, list[float]] = {}


def _check_rate_limit(ip: str) -> bool:
    now = time.time()
    timestamps = _rate_limit_store.get(ip, [])
    timestamps = [t for t in timestamps if now - t < 600]
    if len(timestamps) >= 3:
        _rate_limit_store[ip] = timestamps
        return False
    timestamps.append(now)
    _rate_limit_store[ip] = timestamps
    return True


def _generate_inquiry_id(db: Session) -> str:
    now = datetime.now(timezone.utc)
    year = now.year
    prefix = f"INQ-{year}-"
    last = (
        db.query(Inquiry)
        .filter(Inquiry.inquiry_id.like(f"{prefix}%"))
        .order_by(Inquiry.id.desc())
        .first()
    )
    seq = 1
    if last:
        try:
            seq = int(last.inquiry_id.split("-")[-1]) + 1
        except ValueError:
            seq = 1
    return f"{prefix}{seq:04d}"


@router.post("")
def create_inquiry(body: InquiryCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    if not _check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="请求过于频繁，请稍后再试")

    inquiry_id = _generate_inquiry_id(db)
    inquiry = Inquiry(
        inquiry_id=inquiry_id,
        name=body.name,
        company=body.company,
        email=body.email,
        phone=body.phone,
        product_category=body.product_category,
        quantity=body.quantity,
        message=body.message,
        ip_address=client_ip,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # Async email notifications
    inquiry_data = {
        "name": body.name,
        "company": body.company,
        "email": body.email,
        "phone": body.phone,
        "product_category": body.product_category,
        "quantity": body.quantity,
        "message": body.message,
        "created_at": inquiry.created_at.isoformat(),
    }
    notify_sales_email(inquiry_data)
    confirm_customer_email(body.email, inquiry_id)

    return success(
        data={"inquiry_id": inquiry_id, "created_at": inquiry.created_at.isoformat()},
        message="询价已提交，我们将在1个工作日内与您联系",
    )


@router.get("/{inquiry_id}/status")
def get_inquiry_status(inquiry_id: str, db: Session = Depends(get_db)):
    inquiry = db.query(Inquiry).filter(Inquiry.inquiry_id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="询价记录不存在")
    return success(data={
        "inquiry_id": inquiry.inquiry_id,
        "status": inquiry.status,
        "status_label": STATUS_LABELS.get(inquiry.status, inquiry.status),
        "created_at": inquiry.created_at.isoformat(),
    })
