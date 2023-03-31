from hhb_backend.service.model.base_model import BaseModel


class Saldo(BaseModel):
    id: int
    burger_id: int
    saldo: int
    einddatum: str
    startdatum: str
