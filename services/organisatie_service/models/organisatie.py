from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    id = Column(Integer, Sequence('organisaties_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    kvknummer = Column(String)
    vestigingsnummer = Column(String)
    naam = Column(String)

    afdelingen = relationship("Afdeling", back_populates="organisaties")

    def to_dict(self):
        return {
            "id": self.id,
            "kvknummer": self.kvknummer,
            "vestigingsnummer": self.vestigingsnummer,
            "naam": self.naam
        }
