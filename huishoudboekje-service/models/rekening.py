from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from core.database import db


class Rekening(db.Model):
    __tablename__ = 'rekening'
    __table_args__ = (
            CheckConstraint('NOT(organisatie_id IS NULL AND gebruiker_id IS NULL)'),
            )

    id = Column(Integer, Sequence('rekening_id_seq'), primary_key=True)
    iban = Column(String, nullable=False)
    rekeninghouder = Column(String, nullable=False)

    gebruiker_id = Column(Integer, ForeignKey('gebruikers.id'))
    gebruiker = relationship("Gebruiker", back_populates="rekening")

    organisatie_id = Column(Integer, ForeignKey('organisaties.id'))
    organisatie = relationship("Organisatie", back_populates="rekening")

    def to_dict(self):
        return {
            "id": self.id,
            "iban": self.iban,
            "rekeninghouder": self.rekeninghouder,
            "gebruiker_id": self.gebruiker_id,
            "organisatie_id": self.organisatie_id
        }
