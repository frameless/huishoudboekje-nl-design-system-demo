from sqlalchemy import Column, Integer, Sequence, String
from sqlalchemy.orm import relationship

from core_service.database import db


class Rekening(db.Model):
    __tablename__ = "rekeningen"

    id = Column(Integer, Sequence("rekeningen_id_seq"), primary_key=True)
    iban = Column(String, nullable=False)
    rekeninghouder = Column(String(length=100), nullable=False)

    burgers = relationship("RekeningBurger", back_populates="rekening")
    afdelingen = relationship("RekeningAfdeling", back_populates="rekening")
    afspraken = relationship("Afspraak", back_populates="tegen_rekening")

    @classmethod
    def get_max_rekeninghouder_length(cls):
        return cls.rekeninghouder.property.columns[0].type.length
