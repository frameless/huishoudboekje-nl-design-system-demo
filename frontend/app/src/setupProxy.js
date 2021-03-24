const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function(app) {
	const target = process.env.PROXY || "https://test.huishoudboekje.demoground.nl";
	app.use(
		"/api",
		createProxyMiddleware({
			target,
			changeOrigin: true,
			xfwd: true,
			headers: {
				...process.env.PROXY_AUTHORIZATION && {
					Authorization: `Bearer ${process.env.PROXY_AUTHORIZATION}`,
				},
			},
		}),
	);
};