from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import relationship

from core_service.database import db


class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    id = Column(Integer, Sequence('organisaties_id_seq'), primary_key=True)
    kvk_nummer = Column(String, unique=True)
    vestigingsnummer = Column(Integer)

    rekeningen = relationship("RekeningOrganisatie",
        back_populates="organisatie",
        cascade="all, delete" # cascade only deletes relationship, not the rekening
    )
    afspraken = relationship("Afspraak")
    
    def to_dict(self):
        return {
            "id": self.id,
            "kvk_nummer": self.kvk_nummer,
            "vestigingsnummer": self.vestigingsnummer
        }
