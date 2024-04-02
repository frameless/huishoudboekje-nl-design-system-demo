from core_service.database import db
from sqlalchemy import ARRAY, Column, Index, Integer, String, Sequence, DateTime, Boolean, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class Afspraak(db.Model):
    __tablename__ = 'afspraken'
    __table_args__ = (
        Index("ix_afspraken_zoektermen", 'zoektermen', postgresql_using="gin"),
    )

    id = Column(Integer, Sequence('afspraken_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    burger_id = Column(Integer, ForeignKey('burgers.id'))
    # burger_uuid = Column(UUID, ForeignKey('burgers.uuid'))
    burger = relationship("Burger", back_populates="afspraken")

    omschrijving = Column(String)
    valid_from = Column(DateTime)
    valid_through = Column(DateTime)
    aantal_betalingen = Column(Integer)
    betaalinstructie = Column(JSONB(none_as_null=True))

    rubriek_id = Column(Integer, ForeignKey('rubrieken.id'))
    # rubriek_uuid = Column(UUID, ForeignKey('rubrieken.uuid'))
    rubriek = relationship("Rubriek", back_populates="afspraken")

    tegen_rekening_id = Column(Integer, ForeignKey('rekeningen.id'), index=True)
    # tegen_rekening_uuid = Column(UUID, ForeignKey('rekeningen.uuid'), index=True)
    tegen_rekening = relationship("Rekening", back_populates="afspraken")
    
    bedrag = Column(Integer)
    credit = Column(Boolean)
    zoektermen = Column(ARRAY(String))
    journaalposten = relationship("Journaalpost", back_populates="afspraken")
    overschrijvingen = relationship("Overschrijving", back_populates="afspraken")
    
    afdeling_id = Column(Integer, ForeignKey("afdelingen.id"))
    # afdeling_uuid = Column(UUID, ForeignKey("afdelingen.uuid"))
    afdelingen = relationship("Afdeling", back_populates="afspraken")
    
    postadres_id = Column(String)
    alarm_id = Column(String)
    # postadres_uuid = Column(UUID, nullable=True)
    alarm_uuid = Column(UUID, nullable=True)
