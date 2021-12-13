import asyncio

from flask import Blueprint, request
from graphene_file_upload.flask import FileUploadGraphQLView
from graphql.execution.executors.asyncio import AsyncioExecutor
import nest_asyncio
from hhb_backend.graphql import schema
from hhb_backend.graphql.dataloaders import HHBDataLoader

def create_blueprint(loop=None):
    if not loop:
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    nest_asyncio.apply()

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

    @bp.before_request
    def add_dataloaders():
        """ Initialize dataloader per request """
        request.dataloader = HHBDataLoader(loop=loop)

    return bp
