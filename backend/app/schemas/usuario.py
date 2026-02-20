# app/schemas/usuario.py
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    # EmailStr aplica automáticamente la Regex para validar formato de correo (Ítem 3)
    email: EmailStr 
    password: str = Field(..., min_length=6)
    recordarme: bool = False

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    requiere_cambio_password: bool