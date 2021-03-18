const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
	const target = process.env.PROXY || "https://test.huishoudboekje.demoground.nl";
	const headers = {};
	if (process.env.PROXY_AUTHORIZATION) {
		headers["Authorization"] = `Bearer ${process.env.PROXY_AUTHORIZATION}`;
	}
	app.use(
		"/api",
		createProxyMiddleware({
			target,
			changeOrigin: true,
			xfwd: true,
			headers,
		}),
	);
};