#!/usr/bin/env python
import inspect
import json
import logging
import os
import pprint
import secrets

import itsdangerous
from flask import Flask, url_for, jsonify, g, Response, redirect, request
from flask_oidc import OpenIDConnect


class ReverseProxied(object):

    def __init__(self, app, script_name=None, scheme=None, server=None):
        self.app = app
        self.script_name = script_name
        self.scheme = scheme
        self.server = server

    def __call__(self, environ, start_response):
        logging.debug(pprint.pformat(environ))
        logging.debug(pprint.pformat(self))
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
app.config.update({
    'SESSION_COOKIE_NAME': 'flask_session',
    'TESTING': True,
    'DEBUG': True,
    'OIDC_CLIENT_SECRETS': os.environ.get('OIDC_CLIENT_SECRETS', './client_secrets.json'),
    # 'OIDC_CALLBACK_ROUTE': '/oidc_callback',
    'OVERWRITE_REDIRECT_URI': 'http://localhost:3000/api/oidc_callback',
    'OIDC_SCOPES': ['openid', 'email', 'groups', 'profile'],
    # 'OIDC_CLOCK_SKEW': 360,  #
    'OIDC_ID_TOKEN_COOKIE_SECURE': os.environ.get('OIDC_ID_TOKEN_COOKIE_SECURE', False),
    'SECRET_KEY': os.environ.get('SECRET', secrets.token_urlsafe(16))
})
if 'PREFIX' in os.environ:
    app.wsgi_app = ReverseProxied(app.wsgi_app, script_name=os.environ.get('PREFIX'))

oidc_overrides = {}
oidc = OpenIDConnect(app, **oidc_overrides)


# @app.route('/')
# def hello_world():
#     app.logger.info('url_for(.)=%s', url_for(inspect.stack()[0][3]))
#     return 'Hello, World!'


# TODO only neeede when SECRET_KEY is generated
@app.errorhandler(itsdangerous.exc.BadSignature)
def handle_bad_signature(e):
    oidc.logout()
    return redirect(url_for("login"), code=302)


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


@app.route('/')
def hello_world():
    return redirect('/', code=301)


@app.route('/private')
@oidc.require_login
def hello_me():
    info = oidc.user_getinfo(['email', 'openid'])
    return ('Hello, %s (%s)! <a href="/">Return</a>' %
            (info.get('email'), info.get('openid_id')))


@app.route('/api')
@oidc.accept_token(True, ['openid'])
def hello_api():
    return json.dumps({'hello': 'Welcome %s' % g.oidc_token_info['sub']})


@app.route('/logout')
def logout():
    oidc.logout()
    return 'Hi, you have been logged out! <a href="/">Return</a>'


if __name__ == '__main__':
    app.run(debug=True)
