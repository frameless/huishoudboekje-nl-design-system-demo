import re
from functools import wraps

import itsdangerous
import jwt
from flask import Flask, g, make_response, request, session
from flask_oidc import OpenIDConnect


class Role:
    def __init__(self, name):
        self.name = name


class Auth:
    oidc: OpenIDConnect

    anonymous_role = Role('anonymous')
    medewerker_role = Role('medewerker')

    def __init__(self, app: Flask):
        oidc_overrides = {}

        self.oidc = OpenIDConnect(app, **oidc_overrides)



        @app.errorhandler(itsdangerous.exc.BadSignature)
        def handle_bad_signature(_e):
            self.oidc.logout()
            session.clear()
            return make_response(({"message": "Not logged in"}, 401))


    def middleware(self, view_func):
        @wraps(view_func)
        def decorated(*args, **kwargs):
            self.hhb_roles = [self.anonymous_role]

            if self.oidc.user_loggedin:
                g.hhb_roles.append(self.medewerker_role)

            if 'Authorization' in request.headers:
                token_search = re.search('bearer (.*)', request.headers['Authorization'], re.IGNORECASE)

                if token_search:
                    token = token_search.group(1)
                    claims = jwt.decode(token, self.secret, algorithms="HS256", audience="huishoudboekje_medewerker")
                    if claims:

            return view_func(*args, **kwargs)

