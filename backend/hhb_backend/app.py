#!/usr/bin/env python
import io
import logging
import os

import requests
from flask import Flask, jsonify, make_response, render_template, send_file

import hhb_backend.graphql.blueprint as graphql_blueprint
from hhb_backend.auth import Auth
from hhb_backend.graphql import settings
from hhb_backend.reverse_proxy import ReverseProxied

ANONYMOUS_ROLENAME = 'anonymous'
MEDEWERKER_ROLENAME = 'medewerker'


def create_app(
        config_name=os.getenv("APP_SETTINGS", None)
                    or "hhb_backend.config.DevelopmentConfig",
        loop=None
):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(level=app.config["LOG_LEVEL"])
    logging.info(f"Starting {__name__} with {config_name}")

    if app.config["PREFIX"]:
        app.wsgi_app = ReverseProxied(app.wsgi_app, script_name=app.config["PREFIX"])

    auth = Auth(app, anonymous_rolename=ANONYMOUS_ROLENAME, default_rolename=MEDEWERKER_ROLENAME)

    @app.route("/health")
    @auth.rbac.allow([ANONYMOUS_ROLENAME], ['GET'])
    def health():
        return make_response(("ok", {"Content-Type": "text/plain"}))

    @app.route("/version")
    @auth.rbac.allow([ANONYMOUS_ROLENAME], ['GET'])
    def version_file():
        try:
            return send_file("version.json")
        except:
            return jsonify(component="backend", tag="dev", version="0.20.0")

    graphql = graphql_blueprint.create_blueprint(loop=loop)

    @graphql.before_request
    @auth.rbac.allow([MEDEWERKER_ROLENAME], methods=['GET', 'POST'], endpoint="graphql.graphql")
    def auth_graphql():
        pass

    app.register_blueprint(graphql, url_prefix="/graphql")

    @app.route('/graphql/help')
    @auth.rbac.allow([ANONYMOUS_ROLENAME], methods=['GET'])
    def voyager():
        return render_template('voyager.html')

    @app.route("/export/<export_id>")
    @auth.rbac.allow([MEDEWERKER_ROLENAME], methods=['GET'])
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

    app.auth=auth
    return app


if __name__ == "__main__":
    create_app().run(debug=True)
