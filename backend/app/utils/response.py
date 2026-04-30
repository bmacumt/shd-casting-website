from typing import Any

from fastapi.responses import JSONResponse


def success(data: Any = None, message: str = "success", code: int = 200) -> dict:
    return {"code": code, "message": message, "data": data}


def error(message: str, code: int = 400, data: Any = None) -> dict:
    return {"code": code, "message": message, "data": data}


def paginated(list_data: list, total: int, page: int, page_size: int) -> dict:
    return {
        "code": 200,
        "message": "success",
        "data": {
            "list": list_data,
            "total": total,
            "page": page,
            "pageSize": page_size,
            "totalPages": (total + page_size - 1) // page_size if page_size else 0,
        },
    }
