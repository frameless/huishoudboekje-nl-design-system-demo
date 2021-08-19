from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from core_service.database import db

class Organisatie(db.Model):
    __tablename__ = 'organisaties'

    id = Column(Integer, Sequence('organisaties_id_seq'), primary_key=True)
    kvk_nummer = Column(String)
    vestigingsnummer = Column(String)
    naam = Column(String)
    straatnaam = Column(String)
    huisnummer = Column(String)
    postcode = Column(String)
    plaatsnaam = Column(String)

    def to_dict(self):
        return {
            "id": self.id,
            "kvk_nummer": self.kvk_nummer,
            "vestigingsnummer": self.vestigingsnummer,
            "naam": self.naam,
            "straatnaam": self.straatnaam,
            "huisnummer": self.huisnummer,
            "postcode": self.postcode,
            "plaatsnaam": self.plaatsnaam
        }
