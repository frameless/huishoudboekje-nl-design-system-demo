from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from gebruikers_database.database import db

class Burger(db.Model):
    __tablename__ = 'burgers'

    id = Column(Integer, Sequence('burgers_id_seq'), primary_key=True)

    gebruiker_id = Column(Integer, ForeignKey('gebruikers.id'))
    gebruiker = relationship("Gebruiker", back_populates="burger")

    # Name fields
    voornamen = Column(String)
    voorletters = Column(String)
    voorvoegsel = Column(String)
    geslachtsnaam = Column(String)

    # Adress fields
    straatnaam = Column(String)
    huisnummer = Column(Integer)
    huisletter = Column(String)
    huistoevoeging = Column(String)
    postcode = Column(String)
    woonplaatsnaam = Column(String)

    def to_dict(self):
        return {
            "gebruiker_id": self.gebruiker_id,
            "voornamen": self.voornamen,
            "voorletters": self.voorletters,
            "voorvoegsel": self.voorvoegsel,
            "geslachtsnaam": self.geslachtsnaam,
            "straatnaam": self.straatnaam,
            "huisnummer": self.huisnummer,
            "huisletter": self.huisletter,
            "huistoevoeging": self.huistoevoeging,
            "postcode": self.postcode,
            "woonplaatsnaam": self.woonplaatsnaam
        }
