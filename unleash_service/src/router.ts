import express from "express";
import pkg from "../package.json";
import healthRouter from "./health";
import unleashClient from "./unleash";

const isFeatureEnabled = (feature: string, context?: Record<string, any>): boolean => {
	const isEnabled = unleashClient.isEnabled(feature, context);
	console.info("Feature flag requested:", {feature, context, isEnabled});

	return isEnabled;
};

const apiRouter = express.Router();

apiRouter.get("/health", healthRouter);

apiRouter.get("/version", (req, res) => res.send(pkg.version));

apiRouter.post("/:feature", (req, res) => {
	const {feature} = req.params;
	const context = req.body || {};

	res.json({
		[feature]: isFeatureEnabled(feature, context),
	});
});

export default apiRouter;