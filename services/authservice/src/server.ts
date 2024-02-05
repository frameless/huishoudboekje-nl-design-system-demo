import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import {auth} from "express-openid-connect";
import {getConfig} from "./config";
import SessionHelper from "./SessionHelper";
import log from "loglevel";
import {JsonWebTokenError} from "jsonwebtoken";
import {createClient} from "redis"

const RedisStore = require("connect-redis").default
const session = require('express-session')
const express = require('express');
const config = getConfig();

const sessionHelper = new SessionHelper({
	secret: config.secret,
	issuer: config.issuer,
	audience: config.audience,
	allowedAlgs: config.allowedAlgs,
	scopes: config.scopes
});

let redisClient = createClient({url: process.env.REDIS_URL})
redisClient.connect()

let redisStore = new RedisStore({
	client: redisClient,
})

const server = (prefix: string = "/auth") => {
	const app = express();

	app.use(cors());
	app.use(bodyParser.json());
	app.use(cookieParser());

	app.get("/", (req, res) => {
		res.send(`<a href="${prefix}">Go to auth</a>`);
	});

	app.use(auth({
		session: {
			store: redisStore
		},
		baseURL: process.env.OIDC_BASE_URL,
		clientID: process.env.OIDC_CLIENT_ID,
		clientSecret: process.env.OIDC_CLIENT_SECRET,
		issuerBaseURL: process.env.OIDC_ISSUER_URL,
		authorizationParams: {
			response_type: "code",
			scope: sessionHelper.scopes
		},
		secret: config.secret,
		idpLogout: true,
		authRequired: false,
		routes: {
			login: prefix + "/login",
			logout: false,
			postLogoutRedirect: prefix + "/callback",
			callback: prefix + "/callback",
		},
		enableTelemetry: false,
	}));

	const authRouter = express.Router();

	// Use the auth router on /auth
	app.use(prefix, authRouter);

	authRouter.get("/me", async (req, res) => {
		try {
			// Check with the OIDC provider if the user is authenticated.
			if (req.oidc.isAuthenticated()) {
				let accessToken = req.oidc.accessToken
				log.debug(new Date().toISOString(), "OIDC provider found an authenticated user");
				// verify the token here before creating a new session because otherwise an app-token will be created that's not valid
				if (accessToken == null || accessToken == undefined) {
					return res.status(401).json({ok: false, message: "Unauthorized: AccessToken not found."});
				}
				// refresh_token should be automatically stored by express-openid-connect in the session
				// This also means that this app can only run ONE INSTANCE EVER. if there are more then 1 instance, the session should be properly shared
				// or information regarding refresh_rokens should be shared between sessions/instances. 
				if (accessToken.isExpired()) {
					accessToken = await accessToken.refresh()
				}
				const tokenStr = accessToken.access_token
				return sessionHelper.verifyToken(tokenStr).then(async (result) => {
					if (result) {
						const user = sessionHelper.getUserInfoFromToken(tokenStr)
						log.debug(new Date().toISOString(), "User found");

						sessionHelper.createSession(res, tokenStr);
						return res.json({
							ok: true,
							user,
						});
					}
					else {
						log.warn(new Date().toISOString(), "No user found.");
						sessionHelper.destroySession(req, res);
						return res.status(401).json({ok: false, message: "Unauthorized"});
					}
				}).catch((error) => {
					if (error == typeof (JsonWebTokenError)) {
						log.error(new Date().toISOString(), "token invalid: ", error)
						return res.status(401).json({ok: false, message: "Unauthorized"});
					}
					log.error(new Date().toISOString(), 'failed to authenticate user', error)
					return res.status(500).json({ok: false, message: "Something went wrong"});
				})
			}
			log.info(new Date().toISOString(), "user not authenticated")
			return res.status(401).json({ok: false, message: "Unauthorized"});
		}
		catch (err) {
			log.error(err)
			sessionHelper.destroySession(req, res);
		}

		// If no user was found, deny access.
		log.warn(new Date().toISOString(), "No user found.");
		return res.status(401).json({ok: false, message: "Unauthorized"});
	});

	authRouter.get('/logout', (req, res) => {
		res.clearCookie("app-token")
		res.oidc.logout()
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
