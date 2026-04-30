import datetime

from pydantic import BaseModel, EmailStr, Field


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    company: str | None = Field(None, max_length=200)
    email: EmailStr = Field(..., min_length=5, max_length=200)
    phone: str | None = Field(None, max_length=50)
    product_category: str | None = Field(None, max_length=100)
    quantity: str | None = Field(None, max_length=100)
    message: str = Field(..., min_length=2, max_length=2000)


class InquiryResponse(BaseModel):
    inquiry_id: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class InquiryStatusResponse(BaseModel):
    inquiry_id: str
    status: str
    status_label: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


STATUS_LABELS = {
    "pending": "待处理",
    "processing": "处理中",
    "replied": "已回复",
    "closed": "已关闭",
}


class InquiryDetail(BaseModel):
    id: int
    inquiry_id: str
    name: str
    company: str | None
    email: str
    phone: str | None
    product_category: str | None
    quantity: str | None
    message: str
    status: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class InquiryStatusUpdate(BaseModel):
    status: str
    admin_note: str | None = None
