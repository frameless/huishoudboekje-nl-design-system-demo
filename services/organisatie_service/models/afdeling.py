from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY

class Afdeling(db.Model):
    __tablename__ = 'afdelingen'

    id = Column(Integer, Sequence('afdelingen_id_seq'), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    naam = Column(String)
    organisatie_id = Column(Integer, ForeignKey("organisaties.id"), nullable=False)
    # organisatie_uuid = Column(Integer, ForeignKey("organisaties.uuid"), nullable=False)
    postadressen_ids = Column(ARRAY(String))
    # postadressen_uuids = Column(ARRAY(UUID))
    rekeningen_ids = Column(ARRAY(Integer))
    # rekeningen_uuids = Column(ARRAY(UUID))

    organisaties = relationship("Organisatie", back_populates="afdelingen")

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "naam": self.naam,
            "organisatie_id": self.organisatie_id,
            "postadressen_ids": self.postadressen_ids,
            "rekeningen_ids": self.rekeningen_ids
        }
