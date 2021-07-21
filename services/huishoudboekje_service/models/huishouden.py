from sqlalchemy import Column, Integer, Sequence
from sqlalchemy.orm import relationship

from core_service.database import db


class Huishouden(db.Model):
    __tablename__ = "huishoudens"

    id = Column(Integer, Sequence("huishoudens_id_seq"), primary_key=True)

    burgers = relationship("Burger", back_populates="huishouden")
