from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from core_service.database import db

class Grootboekrekening(db.Model):
    __tablename__ = 'grootboekrekeningen'

    id = Column(String, primary_key=True)
    referentie = Column(String)
    naam = Column(String)
    omschrijving = Column(String)
    parent_id = Column(String, ForeignKey('grootboekrekeningen.id'))
    children = relationship("Grootboekrekening")
    debet = Column(Boolean)

    @property
    def credit(self):
        return not self.debet