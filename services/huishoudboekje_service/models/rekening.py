from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Table
from sqlalchemy.orm import relationship

from core_service.database import db


class Rekening(db.Model):
    __tablename__ = 'rekeningen'

    id = Column(Integer, Sequence('rekeningen_id_seq'), primary_key=True)
    iban = Column(String, nullable=False)
    rekeninghouder = Column(String(length=100), nullable=False)

    burgers = relationship("RekeningBurger", back_populates="rekening")
    organisaties = relationship("RekeningOrganisatie", back_populates="rekening")
    afspraken = relationship("Afspraak", back_populates="tegen_rekening")
