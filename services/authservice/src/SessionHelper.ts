import jwt from "jsonwebtoken";
import {Algorithm} from "jsonwebtoken";
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
			jwt.verify(token, this.secret, {
				audience: this.audience,
				issuer: this.issuer,
				algorithms: this.allowedAlgs
			});
			return true;
		}
		catch (err) {
			log.error('failed to verify token', err)
			return false;
		}
	}

	verifyAllowedAlgorithms(token): boolean {
		try {
			const decodedToken = jwt.decode(token, {complete: true})
			if (decodedToken) {
				const jwtHeader = decodedToken.header
				log.info(new Date().toISOString(), "JWT Header: ", jwtHeader)

				const jwtAlgorithm = jwtHeader.alg
				log.info(new Date().toISOString(), "JWT Alg: ", jwtAlgorithm)

				if (this.allowedAlgs.includes(jwtAlgorithm as Algorithm)) {
					return true
				}
			}
			return false
		}
		catch (err) {
			log.error("failed to decode token or token did not contain alg header")
			return false
		}
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
}

export default SessionHelper;
