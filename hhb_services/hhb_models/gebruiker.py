import enum
from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship
from hhb_services.app import db

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

    def __repr__(self):
        return f"<Gebruiker(id='{self.id}')>"
