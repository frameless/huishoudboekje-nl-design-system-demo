from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Table
from sqlalchemy.orm import relationship

from core.database import db


class Rekening(db.Model):
    __tablename__ = 'rekening'

    id = Column(Integer, Sequence('rekening_id_seq'), primary_key=True)
    iban = Column(String, nullable=False)
    rekeninghouder = Column(String, nullable=False)

    gebruikers = relationship("RekeningGebruiker", back_populates="rekening")
    organisaties = relationship("RekeningOrganisatie", back_populates="rekening")

    def to_dict(self):
        return {
            "id": self.id,
            "iban": self.iban,
            "rekeninghouder": self.rekeninghouder,
            "gebruikers": [g.id for g in self.gebruikers],
            "organisaties": [o.id for o in self.organisaties]
        }
