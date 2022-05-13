import express from "express";

const healthRouter = express.Router();

healthRouter.get("/health", (req, res) => {
	res.set({
		"Content-Type": "text/plain",
	}).status(200).send("alive");
});

export default healthRouter;