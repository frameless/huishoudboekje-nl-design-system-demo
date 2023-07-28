from core_service.database import db
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Sequence, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Saldo(db.Model):
    __tablename__ = "saldos"

    id = Column(Integer, Sequence("saldos_id_seq"), primary_key=True)
    uuid = Column(UUID, default=func.gen_random_uuid(),
                  nullable=False, unique=True, index=True)

    # Foreign Keys
    burger_id = Column(Integer, ForeignKey("burgers.id"), nullable=False)
    # burger_uuid = Column(UUID, ForeignKey("burgers.uuid"), nullable=False)

    # DateTime fields
    begindatum = Column(DateTime)
    einddatum = Column(DateTime)

    # Integer fields
    saldo = Column(Integer, nullable=False, default=0)

    # Relationships
    burger = relationship("Burger", back_populates="saldos")
