from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from core.database import db


class RekeningOrganisatie(db.Model):
    __tablename__ = 'rekening_organisatie_tabel'
    rekening_id = Column(Integer, ForeignKey('rekening.id'), primary_key=True, nullable=False)
    organisatie_id = Column(Integer, ForeignKey('organisaties.id'), primary_key=True, nullable=False)
    rekening = relationship("Rekening", back_populates="organisaties")
    organisatie = relationship("Organisatie", back_populates="rekeningen")
