from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from core_service.database import db


class RekeningAfdeling(db.Model):
    __tablename__ = 'rekening_afdeling'
    rekening_id = Column(Integer, ForeignKey('rekeningen.id'), primary_key=True, nullable=False)
    afdeling_id = Column(Integer, ForeignKey('afdelingen.id'), primary_key=True, nullable=False)

    rekening = relationship("Rekening", back_populates="afdelingen")
    afdeling = relationship("Afdeling", back_populates="rekeningen")

