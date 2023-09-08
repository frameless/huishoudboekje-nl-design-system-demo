import jwt from "jsonwebtoken";
import {Algorithm} from "jsonwebtoken";
import jwksClient from 'jwks-rsa'
import log from "loglevel";

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
	private readonly jwksClientInstance: jwksClient.JwksClient


	constructor(config: Partial<SessionHelperConfig>) {
		const _config = {
			...defaultConfig,
			...config,
		};
		this.secret = _config.secret;
		this.audience = _config.audience;
		this.issuer = _config.issuer;
		this.allowedAlgs = this.parseAllowedAlgorithms(_config.allowedAlgs)
		this.jwksClientInstance = jwksClient({
			jwksUri: `${process.env.OIDC_BASE_URL}/.well-known/jwks.json`
		});

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
		if (['HS256', 'HS384', 'HS512'].includes(alg)) {
			return this.secret
		}
		else {
			const decodedToken = jwt.decode(token, {complete: true})
			if (decodedToken) {
				const jwtHeader = decodedToken.header
				const jwtKid = jwtHeader.kid
				if (jwtKid) {
					this.jwksClientInstance.getSigningKey(jwtKid, (err, key) => {
						if (err) {
							log.error(err)
						}
						else {
							const publicKey = key?.getPublicKey()
							return publicKey
						}
					})

				}

			}
		}
	}
}

export default SessionHelper;
