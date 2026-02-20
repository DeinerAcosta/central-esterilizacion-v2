# app/models/usuario.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    estado = Column(String(20), default="activo") # activo, inactivo, bloqueado
    es_password_provisional = Column(Boolean, default=False)
    ultimo_acceso = Column(DateTime, nullable=True)
    creado_en = Column(DateTime, default=datetime.utcnow)