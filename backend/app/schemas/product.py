import datetime

from pydantic import BaseModel, Field


class CategoryResponse(BaseModel):
    id: int
    name: str
    sort_order: int
    product_count: int = 0

    model_config = {"from_attributes": True}


class ProductListItem(BaseModel):
    id: int
    name: str
    category: CategoryResponse | None = None
    material: str | None
    weight_range: str | None
    standard: str | None
    description: str | None
    cover_image: str | None
    images: list[str] | None
    tag: str | None
    is_featured: bool
    is_active: bool = True
    sort_order: int
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class ProductDetail(ProductListItem):
    pass


class ProductFeaturedItem(BaseModel):
    id: int
    name: str
    category: CategoryResponse | None = None
    material: str | None
    weight_range: str | None
    cover_image: str | None
    tag: str | None

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=200)
    category_id: int
    material: str | None = Field(None, max_length=200)
    weight_range: str | None = Field(None, max_length=100)
    standard: str | None = Field(None, max_length=100)
    description: str | None = None
    cover_image: str | None = Field(None, max_length=500)
    images: list[str] | None = None
    tag: str | None = Field(None, max_length=50)
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0


class ProductUpdate(BaseModel):
    name: str | None = None
    category_id: int | None = None
    material: str | None = None
    weight_range: str | None = None
    standard: str | None = None
    description: str | None = None
    cover_image: str | None = None
    images: list[str] | None = None
    tag: str | None = None
    is_featured: bool | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class ProductBatchUpdate(BaseModel):
    ids: list[int]
    is_active: bool
