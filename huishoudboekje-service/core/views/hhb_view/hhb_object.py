from flask import request, abort, make_response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from core.database import db
from core.utils import row2dict

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
            abort(make_response({"errors": [f"{self.hhb_model} not found."]}, 404))

    def update_using_request_data(self):
        """ Add data to object based on request input """
        for key, value in request.json.items():
            setattr(self.hhb_object, key, value)

    def commit_changes(self):
        """ Try to commit database changes """
        try:
            db.session.commit()
        except IntegrityError as error:
            abort(make_response({"errors": [str(error.orig).strip().split("DETAIL:  ")[1]]}, 409))

    def delete(self):
        """ Delete the selected object """
        db.session.delete(self.hhb_object)
        self.hhb_object = None

    @property
    def json(self):
        """ Convert object to json dict """
        return row2dict(self.hhb_object)