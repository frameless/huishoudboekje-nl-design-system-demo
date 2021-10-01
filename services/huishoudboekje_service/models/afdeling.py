from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import relationship

from core_service.database import db


class Afdeling(db.Model):
    __tablename__ = 'afdelingen'

    id = Column(Integer, Sequence('afdelingen_id_seq'), primary_key=True)
    organisatie_id = Column(Integer)

    rekeningen = relationship("RekeningAfdeling",
                              back_populates="afdeling",
                              cascade="all, delete" # cascade only deletes relationship, not the rekening
                              )

    afspraken = relationship("Afspraak",
                             back_populates="afdelingen")

    def to_dict(self):
        return {
            "id": self.id,
            "organistie_id": self.organisatie_id
        }
