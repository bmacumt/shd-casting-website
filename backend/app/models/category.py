import datetime

from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ProductCategory(Base):
    __tablename__ = "product_categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="分类名称")
    name_en: Mapped[str | None] = mapped_column(String(100), comment="英文名称")
    name_es: Mapped[str | None] = mapped_column(String(100), comment="西语名称")
    name_ru: Mapped[str | None] = mapped_column(String(100), comment="俄语名称")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    products: Mapped[list["Product"]] = relationship(back_populates="category")  # noqa: F821
