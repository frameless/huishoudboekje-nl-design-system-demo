#!/usr/bin/env python
import logging
import os
import io
from urllib.parse import urlparse

import itsdangerous
from flask import Flask, jsonify, redirect, make_response, session, send_file
from flask_oidc import OpenIDConnect

import hhb_backend.graphql.blueprint as graphql_blueprint
from hhb_backend.custom_oidc import CustomOidc
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

        # TODO replace 2 lines below with actual data/filename retrieved by function
        # something like:
        # xml_data, xml_filename = get_export(export_id)
        xml_data = f"<xml>{export_id}</xml>"
        xml_filename = f"{export_id}.xml"

        export_file = io.BytesIO(xml_data.encode('utf-8'))
        response = make_response(send_file(export_file, attachment_filename=xml_filename))
        response.headers['Content-Disposition'] = 'attachment'
        return response

    return app


if __name__ == '__main__':
    create_app().run(debug=True)
