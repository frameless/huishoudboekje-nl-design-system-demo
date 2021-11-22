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
    afspraak_postadressen_response = get_postadres(afspraken)

    if afspraak_postadressen_response.status_code == 200:
        afspraak_postadressen = afspraak_postadressen_response.json()
        for afspraak in afspraken:
            postadres_id = afspraak.get("postadres_id")
            for postadres in afspraak_postadressen:
                if postadres.get("id") == postadres_id:
                    afspraak["postadres"] = postadres
    
    afdelingen_response = get_afdelingen(afspraken)
    if afdelingen_response.status_code == 200:
        afdelingen = afdelingen_response.json()["data"]
        postadressen_response = get_postadressen(afdelingen)
        if postadressen_response.status_code != 200:
            return jsonify(message=postadressen_response.reason), postadressen_response.status_code
        postadressen = postadressen_response.json()


        organisatie_reponse = get_organisaties(afdelingen)
        if organisatie_reponse.status_code != 200:
            return jsonify(message=organisatie_reponse.reason), organisatie_reponse.status_code
        organisaties = organisatie_reponse.json()["data"]

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



    current_date_str = datetime.now().strftime("%Y-%m-%d")

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
    print(df)
    output_excel = io.BytesIO()
    writer2 = pd.ExcelWriter(output_excel, engine='xlsxwriter')

    df.to_excel(writer2, sheet_name='Sheet1', index=False)
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

def get_afdelingen(afspraken):
    afdeling_ids = list(
        set([afspraak["afdeling_id"] for afspraak in afspraken if
             afspraak["afdeling_id"]])
    )
    return requests.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids={','.join(str(x) for x in afdeling_ids)}",
        headers={"Content-type": "application/json"},
    )

def get_postadressen(afdelingen):
    ids= []
    for afdeling in afdelingen:
        postadres_ids = afdeling.get("postadressen_ids")
        if postadres_ids:
            for postadres_id in postadres_ids:
                ids.append(postadres_id)

    querystring = f"?id[]={'&id[]='.join([str(k) for k in ids])}" if ids else ''
    url = f"""{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/{querystring}"""
    return requests.get(url, headers={"Accept": "application/json", "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})

def get_postadres(afspraken):
    ids= []
    for afspraak in afspraken:
        postadres_id = afspraak.get("postadres_id", None)
        if postadres_id:
            ids.append(postadres_id)

    querystring = f"?id[]={'&id[]='.join([str(k) for k in ids])}" if ids else ''
    url = f"""{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/{querystring}"""
    return requests.get(url, headers={"Accept": "application/json", "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})

def get_organisaties(afdelingen):
    organisatie_ids = list(
        set([afdeling_result["organisatie_id"] for afdeling_result in afdelingen if
             afdeling_result["organisatie_id"]])
    )
    return requests.get(
        f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids={','.join(str(x) for x in organisatie_ids)}",
        headers={"Content-type": "application/json"},
    )

def create_row(afdeling, afspraak, burger, current_date_str):
    organisatie = afdeling.get("organisatie", {})
    adres = afspraak.get("postadres", {})

    postcode = adres.get("postalCode", {})
    plaats = adres.get("locality", {})
    straat = adres.get("street", {})
    huisnummer = adres.get("houseNumber",{})

    row = {}
    row["organisatie.naam"] = organisatie["naam"] if "naam" in organisatie else ""
    row["organisatie.postadres.adresregel1"] = ""
    if straat and huisnummer:
        row[
            "organisatie.postadres.adresregel1"] = f"{straat} {huisnummer}"
    row["organisatie.postadres.postcode"] = postcode if postcode else ""
    row["organisatie.postadres.plaats"] = plaats if plaats else ""
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
