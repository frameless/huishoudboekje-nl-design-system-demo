from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from yaml import load, SafeLoader
from marshmallow_dataclass import class_schema


@dataclass
class ConfiguratieItem:
    id: str
    waarde: str


@dataclass
class Rubriek:
    id: int
    naam: str
    grootboekrekening_id: str


@dataclass
class Systeem:
    configuratie: List[ConfiguratieItem] = field(default_factory=list)
    rubrieken: List[Rubriek] = field(default_factory=list)


@dataclass
class Rekening:
    iban: str
    rekeninghouder: str


@dataclass
class Organisatie:
    huisnummer: str
    kvk_nummer: str
    naam: str
    plaatsnaam: str
    postcode: str
    straatnaam: str
    weergave_naam: str
    rekeningen: List[Rekening] = field(default_factory=list)


@dataclass
class OrganisatieScenario:
    aantal: int


@dataclass
class Organisaties:
    organisaties: List[Organisatie] = field(default_factory=list)
    scenarios: List[OrganisatieScenario] = field(default_factory=list)

@dataclass
class Metadata:
    straatnamen: List[str] = field(default_factory=list)


@dataclass
class AfspraakScenario:
    aantal: int = 12
    rubriek: str = None
    organisatie_kvk: str = None
    bedrag: int = 10100
    credit: bool = False
    automatische_incasso: bool = True
    aantal_betalingen: int = 12
    interval: str = "P0Y1M0W0D"
    start_datum: str = "2021-01-01"
    eind_datum: str = "2021-12-31"


@dataclass
class GebruikerScenario:
    aantal: int
    aantal_rekeningen: int = 1
    gezin: int = 1
    afspraken: List[AfspraakScenario] = field(default_factory=list)


@dataclass
class Gebruikers:
    scenarios: List[GebruikerScenario] = field(default_factory=list)


def load_yaml_dataclass(filename: str, clazz):
    with open(filename, 'r') as reader:
        loaded = load(reader, Loader=SafeLoader)

        schema = class_schema(clazz)

        return schema().load(loaded)


class Scenario:
    configuratie: Systeem = load_yaml_dataclass('scenarios/configuratie.yaml', Systeem)
    organisatie: Organisaties = load_yaml_dataclass('scenarios/organisaties.yaml', Organisaties)
    gebruikers: Gebruikers = load_yaml_dataclass('scenarios/gebruikers.yaml', Gebruikers)
    metadata: Metadata = load_yaml_dataclass('scenarios/metadata.yaml', Metadata)
