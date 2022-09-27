from core_service.database import db
from sqlalchemy import ARRAY, Column, Index, Integer, String, Sequence, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Afspraak(db.Model):
    __tablename__ = 'afspraken'
    __table_args__ = (
        Index("ix_afspraken_zoektermen", 'zoektermen', postgresql_using="gin"),
    )

    id = Column(Integer, Sequence('afspraken_id_seq'), primary_key=True)
    burger_id = Column(Integer, ForeignKey('burgers.id'))
    burger = relationship("Burger", back_populates="afspraken")
    omschrijving = Column(String)
    valid_from = Column(DateTime)
    valid_through = Column(DateTime)
    aantal_betalingen = Column(Integer)
    betaalinstructie = Column(JSONB(none_as_null=True))
    rubriek_id = Column(Integer, ForeignKey('rubrieken.id'))
    rubriek = relationship("Rubriek", back_populates="afspraken")
    tegen_rekening_id = Column(Integer, ForeignKey('rekeningen.id'), index=True)
    tegen_rekening = relationship("Rekening", back_populates="afspraken")
    bedrag = Column(Integer)
    credit = Column(Boolean)
    zoektermen = Column(ARRAY(String))
    journaalposten = relationship("Journaalpost", back_populates="afspraken")
    overschrijvingen = relationship("Overschrijving", back_populates="afspraken")
    afdeling_id = Column(Integer, ForeignKey("afdelingen.id"))
    afdelingen = relationship("Afdeling", back_populates="afspraken")
    postadres_id = Column(String)
    alarm_id = Column(String)
