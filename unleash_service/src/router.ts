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

apiRouter.post("/:features", (req, res) => {
	const features = (req.params.features || "").split(",");
	const context = req.body || {};

	const result = features.reduce((result, f) => ({
		...result,
		[f]: isFeatureEnabled(f, context),
	}), {});

	res.json(result);
});

export default apiRouter;