import csv
import io
from _csv import QUOTE_MINIMAL
from datetime import datetime

import requests
from flask import jsonify

from hhb_backend.graphql import settings
import logging
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities)
from dateutil import tz
from flask import request, g
from hhb_backend.version import load_version
import pandas as pd


class HHBCsvDialect(csv.Dialect):
    delimiter = "|"
    quoting = QUOTE_MINIMAL
    quotechar = '"'
    lineterminator = "\n"


brieven_fields = [
    "organisatie.naam",
    "organisatie.postadres.adresregel1",
    "organisatie.postadres.postcode",
    "organisatie.postadres.plaats",
    "afspraak.id",
    "nu.datum",
    "burger.naam",
    "burger.postadres.adresregel1",
    "burger.postadres.postcode",
    "burger.postadres.plaats",
    "betaalrichting",
    "status.afspraak"
]


def dict_keys_subset_builder(match_keys: list):
    """only include items with a matching key"""
    return lambda actual_dict: dict(
        (k, actual_dict[k] if k in actual_dict else None) for k in match_keys
    )


def create_brieven_export(burger_id):
    burger_response = get_burger_response(burger_id)
    if burger_response.status_code != 200:
        return jsonify(message=burger_response.reason), burger_response.status_code
    burger = burger_response.json()["data"]

    afspraken_response = get_afspraken_response(burger_id)
    if afspraken_response.status_code != 200:
        return jsonify(message=afspraken_response.reason), afspraken_response.status_code
    afspraken = afspraken_response.json()["data"]

    if not afspraken:
        return jsonify(message="Geen afspraken gevonden voor burger."), 200

    hhb_organisatie_reponse = get_organisaties(afspraken)
    if hhb_organisatie_reponse.status_code != 200:
        return jsonify(message=hhb_organisatie_reponse.reason), hhb_organisatie_reponse.status_code
    hhb_organisaties = hhb_organisatie_reponse.json()["data"]

    kvk_organisatie_reponse = get_kvk_organisaties(hhb_organisaties)
    if kvk_organisatie_reponse.status_code != 200:
        return jsonify(message=kvk_organisatie_reponse.reason), kvk_organisatie_reponse.status_code
    kvk_organisaties = kvk_organisatie_reponse.json()["data"]

    current_date_str = datetime.now().strftime("%Y-%m-%d")

    data = []
    for afspraak in afspraken:
        hhb_organisatie = next(filter(lambda x: x['id'] == afspraak['organisatie_id'], hhb_organisaties), {})
        kvk_organisatie = {}
        if "kvk_nummer" in hhb_organisatie:
            kvk_organisatie = next(filter(lambda x: x['kvk_nummer'] == hhb_organisatie['kvk_nummer'], kvk_organisaties),
                                   {})

        row = create_row(hhb_organisatie, kvk_organisatie, afspraak, burger, current_date_str)
        data.append(row)

    csv_filename = f"{current_date_str}_{burger['voornamen']}_{burger['achternaam']}.csv"
    xlsx_filename = f"{current_date_str}_{burger['voornamen']}_{burger['achternaam']}.xlsx"
    iowriter = io.StringIO()
    # iowriterExcel = io.StringIO()
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
    print(df)
    output_excel = io.BytesIO()
    writer2 = pd.ExcelWriter(output_excel, engine='xlsxwriter')

    df.to_excel(writer2, sheet_name='Sheet1')
    writer2.save()
    output_excel.seek(0)
    data_excel = output_excel.read()

    gebruikers_activiteit = {
        "action": "exportBrieven",
        "entities": [{"entityType": "burger", "entityId": int(burger_id)}]
    }

    json = {
        "timestamp": datetime.now(tz=tz.tzlocal())
            .replace(microsecond=0)
            .isoformat(),
        "meta": {
            "userAgent": str(request.user_agent) if request else None,
            "ip": ",".join(request.access_route) if request else None,
            "applicationVersion": load_version().version,  # Read version.json
        },
        "gebruiker_id": g.oidc_id_token["email"]
        if g and g.oidc_id_token is not None
        else None,
        **(gebruikers_activiteit),
    }
    # TODO use a Queue and asyncio.run_task
    logging.debug(
        f"logging gebruikersactiviteit {json}"
    )
    requests.post(
        f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
        json=json,
    )

    # raise ValueError('A very specific bad thing happened.')

    return iowriter.getvalue(), csv_filename, data_excel, xlsx_filename


def get_burger_response(burger_id):
    return requests.get(
        f"{settings.HHB_SERVICES_URL}/burgers/{burger_id}",
        headers={"Content-type": "application/json"},
    )


def get_afspraken_response(burger_id):
    return requests.get(
        f"{settings.HHB_SERVICES_URL}/afspraken/?filter_burgers={burger_id}",
        headers={"Content-type": "application/json"},
    )


def get_organisaties(afspraken):
    organisatie_ids = list(
        set([afspraak_result["organisatie_id"] for afspraak_result in afspraken if
             afspraak_result["organisatie_id"]])
    )
    return requests.get(
        f"{settings.HHB_SERVICES_URL}/organisaties/?filter_ids={','.join(str(x) for x in organisatie_ids)}",
        headers={"Content-type": "application/json"},
    )


def get_kvk_organisaties(hhb_orgs):
    organisatie_kvks = list(
        set([org["kvk_nummer"] for org in hhb_orgs if
             org["kvk_nummer"]])
    )

    return requests.get(
        f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_kvks={','.join(str(x) for x in organisatie_kvks)}",
        headers={"Content-type": "application/json"},
    )


def create_row(hhb_organisatie, kvk_organisatie, afspraak, burger, current_date_str):
    row = {}
    row["organisatie.naam"] = kvk_organisatie["naam"] if "naam" in kvk_organisatie else ""
    row["organisatie.postadres.adresregel1"] = ""
    if "straatnaam" in kvk_organisatie and "huisnummer" in kvk_organisatie:
        row[
            "organisatie.postadres.adresregel1"] = f"{kvk_organisatie['straatnaam']} {kvk_organisatie['huisnummer']}"
    row["organisatie.postadres.postcode"] = kvk_organisatie["postcode"] if "postcode" in kvk_organisatie else ""
    row["organisatie.postadres.plaats"] = kvk_organisatie["plaatsnaam"] if "plaatsnaam" in kvk_organisatie else ""
    row["afspraak.id"] = ' '.join(afspraak["zoektermen"]) if afspraak["zoektermen"] else ""
    row["nu.datum"] = current_date_str
    row["burger.naam"] = f"{burger['voornamen']} {burger['achternaam']}"
    row["burger.postadres.adresregel1"] = ""
    if burger['straatnaam'] and burger['huisnummer']:
        row["burger.postadres.adresregel1"] = f"{burger['straatnaam']} {burger['huisnummer']}"
    row["burger.postadres.postcode"] = burger["postcode"] if burger["postcode"] else ""
    row["burger.postadres.plaats"] = burger["plaatsnaam"] if burger["plaatsnaam"] else ""
    row["betaalrichting"] = "credit" if afspraak["credit"] is True else "debet"
    row["status.afspraak"] = afspraak["valid_through"] if afspraak["valid_through"] else ""
    return row
