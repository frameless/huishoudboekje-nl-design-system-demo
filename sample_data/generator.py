import csv
import dataclasses
import os
import string
from _csv import QUOTE_ALL, QUOTE_MINIMAL
from datetime import date, timedelta
from os import path
from random import choice, randrange
from typing import List

import requests
from schwifty import IBAN

from scenarios import (
    Scenario,
    GebruikerScenario,
    OrganisatieBulkScenario,
    Organisatie,
    AfspraakScenario,
)


def faker_datum(
        start_date: date = date(1950, 1, 1), end_date: date = date(1999, 12, 31)
):
    return start_date + timedelta(days=randrange((end_date - start_date).days))


class HHBCsvDialect(csv.Dialect):
    delimiter = "|"
    quoting = QUOTE_ALL
    quotechar = '"'
    lineterminator = "\n"


class Generator:
    def __init__(self, scenario: Scenario):
        self.scenario = scenario

        self.tables = {
            "huishoudboekjeservice": {
                "rubrieken": {
                    "sequence": True,
                    "fieldnames": ["id", "naam", "grootboekrekening_id"],
                },
                "configuratie": {"fieldnames": ["id", "waarde"]},
                "gebruikers": {
                    "sequence": True,
                    "fieldnames": [
                        "id",
                        "telefoonnummer",
                        "email",
                        "geboortedatum",
                        "voorletters",
                        "voornamen",
                        "achternaam",
                        "straatnaam",
                        "huisnummer",
                        "postcode",
                        "plaatsnaam",
                    ],
                },
                "rekeningen": {
                    "sequence": True,
                    "fieldnames": ["id", "iban", "rekeninghouder"],
                },
                "rekening_gebruiker": {"fieldnames": ["rekening_id", "gebruiker_id"]},
                "organisaties": {
                    "sequence": True,
                    "fieldnames": ["id", "kvk_nummer", "weergave_naam"],
                },
                "rekening_organisatie": {
                    "fieldnames": ["organisatie_id", "rekening_id"]
                },
                "afspraken": {
                    "sequence": True,
                    "fieldnames": [
                        "organisatie_id",
                        "rubriek_id",
                        "bedrag",
                        "credit",
                        "automatische_incasso",
                        "aantal_betalingen",
                        "interval",
                        "start_datum",
                        "eind_datum",
                        "gebruiker_id",
                        "tegen_rekening_id",
                        "actief",
                        "beschrijving",
                        "kenmerk",
                    ],
                },
            },
            "organisatieservice": {
                "organisaties": {
                    "fieldnames": [
                        "kvk_nummer",
                        "naam",
                        "straatnaam",
                        "huisnummer",
                        "postcode",
                        "plaatsnaam",
                    ]
                },
            },
        }
        self.rubrieken = []

        self.configuratie = []
        self.gebruikers = []
        self.rekeningen = []
        self.afspraken = []
        self.rekening_gebruiker = []
        self.rekening_organisatie = []

        self.organisaties: List[dict] = []
        self.rekening_counter = 40200
        self.gebruiker_counter = 200
        self.organisatie_counter = 1
        self.kvk_number_counter = 462345

    def generate(self):
        print("generate rubrieken")
        self.rubrieken = list(
            map(dataclasses.asdict, self.scenario.configuratie.rubrieken)
        )
        print("generate configuratie")
        self.configuratie = list(
            map(dataclasses.asdict, self.scenario.configuratie.configuratie)
        )

        print("generate organisaties")
        for organisatie in self.scenario.organisatie.organisaties:
            self.generate_organisatie(organisatie)
        print("generate organisatie scenarios")
        for organisatie_scenario in self.scenario.organisatie.bulk:
            self.generate_organisaties(organisatie_scenario)

        print("generate gebruiker scenarios")
        for gebruiker_scenario in self.scenario.gebruikers.scenarios:
            self.generate_gebruikers(gebruiker_scenario)

    def generate_rekening_gebruiker(self, gebruiker_id, naam):
        rekening = self.create_rekening(naam)
        self.rekening_counter += 1

        self.rekening_gebruiker.append(
            {"rekening_id": rekening["id"], "gebruiker_id": gebruiker_id}
        )

    def generate_gebruikers(self, scenario: GebruikerScenario):
        for _ in range(scenario.aantal):
            gezin = [self.create_gebruiker() for _ in range(scenario.gezin)]

            rekeninghouder = " ".join([g["achternaam"] for g in gezin])
            for _ in range(scenario.aantal_rekeningen):
                rekening = self.create_rekening(rekeninghouder=rekeninghouder)

                for gebruiker in gezin:
                    self.create_gebruiker_rekening(
                        gebruiker=gebruiker, rekening=rekening
                    )

            for afspraak_scenario in scenario.afspraken:
                self.generate_afspraak(gebruiker, afspraak_scenario)

    def create_gebruiker(self):
        response = requests.get(
            "http://faker.hook.io/?property=helpers.createCard&locale=nl"
        ).json()
        achternaam = response["name"].split(" ")[-1]
        voornamen = " ".join(response["name"].split(" ")[:-1])
        voorletters = " ".join([n[0] for n in response["name"].split(" ")[:-1]])

        self.gebruiker_counter += 1

        gebruiker = {
            "id": self.gebruiker_counter,
            "telefoonnummer": response["phone"],
            "email": response["email"],
            "geboortedatum": faker_datum(),
            "voorletters": voorletters,
            "voornamen": voornamen,
            "achternaam": achternaam,
            "straatnaam": self.__faker_straatnaam,
            "huisnummer": randrange(1, 9999),
            "postcode": self.__faker_postcode,
            "plaatsnaam": "Sloothuizen",
        }
        self.gebruikers.append(gebruiker)
        return gebruiker

    def generate_organisatie(self, organisatie: Organisatie):
        self.organisatie_counter += 1
        result = dataclasses.asdict(organisatie)
        result["id"] = self.organisatie_counter
        result.pop("rekeningen")
        self.organisaties.append(result)
        for rekening in organisatie.rekeningen:
            self.generate_organisatie_rekening(
                result,
                self.create_rekening(
                    rekeninghouder=rekening.rekeninghouder, iban=rekening.iban
                ),
            )

    def generate_organisaties(self, scenario: OrganisatieBulkScenario):
        for _ in range(scenario.aantal):
            self.organisatie_counter += 1
            self.kvk_number_counter += 1
            name = self.__faker_name
            organisatie = {
                "id": self.organisatie_counter,
                "kvk_nummer": str(self.kvk_number_counter).zfill(8),
                "naam": name,
                "weergave_naam": name,
                "straatnaam": self.__faker_straatnaam,
                "huisnummer": randrange(1, 9999),
                "postcode": self.__faker_postcode,
                "plaatsnaam": "Sloothuizen",
            }
            self.organisaties.append(organisatie)
            self.generate_organisatie_rekening(
                organisatie=organisatie,
                rekening=self.create_rekening(rekeninghouder=organisatie["naam"]),
            )

    def create_rekening(self, rekeninghouder: str, id: int = None, iban: str = None):
        if id is None:
            self.rekening_counter += 1
            id = self.rekening_counter
        if iban is None:
            iban = IBAN.generate("NL", bank_code="BANK", account_code=str(id))
        rekening = {"id": id, "iban": iban, "rekeninghouder": rekeninghouder}
        self.rekeningen.append(rekening)
        return rekening

    def create_gebruiker_rekening(self, gebruiker, rekening):
        gebruiker_rekening = {
            "rekening_id": rekening["id"],
            "gebruiker_id": gebruiker["id"],
        }
        self.rekening_gebruiker.append(gebruiker_rekening)
        return gebruiker_rekening

    def generate_organisatie_rekening(self, organisatie, rekening):
        organisatie_rekening = {
            "rekening_id": rekening["id"],
            "organisatie_id": organisatie["id"],
        }
        self.rekening_organisatie.append(organisatie_rekening)

    def generate_afspraak(self, gebruiker, scenario: AfspraakScenario):
        organisatie = (
            None
            if scenario.organisatie.kvk is None
            else next(
                (
                    o
                    for o in self.organisaties
                    if o["kvk_nummer"] == scenario.organisatie.kvk
                ),
                choice(self.organisaties),
            )
        )

        rubriek = (
            None
            if scenario.rubriek is None
            else next(
                (r for r in self.rubrieken if r["naam"] == scenario.rubriek),
                choice(self.rubrieken),
            )
        )
        afspraak = {
            "organisatie_id": organisatie["id"] if organisatie is not None else None,
            "rubriek_id": rubriek["id"] if rubriek is not None else None,
            "bedrag": scenario.bedrag,
            "credit": scenario.credit
            if scenario.credit is not None
            else scenario.bedrag > 0,
            "automatische_incasso": scenario.automatische_incasso,
            "aantal_betalingen": scenario.aantal_betalingen or 12,
            "interval": scenario.interval,
            "start_datum": scenario.start_datum,
            "eind_datum": scenario.eind_datum,
            "gebruiker_id": gebruiker["id"],
            "tegen_rekening_id": next(
                iter(
                    (
                        [
                            r["id"]
                            for r in self.rekeningen
                            if r["iban"] == scenario.organisatie.iban
                        ]
                        if scenario.organisatie.iban is not None
                        else []
                    )
                    + [
                        r["rekening_id"]
                        for r in self.rekening_organisatie
                        if r["organisatie_id"] == organisatie["id"]
                    ]
                )
            )
            if organisatie is not None
            else next(
                r["rekening_id"]
                for r in self.rekening_gebruiker
                if r["gebruiker_id"] == gebruiker["id"]
            ),
            "actief": scenario.actief,
            "beschrijving": scenario.beschrijving,
            "kenmerk": scenario.kenmerk,
        }
        self.afspraken.append(afspraak)

    @property
    def __faker_postcode(self):
        return f"13{randrange(1, 9)}{randrange(1, 9)}{choice(string.ascii_letters).upper()}{choice(string.ascii_letters).upper()}"

    @property
    def __faker_straatnaam(self):
        return choice(self.scenario.metadata.straatnamen).strip()

    @property
    def __faker_name(self):
        return requests.get(
            "http://faker.hook.io/?property=company.companyName&locale=nl"
        ).json()

    def save(self):
        def add_newline(lines):
            for line in lines:
                yield line
                yield "\n"

        for db in self.tables:
            for table in self.tables[db]:
                self.save_csv(db=db, name=table)
            with open(f"data/{db}.sql", "w") as sql_file:
                sql_file.writelines(
                    add_newline(
                        ["BEGIN;"]
                        + [
                            f"""\\COPY {table_name} ({",".join(self.tables[db][table_name]["fieldnames"])}) FROM '{db}/{table_name}.csv' (FORMAT csv, DELIMITER '|', HEADER true);"""
                            for table_name in self.tables[db]
                        ]
                        + [
                            f"""select setval('{table_name}_id_seq', (select max("id") from {table_name}));"""
                            for table_name in self.tables[db]
                            if "sequence" in self.tables[db][table_name]
                        ]
                        + ["END;"]
                    )
                )
            with open(f"data/{db}_clean.sql", "w") as sql_file:
                sql_file.writelines(
                    add_newline(
                        ["BEGIN;"] +
                         [
                         f"""TRUNCATE {table_name} RESTART IDENTITY CASCADE;""" for table_name in self.tables[db]] +
                         ["END;"]
                    )
                )

    def save_csv(
            self, db="huishoudboekjeservice", name=None, fieldnames=None, data=None
    ):
        datadir = f"data/{db}"
        filename = f"{datadir}/{name}.csv"

        def dict_keys_subset_builder(match_keys: list):
            """only include items with a matching key"""
            return lambda actual_dict: dict(
                (k, actual_dict[k] if k in actual_dict else None) for k in match_keys
            )

        if path.exists(filename):
            print(f"{filename} already exists.")
        else:
            print(f"writing {filename}")
            os.makedirs(datadir, exist_ok=True)
            with open(filename, "w") as out_file:
                fieldnames = fieldnames or self.tables[db][name]["fieldnames"]
                writer = csv.DictWriter(
                    out_file, fieldnames=fieldnames, dialect=HHBCsvDialect
                )
                writer.writeheader()
                writer.writerows(
                    map(
                        dict_keys_subset_builder(fieldnames),
                        data or self.__dict__[name],
                    )
                )


if __name__ == "__main__":
    scenario = Scenario()
    generator = Generator(scenario)
    generator.generate()
    generator.save()
