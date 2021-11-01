from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from core_service.database import db

class Afdeling(db.Model):
    __tablename__ = 'afdelingen'

    id = Column(Integer, Sequence('afdelingen_id_seq'), primary_key=True)
    naam = Column(String)
    organisatie_id = Column(Integer, ForeignKey("organisaties.id"), nullable=False)
    postadressen_ids = Column(ARRAY(String))

    organisaties = relationship("Organisatie", back_populates="afdelingen")

    def to_dict(self):
        return {
            "id": self.id,
            "naam": self.naam,
            "organisatie_id": self.organisatie_id,
            "postadressen_ids": self.postadressen_ids
        }
