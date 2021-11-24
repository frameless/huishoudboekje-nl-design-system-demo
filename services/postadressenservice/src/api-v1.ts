import {PrismaClient} from "@prisma/client";
import express from "express";
import pkg from "../package.json";
import {NotFoundError} from "./errorHandlers";
import healthRouter from "./health";

const db = new PrismaClient();

const app = express.Router();

app.get("/health", healthRouter);

app.get("/version", (req, res) => res.send(pkg.version));

app.get("/", async (req, res) => {
	const data = await db.address.findMany({});
	res.json(data);
});

app.post("/", (req, res, next) => {
	const data = req.body;
	console.log({data});

	// Create the address
	db.address.create({
		data,
	}).then(result => {
		return res.status(201).json({
			ok: true,
			address: result,
		});
	}).catch(err => {
		next(err);
	});
});

app.get("/:id", async (req, res, next) => {
	const {id} = req.params;
	const data = await db.address.findFirst({
		where: {id},
	});

	if (!data) {
		return next(new NotFoundError());
	}

	return res.json(data);
});

app.put("/:id", (req, res, next) => {
	const {id} = req.params;
	const data = req.body;

	// Find the address
	db.address.findFirst({
		where: {id},
	}).then(result => {
		if (!result) {
			throw new NotFoundError();
		}

		// Update entity
		return db.address.update({
			where: { id },
			data
		});
	}).then(result => {
		return res.status(200).json(result);
	}).catch(err => {
		next(err);
	});
});

app.delete("/:id", (req, res, next) => {
	const {id} = req.params;

	console.log({id});

	// Find the address
	db.address.findFirst({
		where: {id},
	}).then(result => {
		console.log({result});

		if (!result) {
			throw new NotFoundError();
		}

		// Delete entity
		return db.address.delete({
			where: { id },
		});
	}).then(result => {
		console.log({result});
		return res.status(204).end();
	}).catch(err => {
		throw err;
	});
});


export default app;