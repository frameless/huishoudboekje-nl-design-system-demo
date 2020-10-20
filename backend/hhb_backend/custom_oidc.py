import json
import logging
from functools import wraps

from flask import g, request


class CustomOidc(object):

    def __init__(self, oidc, flask_app, prefixes="""{
  "http://localhost:3000": "http://localhost:3000/api/custom_oidc_callback",
  "http://hhb.minikube:3000": "http://hhb.minikube:3001/api/custom_oidc_callback"
}
"""):
        self.oidc = oidc
        self.flask_app = flask_app
        self.prefixes = json.loads(prefixes)

    def require_login(self, view_func):
        """
        Use this to decorate view functions that require a user to be logged
        in. If the user is not already logged in, they will be sent to the
        Provider to log in, after which they will be returned.
        """
        @wraps(view_func)
        def decorated(*args, **kwargs):
            if g.oidc_id_token is None:
                destination = request.url
                if 'HTTP_REFERER' in request.environ:
                    referer = request.environ.get('HTTP_REFERER')
                    for key, value in self.prefixes.items():
                        # logging.info("%s -> %s" % (key, value))
                        if referer.startswith(key):
                            logging.info("OidcRedirectRouter.require_login OVERWRITE_REDIRECT_URI -> %s" % (value))
                            self.flask_app.config['OVERWRITE_REDIRECT_URI'] = value
                            destination = "%s%s" % (key, request.environ.get('RAW_URI'))
                logging.info("OidcRedirectRouter.require_login destination=%s" % (destination))

                return self.oidc.redirect_to_auth_server(request.url, destination)
            return view_func(*args, **kwargs)
        return decorated