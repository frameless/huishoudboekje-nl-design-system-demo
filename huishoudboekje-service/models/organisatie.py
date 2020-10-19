from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship
from flask import abort, make_response
from sqlalchemy.orm.exc import NoResultFound
from core.database import db

class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    id = Column(Integer, Sequence('organisaties_id_seq'), primary_key=True)
    weergave_naam = Column(String)
    kvk_nummer = Column(Integer, unique=True)

    def to_dict(self):
        return {
            "id": self.id,
            "weergave_naam": self.weergave_naam,
            "kvk_nummer": str(self.kvk_nummer).zfill(8)
        }
    