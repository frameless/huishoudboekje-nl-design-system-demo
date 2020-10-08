from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from core.database import db

class Burger(db.Model):
    __tablename__ = 'burgers'

    id = Column(Integer, Sequence('burgers_id_seq'), primary_key=True)

    gebruiker_id = Column(Integer, ForeignKey('gebruikers.id'))
    gebruiker = relationship("Gebruiker", back_populates="burger")

    # Name fields
    voornamen = Column(String)
    voorletters = Column(String)
    achternaam = Column(String)

    # Adress fields
    straatnaam = Column(String)
    huisnummer = Column(String)
    postcode = Column(String)
    woonplaatsnaam = Column(String)

    def to_dict(self):
        return {
            "gebruiker_id": self.gebruiker_id,
            "voornamen": self.voornamen,
            "voorletters": self.voorletters,
            "achternaam": self.achternaam,
            "straatnaam": self.straatnaam,
            "huisnummer": self.huisnummer,
            "postcode": self.postcode,
            "woonplaatsnaam": self.woonplaatsnaam
        }
