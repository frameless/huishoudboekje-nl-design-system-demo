from core_service.database import db
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class RekeningAfdeling(db.Model):
    __tablename__ = 'rekening_afdeling'
    rekening_id = Column(Integer, ForeignKey('rekeningen.id'), primary_key=True, nullable=False)
    afdeling_id = Column(Integer, ForeignKey('afdelingen.id'), primary_key=True, nullable=False)
    # rekening_uuid = Column(UUID, ForeignKey('rekeningen.uuid'), primary_key=True, nullable=False)
    # afdeling_uuid = Column(UUID, ForeignKey('afdelingen.uuid'), primary_key=True, nullable=False)

    rekening = relationship("Rekening", back_populates="afdelingen")
    afdeling = relationship("Afdeling", back_populates="rekeningen")

