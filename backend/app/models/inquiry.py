import datetime

from sqlalchemy import String, Text, Enum as SAEnum, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    inquiry_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, comment="询价编号 INQ-YYYY-XXXX")
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="客户姓名")
    company: Mapped[str | None] = mapped_column(String(200), comment="公司名称")
    email: Mapped[str] = mapped_column(String(200), nullable=False, comment="邮箱")
    phone: Mapped[str | None] = mapped_column(String(50), comment="电话")
    product_category: Mapped[str | None] = mapped_column(String(100), comment="产品类别")
    quantity: Mapped[str | None] = mapped_column(String(100), comment="预计采购量")
    message: Mapped[str] = mapped_column(Text, nullable=False, comment="详细需求")
    status: Mapped[str] = mapped_column(
        SAEnum("pending", "processing", "replied", "closed", name="inquiry_status"),
        default="pending",
        nullable=False,
    )
    source: Mapped[str] = mapped_column(String(50), default="website", comment="来源渠道")
    ip_address: Mapped[str | None] = mapped_column(String(50))
    admin_note: Mapped[str | None] = mapped_column(Text, comment="内部备注")
    replied_at: Mapped[datetime.datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

    __table_args__ = (
        Index("idx_status", "status"),
        Index("idx_created_at", "created_at"),
        Index("idx_email", "email"),
    )
