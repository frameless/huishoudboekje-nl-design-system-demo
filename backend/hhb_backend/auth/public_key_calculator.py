import requests
import logging
from jose.backends import RSAKey, ECKey
from jose.constants import ALGORITHMS
from jose.jwt import get_unverified_header


class PublicKeyCalculator:
    def get_public_key(self, token, alg, issuer):
        return self._determine_key_to_use(self._get_public_key_from_oidc(token, issuer), alg)

    def _get_oidc_config_uri(self, issuer):
        return f'{issuer}{"" if issuer.endswith("/") else "/"}.well-known/openid-configuration'

    def _get_jwks_uri_from_config(self, config_uri):
        try:
            config_data = requests.get(config_uri).json()
            jwks_uri = config_data.get('jwks_uri', None)
            if jwks_uri == None:
                logging.warning("JWKS endpoint not found for issuer")
            return jwks_uri
        except requests.exceptions.RequestException as e:
            logging.error(f'Error trying to fetch oidc configuration: {e}')
            return None
        except Exception as e:
            logging.error(
                f"Error trying to decode openid-configuration: {e}")
            return None

    def _get_public_key_from_oidc(self, token, issuer):
        jwks_uri = self._get_jwks_uri_from_config(
            self._get_oidc_config_uri(issuer))
        if jwks_uri != None:
            try:
                jwks_keys = requests.get(jwks_uri).json().get('keys', [])
                kid = self._get_KID_from_token(token)
                public_key = None
                for key in jwks_keys:
                    if key.get('kid') == kid:
                        public_key = key
                        break
                if public_key == None:
                    logging.warning(f"public key not found for KID: {kid}")
                return public_key
            except requests.exceptions.RequestException as e:
                logging.error(
                    f"Error trying to get keys from JWKS endpoint: {e}")
                return None
            except Exception as e:
                logging.error(
                    f"Error trying to decode JWKS keys: {e}")
                return None
        return None

    def _get_KID_from_token(self, token):
        return get_unverified_header(token).get("kid")

    def _determine_key_to_use(self, key, algorithm):
        if (algorithm in ALGORITHMS.RSA):
            return RSAKey(key, algorithm)
        elif (algorithm in ALGORITHMS.EC):
            return ECKey(key, algorithm)

        raise ValueError(
            f"No key could be found or the algorithm: {algorithm} is not supported.")
