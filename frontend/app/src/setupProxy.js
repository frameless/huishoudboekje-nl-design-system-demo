const {createProxyMiddleware} = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const getGitUser = async () => {
	let [name, email] = [process.env.AUTH_NAME, process.env.AUTH_EMAIL];

	if (!name) {
		name = await exec("git config user.name").then(t => t.stdout.split("\n")[0]);
	}
	if (!email) {
		email = await exec("git config user.email").then(t => t.stdout.split("\n")[0]);
	}

	return {name, email};
};

module.exports = (app) => {
	const apiTarget = process.env.PROXY || "https://test.huishoudboekje.demoground.nl";
	const apiv2Target = process.env.PROXYTWO || "https://test.huishoudboekje.demoground.nl";

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

	app.use("/apiV2", createProxyMiddleware({
		target: apiv2Target,
		changeOrigin: true,
		xfwd: true,
		headers: {
			...process.env.AUTH_TOKEN && {
				Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
			},
		},
	}));

	// Mimic the authservice replying with a valid user.
	app.use("/auth/me", async (req, res) => {
		let user = undefined;

		// If we're talking to a backend that is running on localhost, use the local user.
		if (process.env.PROXY.includes("localhost")) {
			user = await getGitUser();
		}
		// If we're talking to a remote backend, use the user from the token.
		else if (process.env.AUTH_TOKEN) {
			// No need to verify the token, if there's a user in there, we're fine.
			const {name, email} = jwt.decode(process.env.AUTH_TOKEN);
			user = {name, email};
		}
		else {
			user = {
				name: "Developer",
				email: "developer@sloothuizen.nl",
			};
		}

		return res.status(200).json({
			ok: true,
			user,
		});
	});

	app.use("/auth", (req, res) => {
		return res.redirect("/");
	});
};
