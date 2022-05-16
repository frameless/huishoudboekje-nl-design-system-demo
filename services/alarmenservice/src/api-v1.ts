import express from "express";
import pkg from "../package.json";
import createAlarm from "../prisma/operations/createAlarm";
import deleteAlarm from "../prisma/operations/deleteAlarm";
import getManyAlarms from "../prisma/operations/getManyAlarms";
import getOneAlarm from "../prisma/operations/getOneAlarm";
import updateAlarm from "../prisma/operations/updateAlarm";
import healthRouter from "./health";

const app = express.Router();

app.get("/health", healthRouter);
app.get("/version", (req, res) => res.send(pkg.version));

// Get all alarms
app.get("/", async (req, res, next) => {
	try {
		const qFilterIds: string = req.query.filter_ids as string;

		let ids: string[] = [];
		if (qFilterIds) {
			ids = qFilterIds.trim().split(",").filter(s => s);
		}

		// Split by , and filter out empty strings.
		const data = await getManyAlarms(ids);
		return res.json(data);
	}
	catch (err) {
		next(err);
	}
});

// Get one alarm by id
app.get("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;

		const data = await getOneAlarm(id);
		return res.json(data);
	}
	catch (err) {
		next(err);
	}
});

// Create a new alarm
app.post("/", async (req, res, next) => {
	try {
		const data = req.body;
		const alarm = await createAlarm(data);

		return res.status(201).json({
			ok: true,
			alarm,
		});
	}
	catch (err) {
		next(err);
	}
});

// Update an alarm by id
app.put("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;
		const data = req.body;

		const alarm = await updateAlarm({
			id,
			...data,
		});
		return res.json(alarm);
	}
	catch (err) {
		next(err);
	}
});

// Delete an alarm by id
app.delete("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;

		await deleteAlarm(id);
		return res.status(204).end();
	}
	catch (err) {
		next(err);
	}
});

export default app;