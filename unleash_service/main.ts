import cors from "cors";
import express, {json} from "express";
import healthRouter from "./src/health";
import apiRouter from "./src/router";
import unleashClient from "./src/unleash";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(json());

unleashClient.on("synchronized", () => {

	console.info("Unleash connected.");

	app.get("/health", healthRouter);
	app.use("/api/unleash", apiRouter);

	app.listen(port, () => {
		console.log("Unleash server running.");
	});

});