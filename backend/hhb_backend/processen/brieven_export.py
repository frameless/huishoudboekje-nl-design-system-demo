import csv
import io
import pandas as pd
from _csv import QUOTE_MINIMAL
from datetime import datetime
from typing import List

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.audit_logging import AuditLogging


class HHBCsvDialect(csv.Dialect):
    delimiter = "|"
    quoting = QUOTE_MINIMAL
    quotechar = '"'
    lineterminator = "\n"


brieven_fields = [
    "betaalrichting",
    "status.afspraak",
    "organisatie.naam",
    "organisatie.postadres.adresregel1",
    "organisatie.postadres.postcode",
    "organisatie.postadres.plaats",
    "afspraak.id",
    "afspraak.omschrijving",
    "nu.datum",
    "burger.hhbnummer",
    "burger.voorletters",
    "burger.voornamen",
    "burger.achternaam",
    "burger.postadres.adresregel1",
    "burger.postadres.postcode",
    "burger.postadres.plaats"
]

dateformat = "%-d-%-m-%Y"

def dict_keys_subset_builder(match_keys: list):
    """only include items with a matching key"""
    return lambda actual_dict: dict(
        (k, actual_dict[k] if k in actual_dict else None) for k in match_keys
    )


def create_brieven_export(burger_id):
    burger = hhb_dataloader().burgers.load_one(burger_id)
    afspraken = hhb_dataloader().afspraken.by_burger(burger_id)

    # Find a postadres for every afspraak
    postadressen = get_postadres_by_afspraken(afspraken)

    if postadressen:
        for afspraak in afspraken:
            postadres_id = afspraak.get("postadres_id")
            for postadres in postadressen:
                if postadres.get("id") == postadres_id:
                    afspraak["postadres"] = postadres

    # Find an afdeling for every organisatie and find a postadres for every afdeling
    afdelingen = get_afdeling_by_afspraken(afspraken)
    postadressen = get_postadressen_by_afdelingen(afdelingen)
    organisaties = get_organisaties(afdelingen)

    for afdeling in afdelingen:
        organisatie_id = afdeling.get("organisatie_id", {})
        for organisatie in organisaties:
            if organisatie["id"] == organisatie_id:
                afdeling["organisatie"] = organisatie
        for postadres in postadressen:
            single_postadres_id = postadres.get("id")
            afdeling_postadres_ids = afdeling.get('postadressen_ids')
            afdeling["postadressen"] = []
            if single_postadres_id in afdeling_postadres_ids:
                afdeling["postadressen"].append(postadres)

    current_date_str = datetime.now().strftime(dateformat)

    data = []
    for afspraak in afspraken:
        afdeling_id = afspraak["afdeling_id"]
        afdeling = next(filter(lambda x: x['id'] == afdeling_id, afdelingen), {})
        row = create_row(afdeling, afspraak, burger, current_date_str)
        data.append(row)

    csv_filename = f"{current_date_str}_{burger['voornamen']}_{burger['achternaam']}.csv"
    xlsx_filename = f"{current_date_str}_{burger['voornamen']}_{burger['achternaam']}.xlsx"
    iowriter = io.StringIO()
    writer = csv.DictWriter(
        iowriter, fieldnames=brieven_fields, dialect=HHBCsvDialect
    )
    writer.writeheader()
    writer.writerows(
        map(
            dict_keys_subset_builder(brieven_fields),
            data,
        )
    )

    df = pd.DataFrame.from_dict(data)
    output_excel = io.BytesIO()
    writer2 = pd.ExcelWriter(output_excel, engine='xlsxwriter')

    df.to_excel(writer2, sheet_name='Sheet1', index=False)
    writer2.save()
    output_excel.seek(0)
    data_excel = output_excel.read()

    # TODO use a Queue and asyncio.run_task
    AuditLogging.create(
            action="exportBrieven",
            entities=[
                GebruikersActiviteitEntity(entityType="burger", entityId=(burger_id)),
            ]
        )

    return iowriter.getvalue(), csv_filename, data_excel, xlsx_filename


def get_afdeling_by_afspraken(afspraken):
    return hhb_dataloader().afdelingen.load([
        afspraak.afdeling_id
        for afspraak in afspraken
        if afspraak.afdeling_id
    ])


def get_postadressen_by_afdelingen(afdelingen):
    ids = []
    for afdeling in afdelingen:
        postadres_ids = afdeling.get("postadressen_ids")
        if postadres_ids:
            ids.extend(postadres_ids)

    return hhb_dataloader().postadressen.load(ids)


def get_postadres_by_afspraken(afspraken: List[dict]):
    return hhb_dataloader().postadressen.load([
        afspraak["postadres_id"]
        for afspraak in afspraken
        if afspraak.get("postadres_id")
    ])


def get_organisaties(afdelingen):
    return hhb_dataloader().organisaties.load([
        afdeling_result["organisatie_id"]
        for afdeling_result in afdelingen
        if afdeling_result["organisatie_id"]
    ])

def __get_hhb_number(id: int):
    id_as_string = str(id)
    return "HHB" + id_as_string.zfill(6)


def create_row(afdeling, afspraak, burger, current_date_str):
    organisatie = afdeling.get("organisatie", {})
    adres = afspraak.get("postadres", {})

    postcode = adres.get("postalCode", {})
    plaats = adres.get("locality", {})
    straat = adres.get("street", {})
    huisnummer = adres.get("houseNumber", {})

    row = {}
    row["betaalrichting"] = "credit" if afspraak["credit"] is True else "debet"
    row["status.afspraak"] = datetime.strptime(afspraak["valid_through"], '%Y-%m-%dT%H:%M:%S').strftime(dateformat) if afspraak["valid_through"] else ""
    row["organisatie.naam"] =  organisatie["naam"] if "naam" in organisatie else ""
    row["organisatie.postadres.adresregel1"] = ""
    if straat and huisnummer:
        row[
            "organisatie.postadres.adresregel1"] = f"{straat} {huisnummer}"
    row["organisatie.postadres.postcode"] = postcode if postcode else ""
    row["organisatie.postadres.plaats"] = plaats if plaats else ""
    row["afspraak.id"] = ' '.join(afspraak["zoektermen"]) if afspraak["zoektermen"] else ""
    row["afspraak.omschrijving"] = afspraak['omschrijving'] if afspraak['omschrijving'] else ""
    row["nu.datum"] = current_date_str
    row["burger.hhbnummer"] = __get_hhb_number(burger['id'])
    row["burger.voorletters"] = f"{burger['voorletters']}"
    row["burger.voornamen"] = f"{burger['voornamen']}"
    row["burger.achternaam"] = f"{burger['achternaam']}"
    row["burger.postadres.adresregel1"] = ""
    if burger['straatnaam'] and burger['huisnummer']:
        row["burger.postadres.adresregel1"] = f"{burger['straatnaam']} {burger['huisnummer']}"
    row["burger.postadres.postcode"] = burger["postcode"] if burger["postcode"] else ""
    row["burger.postadres.plaats"] = burger["plaatsnaam"] if burger["plaatsnaam"] else ""

    return row
