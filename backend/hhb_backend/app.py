#!/usr/bin/env python
import logging
import os
import secrets

import itsdangerous
from flask import Flask, jsonify, Response, redirect, render_template
from flask_oidc import OpenIDConnect
from flask_graphql import GraphQLView
from hhb_backend.graphql import schema

class ReverseProxied(object):

    def __init__(self, app, script_name=None, scheme=None, server=None):
        self.app = app
        self.script_name = script_name
        self.scheme = scheme
        self.server = server

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '') or self.script_name
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]
        scheme = environ.get('HTTP_X_SCHEME', '') or self.scheme
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        host = environ.get('HTTP_X_FORWARDED_HOST', '') or self.server
        if host:
            environ['HTTP_HOST'] = host
        return self.app(environ, start_response)


# TODO extract to file
class PrefixMiddleware(object):

    def __init__(self, app, prefix=''):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):

        if environ['PATH_INFO'].startswith(self.prefix):
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'text/plain')])
            return ["Not found".encode()]


# TODO extract
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
secretKey = os.getenv('SECRET_KEY', secrets.token_urlsafe(16))
app.config.from_mapping({
    'SECRET_KEY': secretKey,
    'SESSION_COOKIE_NAME': 'flask_session',
    'OIDC_CLIENT_SECRETS': os.getenv('OIDC_CLIENT_SECRETS', './etc/client_secrets.json'),
    'OVERWRITE_REDIRECT_URI': os.getenv('OIDC_REDIRECT_URI', 'http://localhost:3000/api/oidc_callback'),
    'OIDC_SCOPES': ['openid', 'email', 'groups', 'profile'],
    # 'OIDC_CLOCK_SKEW': 360,  #
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


@app.route('/login')
@oidc.require_login
def login():
    return redirect('/', code=302)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view(
    'graphql',
    schema=schema,
    graphiql=True,
))

@app.route('/graphql/help')
def voyager():
    return render_template('voyager.html')

@app.route('/logout')
def logout():
    oidc.logout()
    return 'Hi, you have been logged out! <a href="/">Return</a>'


if __name__ == '__main__':
    app.run(debug=True)
