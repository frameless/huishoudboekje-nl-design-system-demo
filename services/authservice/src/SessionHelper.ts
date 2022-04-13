import jwt from "jsonwebtoken";

class SessionHelper {
	private readonly secret: string;

	constructor() {
		this.secret = process.env.SECRET || "test";
	}

	isAuthenticated(req: any): boolean {
		const token = req.cookies["app-token"];
		const verifiedToken = this.verifyToken(token);
		console.log({verifiedToken});
		return verifiedToken;
	}

	createSession(res, user) {
		const token = this.generateToken(user);
		res.cookie("app-token", token);
	}

	destroySession(res) {
		res.cookie("app-token", "", {expires: new Date(0)});
	}

	generateToken(user: any): string {
		return jwt.sign({user}, this.secret, {expiresIn: "30d"});
	}

	verifyToken(token: string): boolean {
		try {
			const verifiedToken = jwt.verify(token, this.secret);
			console.log({verifiedToken});
			return true;
		}
		catch (err) {
			return false;
		}
	}
}

export default SessionHelper;