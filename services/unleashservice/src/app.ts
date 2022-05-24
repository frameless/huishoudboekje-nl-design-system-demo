import cors from "cors";
import express from "express";
import apiRouter from "./api-v1";
import healthRouter from "./health";
import unleashClient from "./unleash";

const createApp = () => {
	const app = express();
	app.use(cors());

	const features = unleashClient.getFeatureToggleDefinitions();
	console.info("Available features:");
	console.table((features || []).map(f => ({...f, strategies: JSON.stringify(f.strategies)})));

	app.get("/health", healthRouter);
	app.use("/api/unleash", apiRouter);

	return app;
};

export default createApp;
