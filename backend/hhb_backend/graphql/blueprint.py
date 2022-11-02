from flask import Blueprint
from hhb_backend.graphql.graphene_file_upload import FileUploadGraphQLView

from hhb_backend.graphql import schema


def create_blueprint():
    bp = Blueprint('graphql', __name__)

    view = FileUploadGraphQLView.as_view(
        'graphql',
        schema=schema.graphql_schema,
        graphiql=True,
        batch=True)

    bp.add_url_rule('/', view_func=view, strict_slashes=False)

    # Optional, for adding batch query support (used in Apollo-Client)
    bp.add_url_rule('/batch', view_func=view, strict_slashes=False)

    return bp
