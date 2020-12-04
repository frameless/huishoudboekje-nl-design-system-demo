from datetime import date, datetime

import graphene
from graphql import GraphQLError

from hhb_backend.graphql.models.export import Export
from flask import request

from hhb_backend.graphql.utils import planned_overschrijvingen


class CreateExportOverschrijvingen(graphene.Mutation):
    class Arguments:
        start_datum = graphene.Date()
        eind_datum = graphene.Date()

    ok = graphene.Boolean()
    # TODO File instead of export object?
    export = graphene.Field(lambda: Export)

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
        # Overschrijvingen wegschrijven in db + export object
        # Creer export bestand en return deze.

        # gebruiker_response = requests.post(
        #     f"{settings.HHB_SERVICES_URL}/overschrijvingen/",
        #     data=json.dumps(input, default=str),
        #     headers={'Content-type': 'application/json'}
        # )
        # if gebruiker_response.status_code != 201:
        #     raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")
        #
        # result = gebruiker_response.json()["data"]
        #
        # if rekeningen:
        #     result['rekeningen'] = [create_gebruiker_rekening(result['id'], rekening) for rekening in rekeningen]

        return CreateExportOverschrijvingen(export=result, ok=True)
