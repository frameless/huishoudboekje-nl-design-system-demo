from core_service.database import db
from sqlalchemy import Column, String, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

class Grootboekrekening(db.Model):
    __tablename__ = 'grootboekrekeningen'

    id = Column(String, primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    referentie = Column(String)
    naam = Column(String)
    omschrijving = Column(String)
    parent_id = Column(String, ForeignKey('grootboekrekeningen.id'))
    # parent_uuid = Column(UUID, ForeignKey('grootboekrekeningen.id'))
    children = relationship("Grootboekrekening")
    debet = Column(Boolean)

    @property
    def credit(self):
        return not self.debet