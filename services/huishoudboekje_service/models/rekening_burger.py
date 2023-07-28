from core_service.database import db
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class RekeningBurger(db.Model):
    __tablename__ = 'rekening_burger'
    rekening_id = Column(Integer, ForeignKey('rekeningen.id'), primary_key=True, nullable=False)
    burger_id = Column(Integer, ForeignKey('burgers.id'), primary_key=True, nullable=False)
    # rekening_uuid = Column(UUID, ForeignKey('rekeningen.uuid'), primary_key=True, nullable=False)
    # burger_uuid = Column(UUID, ForeignKey('burgers.uuid'), primary_key=True, nullable=False)

    rekening = relationship("Rekening", back_populates="burgers")
    burger = relationship("Burger", back_populates="rekeningen")
