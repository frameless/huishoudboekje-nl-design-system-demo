import graphene

from hhb_backend.graphql.models.export import Export


class CreateExportOverschrijvingen(graphene.Mutation):
    class Arguments:
        start_datum = graphene.Date()
        eind_datum = graphene.Date()

    ok = graphene.Boolean()
    # TODO File instead of export object?
    gebruiker = graphene.Field(lambda: Export)

    def mutate(root, info, **kwargs):
        """ Create the export file based on start and end date """
        start_datum = kwargs.pop("start_datum")
        eind_datum = kwargs.pop("eind_datum")
        # haal alle afspraken op die geldig zijn op start en eindadatum

        # haal alle overschrijvingen op die in die periode gelden (kan zijn dat er al overschrijvingen zijn geweest.

        # Haal alle toekomstige overschrijvingen op. Met in achtneming van start en datum.

        # Crossref met huidige overschrijvingen
        # Creer export object en koppel deze aan overschrijvingen
        # Creer export bestand en return deze.
        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/overschrijvingen/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        result = gebruiker_response.json()["data"]

        if rekeningen:
            result['rekeningen'] = [create_gebruiker_rekening(result['id'], rekening) for rekening in rekeningen]

        return CreateGebruiker(gebruiker=result, ok=True)
