""" Factories to generate objects within a test scope """

from models import Gebruiker, Organisatie
from models.rekening import Rekening


class RekeningFactory:
    """ Factory for Rekening objects """

    def __init__(self, session):
        self.dbsession = session

    def create_gebruiker_rekening(
            self,
            gebruiker: Gebruiker,
            iban: str = "GB33BUKB20201555555555",
            rekeninghouder: str = "B. Huismans"
    ):
        rekening = Rekening(
            iban=iban,
            rekeninghouder=rekeninghouder,
            gebruiker=gebruiker
        )
        self.dbsession.add(rekening)
        self.dbsession.flush()
        return rekening

    def create_organisatie_rekening(
            self,
            organisatie: Organisatie,
            iban: str = "GB33BUKB20201555555555",
            rekeninghouder: str = "B. Huismans"
    ):
        rekening = Rekening(
            iban=iban,
            rekeninghouder=rekeninghouder,
            organisatie=organisatie
        )
        self.dbsession.add(rekening)
        self.dbsession.flush()
        return rekening
