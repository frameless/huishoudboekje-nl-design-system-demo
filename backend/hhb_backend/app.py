#!/usr/bin/env python
import logging
import os
import io
from urllib.parse import urlparse

import itsdangerous
import requests
from flask import Flask, jsonify, redirect, make_response, session, send_file
from flask_oidc import OpenIDConnect

import hhb_backend.graphql.blueprint as graphql_blueprint
from hhb_backend.custom_oidc import CustomOidc
from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.create_sepa_export import create_export_string
from hhb_backend.reverse_proxy import ReverseProxied


def create_app(config_name=os.getenv('APP_SETTINGS', None) or 'hhb_backend.config.DevelopmentConfig'):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig( level=app.config["LOG_LEVEL"],  )
    logging.info(f"Starting {__name__} with {config_name}")

    if app.config['PREFIX']:
        app.wsgi_app = ReverseProxied(app.wsgi_app, script_name=app.config['PREFIX'])

    oidc_overrides = {}
    oidc = OpenIDConnect(app, **oidc_overrides)

    custom_oidc = oidc
    if app.config['OVERWITE_REDIRECT_URI_MAP']:
        logging.info(f"Loading custom OVERWITE_REDIRECT_URI_MAP: {app.config['OVERWITE_REDIRECT_URI_MAP']}")
        custom_oidc = CustomOidc(oidc=oidc, flask_app=app, prefixes=app.config['OVERWITE_REDIRECT_URI_MAP'])

    @app.errorhandler(itsdangerous.exc.BadSignature)
    def handle_bad_signature(e):
        oidc.logout()
        session.clear()
        return jsonify(message='Not logged in'), 401

    @app.route('/health')
    def health():
        return make_response(('ok', {'Content-Type': 'text/plain'}))

    @app.route('/version')
    def version_file():
        try:
            return send_file('version.json')
        except :
            return jsonify(component='backend', tag='dev')

    @app.route('/me')
    def me():
        if oidc.user_loggedin:
            return jsonify(email=oidc.user_getfield('email'), groups=oidc.user_getinfo('groups'))
        else:
            return jsonify(message='Not logged in'), 401

    @app.route('/custom_oidc_callback')
    @oidc.custom_callback
    def oidc_redirect(url):
        session.permanent = True
        parse_result = urlparse(url)
        new_url = "%s://%s" % (parse_result.scheme, parse_result.netloc)
        logging.info("oidc_redirect url=%s" % (new_url))
        return redirect(new_url)

    @app.route('/login')
    @custom_oidc.require_login
    def login():
        return redirect('/', code=302)

    graphql = graphql_blueprint.create_blueprint()
    if app.config['GRAPHQL_AUTH_ENABLED']:
        @graphql.before_request
        @custom_oidc.require_login
        def auth_graphql():
            pass

    app.register_blueprint(graphql, url_prefix='/graphql')
    app.register_blueprint(graphql, url_prefix='/graphql_upload')

    @app.route('/logout')
    def logout():
        oidc.logout()
        session.clear()
        return make_response(('ok', {'Content-Type': 'text/plain'}))

    @app.route('/export/<export_id>')
    def export_overschrijvingen(export_id):
        """ Send xml overschijvingen file to client """
        # Get export object
        export_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/export/{export_id}",
            headers={'Content-type': 'application/json'}
        )
        if export_response.status_code != 200:
            return jsonify(message=export_response.json()), export_response.status_code
        export_object = export_response.json()['data']

        # Get all overschrijvingen based on export object
        overschrijving_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/overschrijvingen/?filter_exports={export_object['id']}",
            headers={'Content-type': 'application/json'}
        )
        if overschrijving_response.status_code != 200:
            return jsonify(message=export_response.json()), export_response.status_code
        overschrijvingen = overschrijving_response.json()['data']
        if not overschrijvingen:
            return jsonify(message="Geen overschrijvingen gevonden"), export_response.status_code

        # Get all afspraken based on the overschrijvingen
        afspraken_ids = list(set([overschrijving['afspraak_id'] for overschrijving in overschrijvingen]))
        afspraken_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={','.join(str(x) for x in afspraken_ids)}",
            headers={'Content-type': 'application/json'}
        )
        if afspraken_response.status_code != 200:
            return jsonify(message=afspraken_response.json()), afspraken_response.status_code
        afspraken = afspraken_response.json()['data']
        if not afspraken:
            return jsonify(message="Geen afspraken gevonden"), afspraken_response.status_code

        # Get all tegen_rekeningen based on the afspraken
        tegen_rekeningen_ids = list(set([afspraak_result['tegen_rekening_id'] for afspraak_result in afspraken]))
        rekeningen_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids={','.join(str(x) for x in tegen_rekeningen_ids)}",
            headers={'Content-type': 'application/json'}
        )
        if rekeningen_response.status_code != 200:
            return jsonify(message=rekeningen_response.json()), rekeningen_response.status_code
        tegen_rekeningen = rekeningen_response.json()['data']
        if not tegen_rekeningen:
            return jsonify(message="Geen rekeningen gevonden"), rekeningen_response.status_code

        # Create xml
        xml_data = create_export_string(overschrijvingen, afspraken, tegen_rekeningen)
        xml_filename = f"{export_object['naam']}.xml"

        export_file = io.BytesIO(xml_data)
        response = make_response(send_file(export_file, attachment_filename=xml_filename))
        response.headers['Content-Disposition'] = f'attachment; filename="{xml_filename}"'
        return response

    return app


if __name__ == '__main__':
    create_app().run(debug=True)
