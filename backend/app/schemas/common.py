from pydantic import BaseModel


class ResponseBase(BaseModel):
    code: int = 200
    message: str = "success"


class PaginatedResponse(ResponseBase):
    class PaginationData(BaseModel):
        list: list
        total: int
        page: int
        pageSize: int
        totalPages: int

    data: PaginationData
