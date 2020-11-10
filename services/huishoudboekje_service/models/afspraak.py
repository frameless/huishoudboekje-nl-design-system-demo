from sqlalchemy import Column, Integer, String, Sequence, Date, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.orm.exc import NoResultFound
from flask import abort, make_response
from core_service.database import db

class Afspraak(db.Model):
    __tablename__ = 'afspraken'

    id = Column(Integer, Sequence('afspraken_id_seq'), primary_key=True)
    gebruiker_id = Column(Integer, ForeignKey('gebruikers.id'))
    gebruiker = relationship("Gebruiker", back_populates="afspraken")
    beschrijving = Column(String)
    start_datum = Column(Date)
    eind_datum = Column(Date)
    aantal_betalingen = Column(Integer)
    interval = Column(String)
    tegen_rekening_id = Column(Integer, ForeignKey('rekeningen.id'))
    tegen_rekening = relationship("Rekening", back_populates="afspraken")
    bedrag = Column(Integer)
    credit = Column(Boolean)
    kenmerk = Column(String)
    actief = Column(Boolean)