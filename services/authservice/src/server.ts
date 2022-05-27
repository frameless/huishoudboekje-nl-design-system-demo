import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {auth} from "express-openid-connect";
import SessionHelper from "./SessionHelper";

const config = Object.freeze({
	secret: process.env.SECRET || "testtest",
	port: process.env.APP_PORT ?? 8080,
	debug: process.env.NODE_ENV !== "production",

	issuer: process.env.JWT_ISSUER || "huishoudboekje",
	audience: process.env.JWT_AUDIENCE || "huishoudboekje",
	expiresIn: process.env.JWT_EXPIRES_IN || "14d",
});

const sessionHelper = new SessionHelper({
	secret: config.secret,
	issuer: config.issuer,
	audience: config.audience,
	expiresIn: config.expiresIn,
});

const server = (prefix: string = "/auth") => {
	const app = express();

	app.use(cors());
	app.use(bodyParser.json());
	app.use(cookieParser());

	app.get("/", (req, res) => {
		res.send(`<a href="${prefix}">Go to auth</a>`);
	});

	app.use(auth({
		// OIDC parameters
		baseURL: process.env.OIDC_BASE_URL,
		clientID: process.env.OIDC_CLIENT_ID,
		clientSecret: process.env.OIDC_CLIENT_SECRET,
		issuerBaseURL: process.env.OIDC_ISSUER_URL,
		authorizationParams: {
			response_type: "code",
		},

		// Auth app settings
		secret: config.secret,
		idpLogout: true,
		authRequired: false,
		routes: {
			login: false,
			logout: false,
			postLogoutRedirect: prefix + "/logout",
			callback: prefix + "/callback",
		},
	}));

	const authRouter = express.Router();

	authRouter.get("/me", async (req, res) => {
		let user;

		// Check with the OIDC provider if the user is authenticated.
		if (req.oidc.isAuthenticated()) {
			console.log("OIDC provider says it's ok.");
			user = req.oidc.user;
		}
		else {
			console.log("OIDC provider didn't recognize user.");

			// If not, see if the client has provided a valid token.
			if (sessionHelper.isAuthenticated(req)) {
				// If so, use the user's data from the token.
				console.log("Token is valid.");

				user = sessionHelper.getUserFromRequest(req);
			}
		}

		// If a user was found, create a session and allow the user in.
		if (user) {
			console.log("User found:", user);
			sessionHelper.createSession(res, user);
			return res.json({
				ok: true,
				user,
			});
		}

		// If no user was found, deny access.
		console.log("No user found.", user);
		sessionHelper.destroySession(res);
		return res.status(401).json({ok: false, message: "Unauthorized"});
	});

	authRouter.get("/login", (req, res) => {
		return res.oidc.login({
			returnTo: prefix + "/login_callback",
		});
	});

	authRouter.get("/login_callback", (req, res) => {
		console.log("returnTo", req.cookies["return-to"]);
		return res.redirect(req.cookies["return-to"] || "/");
	});

	authRouter.get("/logout", (req, res) => {
		return res.oidc.logout({
			returnTo: prefix + "/logout_callback",
		});
	});

	authRouter.get("/logout_callback", (req, res) => {
		sessionHelper.destroySession(res);
		return res.redirect("/");
	});

	app.use(prefix, authRouter);

	return {
		start: () => app.listen(config.port, () => {
			console.log("Server is running.");
			console.table({
				issuer: process.env.JWT_ISSUER,
				audience: process.env.JWT_AUDIENCE,
				expiresIn: process.env.JWT_EXPIRES_IN,
			});
		}),
	};
};

export default server();