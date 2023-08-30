import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {auth} from "express-openid-connect";
import {getConfig} from "./config";
import SessionHelper from "./SessionHelper";
import log from "loglevel";

const config = getConfig();

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
		baseURL: process.env.OIDC_BASE_URL,
		clientID: process.env.OIDC_CLIENT_ID,
		clientSecret: process.env.OIDC_CLIENT_SECRET,
		issuerBaseURL: process.env.OIDC_ISSUER_URL,
		authorizationParams: {
			response_type: "code",
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

	authRouter.get("/", (req, res) => {
		res.send(`
			<a href="${prefix}/me">Me</a><br>
			<a href="${prefix}/login">Login</a><br>
			<a href="${prefix}/logout">Logout</a><br>
		`);
	});

	authRouter.get("/me", async (req, res) => {
		try {
			// Check with the OIDC provider if the user is authenticated.
			if (req.oidc.isAuthenticated()) {
				const tokenContent = req.oidc.user;
				log.debug("OIDC provider found an authenticated user:", tokenContent);

				// Check if the token is expired, if so, try to refresh. 
				const isExpired = req.oidc.accessToken?.isExpired();
				if (isExpired) {
					await req.oidc.accessToken?.refresh();
				}

				const user = await req.oidc.fetchUserInfo();
				log.info("User found:", user.given_name);
				log.debug("User found:", user);

				sessionHelper.createSession(res, user);
				return res.json({
					ok: true,
					user,
				});
			}
			log.info("user not authenticated")
		}
		catch (err) {
			log.error("OIDC provider didn't recognize user.");
			log.error(err)
		}

		// If no user was found, deny access.
		log.info("No user found.");
		sessionHelper.destroySession(res);
		return res.status(401).json({ok: false, message: "Unauthorized"});
	});

	// Use the auth router on /auth
	app.use(prefix, authRouter);

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
