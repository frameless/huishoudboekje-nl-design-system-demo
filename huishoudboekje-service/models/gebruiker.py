from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship
from flask import abort, make_response
from sqlalchemy.orm.exc import NoResultFound
from database.database import db

class Gebruiker(db.Model):
    __tablename__ = 'gebruikers'

    id = Column(Integer, Sequence('gebruikers_id_seq'), primary_key=True)

    burger = relationship("Burger", uselist=False, back_populates="gebruiker")

    # Gebruiker fields
    telefoonnummer = Column(String)
    email = Column(String)
    geboortedatum = Column(Date)

    def to_dict(self):
        return_data = {
            "id": self.id,
            "telefoonnummer": self.telefoonnummer,
            "email": self.email,
        }

        try:
            return_data["geboortedatum"] = self.geboortedatum.isoformat()
        except AttributeError:
            return_data["geboortedatum"] = ""

        if self.burger:
            return_data["burger_id"] = self.burger.id
        else:
            return_data["burger_id"] = None

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