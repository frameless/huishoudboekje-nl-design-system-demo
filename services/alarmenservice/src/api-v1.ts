import {PrismaClient} from "@prisma/client";
import express from "express";
import pkg from "../package.json";
import {NotFoundError} from "./errorHandlers";
import healthRouter from "./health";

const db = new PrismaClient();

const app = express.Router();

app.get("/health", healthRouter);
app.get("/version", (req, res) => res.send(pkg.version));

app.get("/", async (request, response) => {
	const filterIds: string = request.query.filter_ids as string || "";

	// Split by , and filter out empty strings.
	const ids = filterIds.trim().split(",").filter(s => s);

	const data = await db.alarm.findMany({
		where: {
			...ids.length > 0 ? {
				id: {
					in: ids,
				},
			} : {},
		},
	});

	return response.status(200).json({data});
});

app.post("/", (request, response, next) => {
	const data = request.body;

	db.alarm.create({
		data,
	}).then(result => {
		return response.status(201).json({
			ok: true,
			data: result,
		});
	}).catch(err => {
		next(err);
	});
});

app.get("/:id", async (request, response, next) => {
	const {id} = request.params;
	const data = await db.alarm.findFirst({
		where: {id},
	});

	if (!data) {
		return next(new NotFoundError());
	}

	return response.json(data);
});

app.put("/:id", (request, response, next) => {
	const {id} = request.params;

	const data = request.body;

	db.alarm.findFirst({
		where: {id},
	}).then(result => {
		if (!result) {
			throw new NotFoundError();
		}

		return db.alarm.update({
			where: {id},
			data,
		});
	}).then(result => {
		return response.status(200).json({
			ok: true,
			data: result,
		});
	}).catch(err => {
		next(err);
	});
});

app.delete("/:id", (request, response, next) => {
	const {id} = request.params;

	db.alarm.findFirst({
		where: {id},
	}).then(result => {
		if (!result) {
			throw new NotFoundError();
		}

		return db.alarm.delete({
			where: {id},
		});
	}).then(() => {
		return response.status(204).end();
	}).catch(err => {
		next(err);
	});
});


export default app;