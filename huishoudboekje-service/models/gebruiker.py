from flask import abort, make_response
from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship
from sqlalchemy.orm.exc import NoResultFound

from core.database import db


class Gebruiker(db.Model):
    __tablename__ = 'gebruikers'

    id = Column(Integer, Sequence('gebruikers_id_seq'), primary_key=True)

    # Name fields
    voornamen = Column(String)
    voorletters = Column(String)
    achternaam = Column(String)

    # Adress fields
    straatnaam = Column(String)
    huisnummer = Column(String)
    postcode = Column(String)
    plaatsnaam = Column(String)

    # Gebruiker fields
    telefoonnummer = Column(String)
    email = Column(String)
    geboortedatum = Column(Date)
    iban = Column(String)

    # Relations from other models
    rekeningen = relationship("RekeningGebruiker", back_populates="gebruiker")
    afspraken = relationship("Afspraak")

    def to_dict(self):
        return_data = {
            "id": self.id,
            "telefoonnummer": self.telefoonnummer,
            "email": self.email,
            "iban": self.iban,
            "voornamen": self.voornamen,
            "voorletters": self.voorletters,
            "achternaam": self.achternaam,
            "straatnaam": self.straatnaam,
            "huisnummer": self.huisnummer,
            "postcode": self.postcode,
            "plaatsnaam": self.plaatsnaam
        }

        try:
            return_data["geboortedatum"] = self.geboortedatum.isoformat()
        except AttributeError:
            return_data["geboortedatum"] = ""

        return return_data

def get_gebruiker(gebruiker_id: int) -> Gebruiker:
    """ Get Gebruiker object based on id """
    try:
        int(gebruiker_id)
    except ValueError:
        abort(make_response({"errors": ["The supplied gebruiker_id is not a number."]}, 400))

    try:
        return db.session.query(Gebruiker).filter_by(id=gebruiker_id).one()
    except NoResultFound:
        abort(make_response({"errors": ["The requested resource could not be found."]}, 404))