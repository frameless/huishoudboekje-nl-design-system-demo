import graphene

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.postadres as postadres
import hhb_backend.graphql.models.rekening as rekening
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Afdeling(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    organisatie_id = graphene.Int()
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    rekeningen = graphene.List(lambda: rekening.Rekening)
    postadressen = graphene.List(lambda: postadres.Postadres)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    def resolve_rekeningen(self, _info):
        """ Get rekeningen when requested """
        return hhb_dataloader().rekeningen.by_afdeling(self.get('id')) or []

    def resolve_organisatie(self, _info):
        return hhb_dataloader().organisaties.load_one(self.get('organisatie_id'))

    def resolve_postadressen(self, _info):
        ids = self.get('postadressen_ids')
        if not ids:
            return []

        return hhb_dataloader().postadressen.load(ids)

    def resolve_afspraken(self, _info):
        return hhb_dataloader().afspraken.by_afdeling(self.get('id')) or []
