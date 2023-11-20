import hashlib
import json
from datetime import datetime
import logging

import graphene
import requests
from dateutil import tz

import hhb_backend.graphql.models.export as graphene_export
from graphql import GraphQLError
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.dates import to_date
from hhb_backend.processen.create_sepa_export import create_export_string
from hhb_backend.processen.overschrijvingen_planner import (
    PlannedOverschrijvingenInput,
    get_planned_overschrijvingen,
)
from hhb_backend.service.model.overschrijving import Overschrijving


def create_json_payload_overschrijving(future_overschrijving, export_id) -> dict:
    return Overschrijving(
        afspraak_id=future_overschrijving["afspraak_id"],
        export_id=export_id,
        bedrag=future_overschrijving["bedrag"],
        datum=future_overschrijving["datum"]
    )


def get_config_value(config_id) -> str:
    return hhb_dataloader().configuraties.load_one(config_id)["waarde"]


def invalid_overschrijvingen_date(overschrijving, afspraak):
    overschrijving_date = to_date(overschrijving['datum'])
    logging.info("TEST")
    logging.info(overschrijving_date)
    logging.info(to_date(afspraak['valid_through']))
    return to_date(afspraak['valid_from']) > overschrijving_date or to_date(afspraak['valid_through']) < overschrijving_date

def filter_future_overschrijvingen_on_afspraak_startdate_and_enddate_before_payment_date(future_overschrijvingen, afspraken):
    count = 0
    for overschrijving in future_overschrijvingen:
        afspraak = next(
            filter(lambda x: x['id'] == overschrijving['afspraak_id'], afspraken), None)
        if afspraak is not None:
            if invalid_overschrijvingen_date(overschrijving, afspraak):
                future_overschrijvingen.pop(count)
                logging.info("TEST2")
        count += 1
    logging.info("TEST3")
    logging.info(future_overschrijvingen)
    return future_overschrijvingen


class CreateExportOverschrijvingen(graphene.Mutation):
    """Mutatie om een betaalinstructie te genereren."""

    class Arguments:
        startDatum = graphene.String()
        eindDatum = graphene.String()
        verwerkingDatum = graphene.String()

    ok = graphene.Boolean()
    export = graphene.Field(lambda: graphene_export.Export)

    @staticmethod
    def mutate(self, info, **kwargs):
        """ Create the export file based on start and end date """
        logging.info(f"Creating export file")
        start_datum_str = kwargs.pop("startDatum")
        eind_datum_str = kwargs.pop("eindDatum")
        verwerking_datum_str = kwargs.get(
            "verwerkingDatum", None)
        start_datum = to_date(start_datum_str)
        eind_datum = to_date(eind_datum_str)
        verwerking_datum = to_date(
            verwerking_datum_str) if verwerking_datum_str is not None else None

        # Get all afspraken with the start and end date.
        afspraken = hhb_dataloader().afspraken.in_date_range(
            start_datum_str, eind_datum_str)
        afspraken = list(filter(lambda o: o.betaalinstructie, afspraken))
        afspraken_ids = [afspraak_result.id for afspraak_result in afspraken]

        # Get all previous overschrijvingen from afspraken
        overschrijvingen = hhb_dataloader().overschrijvingen.by_afspraken(afspraken_ids)

        # Haal alle toekomstige overschrijvingen op. Met in achtneming van start en eind datum.
        future_overschrijvingen = []
        for afspraak in afspraken:
            planner_input = PlannedOverschrijvingenInput(
                afspraak.betaalinstructie,
                afspraak.bedrag,
                afspraak.id
            )
            future_overschrijvingen += list(
                get_planned_overschrijvingen(
                    planner_input, start_datum, eind_datum
                ).values()
            )

        # Crossref met huidige overschrijvingen
        for overschrijving in overschrijvingen:
            future_overschrijvingen = list(
                filter(
                    lambda future_overschrijving: not (
                        future_overschrijving["afspraak_id"] == overschrijving.afspraak_id
                        and to_date(future_overschrijving["datum"])
                        == to_date(overschrijving.datum)
                    ),
                    future_overschrijvingen,
                )
            )

        if future_overschrijvingen:
            filter_future_overschrijvingen_on_afspraak_startdate_and_enddate_before_payment_date(
                future_overschrijvingen, afspraken)

        if not future_overschrijvingen:
            raise GraphQLError(
                f"Failed to created export. No overschrijvingen found in period."
            )

        # Get all tegen_rekeningen based on the afspraken
        tegen_rekeningen_ids = list(
            set([afspraak_result.tegen_rekening_id for afspraak_result in afspraken])
        )

        tegen_rekeningen = hhb_dataloader().rekeningen.load(tegen_rekeningen_ids)
        if not tegen_rekeningen:
            raise GraphQLError(f"Rekeningen not found.")

        config_values = {
            "derdengeldenrekening_rekeninghouder": get_config_value("derdengeldenrekening_rekeninghouder"),
            "derdengeldenrekening_iban": get_config_value("derdengeldenrekening_iban"),
            "derdengeldenrekening_bic": get_config_value("derdengeldenrekening_bic"),
        }

        today = datetime.now(tz=tz.tzlocal()).replace(microsecond=0)
        xml_string = create_export_string(
            verwerking_datum,
            future_overschrijvingen,
            afspraken,
            tegen_rekeningen,
            config_values
        )
        export_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/export/",
            data=json.dumps(
                {
                    "naam": "Huishoudboekje-" + today.strftime("%Y-%m-%d_%H-%M-%S") + "-SEPA-EXPORT",
                    "timestamp": today.isoformat(),
                    "start_datum": start_datum_str,
                    "eind_datum": eind_datum_str,
                    "verwerking_datum": verwerking_datum_str,
                    "xmldata": xml_string,
                    "sha256": hashlib.sha256(xml_string.encode()).hexdigest()
                }
            ),
            headers={"Content-type": "application/json"},
        )
        if export_response.status_code != 201:
            raise GraphQLError(
                f"Upstream API responded: {export_response.json()}")
        export_object = export_response.json()["data"]

        # Overschrijvingen wegschrijven in db + export object
        for export_overschrijving in future_overschrijvingen:
            json_payload = create_json_payload_overschrijving(
                export_overschrijving, export_object["id"]
            )
            overschrijving_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/overschrijvingen/",
                data=json.dumps(json_payload),
                headers={"Content-type": "application/json"},
            )
            if overschrijving_response.status_code != 201:
                raise GraphQLError(
                    f"Upstream API responded: {overschrijving_response.json()}"
                )

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="export", entityId=export_object["id"]),
            ],
            after=dict(export=export_object)
        )

        return CreateExportOverschrijvingen(export=export_object, ok=True)
