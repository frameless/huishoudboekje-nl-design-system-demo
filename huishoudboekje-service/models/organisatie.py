from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import relationship

from core.database import db


class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    id = Column(Integer, Sequence('organisaties_id_seq'), primary_key=True)
    weergave_naam = Column(String)
    kvk_nummer = Column(String, unique=True)

    rekening = relationship("Rekening", back_populates="organisatie")

    def to_dict(self):
        return {
            "id": self.id,
            "weergave_naam": self.weergave_naam,
            "kvk_nummer": self.kvk_nummer
        }
