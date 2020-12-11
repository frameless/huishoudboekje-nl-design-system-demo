import json
from datetime import datetime
from urllib.parse import urlencode

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.export import Export
from hhb_backend.graphql.utils import planned_overschrijvingen
from hhb_backend.graphql.utils.create_sepa_export import create_export_string


def create_json_payload_overschrijving(future_overschrijving, export_id) -> dict:
    return {
        "afspraak_id": future_overschrijving['afspraak_id'],
        "export_id": export_id,
        "bedrag": future_overschrijving['bedrag'],
        "datum": future_overschrijving['datum'].strftime('%Y-%m-%d')
    }


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
        afspraken_ids = [afspraak_result['id'] for afspraak_result in afspraken]
        # TODO automatische_incasso check has to be done. We only need afspraken with automatische incasso

        # Get all previous overschrijvingen from afspraken
        overschrijvingen = await request.dataloader.overschrijvingen_by_afspraken.load_many(afspraken_ids)
        # Flatten the overschrijvingen list.
        overschrijvingen = [item for sublist in overschrijvingen for item in sublist]

        # Haal alle toekomstige overschrijvingen op. Met in achtneming van start en datum.
        future_overschrijvingen = []
        for afspraak in afspraken:
            # TODO refactor aan de hand van andere features
            future_overschrijvingen += planned_overschrijvingen(afspraak, start_datum, eind_datum)

        # Crossref met huidige overschrijvingen
        for overschrijving in overschrijvingen:
            future_overschrijvingen = list(filter(lambda o:
                                                  not(o['afspraak_id'] == overschrijving["afspraak_id"] and
                                                      o['datum'] == datetime.strptime(overschrijving['datum'], '%Y-%m-%d').date()),
                                                  future_overschrijvingen))

        # TODO Creer export object en koppel deze aan overschrijvingen
        export_object = ""

        # Overschrijvingen wegschrijven in db + export object
        for export_overschrijving in future_overschrijvingen:
            # TODO use export_object id
            json_payload = create_json_payload_overschrijving(export_overschrijving, 1)
            gebruiker_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/overschrijvingen/",
                data=json.dumps(json_payload),
                headers={'Content-type': 'application/json'}
            )
            if gebruiker_response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        # Creer export bestand en return deze. # TODO deze moet weg uitdeze call
        export_file_xml = await create_export_string(future_overschrijvingen, export_object)
        print(export_file_xml)

        return CreateExportOverschrijvingen(export=export_object, ok=True)
