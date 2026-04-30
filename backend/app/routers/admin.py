from datetime import datetime, timedelta, timezone
import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.admin import Admin
from app.models.inquiry import Inquiry
from app.models.product import Product
from app.schemas.auth import LoginRequest, LoginResponse, TokenResponse
from app.schemas.inquiry import InquiryDetail, InquiryStatusUpdate, STATUS_LABELS
from app.schemas.product import ProductCreate, ProductUpdate, ProductBatchUpdate
from app.services.auth import verify_password, hash_password, create_token, decode_token
from app.utils.response import success, error
from app.config import get_settings

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

MAX_LOGIN_FAILS = 5
LOCK_MINUTES = 30


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Admin:
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token 无效或已过期")
    admin = db.query(Admin).filter(Admin.id == int(payload.get("sub"))).first()
    if not admin or not admin.is_active:
        raise HTTPException(status_code=401, detail="管理员不存在或已禁用")
    return admin


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == body.username).first()
    if not admin:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    now = datetime.now(timezone.utc)
    if admin.locked_until and admin.locked_until > now:
        raise HTTPException(status_code=403, detail=f"账号已锁定，请{LOCK_MINUTES}分钟后再试")

    if not verify_password(body.password, admin.password):
        admin.login_fail_count += 1
        if admin.login_fail_count >= MAX_LOGIN_FAILS:
            admin.locked_until = now + timedelta(minutes=LOCK_MINUTES)
        db.commit()
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    admin.login_fail_count = 0
    admin.locked_until = None
    admin.last_login = now
    db.commit()

    token = create_token({"sub": str(admin.id), "role": admin.role})
    return success(data={
        "token": token,
        "expires_in": 86400,
        "admin": {"id": admin.id, "username": admin.username, "role": admin.role},
    })


@router.post("/refresh-token")
def refresh_token(admin: Admin = Depends(get_current_admin)):
    token = create_token({"sub": str(admin.id), "role": admin.role})
    return success(data={"token": token, "expires_in": 86400})


@router.post("/logout")
def logout():
    return success(message="已退出登录")


# ─── Inquiry Management ───


@router.get("/inquiries")
def admin_list_inquiries(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    status: str | None = None,
    keyword: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    query = db.query(Inquiry)

    if status:
        query = query.filter(Inquiry.status == status)
    if keyword:
        pattern = f"%{keyword}%"
        query = query.filter(
            (Inquiry.name.like(pattern)) | (Inquiry.company.like(pattern)) | (Inquiry.email.like(pattern))
        )
    if start_date:
        query = query.filter(Inquiry.created_at >= start_date)
    if end_date:
        query = query.filter(Inquiry.created_at <= end_date + " 23:59:59")

    query = query.order_by(Inquiry.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * pageSize).limit(pageSize).all()

    stats_raw = db.query(Inquiry.status, func.count(Inquiry.id)).group_by(Inquiry.status).all()
    stats = {s: c for s, c in stats_raw}

    from app.utils.response import paginated
    result = [
        InquiryDetail(
            id=i.id, inquiry_id=i.inquiry_id, name=i.name,
            company=i.company, email=i.email, phone=i.phone,
            product_category=i.product_category, quantity=i.quantity,
            message=i.message, status=i.status, created_at=i.created_at,
        ).model_dump()
        for i in items
    ]
    data = paginated(result, total, page, pageSize)["data"]
    data["stats"] = {
        "total": sum(stats.values()),
        "pending": stats.get("pending", 0),
        "processing": stats.get("processing", 0),
        "replied": stats.get("replied", 0),
        "closed": stats.get("closed", 0),
    }
    return success(data=data)


@router.get("/inquiries/{inquiry_id}")
def admin_get_inquiry(inquiry_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="询价不存在")
    return success(data=InquiryDetail(
        id=inquiry.id, inquiry_id=inquiry.inquiry_id, name=inquiry.name,
        company=inquiry.company, email=inquiry.email, phone=inquiry.phone,
        product_category=inquiry.product_category, quantity=inquiry.quantity,
        message=inquiry.message, status=inquiry.status, created_at=inquiry.created_at,
    ).model_dump())


@router.patch("/inquiries/{inquiry_id}")
def admin_update_inquiry(
    inquiry_id: int,
    body: InquiryStatusUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="询价不存在")

    if body.status not in STATUS_LABELS:
        raise HTTPException(status_code=400, detail="无效的状态值")

    inquiry.status = body.status
    if body.admin_note:
        inquiry.admin_note = body.admin_note
    if body.status == "replied":
        inquiry.replied_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(inquiry)
    return success(data={"id": inquiry.id, "status": inquiry.status, "updated_at": inquiry.updated_at.isoformat()})


@router.delete("/inquiries/{inquiry_id}")
def admin_delete_inquiry(inquiry_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="询价不存在")
    db.delete(inquiry)
    db.commit()
    return success(message="删除成功")


# ─── Dashboard ───


@router.get("/dashboard/stats")
def admin_dashboard(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    now = datetime.now(timezone.utc)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    today_count = db.query(func.count(Inquiry.id)).filter(Inquiry.created_at >= today).scalar()
    month_count = db.query(func.count(Inquiry.id)).filter(Inquiry.created_at >= month_start).scalar()
    total_count = db.query(func.count(Inquiry.id)).scalar()
    pending_count = db.query(func.count(Inquiry.id)).filter(Inquiry.status == "pending").scalar()

    # Last 7 days trend
    from sqlalchemy import cast, Date
    trend = []
    for i in range(6, -1, -1):
        d = (now - timedelta(days=i)).date()
        d_start = datetime.combine(d, datetime.min.time())
        d_end = datetime.combine(d, datetime.max.time())
        count = db.query(func.count(Inquiry.id)).filter(Inquiry.created_at >= d_start, Inquiry.created_at <= d_end).scalar()
        trend.append({"date": d.isoformat(), "count": count})

    # Category distribution
    cat_dist = (
        db.query(Inquiry.product_category, func.count(Inquiry.id))
        .filter(Inquiry.product_category.isnot(None))
        .group_by(Inquiry.product_category)
        .order_by(func.count(Inquiry.id).desc())
        .limit(5)
        .all()
    )
    total_cat = sum(c for _, c in cat_dist) or 1
    category_distribution = [
        {"category": cat or "其他", "count": cnt, "percentage": round(cnt / total_cat * 100, 1)}
        for cat, cnt in cat_dist
    ]

    return success(data={
        "today_inquiries": today_count,
        "month_inquiries": month_count,
        "total_inquiries": total_count,
        "pending_count": pending_count,
        "trend": trend,
        "category_distribution": category_distribution,
    })


# ─── Product Management ───


@router.post("/products")
def admin_create_product(body: ProductCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    product = Product(
        name=body.name, category_id=body.category_id, material=body.material,
        weight_range=body.weight_range, standard=body.standard, description=body.description,
        cover_image=body.cover_image, images=body.images, tag=body.tag,
        is_featured=body.is_featured, is_active=body.is_active, sort_order=body.sort_order,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return success(data={"id": product.id}, message="创建成功")


@router.put("/products/{product_id}")
def admin_update_product(
    product_id: int, body: ProductUpdate,
    db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")
    for key, value in body.model_dump(exclude_none=True).items():
        setattr(product, key, value)
    db.commit()
    return success(message="更新成功")


@router.delete("/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")
    db.delete(product)
    db.commit()
    return success(message="删除成功")


@router.patch("/products/batch")
def admin_batch_update_products(
    body: ProductBatchUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    db.query(Product).filter(Product.id.in_(body.ids)).update(
        {"is_active": body.is_active}, synchronize_session=False
    )
    db.commit()
    return success(message="批量更新成功")


# ─── File Upload ───

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


@router.post("/upload")
def admin_upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    settings = get_settings()
    ext = os.path.splitext(file.filename or "image.jpg")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"不支持的文件格式，仅支持 {', '.join(ALLOWED_EXTENSIONS)}")

    content = file.file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail=f"文件大小不能超过 {settings.MAX_UPLOAD_SIZE_MB}MB")

    filename = f"{uuid.uuid4().hex}{ext}"
    sub_dir = "products"
    save_dir = os.path.join(settings.UPLOAD_DIR, sub_dir)
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, filename)

    with open(save_path, "wb") as f:
        f.write(content)

    url = f"/uploads/{sub_dir}/{filename}"
    return success(data={"url": url, "filename": file.filename})
