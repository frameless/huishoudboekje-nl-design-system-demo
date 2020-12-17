import string
import sys 
from os import path
from random import choice, randrange
import requests

if not path.exists("../context/straatnamen.txt"):
    sys.exit("Missing required data: straatnamen")
with open("../context/straatnamen.txt", "r") as fh:
    straten = fh.readlines()

class GebruikerGenerator:

    gebruikers = []
    rekeningen = []
    gebruiker_rekeningen = []

    rekening_counter = 40001
    gebruiker_counter = 1

    @property
    def __faker_datum(self):
        return f"19{str(randrange(1, 99)).zfill(2)}-{str(randrange(1, 12)).zfill(2)}-{str(randrange(1, 30)).zfill(2)}"

    @property
    def __faker_postcode(self):
        return f"13{randrange(1, 9)}{randrange(1, 9)}{choice(string.ascii_letters).upper()}{choice(string.ascii_letters).upper()}"


    def create_gebruiker(self):
        response = requests.get("http://faker.hook.io/?property=helpers.createCard&locale=nl").json()
        achternaam = response["name"].split(" ")[-1]
        voornamen = " ".join(response["name"].split(" ")[:-1])
        voorletters = " ".join([n[0] for n in response["name"].split(" ")[:-1]])
        gebruiker = {
            "id": self.gebruiker_counter,
            "telefoonnummer": response["phone"],
            "email": response["email"],
            "geboortedatum": self.__faker_datum,
            "voorletters": voorletters,
            "voornamen": voornamen,
            "achternaam": achternaam,
            "straatnaam": choice(straten).strip(),
            "huisnummer": randrange(1, 9999),
            "postcode": self.__faker_postcode,
            "plaatsnaam": "Sloothuizen"
        }
        self.gebruiker_counter += 1
        return gebruiker

    def generate_gebruiker_rekeningen(self, gebruiker_id, naam):
        self.rekeningen.append({
            "id":  self.rekening_counter,
            "iban": "NL00BANK00" + str(self.rekening_counter),
            "rekeninghouder": naam
        })
        
        self.gebruiker_rekeningen.append({
            "rekening_id": self.rekening_counter,
            "gebruiker_id": gebruiker_id
        })
        self.rekening_counter += 1
        
    def generate_gebruikers(self, amount: int = 100):
        for i in range(amount):
            gebruiker = self.create_gebruiker()
            self.gebruikers.append(gebruiker)
            self.generate_gebruiker_rekeningen(gebruiker["id"], gebruiker["achternaam"])

    def get_csv_rekeningen(self):
        csv_data = ""
        for rekening in self.rekeningen:
            csv_data += f'{rekening["id"]}\t{rekening["iban"]}\t{rekening["rekeninghouder"]}\n'
        return csv_data

    def get_csv_gebruiker_rekenignen(self):
        csv_data = ""
        for rekening_rel in self.gebruiker_rekeningen:
            csv_data += f'{rekening_rel["rekening_id"]}\t{rekening_rel["gebruiker_id"]}\n'
        return csv_data
    
    def get_csv_huishoudboekje_db(self):
        csv_data = ""
        for gb in self.gebruikers:
            csv_data += f'{gb["id"]}\t{gb["telefoonnummer"]}\t{gb["email"]}\t{gb["geboortedatum"]}\t{gb["voorletters"]}\t{gb["voornamen"]}\t{gb["achternaam"]}\t{gb["straatnaam"]}\t{gb["huisnummer"]}\t{gb["postcode"]}\t{gb["plaatsnaam"]}\t\n'
        return csv_data
    
    def save_csvs(self):
        self.save_huishoudboekje_db()
        self.save_rekeningen()
        self.save_rekening_relations()

    def save_huishoudboekje_db(self):
        if path.exists("../huishoudboekje_db/gebruikers.txt"):
            print("data for huishoudboekje_db  gebruikers already exists.")
        else:
            with open("../huishoudboekje_db/gebruikers.txt", "w") as out_file:
                out_file.write(self.get_csv_huishoudboekje_db())

    def save_rekeningen(self):
        if path.exists("../huishoudboekje_db/rekeningen_gebruikers.txt"):
            print("data for huishoudboekje_db  rekenignen_gebruikers already exists.")
        else:
            with open("../huishoudboekje_db/rekeningen_gebruikers.txt", "w") as out_file:
                out_file.write(self.get_csv_rekeningen())

    def save_rekening_relations(self):
        if path.exists("../huishoudboekje_db/rekeningen_gebruikers_rel.txt"):
            print("data for huishoudboekje_db  rekenignen_gebruikers_rel already exists.")
        else:
            with open("../huishoudboekje_db/rekeningen_gebruikers_rel.txt", "w") as out_file:
                out_file.write(self.get_csv_gebruiker_rekenignen())

gb = GebruikerGenerator()
gb.generate_gebruikers()
gb.save_csvs()

