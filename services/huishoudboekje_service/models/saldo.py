import logging

from models.huishouden import Huishouden
from sqlalchemy import Column, DateTime, event, ForeignKey, Integer, Sequence, String
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import relationship, Session

from core_service.database import db


class Saldo(db.Model):
    __tablename__ = "saldos"

    id = Column(Integer, Sequence("burgers_id_seq"), primary_key=True)

    # Foreign Keys
    burger_id = Column(Integer, ForeignKey(
        "burgers.id"), nullable=False)

    # DateTime fields
    begindatum = Column(DateTime)
    einddatum = Column(DateTime)

    # Integer fields
    saldo = Column(Integer, nullable=False, default=0)

    # Relationships
    burger = relationship("Burger", back_populates="saldos")
