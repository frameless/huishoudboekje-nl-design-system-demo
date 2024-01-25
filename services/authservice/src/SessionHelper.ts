import jwt from "jsonwebtoken";
import {Algorithm} from "jsonwebtoken";
import jwksClient from 'jwks-rsa'
import log from "loglevel";
const axios = require('axios')

const defaultConfig: SessionHelperConfig = {
	secret: "testtest",
	audience: "huishoudboekje",
	issuer: "huishoudboekje",
	allowedAlgs: 'HS256,RS256',
	scopes: null
};

type SessionHelperConfig = {
	secret: string,
	audience: string,
	issuer: string,
	allowedAlgs: string,
	scopes: string | null
}

class SessionHelper {
	private readonly secret: string;
	private readonly audience: string;
	private readonly issuer: string;
	private readonly allowedAlgs: Algorithm[];
	private readonly supportedAlgs: Algorithm[] = ['ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'PS256', 'PS512', 'RS256', 'RS384', 'RS512']
	// we only need one jwksClient, but we can only configure it when we know the jwks uri. We will set the jwksclient when the first request is made to the auth service.
	private jwksClientInstance: jwksClient.JwksClient | null = null

	public readonly scopes: string;


	constructor(config: Partial<SessionHelperConfig>) {
		const _config = {
			...defaultConfig,
			...config,
		};
		this.secret = _config.secret;
		this.audience = _config.audience;
		this.issuer = _config.issuer;
		this.allowedAlgs = this.parseAllowedAlgorithms(_config.allowedAlgs)
		this.scopes = this.parseScopes(_config.scopes)
		log.warn("secr: " + this.secret)
		log.warn("aud: " + this.audience)
		log.warn("iss: " + this.issuer)
		log.warn("allwdAlgs: " + this.allowedAlgs)
		log.warn("scopes: " + this.scopes)

	}

	createSession(res, token) {
		res.cookie("app-token", token, {httpOnly: true, secure: true, sameSite: "lax"});
	}

	destroySession(req, res) {
		res.clearCookie('app-token')
		req.session.destroy()
	}

	async verifyToken(token) {
		try {
			log.warn("jwt: " + token)
			const alg = this.getAlgorithmFromHeader(token)
			if (alg) {
				if (this.verifyAllowedAlgorithms(alg)) {
					if (this.jwksClientInstance == null) {
						await this.setJWKSClientInstance()
					}
					return await this.getJWTKeyOrSecret(alg, token).then((keyOrSecret) => {
						if (keyOrSecret) {
							const res = jwt.verify(token, keyOrSecret, {
								audience: this.audience,
								issuer: this.issuer,
								algorithms: [alg]
							});
							return true;
						}
					}).catch((error) => {
						log.error(new Date().toISOString(), error)
						this.jwksClientInstance = null
						return false
					})

				}
			}
			return false
		}
		catch (err) {
			log.error(new Date().toISOString(), 'failed to verify token', err)
			return false;
		}
	}

	getUserInfoFromToken(token) {
		const decodedToken = jwt.decode(token, {complete: true})
		if (decodedToken) {
			const jwtBody: jwt.JwtPayload = decodedToken.payload as jwt.JwtPayload
			const name = jwtBody.name ?? null
			const email = jwtBody.email ?? (jwtBody.preferred_username ?? null)
			const user = {name, email}
			return user
		}
		return false
	}

	getAlgorithmFromHeader(token) {
		try {
			const decodedToken = jwt.decode(token, {complete: true})
			if (decodedToken) {
				const jwtHeader = decodedToken.header

				const jwtAlgorithm = jwtHeader.alg
				return jwtAlgorithm as Algorithm
			}
			log.info(new Date().toISOString(), "token did not contain a decode-able header")
			return false
		}
		catch (err) {
			log.error(new Date().toISOString(), "failed to decode token or token did not contain alg header")
			return false
		}
	}

	verifyAllowedAlgorithms(alg) {
		if (alg) {
			if (this.allowedAlgs.includes(alg)) {
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

	// scopes should be space delimited
	parseScopes(scopesEnv: string | null): string {
		let scopeList = ['email', 'profile', 'offline_access', 'openid']
		if (scopesEnv != null) {
			scopeList = scopeList.concat(scopesEnv.split(','))
		}
		return scopeList.join(' ')
	}

	async getJWTKeyOrSecret(alg: Algorithm, token) {
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
					return await this.getJWKSPublicKey(jwtKid)
				}

			}
		}
	}

	async setJWKSClientInstance() {
		// the issuer should always be the same, and as such the open-id configuration aswell. We only need to do this once here, when the client instance does not exist
		log.info(new Date().toISOString(), "no jwks client configured, getting configuration and setting up..")
		try {
			await this.getJWKSUri().then((uri) => {
				// set the jwks uri and create the jwksClient
				this.jwksClientInstance = jwksClient({
					jwksUri: uri,
				});
			})
			return true
		}
		catch (err) {
			log.error(new Date().toISOString(), err)
			this.jwksClientInstance = null;
		}
	}

	// The JWKS endpoint is not the same for every openid provider, but the configuration is.
	// For this reason we first get the openid-configuration, which returns a json object inlcuding the jwks_uri
	getJWKSPublicKey(kid) {
		// get the public key from openid provider using jwksClient
		return this.jwksClientInstance?.getSigningKey(kid)
			.then((key) => {
				return key.getPublicKey()
			})
			.catch((error) => {
				log.error(new Date().toISOString(), error)
				this.jwksClientInstance = null;
			})
	}

	// this will get the configuration where we can find the JWKS uri
	async getJWKSUri() {
		let url;
		if (this.issuer.endsWith('/')) {
			url = `${this.issuer}.well-known/openid-configuration`
		}
		else {
			url = `${this.issuer}/.well-known/openid-configuration`
		}
		const response = await axios.get(url)
		return response.data.jwks_uri
	}
}

export default SessionHelper;
