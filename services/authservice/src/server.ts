import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {auth} from "express-openid-connect";
import SessionHelper from "./SessionHelper";

const sessionHelper = new SessionHelper();

const config = Object.freeze({
	secret: process.env.SECRET,
	port: process.env.APP_PORT ?? 8080,
	debug: process.env.NODE_ENV !== "production",
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
		authorizationParams: {
			response_type: "code",
		},
		idpLogout: true,
		authRequired: false,
		routes: {
			callback: prefix + "/callback",
			login: prefix + "/login",
			logout: false,
			postLogoutRedirect: prefix + "/logout",
		},
		afterCallback: (req, res, session) => {
			sessionHelper.createSession(res, session);
			return {
				...session,
			};
		},
	}));

	const authRouter = express.Router();

	if (!config.debug) {
		authRouter.get("/", (req, res) => {
			if (sessionHelper.isAuthenticated(req)) {
				return res.send(`
					<h1>Hello ${req.oidc.user?.name}</h1>
					<a href="/logout">Logout</a>
					<a href="${prefix}/me">Check auth</a>
				`);
			}

			return res.send(`
				<h1>Hello!</h1>
				<a href="/login">Login</a>
				<a href="${prefix}/me">Check auth</a>
			`);
		});
	}

	authRouter.get("/me", async (req, res) => {
		if (req.oidc.isAuthenticated()) {
			sessionHelper.createSession(res, req.oidc.user);
			return res.json({
				ok: true,
				user: req.oidc.user,
			});
		}

		sessionHelper.destroySession(res);
		return res.status(401).json({ok: false, message: "Unauthorized"});
	});

	authRouter.get("/logout", (req, res) => {
		return res.oidc.logout({returnTo: prefix + "/logout_callback"});
	});

	authRouter.get("/logout_callback", (req, res) => {
		sessionHelper.destroySession(res);
		return res.redirect("/");
	});

	app.use(prefix, authRouter);

	return {
		start: () => app.listen(config.port, () => {
			console.log(`Server is running.`);
		}),
	};
};

export default server();