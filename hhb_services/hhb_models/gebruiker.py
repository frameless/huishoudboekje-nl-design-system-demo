import enum
from sqlalchemy import Column, Integer, String, Sequence, Date
from sqlalchemy.orm import relationship
from hhb_services.app import db

class Gebruiker(db.Model):
    __tablename__ = 'gebruikers'

    id = Column(Integer, Sequence('gebruikers_id_seq'), primary_key=True)

    burger = relationship("Burger", uselist=False, back_populates="gebruiker")

    # Gebruiker fields
    burgerservicenummeer = Column(String)
    telefoon = Column(String)
    email = Column(String)
    geboortedatum = Column(Date)

    def to_dict(self):

        geboortedatum = ""
        try:
            geboortedatum = self.geboortedatum.isoformat()
        except AttributeError:
            pass

        return {
            "id": self.id,
            "burgerservicenummeer": self.burgerservicenummeer,
            "telefoon": self.telefoon,
            "email": self.email,
            "geboortedatum": geboortedatum
        }

    def __repr__(self):
        return f"<Gebruiker(id='{self.id}'>"