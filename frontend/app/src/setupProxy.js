const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	const proxyApiUrl = process.env.PROXY || "https://hhb-acc.nlx.reviews";
	app.use(
		"/api",
		createProxyMiddleware({
			target: proxyApiUrl,
			changeOrigin: true,
			xfwd: true,
		}),
	);
};
