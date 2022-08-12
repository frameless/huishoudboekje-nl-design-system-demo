import logging

from models.huishouden import Huishouden
from sqlalchemy import Column, Date, event, ForeignKey, Integer, Sequence, String
from sqlalchemy.exc import OperationalError
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

    bsn = Column(Integer, unique=True)

    # Relations from other models
    rekeningen = relationship(
        "RekeningBurger",
        back_populates="burger",
        cascade="all, delete",  # cascade only deletes relationship, not the rekening
    )
    afspraken = relationship("Afspraak")
    huishouden = relationship("Huishouden", back_populates="burgers")


"""
Event hooks for ensuring huishouden orphanage removal. 
Inspired by:
https://stackoverflow.com/questions/51419186/delete-parent-object-when-all-children-have-been-deleted-in-sqlalchemy#answer-51773089 
"""


# TODO: these events are fairly rigorous and could possibly be improved.
def delete_orphaned_huishoudens(session):
    # don't let the request that updates/deletes a burger fail if the orphans can't be removed
    try:
        huishouden_ids = session.query(Burger.huishouden_id).all()
        huishouden_ids = {id for (id,) in huishouden_ids}
        session.query(Huishouden).filter(Huishouden.id.not_in(huishouden_ids)).delete()
    except OperationalError as error:
        logging.exception(error)


@event.listens_for(Burger, "after_update")
def receive_after_update(mapper, connection, target):
    @event.listens_for(Session, "after_flush", once=True)
    def receive_after_flush(session, context):
        delete_orphaned_huishoudens(session=session)


@event.listens_for(Burger, "after_delete")
def receive_after_delete(mapper, connection, target):
    @event.listens_for(Session, "after_flush", once=True)
    def receive_after_flush(session, context):
        delete_orphaned_huishoudens(session=session)
