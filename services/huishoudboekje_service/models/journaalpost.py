from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Boolean
from sqlalchemy.orm import relationship


class Journaalpost(db.Model):
    __tablename__ = 'journaalposten'

    id = Column(Integer, Sequence('journaalposten_id_seq'), primary_key=True)
    afspraak_id = Column(Integer, ForeignKey('afspraken.id'))
    afspraak = relationship("Afspraak", back_populates="journaalposten")
    transaction_id = Column(Integer)
    grootboekrekening_id = Column(String)
    is_automatisch_geboekt = Column(Boolean)
