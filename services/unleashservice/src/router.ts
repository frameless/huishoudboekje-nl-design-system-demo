import express from "express";
import pkg from "../package.json";
import healthRouter from "./health";
import unleashClient from "./unleash";

const isFeatureEnabled = (feature: string, context?: Record<string, any>): boolean => {
	const _context = {
		userId: process.env.UNLEASH_OTAP,
		...context,
	};
	const isEnabled = unleashClient.isEnabled(feature, _context);
	console.log("Feature flag request:");
	console.table([
		{feature, context: _context, result: isEnabled},
	]);

	return isEnabled;
};

const apiRouter = express.Router();

apiRouter.get("/health", healthRouter);

apiRouter.get("/version", (req, res) => res.send(pkg.version));

apiRouter.post("/:features", (req, res) => {
	const features = (req.params.features || "").split(",");

	const result = features.reduce((result, f) => ({
		...result,
		[f]: isFeatureEnabled(f),
	}), {});

	res.json(result);
});

export default apiRouter;