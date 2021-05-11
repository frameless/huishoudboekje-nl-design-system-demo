import express from "express";

const healthRouter = express.Router();

healthRouter.get("/health", (req, res) => res.send("alive"));

export default healthRouter;