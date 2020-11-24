from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Table
from sqlalchemy.orm import relationship

from core_service.database import db


class Rubriek(db.Model):
    __tablename__ = 'rubrieken'

    id = Column(Integer, Sequence('rubrieken_id_seq'), primary_key=True)
    naam = Column(String)
    grootboekrekening_id = Column(String)
    afspraken = relationship("Afspraak", back_populates="rubriek")