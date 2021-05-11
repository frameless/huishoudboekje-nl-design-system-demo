import cors from "cors";
import {config} from "dotenv";
import express, {json} from "express";
import pkg from "./package.json";
import unleashClient from "./src/unleash";

config();

const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(json());

unleashClient.on("synchronized", () => {

	console.info("Unleash connected.");

	app.get("/health", (req, res) => res.send("alive"));
	app.get("/version", (req, res) => res.send(pkg.version));

	app.post("/:feature", (req, res) => {
		const {feature} = req.params;
		const context = req.body || {};

		const featureEnabled = unleashClient.isEnabled(feature, context);

		console.log("Feature flag request:", feature, featureEnabled, context);

		res.status(418).json({
			[feature]: featureEnabled,
		});
	});

	app.listen(port, () => {
		console.log(`Unleash server running on port ${port}.`);
	});

});
