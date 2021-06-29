from sqlalchemy import Column, Date, event, ForeignKey, Integer, Sequence, String
from sqlalchemy.orm import relationship, Session

from core_service.database import db


class Burger(db.Model):
    __tablename__ = "burgers"

    id = Column(Integer, Sequence("burgers_id_seq"), primary_key=True)

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

    huishouden_id = Column(Integer, ForeignKey("huishoudens.id"), nullable=False)

    # Relations from other models
    rekeningen = relationship(
        "RekeningBurger",
        back_populates="burger",
        cascade="all, delete",  # cascade only deletes relationship, not the rekening
    )
    afspraken = relationship("Afspraak")
    huishouden = relationship("Huishouden", back_populates="burgers")


@event.listens_for(Burger, "after_delete")
def delete_burger(mapper, connection, target):
    """
    Listener to ensure that on burger deletion, any remaining empty households get deleted automatically.

    Inspired by:
    https://stackoverflow.com/questions/51419186/delete-parent-object-when-all-children-have-been-deleted-in-sqlalchemy#answer-51773089
    """

    @event.listens_for(Session, "after_flush", once=True)
    def receive_after_flush(session, context):
        remaining_burgers_in_huishouden = (
            session.query(Burger).filter_by(huishouden_id=target.huishouden_id).all()
        )
        if not remaining_burgers_in_huishouden:
            session.delete(target.huishouden)
