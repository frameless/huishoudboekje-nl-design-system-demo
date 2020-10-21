#!/usr/bin/env python
import logging
import os
import secrets
import itsdangerous
from flask import Flask, jsonify, Response, redirect, render_template
from flask_oidc import OpenIDConnect
from flask_graphql import GraphQLView

from hhb_backend.custom_oidc import CustomOidc
from hhb_backend.graphql import schema
from urllib.parse import urlparse

from hhb_backend.reverse_proxy import ReverseProxied


# TODO extract
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
secretKey = os.getenv('SECRET_KEY', secrets.token_urlsafe(16))
app.config.from_mapping({
    'SECRET_KEY': secretKey,
    'SESSION_COOKIE_NAME': 'flask_session',
    'OIDC_CLIENT_SECRETS': os.getenv('OIDC_CLIENT_SECRETS', './etc/client_secrets.json'),
    'OIDC_SCOPES': ['openid', 'email', 'groups', 'profile'],
    'OIDC_ID_TOKEN_COOKIE_SECURE': os.getenv('OIDC_ID_TOKEN_COOKIE_SECURE', False),
})
if 'PREFIX' in os.environ:
    prefix = os.environ.get('PREFIX')
    app.config.from_mapping({
        'SESSION_COOKIE_PATH': prefix,
    })
    app.wsgi_app = ReverseProxied(app.wsgi_app, script_name=prefix)

oidc_overrides = {}
oidc = OpenIDConnect(app, **oidc_overrides)

customOidc = oidc
if 'OVERWITE_REDIRECT_URI_MAP' in os.environ:
    customOidc = CustomOidc(oidc=oidc, flask_app=app, prefixes=os.environ.get('OVERWITE_REDIRECT_URI_MAP'))


# TODO only needed when SECRET_KEY is generated
@app.errorhandler(itsdangerous.exc.BadSignature)
def handle_bad_signature(e):
    oidc.logout()
    return jsonify(message='Not logged in'), 401


@app.route('/health')
def health():
    return Response()


@app.route('/me')
def me():
    if oidc.user_loggedin:
        return jsonify(email=oidc.user_getfield('email'), groups=oidc.user_getinfo('groups'))
    else:
        return jsonify(message='Not logged in'), 401


@app.route('/custom_oidc_callback')
@oidc.custom_callback
def oidc_redirect(url):
    parseResult = urlparse(url)
    newUrl = "%s://%s" % (parseResult.scheme, parseResult.netloc)
    logging.info("oidc_redirect url=%s" % (newUrl))
    return redirect(newUrl)


@app.route('/login')
@customOidc.require_login
def login():
    return redirect('/', code=302)

app.add_url_rule('/graphql', view_func=customOidc.require_login(GraphQLView.as_view(
    'graphql',
    schema=schema,
    graphiql=True,
)), strict_slashes=False)

# Optional, for adding batch query support (used in Apollo-Client)
app.add_url_rule('/graphql/batch', view_func=customOidc.require_login(GraphQLView.as_view(
    'graphql_batch',
    schema=schema,
    batch=True
)), strict_slashes=False)

@app.route('/graphql/help')
@customOidc.require_login
def voyager():
    return render_template('voyager.html')

@app.route('/logout')
def logout():
    oidc.logout()
    return Response()


if __name__ == '__main__':
    app.run(debug=True)
