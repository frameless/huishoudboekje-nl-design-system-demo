const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function(app) {
	const authTarget = process.env.PROXY_AUTH || "https://keycloak.huishoudboekje.demoground.nl";
	app.use("/auth", createProxyMiddleware({
		target: authTarget,
		changeOrigin: true,
		xfwd: true,
	}));

	const apiTarget = process.env.PROXY || "https://test.huishoudboekje.demoground.nl";
	app.use("/api", createProxyMiddleware({
		target: apiTarget,
		changeOrigin: true,
		xfwd: true,
	}));
};