import express from "express";
import pkg from "../package.json";
import createAddress from "../prisma/operations/createAddress";
import deleteAddress from "../prisma/operations/deleteAddress";
import getOneAddress from "../prisma/operations/getOneAddress";
import getManyAddresses from "../prisma/operations/getManyAddresses";
import updateAddress from "../prisma/operations/updateAddress";
import {NotFoundError} from "./errorHandlers";
import healthRouter from "./health";

const app = express.Router();

app.get("/health", healthRouter);

app.get("/version", (req, res) => res.send(pkg.version));

// Get all addresses
app.get("/", async (req, res) => {
	const qFilterIds: string = req.query.filter_ids as string;

	let ids: string[] = [];
	if (qFilterIds) {
		ids = qFilterIds.trim().split(",").filter(s => s);
	}

	// Split by , and filter out empty strings.
	const addresses = await getManyAddresses(ids);
	res.json(addresses);
});

// Get an address by id
app.get("/:id", async (req, res, next) => {
	const {id} = req.params;

	const data = await getOneAddress(id);

	if (!data) {
		return next(new NotFoundError());
	}

	return res.json(data);
});

// Create a new address
app.post("/", async (req, res, next) => {
	const data = req.body;
	const address = await createAddress(data);

	return res.status(201).json({
		ok: true,
		address,
	});
});

// Update an address by id
app.put("/:id", async (req, res) => {
	const {id} = req.params;
	const data = req.body;

	const address = await updateAddress({
		id,
		...data,
	});

	return res.status(200).json(address);
});

// Delete an address by id
app.delete("/:id", async (req, res, next) => {
	const {id} = req.params;

	await deleteAddress(id);

	return res.status(204).end();
});


export default app;