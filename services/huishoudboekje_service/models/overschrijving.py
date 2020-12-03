from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Table, Date
from sqlalchemy.orm import relationship

from core_service.database import db


class Overschrijving(db.Model):
    __tablename__ = 'overschrijvingen'

    id = Column(Integer, Sequence('overschrijvingen_id_seq'), primary_key=True)
    afspraak_id = Column(Integer, ForeignKey('afspraken.id'))
    afspraak = relationship("Afspraak", back_populates="overschrijvingen")
    #Todo make FK
    export_id = Column(Integer)
    datum = Column(Date)
    bedrag = Column(Integer)
    bank_transaction_id = Column(Integer)
