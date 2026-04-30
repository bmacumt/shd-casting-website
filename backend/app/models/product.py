import datetime

from sqlalchemy import String, Text, Integer, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="产品名称")
    name_en: Mapped[str | None] = mapped_column(String(200), comment="英文名称")
    name_es: Mapped[str | None] = mapped_column(String(200), comment="西语名称")
    name_ru: Mapped[str | None] = mapped_column(String(200), comment="俄语名称")
    description_en: Mapped[str | None] = mapped_column(Text, comment="英文描述")
    description_es: Mapped[str | None] = mapped_column(Text, comment="西语描述")
    description_ru: Mapped[str | None] = mapped_column(Text, comment="俄语描述")
    category_id: Mapped[int] = mapped_column(ForeignKey("product_categories.id"), nullable=False)
    material: Mapped[str | None] = mapped_column(String(200), comment="材质规格")
    weight_range: Mapped[str | None] = mapped_column(String(100), comment="重量范围")
    standard: Mapped[str | None] = mapped_column(String(100), comment="执行标准")
    description: Mapped[str | None] = mapped_column(Text, comment="产品描述")
    cover_image: Mapped[str | None] = mapped_column(String(500), comment="封面图URL")
    images: Mapped[dict | None] = mapped_column(JSON, comment="多图URL数组")
    tag: Mapped[str | None] = mapped_column(String(50), comment="标签")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

    category: Mapped["ProductCategory"] = relationship(back_populates="products")  # noqa: F821
