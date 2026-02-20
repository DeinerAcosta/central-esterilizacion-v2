# app/core/security.py
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

# Configuración de bcrypt para hashear contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "una_clave_muy_secreta_y_larga_aqui")
ALGORITHM = "HS256"

def verificar_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def crear_token_acceso(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt