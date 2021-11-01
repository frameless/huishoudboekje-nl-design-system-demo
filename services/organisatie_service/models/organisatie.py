from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from core_service.database import db

class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    id = Column(Integer, Sequence('organisaties_id_seq'), primary_key=True)
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
