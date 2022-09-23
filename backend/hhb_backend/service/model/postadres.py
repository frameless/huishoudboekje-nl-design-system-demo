from hhb_backend.service.model.base_model import BaseModel


class Postadres(BaseModel):
    id: str
    street: str
    houseNumber: str
    postalCode: str
    locality: str
    timeCreated: str  # unused
