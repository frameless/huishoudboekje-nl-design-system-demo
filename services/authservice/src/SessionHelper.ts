import jwt from "jsonwebtoken";
import log from "loglevel";

const defaultConfig: SessionHelperConfig = {
	secret: "testtest",
	expiresIn: "30d",
	audience: "huishoudboekje",
	issuer: "huishoudboekje",
};

type SessionHelperConfig = {
	secret: string,
	expiresIn: string,
	audience: string,
	issuer: string,
}

class SessionHelper {
	private readonly secret: string;
	private readonly audience: string;
	private readonly issuer: string;

	constructor(config: Partial<SessionHelperConfig>) {
		const _config = {
			...defaultConfig,
			...config,
		};

		this.secret = _config.secret;
		this.audience = _config.audience;
		this.issuer = _config.issuer;
	}

	createSession(res, token) {
		res.cookie("app-token", token, {httpOnly: true, secure: true, sameSite: "lax"});
	}

	destroySession(req, res) {
		req.session.destroy()
		res.clearCookie('app-token')
		res.redirect('/login')
	}


	verifyToken(token): boolean {
		try {
			jwt.verify(token, this.secret, {
				audience: this.audience,
				issuer: this.issuer,
			});
			return true;
		}
		catch (err) {
			log.error('failed to verify token', err)
			return false;
		}
	}
}

export default SessionHelper;
