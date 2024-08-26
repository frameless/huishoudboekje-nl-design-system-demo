from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Journaalpost(db.Model):
    __tablename__ = 'journaalposten'

    id = Column(Integer, Sequence('journaalposten_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    afspraak_id = Column(Integer, ForeignKey('afspraken.id'))
    # afspraak_uuid = Column(UUID, ForeignKey('afspraken.uuid'))
    afspraken = relationship("Afspraak", back_populates="journaalposten")

    transaction_id = Column(Integer, index=True)
    transaction_uuid = Column(UUID, index=True)
    
    grootboekrekening_id = Column(String)
    # grootboekrekening_uuid = Column(UUID)
    
    is_automatisch_geboekt = Column(Boolean)
