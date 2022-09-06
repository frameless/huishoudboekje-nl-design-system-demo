from typing import Optional, List

from hhb_backend.service.model.alarm import Alarm
from hhb_backend.service.model.afdeling import Afdeling
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.service.model.bank_transaction import BankTransaction
from hhb_backend.service.model.base_model import BaseModel
from hhb_backend.service.model.burger import Burger
from hhb_backend.service.model.configuratie import Configuratie
from hhb_backend.service.model.customer_statement_message import CustomerStatementMessage
from hhb_backend.service.model.export import Export
from hhb_backend.service.model.grootboekrekening import Grootboekrekening
from hhb_backend.service.model.huishouden import Huishouden
from hhb_backend.service.model.journaalpost import Journaalpost
from hhb_backend.service.model.organisatie import Organisatie
from hhb_backend.service.model.rekening import Rekening
from hhb_backend.service.model.rubriek import Rubriek
from hhb_backend.service.model.signaal import Signaal


class GebruikersactiviteitMeta:
    userAgent: str
    ip: str  # a single string with possibly multiple ips joined together with ','
    applicationVersion: str


class GebruikersactiviteitSnapshot(BaseModel):
    alarm: Optional[Alarm]
    afdeling: Optional[Afdeling]
    afspraak: Optional[Afspraak]
    burger: Optional[Burger]
    configuratie: Optional[Configuratie]
    customer_statement_message: Optional[CustomerStatementMessage]
    export: Optional[Export]
    grootboekrekening: Optional[Grootboekrekening]
    journaalpost: Optional[Journaalpost]
    organisatie: Optional[Organisatie]
    rekening: Optional[Rekening]
    rubriek: Optional[Rubriek]
    transaction: Optional[BankTransaction]
    huishouden: Optional[Huishouden]
    signaal: Optional[Signaal]


class GebruikersactiviteitEntity:
    entityType: str
    entityId: str


class Gebruikersactiviteit(BaseModel):
    id: int
    timestamp: str
    gebruiker_id: Optional[str]
    action: str
    entities: List[GebruikersactiviteitEntity]
    snapshot_before: Optional[GebruikersactiviteitSnapshot]
    snapshot_after: Optional[GebruikersactiviteitSnapshot]
    meta: GebruikersactiviteitMeta