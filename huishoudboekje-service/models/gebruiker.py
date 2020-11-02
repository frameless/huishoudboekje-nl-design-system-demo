from flask import abort, make_response
from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship
from sqlalchemy.orm.exc import NoResultFound

from core.database import db


class Gebruiker(db.Model):
    __tablename__ = 'gebruikers'

    id = Column(Integer, Sequence('gebruikers_id_seq'), primary_key=True)

    # Name fields
    voornamen = Column(String)
    voorletters = Column(String)
    achternaam = Column(String)

    # Adress fields
    straatnaam = Column(String)
    huisnummer = Column(String)
    postcode = Column(String)
    plaatsnaam = Column(String)

    # Gebruiker fields
    telefoonnummer = Column(String)
    email = Column(String)
    geboortedatum = Column(Date)
    iban = Column(String)

    # Relations from other models
    rekeningen = relationship("RekeningGebruiker", back_populates="gebruiker")
    afspraken = relationship("Afspraak")