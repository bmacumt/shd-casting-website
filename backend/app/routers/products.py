from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.product import Product
from app.models.category import ProductCategory
from app.schemas.product import ProductListItem, ProductDetail, ProductFeaturedItem, CategoryResponse
from app.utils.response import success, paginated

router = APIRouter(tags=["products"])


@router.get("/products")
def list_products(
    page: int = Query(1, ge=1),
    pageSize: int = Query(12, ge=1, le=50),
    category_id: int | None = None,
    keyword: str | None = None,
    is_featured: bool | None = None,
    sort: str = Query("sort_order", pattern="^(sort_order|created_at)$"),
    order: str = Query("asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active == True).options(joinedload(Product.category))

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if keyword:
        pattern = f"%{keyword}%"
        query = query.filter((Product.name.like(pattern)) | (Product.material.like(pattern)))
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    sort_col = getattr(Product, sort)
    query = query.order_by(sort_col.asc() if order == "asc" else sort_col.desc())

    total = query.count()
    items = query.offset((page - 1) * pageSize).limit(pageSize).all()

    result = []
    for p in items:
        cat_data = None
        if p.category:
            cat_data = CategoryResponse(
                id=p.category.id, name=p.category.name,
                sort_order=p.category.sort_order, product_count=0,
            )
        result.append(ProductListItem(
            id=p.id, name=p.name, category=cat_data,
            material=p.material, weight_range=p.weight_range,
            standard=p.standard, description=p.description,
            cover_image=p.cover_image, images=p.images,
            tag=p.tag, is_featured=p.is_featured, is_active=p.is_active,
            sort_order=p.sort_order, created_at=p.created_at,
        ))

    return paginated([r.model_dump() for r in result], total, page, pageSize)


@router.get("/products/featured")
def list_featured_products(db: Session = Depends(get_db)):
    items = (
        db.query(Product)
        .filter(Product.is_active == True, Product.is_featured == True)
        .options(joinedload(Product.category))
        .order_by(Product.sort_order.asc())
        .limit(6)
        .all()
    )
    result = []
    for p in items:
        cat_data = None
        if p.category:
            cat_data = CategoryResponse(
                id=p.category.id, name=p.category.name,
                sort_order=p.category.sort_order, product_count=0,
            )
        result.append(ProductFeaturedItem(
            id=p.id, name=p.name, category=cat_data,
            material=p.material, weight_range=p.weight_range,
            cover_image=p.cover_image, tag=p.tag,
        ).model_dump())
    return success(data=result)


@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).options(joinedload(Product.category)).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")

    cat_data = None
    if product.category:
        cat_data = CategoryResponse(
            id=product.category.id, name=product.category.name,
            sort_order=product.category.sort_order, product_count=0,
        )

    related = (
        db.query(Product)
        .filter(Product.category_id == product.category_id, Product.id != product.id, Product.is_active == True)
        .limit(4)
        .all()
    )
    related_list = [
        {"id": r.id, "name": r.name, "cover_image": r.cover_image}
        for r in related
    ]

    detail = ProductDetail(
        id=product.id, name=product.name, category=cat_data,
        material=product.material, weight_range=product.weight_range,
        standard=product.standard, description=product.description,
        cover_image=product.cover_image, images=product.images,
        tag=product.tag, is_featured=product.is_featured,
        sort_order=product.sort_order, created_at=product.created_at,
    )
    data = detail.model_dump()
    data["related_products"] = related_list
    return success(data=data)
