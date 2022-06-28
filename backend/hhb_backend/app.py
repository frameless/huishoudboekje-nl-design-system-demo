#!/usr/bin/env python
from http.client import HTTPException
import io
import logging
import os

import hhb_backend.graphql.blueprint as graphql_blueprint
import requests
from flask import Flask, jsonify, make_response, render_template, send_file
from hhb_backend.auth import Auth
from hhb_backend.graphql import settings
from hhb_backend.processen import brieven_export
from hhb_backend.reverse_proxy import ReverseProxied


def create_app(
        config_name=os.getenv("APP_SETTINGS", None)
                    or "hhb_backend.config.DevelopmentConfig",
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

    if app.config["PREFIX"]:
        app.wsgi_app = ReverseProxied(app.wsgi_app, script_name=app.config["PREFIX"])

    try:
        auth = Auth(app)
    except HTTPException as err:
        logger.error(err)

    @app.route("/health")
    def health():
        return make_response(("ok", {"Content-Type": "text/plain"}))

    @app.route("/version")
    def version_file():
        try:
            return send_file("version.json")
        except:
            return jsonify(component="backend", tag="dev", version="0.20.0")

    graphql = graphql_blueprint.create_blueprint(loop=loop)

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
        export_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/export/{export_id}",
            headers={"Content-type": "application/json"},
        )
        if export_response.status_code != 200:
            return jsonify(message=export_response.json()), export_response.status_code
        export_object = export_response.json()["data"]

        # Create xml
        xml_data = export_object["xmldata"]
        xml_filename = f"{export_object['naam']}.xml"

        export_file = io.BytesIO(xml_data.encode("utf-8"))
        response = make_response(
            send_file(export_file, attachment_filename=xml_filename)
        )
        response.headers[
            "Content-Disposition"
        ] = f'attachment; filename="{xml_filename}"'
        return response

    @app.route("/brievenexport/<burger_id>/<type>")
    @auth.require_login
    def export_afspraken(burger_id, type="excel"):
        """ Send csv with afspraken data to medewerker """
        data, csv_filename_or_errorcode, excel_data, excel_filename = brieven_export.create_brieven_export(burger_id)

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
            return data, 404

        return output

    return app

if __name__ == "__main__":
    create_app().run()
