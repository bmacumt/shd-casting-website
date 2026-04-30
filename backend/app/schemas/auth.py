from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    expires_in: int

    class AdminInfo(BaseModel):
        id: int
        username: str
        role: str

    admin: AdminInfo


class TokenResponse(BaseModel):
    token: str
    expires_in: int
