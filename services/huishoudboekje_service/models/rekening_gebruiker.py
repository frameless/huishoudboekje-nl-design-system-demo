from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from core_service.database import db


class RekeningGebruiker(db.Model):
    __tablename__ = 'rekening_gebruiker'
    rekening_id = Column(Integer, ForeignKey('rekeningen.id'), primary_key=True, nullable=False)
    gebruiker_id = Column(Integer, ForeignKey('gebruikers.id'), primary_key=True, nullable=False)
    rekening = relationship("Rekening", back_populates="gebruikers")
    gebruiker = relationship("Gebruiker", back_populates="rekeningen")