from sqlalchemy import Column, Integer, String, Sequence, Date
from hhb_services.app import db

class Burger(db.Model):
    __tablename__ = 'burgers'

    id = Column(Integer, Sequence('burgers_id_seq'), primary_key=True)
    burgerservicenummer = Column(String)

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
            "id": self.id,
            "burgerservicenummer": self.burgerservicenummer,
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

    def __repr__(self):
        return f"<Burger(id='{self.id}'>"
