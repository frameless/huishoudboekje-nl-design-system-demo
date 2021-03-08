from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship


class Burger(db.Model):
    __tablename__ = 'burgers'

    id = Column(Integer, Sequence('burgers_id_seq'), primary_key=True)

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
    rekeningen = relationship("RekeningBurger",
        back_populates="burger",
        cascade="all, delete" # cascade only deletes relationship, not the rekening
    )
    afspraken = relationship("Afspraak")
