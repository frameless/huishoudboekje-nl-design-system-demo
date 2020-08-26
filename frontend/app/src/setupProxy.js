const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			target: process.env.PROXY || "https://api.staging.huishoudboekje010.nl",
			headers: { "X-Forwarded-Port": process.env.PORT || "3000" },
			changeOrigin: true,
		}),
	);
};
