from core_service.database import db
from sqlalchemy import Column, Integer, func, Sequence
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Afdeling(db.Model):
    __tablename__ = 'afdelingen'

    id = Column(Integer, Sequence('afdelingen_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    organisatie_id = Column(Integer)
    # organisatie_uuid = Column(UUID)

    rekeningen = relationship(
        "RekeningAfdeling",
        back_populates="afdeling",
        cascade="all, delete" # cascade only deletes relationship, not the rekening
    )

    afspraken = relationship(
        "Afspraak",
        back_populates="afdelingen"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "organistie_id": self.organisatie_id
        }
