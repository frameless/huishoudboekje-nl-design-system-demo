from hhb_backend.service.model.base_model import BaseModel


class Burger(BaseModel):
    id: int
    bsn: int
    voorletters: str
    voornamen: str
    achternaam: str
    geboortedatum: str
    telefoonnummer: str
    email: str
    straatnaam: str
    huisnummer: str
    postcode: str
    plaatsnaam: str
    huishouden_id: int
    iban: str  # appears to be unused
