from sqlalchemy import Column, Integer, String, Sequence, TIMESTAMP
from sqlalchemy.orm import relationship

from core_service.database import db


class Export(db.Model):
    __tablename__ = 'export'

    id = Column(Integer, Sequence('export_id_seq'), primary_key=True)
    naam = Column(String, nullable=False, unique=True, index=True)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False, index=True)

    overschrijvingen = relationship("Overschrijving", back_populates="export")

    def to_dict(self):
        return {
            "id": self.id,
            "naam": self.naam,
            "timestamp": self.timestamp
        }
