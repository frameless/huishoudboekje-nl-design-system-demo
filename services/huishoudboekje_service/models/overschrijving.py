from core_service.database import db
from sqlalchemy import Column, Integer, Sequence, ForeignKey, Date
from sqlalchemy.orm import relationship


class Overschrijving(db.Model):
    __tablename__ = 'overschrijvingen'

    id = Column(Integer, Sequence('overschrijvingen_id_seq'), primary_key=True)
    afspraak_id = Column(Integer, ForeignKey('afspraken.id'))
    afspraak = relationship("Afspraak", back_populates="overschrijvingen")
    export_id = Column(Integer, ForeignKey('export.id', name='overschrijvingen_export_id_fkey'))
    export = relationship("Export", back_populates="overschrijvingen")
    datum = Column(Date)
    bedrag = Column(Integer)
    bank_transaction_id = Column(Integer)
