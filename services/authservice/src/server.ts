import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import {auth} from "express-openid-connect";
import {getConfig} from "./config";
import SessionHelper from "./SessionHelper";
import log from "loglevel";
import {JsonWebTokenError} from "jsonwebtoken";

const session = require('express-session')
const config = getConfig();

const sessionHelper = new SessionHelper({
	secret: config.secret,
	issuer: config.issuer,
	audience: config.audience
});

const server = (prefix: string = "/auth") => {
	const app = express();

	app.use(cors());
	app.use(bodyParser.json());
	app.use(cookieParser());

	app.get("/", (req, res) => {
		res.send(`<a href="${prefix}">Go to auth</a>`);
	});

	app.use(
		session({
			secret: process.env.OIDC_CLIENT_SECRET,
			resave: false,
			saveUninitialized: true,
		})
	)

	app.use(auth({
		baseURL: process.env.OIDC_BASE_URL,
		clientID: process.env.OIDC_CLIENT_ID,
		clientSecret: process.env.OIDC_CLIENT_SECRET,
		issuerBaseURL: process.env.OIDC_ISSUER_URL,
		authorizationParams: {
			response_type: "code",
			scope: "openid profile email offline_access"
		},
		secret: config.secret,
		idpLogout: true,
		authRequired: false,
		routes: {
			login: prefix + "/login",
			logout: prefix + "/logout",
			postLogoutRedirect: prefix + "/callback",
			callback: prefix + "/callback",
		},
		enableTelemetry: false,
	}));

	const authRouter = express.Router();

	// Use the auth router on /auth
	app.use(prefix, authRouter);

	// express-openid-connect automatically refreshes tokens when needed
	// so there is no need to do it here
	authRouter.get("/me", async (req, res) => {
		try {
			// Check with the OIDC provider if the user is authenticated.
			if (req.oidc.isAuthenticated()) {
				const tokenContent = req.oidc.user;
				const stringJWT = req.oidc.accessToken?.access_token
				log.info(new Date().toISOString(), "token ", stringJWT)
				log.info("OIDC provider found an authenticated user:", tokenContent);

				// verify the token here before creating a new session because otherwise an app-token will be created that's not valid
				return sessionHelper.verifyToken(stringJWT).then(async (result) => {
					log.info(result)
					if (result) {
						const user = await req.oidc.fetchUserInfo();
						log.info("User found");

						sessionHelper.createSession(res, stringJWT);
						return res.json({
							ok: true,
							user,
						});
					}
					else {
						log.info("No user found.");
						sessionHelper.destroySession(req, res);
						return res.status(401).json({ok: false, message: "Unauthorized"});
					}
				}).catch((error) => {
					if (error == typeof (JsonWebTokenError)) {
						log.error("token invalid: ", error)
						return res.status(401).json({ok: false, message: "Unauthorized"});
					}
					log.error('failed to authenticate user', error)
					return res.status(500).json({ok: false, message: "Something went wrong"});
				})
			}
			log.info("user not authenticated")
			return res.status(401).json({ok: false, message: "Unauthorized"});
		}
		catch (err) {
			log.error(err)
		}

		// If no user was found, deny access.
		log.info("No user found.");
		sessionHelper.destroySession(req, res);
		return res.status(401).json({ok: false, message: "Unauthorized"});
	});

	authRouter.get('/logout', (req, res) => {
		res.clearCookie('app-token', {httpOnly: true, secure: true, sameSite: "lax"})

		req.session.destroy((err) => {
			if (err) {
				log.error(err)
				return res.status(500).send('Failed to logout user')
			}
			res.redirect('/login')
		});
	})

	authRouter.get("/", (req, res) => {
		res.send(`
			<a href="${prefix}/me">Me</a><br>
			<a href="${prefix}/login">Login</a><br>
			<a href="${prefix}/logout">Logout</a><br>
		`);
	});

	// Endpoint for testing the health of this service
	app.get("/health", (req, res) => {
		res.status(200).send("alive");
	});

	return {
		start: () => app.listen(config.port, () => {
			log.info(`Server is running on port ${config.port}.`);
		}),
	};
};

export default server();
