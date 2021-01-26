import json
from datetime import datetime
from dateutil import tz
from urllib.parse import urlencode

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.export import Export
from hhb_backend.graphql.utils.create_sepa_export import create_export_string
from hhb_backend.graphql.utils.overschrijvingen_planner import PlannedOverschijvingenInput, get_planned_overschrijvingen


def create_json_payload_overschrijving(future_overschrijving, export_id) -> dict:
    return {
        "afspraak_id": future_overschrijving['afspraak_id'],
        "export_id": export_id,
        "bedrag": future_overschrijving['bedrag'],
        "datum": future_overschrijving['datum'].strftime('%Y-%m-%d')
    }


def get_config_value(config_id) -> str:
    config_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/configuratie/{config_id}",
        headers={'Content-type': 'application/json'}
    )
    if config_response.status_code != 200:
        if config_response.status_code == 404:
            raise GraphQLError(f"'{config_id}' is niet gevonden.")
        else:
            raise GraphQLError(f"Upstream API responded: {config_response.json()}")
    return config_response.json()['data']['waarde']


class CreateExportOverschrijvingen(graphene.Mutation):
    class Arguments:
        startDatum = graphene.String()
        eindDatum = graphene.String()

    ok = graphene.Boolean()
    export = graphene.Field(lambda: Export)

    async def mutate(root, info, **kwargs):
        """ Create the export file based on start and end date """
        start_datum_str = kwargs.pop("startDatum")
        eind_datum_str = kwargs.pop("eindDatum")
        start_datum = datetime.strptime(start_datum_str, '%Y-%m-%d').date()
        eind_datum = datetime.strptime(eind_datum_str, '%Y-%m-%d').date()

        # Get all afspraken with the start and end date.
        afspraken_response = requests.get(
            f'{settings.HHB_SERVICES_URL}/afspraken/?{urlencode({"begin_datum": start_datum_str, "eind_datum": eind_datum_str})}',
            headers={'Content-type': 'application/json'})
        if not afspraken_response.ok:
            raise GraphQLError(f"Upstream API responded: {afspraken_response.text}")

        afspraken = afspraken_response.json()['data']
        afspraken = list(filter(lambda o: o['automatische_incasso'] is False, afspraken))
        afspraken_ids = [afspraak_result['id'] for afspraak_result in afspraken]

        # Get all previous overschrijvingen from afspraken
        overschrijvingen_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/overschrijvingen/?filter_afspraken={','.join(str(x) for x in afspraken_ids)}",
            headers={'Content-type': 'application/json'}
        )
        if overschrijvingen_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {afspraken_response.text}")
        overschrijvingen = overschrijvingen_response.json()['data']

        # Haal alle toekomstige overschrijvingen op. Met in achtneming van start en datum.
        future_overschrijvingen = []
        for afspraak in afspraken:
            planner_input = PlannedOverschijvingenInput(
                afspraak["start_datum"],
                afspraak["interval"],
                afspraak["aantal_betalingen"],
                afspraak["bedrag"],
                afspraak["id"]
            )
            future_overschrijvingen += list(
                get_planned_overschrijvingen(planner_input, start_datum, eind_datum).values())

        # Crossref met huidige overschrijvingen
        for overschrijving in overschrijvingen:
            future_overschrijvingen = list(filter(lambda o:
                                                  not (o['afspraak_id'] == overschrijving["afspraak_id"] and
                                                       o['datum'] == datetime.strptime(overschrijving['datum'],
                                                                                       '%Y-%m-%d').date()),
                                                  future_overschrijvingen))

        if not future_overschrijvingen:
            raise GraphQLError(f"Geen overschrijvingen in periode, geen export bestand aangemaakt.")

        # Get all tegen_rekeningen based on the afspraken
        tegen_rekeningen_ids = list(set([afspraak_result['tegen_rekening_id'] for afspraak_result in afspraken]))
        rekeningen_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids={','.join(str(x) for x in tegen_rekeningen_ids)}",
            headers={'Content-type': 'application/json'}
        )
        if rekeningen_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {rekeningen_response.text}")
        tegen_rekeningen = rekeningen_response.json()['data']
        if not tegen_rekeningen:
            raise GraphQLError(f"Geen rekeningen gevonden.")

        config_values = {
            "gemeente_naam": get_config_value('gemeente_naam'),
            "gemeente_iban": get_config_value("gemeente_iban"),
            "gemeente_bic": get_config_value("gemeente_bic")
        }

        today = datetime.now(tz=tz.tzlocal()).replace(microsecond=0)
        export_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/export/",
            data=json.dumps({
                "naam": today.strftime('%Y-%m-%d_%H-%M-%S') + "-SEPA-EXPORT",
                "timestamp": today.isoformat(),
                "start_datum": start_datum_str,
                "eind_datum": eind_datum_str,
                "xmldata": create_export_string(future_overschrijvingen, afspraken, tegen_rekeningen, config_values).decode()
            }),
            headers={'Content-type': 'application/json'}
        )
        if export_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {export_response.json()}")
        export_object = export_response.json()['data']

        # Overschrijvingen wegschrijven in db + export object
        for export_overschrijving in future_overschrijvingen:
            json_payload = create_json_payload_overschrijving(export_overschrijving, export_object['id'])
            overschrijving_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/overschrijvingen/",
                data=json.dumps(json_payload),
                headers={'Content-type': 'application/json'}
            )
            if overschrijving_response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {overschrijving_response.json()}")

        return CreateExportOverschrijvingen(export=export_object, ok=True)
