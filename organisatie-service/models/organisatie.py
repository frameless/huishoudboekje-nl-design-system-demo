from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from core.database import db

class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    kvk_nummer = Column(Integer, primary_key=True)
    naam = Column(String)
    straatnaam = Column(String)
    huisnummer = Column(String)
    postcode = Column(String)
    plaatsnaam = Column(String)

    def to_dict(self):
        return {
            "kvk_nummer": str(self.kvk_nummer).zfill(8),
            "naam": self.naam,
            "straatnaam": self.straatnaam,
            "huisnummer": self.huisnummer,
            "postcode": self.postcode,
            "plaatsnaam": self.plaatsnaam
        }
