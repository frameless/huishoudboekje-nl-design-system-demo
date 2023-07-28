from core_service.database import db
from sqlalchemy import Column, Integer, Sequence, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Overschrijving(db.Model):
    __tablename__ = 'overschrijvingen'

    id = Column(Integer, Sequence('overschrijvingen_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    afspraak_id = Column(Integer, ForeignKey('afspraken.id'))
    # afspraak_uuid = Column(UUID, ForeignKey('afspraken.uuid'))
    afspraken = relationship("Afspraak", back_populates="overschrijvingen")
    
    export_id = Column(Integer, ForeignKey('export.id', name='overschrijvingen_export_id_fkey'))
    # export_uuid = Column(UUID, ForeignKey('export.uuid', name='overschrijvingen_export_uuid_fkey'))
    export = relationship("Export", back_populates="overschrijvingen")
    
    datum = Column(DateTime)
    bedrag = Column(Integer)
    
    bank_transaction_id = Column(Integer)
    # bank_transaction_uuid = Column(UUID)
