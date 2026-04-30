from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.category import ProductCategory
from app.models.product import Product
from app.schemas.product import CategoryResponse
from app.routers.admin import get_current_admin
from app.utils.response import success
from sqlalchemy import func

router = APIRouter(tags=["categories"])


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(ProductCategory).order_by(ProductCategory.sort_order.asc()).all()
    counts = (
        db.query(Product.category_id, func.count(Product.id))
        .filter(Product.is_active == True)
        .group_by(Product.category_id)
        .all()
    )
    count_map = dict(counts)
    result = [
        CategoryResponse(
            id=c.id, name=c.name, sort_order=c.sort_order,
            name_en=c.name_en, name_es=c.name_es, name_ru=c.name_ru,
            product_count=count_map.get(c.id, 0),
        ).model_dump()
        for c in categories
    ]
    return success(data=result)


class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    name_en: str | None = Field(None, max_length=100)
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    name_en: str | None = Field(None, max_length=100)
    sort_order: int | None = None


@router.post("/admin/categories")
def admin_create_category(body: CategoryCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    cat = ProductCategory(name=body.name, name_en=body.name_en, sort_order=body.sort_order)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    try:
        from app.utils.translator import translate_product
        translations = translate_product(body.name)
        if translations:
            for k, v in translations.items():
                if k.startswith('name_'):
                    setattr(cat, k, v)
            db.commit()
    except Exception:
        pass
    return success(data={"id": cat.id}, message="创建成功")


@router.put("/admin/categories/{category_id}")
def admin_update_category(category_id: int, body: CategoryUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    cat = db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="分类不存在")
    if body.name is not None:
        cat.name = body.name
    if body.name_en is not None:
        cat.name_en = body.name_en
    if body.sort_order is not None:
        cat.sort_order = body.sort_order
    db.commit()
    if body.name is not None:
        try:
            from app.utils.translator import translate_product
            translations = translate_product(body.name)
            if translations:
                for k, v in translations.items():
                    if k.startswith('name_'):
                        setattr(cat, k, v)
                db.commit()
        except Exception:
            pass
    return success(message="更新成功")


@router.delete("/admin/categories/{category_id}")
def admin_delete_category(category_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    cat = db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="分类不存在")
    product_count = db.query(Product).filter(Product.category_id == category_id).count()
    if product_count > 0:
        raise HTTPException(status_code=400, detail=f"该分类下有 {product_count} 个产品，无法删除")
    db.delete(cat)
    db.commit()
    return success(message="删除成功")
