from core_service.database import db
from sqlalchemy import Column, Integer, Sequence, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Huishouden(db.Model):
    __tablename__ = "huishoudens"

    id = Column(Integer, Sequence("huishoudens_id_seq"), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    burgers = relationship("Burger", back_populates="huishouden")
