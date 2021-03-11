const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
	const proxyApiUrl = process.env.PROXY || "https://test.huishoudboekje.demoground.nl";
	app.use(
		"/api",
		createProxyMiddleware({
			target: proxyApiUrl,
			changeOrigin: true,
			xfwd: true,
		}),
	);
};