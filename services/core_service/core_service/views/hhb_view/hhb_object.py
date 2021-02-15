import json
import logging

from flask import request, abort, make_response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from core_service.database import db
from core_service.utils import row2dict

class HHBObject():
    hhb_model = None
    hhb_object = None

    def __init__(self, hhb_model):
        self.hhb_model = hhb_model
        self.hhb_query = self.hhb_model.query

    def get_or_create(self, object_id: int):
        """ Get or create an object of the current hhb model """
        if object_id:
            self.get_or_404(object_id)
            response_code = 200
        elif type(request.json) == list:
            self.hhb_object = []
            response_code = 201
        else:
            self.hhb_object = self.hhb_model()
            db.session.add(self.hhb_object)
            response_code = 201
        return response_code

    def get_or_404(self, object_id: int):
        """ Query database for a single object based on id """
        try:
            self.hhb_object = self.hhb_model.query.filter(self.hhb_model.id==object_id).one()
        except NoResultFound:
            abort(make_response({"errors": [f"{self.hhb_model.__name__} not found."]}, 404))

    def update_using_request_data(self):
        """ Add data to object based on request input """
        if type(request.json) == list:
            for item in request.json:
                hhb_object = self.hhb_model()
                for key, value in item.items():
                    setattr(hhb_object, key, value)
                db.session.add(hhb_object)
                self.hhb_object.append(hhb_object)
        else:
            for key, value in request.json.items():
                setattr(self.hhb_object, key, value)

    def commit_changes(self):
        """ Try to commit database changes """
        try:
            db.session.commit()
        except IntegrityError as error:
            logging.warning(repr(error))
            abort(make_response({"errors": [str(error.orig).strip().split("DETAIL:  ")[1]]}, 409))

    def delete(self):
        """ Delete the selected object """
        db.session.delete(self.hhb_object)
        self.hhb_object = None

    @property
    def json(self):
        """ Convert object to json dict """
        if type(self.hhb_object) == list:
            return [row2dict(o) for o in self.hhb_object]
        return row2dict(self.hhb_object)
