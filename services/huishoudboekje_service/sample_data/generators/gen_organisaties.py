import string
import sys 
from os import path
from random import choice, randrange
import requests

if not path.exists("../context/straatnamen.txt"):
    sys.exit("Missing required data: straatnamen")
with open("../context/straatnamen.txt", "r") as fh:
    straten = fh.readlines()

class OrganisatieGenerator:

    organisaties = []
    rekeningen = []
    organisatie_rekeningen = []

    kvk_number_counter = 462345
    rekening_counter = 10001
    organisatie_counter = 1


    @property
    def __faker_postcode(self):
        return f"13{randrange(1, 9)}{randrange(1, 9)}{choice(string.ascii_letters).upper()}{choice(string.ascii_letters).upper()}"

    @property
    def __faker_name(self):
        return requests.get("http://faker.hook.io/?property=company.companyName&locale=nl").json()

    def create_organisatie(self):
        organisatie = {
            "id": self.organisatie_counter,
            "kvk_nummer": str(self.kvk_number_counter).zfill(8),
            "naam": self.__faker_name,
            "straatnaam": choice(straten).strip(),
            "huisnummer": randrange(1, 9999),
            "postcode": self.__faker_postcode,
            "plaatsnaam": "Sloothuizen"
        }
        self.kvk_number_counter += 1
        self.organisatie_counter += 1
        return organisatie

    def generate_organisatie_rekeningen(self, organisatie_id, naam):
        self.rekeningen.append({
            "id":  self.rekening_counter,
            "iban": "NL00BANK00" + str(self.rekening_counter),
            "rekeninghouder": naam
        })
        
        self.organisatie_rekeningen.append({
            "rekening_id": self.rekening_counter,
            "organisatie_id": organisatie_id
        })
        self.rekening_counter += 1
        
    def generate_organisaties(self, amount: int = 100):
        for i in range(amount):
            organisatie = self.create_organisatie()
            self.organisaties.append(organisatie)
            self.generate_organisatie_rekeningen(organisatie["id"], organisatie["naam"])

    def get_csv_organisatie_db(self):
        csv_data = ""
        for org in self.organisaties:
            csv_data += f'{org["kvk_nummer"]}\t{org["naam"]}\t{org["straatnaam"]}\t{org["huisnummer"]}\t{org["postcode"]}\t{org["plaatsnaam"]}\n'
        return csv_data

    def get_csv_rekeningen(self):
        csv_data = ""
        for rekening in self.rekeningen:
            csv_data += f'{rekening["id"]}\t{rekening["iban"]}\t{rekening["rekeninghouder"]}\n'
        return csv_data

    def get_csv_organisatie_rekenignen(self):
        csv_data = ""
        for rekening_rel in self.organisatie_rekeningen:
            csv_data += f'{rekening_rel["rekening_id"]}\t{rekening_rel["organisatie_id"]}\n'
        return csv_data
    
    def get_csv_huishoudboekje_db(self):
        csv_data = ""
        for org in self.organisaties:
            csv_data += f'{org["id"]}\t{org["kvk_nummer"]}\t{org["naam"]}\n'
        return csv_data
    
    def save_csvs(self):
        self.save_organisatie_db()
        self.save_huishoudboekje_db()
        self.save_rekeningen()
        self.save_rekening_relations()

    def save_organisatie_db(self):
        if path.exists("../organisatie_db/organisaties.txt"):
            print("data for organisatie_db organisaties already exists.")
        else:
            with open("../organisatie_db/organisaties.txt", "w") as out_file:
                out_file.write(self.get_csv_organisatie_db())

    def save_huishoudboekje_db(self):
        if path.exists("../huishoudboekje_db/organisaties.txt"):
            print("data for huishoudboekje_db  organisaties already exists.")
        else:
            with open("../huishoudboekje_db/organisaties.txt", "w") as out_file:
                out_file.write(self.get_csv_huishoudboekje_db())

    def save_rekeningen(self):
        if path.exists("../huishoudboekje_db/rekeningen_organisaties.txt"):
            print("data for huishoudboekje_db  rekenignen_organisaties already exists.")
        else:
            with open("../huishoudboekje_db/rekeningen_organisaties.txt", "w") as out_file:
                out_file.write(self.get_csv_rekeningen())

    def save_rekening_relations(self):
        if path.exists("../huishoudboekje_db/rekeningen_organisaties_rel.txt"):
            print("data for huishoudboekje_db  rekenignen_organisaties_rel already exists.")
        else:
            with open("../huishoudboekje_db/rekeningen_organisaties_rel.txt", "w") as out_file:
                out_file.write(self.get_csv_organisatie_rekenignen())

og = OrganisatieGenerator()
og.generate_organisaties()
og.save_csvs()
