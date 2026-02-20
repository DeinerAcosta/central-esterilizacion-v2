# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from app.db.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import LoginRequest, TokenResponse
from app.core.security import verificar_password, crear_token_acceso

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Buscar usuario por email (Ítem 5)
    usuario = db.query(Usuario).filter(Usuario.email == request.email).first()
    
    # 2. Validación de existencia y contraseña con mensaje genérico (Ítems 5, 6 y 7)
    if not usuario or not verificar_password(request.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )
    
    # 3. Validar estado (Ítem 8)
    if usuario.estado != "activo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Su cuenta se encuentra inactiva o bloqueada. Contacte al administrador."
        )

    # 4. Lógica de "Recordarme" para expiración del token (Ítem 9)
    if request.recordarme:
        expires_delta = timedelta(days=7) # 7 días si marca recordarme
    else:
        expires_delta = timedelta(hours=2) # 2 horas sesión normal

    # 5. Generar JWT incluyendo si es provisional (Ítems 10 y 11)
    token_data = {
        "sub": str(usuario.id),
        "email": usuario.email,
        "es_provisional": usuario.es_password_provisional
    }
    access_token = crear_token_acceso(data=token_data, expires_delta=expires_delta)

    # 6. Auditoría: Actualizar último acceso (Ítem 12)
    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "requiere_cambio_password": usuario.es_password_provisional
    }