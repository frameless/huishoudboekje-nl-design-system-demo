""" MethodView for /burgers/ path """
from datetime import date
from models.burger import Burger
from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response
from sqlalchemy import or_, func, and_, cast, String, any_
from core_service.utils import row2dict
from models.rekening_burger import RekeningBurger
from core_service.database import db
from models.afspraak import Afspraak
from models.rekening import Rekening

from sqlalchemy.dialects import postgresql


class BurgerView(HHBView):
    """ Methods for /burgers/(<burger_id>) path """
    hhb_model = Burger
    validation_data = {
        "type": "object",
        "properties": {
            "telefoonnummer": {
                "type": ["string", "null"],
            },
            "email": {
                "type": ["string", "null"],
            },
            "geboortedatum": {
                "type": ["string", "null"],
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "voornamen": {
                "type": "string",
            },
            "voorletters": {
                "type": "string",
            },
            "achternaam": {
                "type": "string",
            },
            "straatnaam": {
                "type": "string",
            },
            "huisnummer": {
                "type": "string",
            },
            "postcode": {
                "type": "string",
            },
            "plaatsnaam": {
                "type": "string",
            },
            "huishouden_id": {
                "type": "integer",
            },
            "bsn": {
                "type": "integer",
            }
        },
        "required": []
    }

    def get(self, **kwargs):
        if (request.args.get("search")):
            data = self.search_for_burgers(request.json.get("search"))
            if (data != None):
                return {"data": [row2dict(row) for row in data]}
        else:
            return super().get(**kwargs)

    def extend_post_with_extra_check(self, **kwargs):
        """ Extend the post function with extra check and return a list of errors"""
        errors = []
        errors = self.check_if_bsn_already_exists(errors)
        return errors

    def check_if_bsn_already_exists(self, errors):
        bsn = request.json.get("bsn", None)
        if bsn:
            result = Burger.query.filter(Burger.bsn == bsn).all()
            if len(result) > 0:
                errors.append("bsn already exists")
        return errors

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_filter_huishouden()
        self.add_filter_filter_bsn()
        self.add_filter_filter_uuids()

    def add_filter_filter_huishouden(self):
        """ Add filter_huishouden filter based on the id of huishouden """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.huishouden_id.in_(ids))

        BurgerView.filter_in_string('filter_huishoudens', add_filter)

    def add_filter_filter_bsn(self):
        """ Add filter_bsn filter based on the bsn of a burger """

        def add_filter(bsn):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.bsn.in_(bsn))

        BurgerView.filter_in_string('filter_bsn', add_filter)
        
    def add_filter_filter_uuids(self):
        """ Add filter_uuids filter based on the uuid of a burger """

        def add_filter(uuids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.uuid.in_(uuids))

        BurgerView.filter_in_string('filter_uuid', add_filter)

    def search_for_burgers(self, searchable_value):
        search_value = '%'+searchable_value+'%'
        check_date = date.today()
        # Query searches multiple locations for the requested value
        # Important note: should be outerjoin because otherwise Burgers with no (active) Afspraak or Rekening cannot be found
        # Ilike is a case-insensitive version of LIKE in sql
        # array_to_string is a function specific to PostgreSQL. The func. is an sqlAlchemy function that puts *any* function after it into sql which is why this works
        query = db.session.query(Burger)\
            .outerjoin(Afspraak, and_(Burger.id == Afspraak.burger_id, and_(and_(Afspraak.valid_from is not None, Afspraak.valid_from < check_date),
                                                                            or_(Afspraak.valid_through == None, Afspraak.valid_through > check_date))))\
            .outerjoin(RekeningBurger, Burger.id == RekeningBurger.burger_id)\
            .outerjoin(Rekening, Rekening.id == RekeningBurger.rekening_id)\
            .filter(or_(Burger.achternaam.ilike(search_value),
                        Burger.voornamen.ilike(search_value),
                        cast(Burger.bsn, String).ilike(search_value),
                        Rekening.iban.ilike(search_value),
                        Rekening.rekeninghouder.ilike(search_value),
                        Rekening.rekeninghouder.ilike(search_value),
                        Burger.straatnaam.ilike(search_value),
                        Burger.postcode.ilike(search_value),
                        and_(Afspraak.burger_id != None,
                             func.array_to_string(Afspraak.zoektermen, ' ', '*').ilike(search_value))
                        ))\
            .group_by(Burger.id)\
            .all()
        return query
