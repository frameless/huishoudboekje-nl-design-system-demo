import cors from "cors";
import express from "express";
import apiV1Router from "./src/api-v1";
import {errorHandler} from "./src/errorHandlers";
import healthRouter from "./src/health";

const app = express();
const port = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error("Unknown database. Please provide the database connection string in DATABASE_URL in the environment.");
}

const requestLogger = () => (req, res, next) => {
	console.log("[EVENT]", `Incoming request: ${req.method} ${req.url}`);
	if (req.body) {
		console.log("[EVENT]", "Body:", req.body);
	}

	res.on("finish", () => {
		console.log("[EVENT]", `Outgoing response: ${res.statusCode} ${res.statusMessage}`);
	});

	next();
};


app.use(cors());
// @ts-ignore Typescript is complaining, but it actually works just fine.
app.use(express.json());
app.use(requestLogger());

app.get("/health", healthRouter);
app.use("/v1/alarms", apiV1Router);
app.use(errorHandler);


app.listen(port, () => {
	console.log(`Alarm service server running on port ${port}.`);
});