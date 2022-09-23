""" MethodView for /burgers/<burger_id>/rekeningen path """
from flask import request, abort, make_response
from sqlalchemy.orm.exc import FlushError

from core_service.utils import row2dict, one_or_none
from core_service.views.hhb_view import HHBView
from models import RekeningBurger, Burger


class RekeningBurgerView(HHBView):
    """ Methods for /burgers/<burger_id>/rekeningen path """

    hhb_model = Burger
    validation_data = {
        "type": "object",
        "properties": {
            "rekening_id": {
                "type": "integer",
            },
        },
        "required": []
    }

    def get(self, **kwargs):
        """ GET /burgers/<burger_id>/rekeningen

        returns
        """
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        rekeningen = [row2dict(o.rekening) for o in self.hhb_object.hhb_object.rekeningen]
        return {"data": rekeningen}, 200

    def post(self, **kwargs):
        """ Add a rekening to a burger """
        self.input_validate()
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        burger_id = self.hhb_object.hhb_object.id
        rekening_id = request.json["rekening_id"]
        relation = RekeningBurger(
            burger_id=burger_id,
            rekening_id=rekening_id
        )
        self.db.session.add(relation)
        try:
            self.hhb_object.commit_changes()
        except FlushError:
            return {"errors": ["Burger / Rekening relation already exsists."]}, 409
        return {}, 201

    def delete(self, **kwargs):
        self.input_validate()
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        burger_id = self.hhb_object.hhb_object.id
        rekening_id = request.json["rekening_id"]
        rekening_burger_relation = one_or_none(RekeningBurger.query.filter(
                RekeningBurger.burger_id == burger_id
            ).filter(RekeningBurger.rekening_id == rekening_id))
        if not rekening_burger_relation:
            abort(make_response({"errors": [f"Rekening / Burger relation not found."]}, 404))
        self.db.session.delete(rekening_burger_relation)
        self.hhb_object.commit_changes()
        return {}, 202