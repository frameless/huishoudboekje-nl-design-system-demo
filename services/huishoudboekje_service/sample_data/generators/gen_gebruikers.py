import csv
import dataclasses
import os
import string
import sys
from _csv import QUOTE_MINIMAL
from os import path
from random import choice, randrange
import requests
from schwifty import IBAN
from datetime import date, timedelta

from sample_data.generators.scenarios import Scenario, GebruikerScenario

if not path.exists("../context/straatnamen.txt"):
    sys.exit("Missing required data: straatnamen")
with open("../context/straatnamen.txt", "r") as fh:
    straten = fh.readlines()


def faker_datum(start_date: date = date(1950, 1, 1), end_date: date = date(1999, 12, 31)):
    return start_date + timedelta(days=randrange((end_date - start_date).days))


def faker_postcode():
    return f"13{randrange(1, 9)}{randrange(1, 9)}{choice(string.ascii_letters).upper()}{choice(string.ascii_letters).upper()}"


def create_rekening(naam: str, id: int):
    return {
        "id": id,
        "iban": IBAN.generate('NL', bank_code='BANK', account_code=str(id)),
        "rekeninghouder": naam
    }


def create_gebruiker(id: int):
    response = requests.get("http://faker.hook.io/?property=helpers.createCard&locale=nl").json()
    achternaam = response["name"].split(" ")[-1]
    voornamen = " ".join(response["name"].split(" ")[:-1])
    voorletters = " ".join([n[0] for n in response["name"].split(" ")[:-1]])
    return {
        "id": id,
        "telefoonnummer": response["phone"],
        "email": response["email"],
        "geboortedatum": faker_datum(),
        "voorletters": voorletters,
        "voornamen": voornamen,
        "achternaam": achternaam,
        "straatnaam": choice(straten).strip(),
        "huisnummer": randrange(1, 9999),
        "postcode": faker_postcode(),
        "plaatsnaam": "Sloothuizen"
    }


def create_gebruiker_rekening(gebruiker, rekening):
    return {
        "rekening_id": rekening["id"],
        "gebruiker_id": gebruiker["id"],
    }


def dict_keys_subset_builder(match_keys: list):
    """only include items with a matching key"""
    return lambda actual_dict: dict((k, actual_dict[k] if k in actual_dict else None) for k in match_keys)

class HHBCsvDialect(csv.Dialect):
    delimiter = '\t'
    quoting = QUOTE_MINIMAL
    quotechar = '"'
    lineterminator = '\n'

class Generator:
    fieldnames = {
        "gebruikers": ["id", "telefoonnummer", "email", "geboortedatum", "voorletters", "voornamen", "achternaam",
                       "straatnaam", "huisnummer", "postcode", "plaatsnaam"],
        "rekeningen": ["id", "iban", "rekeninghouder"],
        "gebruiker_rekeningen": ["rekening_id", "gebruiker_id"],
        "kvk_details": ["kvk_nummer", "naam", "straatnaam", "huisnummer", "postcode", "plaatsnaam"],
        "organisaties": ["id", "kvk_nummer", "naam"],
        "organisatie_rekenignen": ["organisatie_id", "gebruiker_id"],
        "configuratie": ["id", "waarde"],
        "rubrieken": ["naam", "grootboekrekening_id"],
    }
    rubrieken = []
    configuratie = []
    gebruikers = []
    rekeningen = []
    afspraken = []
    gebruiker_rekeningen = []

    rekening_counter = 40200
    gebruiker_counter = 200
    kvk_number_counter = 462345

    def __init__(self, scenario: Scenario):
        self.scenario = scenario

    def generate(self):
        self.rubrieken = map(dataclasses.asdict, self.scenario.configuratie.rubrieken)
        self.configuratie = map(dataclasses.asdict,self.scenario.configuratie.configuratie)
        for organisatie_scenario in self.scenario.organisatie.scenarios:
            # self.generate_organisaties(organisatie_scenario)
            pass

        for gebruiker_scenario in self.scenario.gebruikers.scenarios:
            self.generate_gebruikers(gebruiker_scenario)

    def generate_gebruiker_rekeningen(self, gebruiker_id, naam):

        rekening = self.generate_rekening(naam)
        self.rekening_counter += 1

        self.gebruiker_rekeningen.append({
            "rekening_id": rekening["id"],
            "gebruiker_id": gebruiker_id
        })

    def generate_gebruikers(self, scenario: GebruikerScenario):
        for _ in range(scenario.gebruikers_scenario.aantal):
            self.gebruiker_counter += 1
            gebruiker = create_gebruiker(id=self.gebruiker_counter)
            self.gebruikers.append(gebruiker)

            for _ in range(scenario.aantal_rekeningen):
                self.rekening_counter += 1
                rekening = create_rekening(id=self.rekening_counter, naam=gebruiker["achternaam"])
                self.rekeningen.append(rekening)

                gebruiker_rekening = create_gebruiker_rekening(gebruiker=gebruiker, rekening=rekening)
                self.gebruiker_rekeningen.append(gebruiker_rekening)

            # for afspraak_scenario in scenario.afspraken:
            #     gebruiker.afspraken.append(self.generate_afspraak)

            self.gebruikers.append(gebruiker)

    def save(self):
        self.save_csv(db='huishoudboekje_db', name='configuratie')
        self.save_csv(db='huishoudboekje_db', name='rubrieken')
        self.save_csv(db='huishoudboekje_db', name='gebruikers')
        self.save_csv(db='huishoudboekje_db', name='rekeningen')
        self.save_csv(db='huishoudboekje_db', name='gebruiker_rekeningen')
        self.save_csv(db='huishoudboekje_db', name='organisaties')

    def save_csv(self, db='huishoudboekje_db', name='gebruikers', fieldnames=None, data=None):
        if path.exists(f"../{db}/{name}.txt"):
            print(f"data for {db}:{name} already exists.")
        else:
            os.makedirs(f"../{db}", exist_ok=True)
            with open(f"../{db}/{name}.txt", "w") as out_file:
                fieldnames = fieldnames or self.fieldnames[name]
                writer = csv.DictWriter(
                    out_file,
                    fieldnames=fieldnames,
                    dialect=HHBCsvDialect
                )
                writer.writeheader()
                writer.writerows(map(dict_keys_subset_builder(fieldnames), data or self.__dict__[name]))


scenario = Scenario()
generator = Generator(scenario)
generator.generate()
generator.save()
