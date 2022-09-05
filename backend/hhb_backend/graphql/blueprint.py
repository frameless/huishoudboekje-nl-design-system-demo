from flask import Blueprint
from graphene_file_upload.flask import FileUploadGraphQLView
from graphql.execution.executors.asyncio import AsyncioExecutor

from hhb_backend.graphql import schema


def create_blueprint(loop=None):
    bp = Blueprint('graphql', __name__)

    view = FileUploadGraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
        batch=True,
        executor=AsyncioExecutor(loop=loop))

    bp.add_url_rule('/', view_func=view, strict_slashes=False)

    # Optional, for adding batch query support (used in Apollo-Client)
    bp.add_url_rule('/batch', view_func=view, strict_slashes=False)

    return bp
