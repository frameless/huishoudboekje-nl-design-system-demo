import logging
from os import abort

from sqlalchemy import and_, or_
from core_service.base_consumer import BaseConsumer
from models.afspraak import Afspraak
from flask import Flask
from core_service.database import SQLAlchemy
from core_service.utils import filter_in_strings


class GetAfsprakenConsumer(BaseConsumer):
    queue_name = "afspraken-get"
    model = Afspraak

    def __init__(self, app: Flask):
        logging.info(f"Initiating: {self.queue_name}")

        queryable = SQLAlchemy(app=app).make_declarative_base(model=self.model)
        logging.info(f"mapping filters...")
        filter_callback_mapping = {
            {"valid_from", self.add_filter_filter_datums},
            {"filter_burgers", self.add_filter_filter_burger}

        }

        if queryable:
            self.query = queryable.query

        super().__init__()

    def filter(self, filters):

        return super().filter(filters)
        # example body json:
        # b'{"filter_burgers": [3]}'
        # current core service soes not work like this, needs to be implemented differently

    def add_filter_filter_datums(self):
        """ Add filter_datums filter based on the valid_from and valid_through """
        valid_from = get_date_from_request(request, 'valid_from')
        valid_through = get_date_from_request(request, 'valid_through')

        if valid_from or valid_through:
            if not valid_from:
                return self.__create_error_json("param valid_from is not set")
            if not valid_through:
                return self.__create_error_json("param valid_from is not set")
            if valid_from > valid_through:
                return self.__create_error_json("param valid_from is not set")

            self.hhb_query.query = self.hhb_query.query.filter(
                and_(
                    or_(
                        self.hhb_model.valid_through == None,
                        self.hhb_model.valid_through >= valid_from
                    ),
                    self.hhb_model.valid_from <= valid_through
                )
            )

    def add_filter_filter_burger(self):
        """ Add filter_burger filter based on the id of burger """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.burger_id.in_(ids))

    # rubriek

    def add_filter_filter_rekening(self):
        """ Add filter_rekening filter"""

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.tegen_rekening_id.in_(ids))

        AfspraakView.filter_in_string('filter_rekening', add_filter)

    def add_filter_filter_zoektermen(self):
        """ Add filter_zoektermen filter"""
        zoektermenen = request.args.get('filter_zoektermen')
        if zoektermenen:
            for zoektermen in zoektermenen.split(","):
                self.hhb_query.query = self.hhb_query.query.filter(
                    self.hhb_model.zoektermen.contains(zoektermen))

    def add_filter_filter_afdelingen(self):
        """ Add filter_afdelingen filter based on the id of the afdeling model """

        def add_filter(ids):  # not mandetory, make optional
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.afdeling_id.in_(ids))

        AfspraakView.filter_in_string('filter_afdelingen', add_filter)

    def add_filter_filter_postadressen(self):
        """ Add filter_postadressen filter based on the id of the postadres model """

        def add_filter(ids):  # not mandetory, make optional
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.postadres_id.in_(ids))

        AfspraakView.filter_in_string('filter_postadressen', add_filter)

    def add_filter_filter_alarmen(self):
        """ Add filter_alarmen filter based on the id of the alarm model """

        def add_filter(ids):  # not mandetory, make optional
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.alarm_id.in_(ids))

        AfspraakView.filter_in_string('filter_alarmen', add_filter)
