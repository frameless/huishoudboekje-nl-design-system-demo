import json
from datetime import date, datetime

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.export import Export
from flask import request

from hhb_backend.graphql.utils import planned_overschrijvingen
from hhb_backend.graphql.utils.create_sepa_export import create_export_string


def create_json_payload_overschrijving(future_overschrijving, export_id) -> dict:
    return {
        "afspraak_id": future_overschrijving['afspraak_id'],
        "export_id": export_id,
        "bedrag": future_overschrijving['bedrag'],
        "datum": future_overschrijving['datum']
    }


class CreateExportOverschrijvingen(graphene.Mutation):
    class Arguments:
        start_datum = graphene.Date()
        eind_datum = graphene.Date()

    ok = graphene.Boolean()
    # TODO File instead of export object?
    export = graphene.String()

    def mutate(root, info, **kwargs):
        """ Create the export file based on start and end date """
        start_datum_str = kwargs.pop("start_datum")
        eind_datum_str = kwargs.pop("eind_datum")
        start_datum = datetime.strptime(start_datum_str, '%Y-%m-%d').date()
        eind_datum = datetime.strptime(eind_datum_str, '%Y-%m-%d').date()

        # haal alle afspraken op die geldig zijn op start en einddatum
        # Alleen afspraken met handmatige overschrijving
        afspraken = []  # TODO afspraken call

        afspraken_ids = [1, 2, 3]

        # haal alle overschrijvingen op die in die periode gelden (kan zijn dat er al overschrijvingen zijn geweest.
        overschrijvingen = await request.dataloader.overschrijvingen_by_afspraken.load(afspraken_ids)
        if not overschrijvingen:
            raise GraphQLError("overschrijvingen not found")

        # Haal alle toekomstige overschrijvingen op. Met in achtneming van start en datum.
        future_overschrijvingen = []
        for afspraak in afspraken:
            future_overschrijvingen += planned_overschrijvingen(afspraak, start_datum, eind_datum)

        # Crossref met huidige overschrijvingen
        for overschrijving in overschrijvingen:
            future_overschrijvingen = list(filter(lambda o:
                                                  o['afspraak_id'] != overschrijving.afspraak.id and
                                                  o['datum'] != overschrijving.datum,
                                                  future_overschrijvingen))

        # Creer export object en koppel deze aan overschrijvingen
        exportFile = ""

        # Overschrijvingen wegschrijven in db + export object
        for export_overschrijving in future_overschrijvingen:
            json_payload = create_json_payload_overschrijving(export_overschrijving, 1)
            gebruiker_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/overschrijvingen/",
                data=json.dumps(json_payload),
                headers={'Content-type': 'application/json'}
            )
            if gebruiker_response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        # Creer export bestand en return deze.
        export_file_xml = create_export_string(future_overschrijvingen, exportFile)

        return CreateExportOverschrijvingen(export=export_file_xml, ok=True)
