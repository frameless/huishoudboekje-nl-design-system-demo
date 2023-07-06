from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Rubriek(db.Model):
    __tablename__ = 'rubrieken'

    id = Column(Integer, Sequence('rubrieken_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    naam = Column(String)
    # deze unique maken en testen
    grootboekrekening_id = Column(String, unique=True)
    # grootboekrekening_uuid = Column(UUID, unique=True)

    afspraken = relationship("Afspraak", back_populates="rubriek")
