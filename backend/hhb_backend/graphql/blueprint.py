import asyncio
import logging
from flask import Blueprint
from inspect import isawaitable

from hhb_backend.graphql import schema
from lib.graphene_file_upload import FileUploadGraphQLView


def create_blueprint():
    bp = Blueprint('graphql', __name__)

    view = FileUploadGraphQLView.as_view(
        'graphql',
        schema=schema.graphql_schema,
        graphiql=True,
        batch=True,
        middleware=[
            ErrorReportingMiddleware()
        ]
    )

    bp.add_url_rule('/', view_func=view, strict_slashes=False)

    # Optional, for adding batch query support (used in Apollo-Client)
    bp.add_url_rule('/batch', view_func=view, strict_slashes=False)

    return bp


class ErrorReportingMiddleware(object):
    def resolve(self, next, root, info, **args):
        try:
            return next(root, info, **args)
        except Exception as e:
            logging.exception(
                "An error occurred while resolving field {}.{}".format(info.parent_type.name, info.field_name)
            )
            logging.error(e)
            raise e
