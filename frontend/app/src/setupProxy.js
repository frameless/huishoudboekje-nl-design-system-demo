const {createProxyMiddleware} = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
	const apiTarget = process.env.PROXY || "https://test.huishoudboekje.demoground.nl";

	app.use("/api/unleash", (req, res) => {
		res.json({
			features: [
				{name: "signalen", enabled: true},
			],
		});
	});

	app.use("/api", createProxyMiddleware({
		target: apiTarget,
		changeOrigin: true,
		xfwd: true,
		headers: {
			...process.env.AUTH_TOKEN && {
				Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
			},
		},
	}));

	// Mimic the authservice replying with a valid user.
	app.use("/auth/me", (req, res) => {
		if (!process.env.AUTH_TOKEN) {
			return res.status(401).json({
				ok: false,
				message: "Unauthorized",
			});
		}

		// No need to verify the token, if there's a user in there, we're fine.
		const {name, email} = jwt.decode(process.env.AUTH_TOKEN);

		res.status(200).json({
			ok: true,
			user: {name, email},
		});
	});

	app.use("/auth", (req, res) => {
		return res.redirect("/");
	});
};
