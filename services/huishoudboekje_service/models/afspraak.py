from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship


class Afspraak(db.Model):
    __tablename__ = 'afspraken'

    id = Column(Integer, Sequence('afspraken_id_seq'), primary_key=True)
    burger_id = Column(Integer, ForeignKey('burgers.id'))
    burger = relationship("Burger", back_populates="afspraken")
    beschrijving = Column(String)
    start_datum = Column(Date)
    eind_datum = Column(Date)
    aantal_betalingen = Column(Integer)
    interval = Column(String)
    rubriek_id = Column(Integer, ForeignKey('rubrieken.id'))
    rubriek = relationship("Rubriek", back_populates="afspraken")
    tegen_rekening_id = Column(Integer, ForeignKey('rekeningen.id'))
    tegen_rekening = relationship("Rekening", back_populates="afspraken")
    bedrag = Column(Integer)
    credit = Column(Boolean)
    kenmerk = Column(String)
    actief = Column(Boolean)
    automatische_incasso = Column(Boolean)
    automatisch_boeken = Column(Boolean)
    organisatie_id = Column(Integer, ForeignKey('organisaties.id'))
    organisatie = relationship("Organisatie", back_populates="afspraken")
    journaalposten = relationship("Journaalpost", back_populates="afspraak")
    overschrijvingen = relationship("Overschrijving", back_populates="afspraak")
