import cors from "cors";
import express from "express";
import healthRouter from "./src/health";
import apiRouter from "./src/router";
import unleashClient from "./src/unleash";

const app = express();
const port = process.env.PORT || 80;

app.use(cors());

unleashClient.on("synchronized", () => {

	console.info("Unleash synced.");

	app.get("/health", healthRouter);
	app.use("/api/unleash", apiRouter);

	app.listen(port, () => {
		console.log(`Unleash server running on port ${port}.`);
	});

});