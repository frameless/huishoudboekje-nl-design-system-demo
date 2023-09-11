import jwt from "jsonwebtoken";
import {Algorithm} from "jsonwebtoken";
import jwksClient from 'jwks-rsa'
import log from "loglevel";
const axios = require('axios')

const defaultConfig: SessionHelperConfig = {
	secret: "testtest",
	audience: "huishoudboekje",
	issuer: "huishoudboekje",
	allowedAlgs: 'HS256,RS256'
};

type SessionHelperConfig = {
	secret: string,
	audience: string,
	issuer: string,
	allowedAlgs: string
}

class SessionHelper {
	private readonly secret: string;
	private readonly audience: string;
	private readonly issuer: string;
	private readonly allowedAlgs: Algorithm[];
	private readonly supportedAlgs: Algorithm[] = ['ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'PS256', 'PS512', 'RS256', 'RS384', 'RS512']
	// we only need one jwksClient, but we can only configure it when we know the jwks uri. We will set the jwksclient when the first request is made to the auth service.
	private jwksClientInstance: jwksClient.JwksClient | null = null


	constructor(config: Partial<SessionHelperConfig>) {
		const _config = {
			...defaultConfig,
			...config,
		};
		this.secret = _config.secret;
		this.audience = _config.audience;
		this.issuer = _config.issuer;
		this.allowedAlgs = this.parseAllowedAlgorithms(_config.allowedAlgs)
	}

	createSession(res, token) {
		res.cookie("app-token", token, {httpOnly: true, secure: true, sameSite: "lax"});
	}

	destroySession(req, res) {
		res.clearCookie('app-token')
		req.session.destroy()
	}

	verifyToken(token): boolean {
		try {
			const alg = this.getAlgorithmFromHeader(token)

			if (alg) {
				const keyOrSecret = this.getJWTKeyOrSecret(alg, token)
				if (keyOrSecret) {
					jwt.verify(token, keyOrSecret, {
						audience: this.audience,
						issuer: this.issuer,
						algorithms: [alg]
					});
					return true;
				}
			}
			return false
		}
		catch (err) {
			log.error('failed to verify token', err)
			return false;
		}
	}

	getAlgorithmFromHeader(token) {
		try {
			const decodedToken = jwt.decode(token, {complete: true})
			if (decodedToken) {
				const jwtHeader = decodedToken.header
				log.info(new Date().toISOString(), "JWT Header: ", jwtHeader)

				const jwtAlgorithm = jwtHeader.alg
				log.info(new Date().toISOString(), "JWT Alg: ", jwtAlgorithm)
				return jwtAlgorithm as Algorithm
			}
			log.info("token did not contain a decode-able token")
			return false
		}
		catch (err) {
			log.error("failed to decode token or token did not contain alg header")
			return false
		}
	}

	verifyAllowedAlgorithms(token) {
		const jwtAlg = this.getAlgorithmFromHeader(token)
		if (jwtAlg) {
			if (this.allowedAlgs.includes(jwtAlg)) {
				return true
			}
		}
		return false
	}

	parseAllowedAlgorithms(algorithmsEnv: string): Algorithm[] {
		const algorithmStrings = algorithmsEnv.split(',');

		const algorithms: Algorithm[] = algorithmStrings.map((algorithmString) => {
			const trimmedAlgorithm = (algorithmString.trim().toUpperCase() as Algorithm)
			if (this.supportedAlgs.includes(trimmedAlgorithm)) {
				return trimmedAlgorithm
			}
			throw new TypeError(`Algorithm ${trimmedAlgorithm} is not supported, please update environment`)
		});

		return algorithms;
	}

	getJWTKeyOrSecret(alg: Algorithm, token) {
		// These are symmetric (private key only) algorithms and only require the secret from env
		if (['HS256', 'HS384', 'HS512'].includes(alg)) {
			return this.secret
		}
		// any other algorithm uses a public key system based on the KID (gotten from jwt header)
		else {
			const decodedToken = jwt.decode(token, {complete: true})
			if (decodedToken) {
				const jwtHeader = decodedToken.header
				const jwtKid = jwtHeader.kid
				if (jwtKid) {
					return this.getJWKSPublicKey(jwtKid)
				}

			}
		}
	}

	// The JWKS endpoint is not the same for every openid provider, but the configuration is.
	// For this reason we first get the openid-configuration, which returns a json object inlcuding the jwks_uri
	getJWKSPublicKey(kid) {
		// the issuer should always be the same, and as such the open-id configuration aswell. We only need to do this once here, when the client instance does not exist
		if (this.jwksClientInstance == null) {
			log.info("no jwks client configured, getting configuration and setting up..")
			try {
				const jwksUri = Promise.resolve(this.getJWKSUri()).toString()
				// set the jwks uri and create the jwksClient
				this.jwksClientInstance = jwksClient({
					jwksUri: jwksUri,
				});
			}
			catch (err) {
				log.error(err)
				return false
			}
		}
		// get the public key from openid provider using jwksClient
		this.jwksClientInstance.getSigningKey(kid, (err, key) => {
			if (err) {
				log.error(err)
				return false
			}
			else {
				const publicKey = key?.getPublicKey()
				return publicKey
			}
		})
	}

	// this will get the configuration where we can find the JWKS uri
	async getJWKSUri() {
		const response = await axios.get(`${this.issuer}/.well-known/openid-configuration`)
		return response.data['jwks_uri']
	}
}

export default SessionHelper;
