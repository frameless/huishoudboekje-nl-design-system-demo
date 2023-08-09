import jwt from "jsonwebtoken";

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
	private readonly expiresIn: string;
	private readonly audience: string;
	private readonly issuer: string;

	constructor(config: Partial<SessionHelperConfig>) {
		const _config = {
			...defaultConfig,
			...config,
		};

		this.secret = _config.secret;
		this.expiresIn = _config.expiresIn;
		this.audience = _config.audience;
		this.issuer = _config.issuer;
	}

	createSession(res, user) {
		const token = this.generateToken(user);
		res.cookie("app-token", token, {httpOnly: true, secure: true, sameSite: "lax"});
	}

	destroySession(res) {
		res.cookie("app-token", "", {expires: new Date(0)});
	}

	generateToken(user: any): string {
		const {
			preferred_username,
			name,
			email,
			family_name,
			given_name,
		} = user;

		const jwtContent = {
			name,
			email,
			family_name,
			given_name,
			preferred_username,
		};

		return jwt.sign(jwtContent, this.secret, {
			expiresIn: this.expiresIn,
			audience: this.audience,
			issuer: this.issuer,
		});
	}

	// verifyToken(token: string): boolean {
	// 	try {
	// 		jwt.verify(token, this.secret, {
	// 			audience: this.audience,
	// 			issuer: this.issuer,
	// 		});
	// 		return true;
	// 	}
	// 	catch (err) {
	// 		return false;
	// 	}
	// }
}

export default SessionHelper;
