from graphene_file_upload.flask import FileUploadGraphQLView
from graphql.execution.executors.asyncio import AsyncioExecutor
import asyncio
import nest_asyncio
from flask import render_template, Blueprint, request
from flask_graphql import GraphQLView

from hhb_backend.graphql import schema
from hhb_backend.graphql.dataloaders import HHBDataLoader


def create_blueprint(loop=None):
    if not loop:
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    nest_asyncio.apply()

    bp = Blueprint('graphql', __name__)

    bp.add_url_rule('/',
                    view_func=GraphQLView.as_view('graphql',
                                                  schema=schema,
                                                  graphiql=True,
                                                  executor=AsyncioExecutor(loop=loop)),
                    strict_slashes=False)

    # Optional, for adding batch query support (used in Apollo-Client)
    bp.add_url_rule('/batch',
                    view_func=GraphQLView.as_view('graphql_batch',
                                                  schema=schema,
                                                  executor=AsyncioExecutor(loop=loop),
                                                  batch=True),
                    strict_slashes=False)

    bp.add_url_rule(
        '/upload',
        view_func=FileUploadGraphQLView.as_view(
            'upload',
            graphiql=True,
            schema=schema,
            executor=AsyncioExecutor(loop=loop)),
        strict_slashes=False)

    @bp.route('/help')
    def voyager():
        return render_template('voyager.html')

    @bp.before_request
    def add_dataloaders():
        """ Initialize dataloader per request """
        request.dataloader = HHBDataLoader(loop=loop)

    return bp
