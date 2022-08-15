import express from "express";
import createSignal from "../prisma/operations/createSignal";
import deleteSignal from "../prisma/operations/deleteSignal";
import getManySignals from "../prisma/operations/getManySignals";
import getOneSignal from "../prisma/operations/getOneSignal";
import updateSignal from "../prisma/operations/updateSignal";
import healthRouter from "./health";

const app = express.Router();

app.get("/health", healthRouter);

// Get all signals
app.get("/", async (req, res, next) => {
	try {
		const qFilterIds: string = req.query.filter_ids as string;

		let ids: string[] = [];
		if (qFilterIds) {
			ids = qFilterIds.trim().split(",").filter(s => s);
		}

		// Split by , and filter out empty strings.
		const signals = await getManySignals(ids);
		return res.json({
			ok: true,
			data: signals,
		});
	}
	catch (err) {
		next(err);
	}
});

// Get one signal by id
app.get("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;

		const signal = await getOneSignal(id);
		return res.json({
			ok: true,
			data: signal,
		});
	}
	catch (err) {
		next(err);
	}
});

// Create a new signal
app.post("/", async (req, res, next) => {
	try {
		const data = req.body;
		const signal = await createSignal(data);

		return res.status(201).json({
			ok: true,
			data: signal,
		});
	}
	catch (err) {
		next(err);
	}
});

// Update an signal by id
app.put("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;
		const data = req.body;

		const signal = await updateSignal({
			id,
			...data,
		});
		return res.json({
			ok: true,
			data: signal,
		});
	}
	catch (err) {
		next(err);
	}
});

// Delete an signal by id
app.delete("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;

		await deleteSignal(id);
		return res.status(204).end();
	}
	catch (err) {
		next(err);
	}
});

export default app;