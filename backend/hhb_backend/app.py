#!/usr/bin/env python
import asyncio
import io
import logging
import nest_asyncio
from flask import Flask, make_response, render_template, send_file, request, abort
from functools import wraps
from http.client import HTTPException

import hhb_backend.graphql.blueprint as graphql_blueprint
from graphql import GraphQLError
from hhb_backend.auth import Auth
from hhb_backend.commands.alarms import alarms_cli
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.processen import brieven_export
from hhb_backend.reverse_proxy import ReverseProxied
from hhb_backend.content_type_validation import ContentTypeValidator


def create_app(
    config_name="hhb_backend.config.Config",
    loop=None
):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    app.logger = logger = logging.getLogger(__name__)
    logger.info(f"Starting {__name__} with {config_name}")

    # Werkzeug has their own logger which outputs info level URL calls.
    # This can also cause parameters that are normally hidden to be logged
    # Default warning because there is only one endpoint
    logging.getLogger('werkzeug').setLevel("WARNING")
    #Pika logs very much so default only warning so the logs stay readable
    logging.getLogger("pika").setLevel(logging.WARNING)

    if app.config["PREFIX"]:
        app.wsgi_app = ReverseProxied(
            app.wsgi_app, script_name=app.config["PREFIX"])

    if not loop:
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    nest_asyncio.apply()

    try:
        auth = Auth(app)
    except HTTPException as err:
        logger.error("A HTTP Exception occurred")
        logger.debug(err)

    @app.route("/health")
    def health():
        return make_response(("ok", {"Content-Type": "text/plain"}))

    graphql = graphql_blueprint.create_blueprint(app.config["USE_GRAPHIQL"], app.config["ALLOW_INTROSPECTION"])

    @graphql.before_request
    def validate_content_type():
        if not ContentTypeValidator().is_valid(request):
            abort(415, "Content-type not supported by this endpoint")

    @graphql.before_request
    @auth.require_login
    def auth_graphql():
        pass

    app.register_blueprint(graphql, url_prefix="/graphql")

    @app.route('/graphql/help')
    @auth.require_login
    def voyager():
        return render_template('voyager.html')

    @app.route("/export/<export_id>")
    @auth.require_login
    def export_overschrijvingen(export_id):
        """ Send xml overschijvingen file to client """
        # Get export object
        export = hhb_dataloader().exports.load_one(export_id)
        if not export:
            raise GraphQLError("Export not found")

        # Create xml
        xml_data = export["xmldata"]
        xml_filename = f"{export['naam']}.xml"

        export_file = io.BytesIO(xml_data.encode("utf-8"))
        response = make_response(
            # attachment_filename=xml_filename)
            send_file(export_file, download_name=xml_filename)
        )
        response.headers[
            "Content-Disposition"
        ] = f'attachment; filename="{xml_filename}"'
        return response

    @app.route("/brievenexport/<burger_id>/<type>")
    @auth.require_login
    def export_afspraken(burger_id, type="excel"):
        """ Send csv with afspraken data to medewerker """
        data, csv_filename_or_errorcode, excel_data, excel_filename = brieven_export.create_brieven_export(
            burger_id)

        # If the filename is an int, its an error code.
        if isinstance(csv_filename_or_errorcode, int):
            return data, csv_filename_or_errorcode

        csv_filename = csv_filename_or_errorcode

        if type == "excel":
            output = make_response(excel_data)
            output.headers["Content-Disposition"] = f"attachment; filename={excel_filename}"
            output.headers["Content-type"] = "application/vnd.ms-excel"
        elif type == "csv":
            output = make_response(data)
            output.headers["Content-Disposition"] = f"attachment; filename={csv_filename}"
            output.headers["Content-type"] = "text/csv"
        else:
            output = make_response(data)
            output.headers["Content-type"] = "text/plain"

        return output

    app.register_blueprint(alarms_cli)

    return app


if __name__ == "__main__":
    create_app().run()
