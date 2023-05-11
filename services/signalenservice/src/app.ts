import cors from "cors";
import express from "express";
import apiV1Router from "./api-v1";
import {errorHandler} from "./errorHandlers";
import healthRouter from "./health";
import log from "loglevel";

const app = express();
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL && process.env.NODE_ENV !== "test") {
	throw new Error("Unknown database. Please provide the database connection string in DATABASE_URL in the environment.");
}

const logger = () => (req, res, next) => {
	log.debug("[EVENT]", `Incoming request: ${req.method} ${req.url}`);
	if (req.body) {
		log.debug("[EVENT]", "Body:", req.body);
	}
	next();
};

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
	app.use(logger());
}

app.get("/health", healthRouter);
app.use("/v1/signals", apiV1Router);
app.use(errorHandler);

export default app;