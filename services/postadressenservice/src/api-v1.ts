import express from "express";
import createAddress from "../prisma/operations/createAddress";
import deleteAddress from "../prisma/operations/deleteAddress";
import getManyAddresses from "../prisma/operations/getManyAddresses";
import getOneAddress from "../prisma/operations/getOneAddress";
import updateAddress from "../prisma/operations/updateAddress";
import healthRouter from "./health";

const app = express.Router();

app.get("/health", healthRouter);

// Get all addresses
app.get("/", async (req, res, next) => {
	try {
		const qFilterIds: string = req.query.filter_ids as string;

		let ids: string[] = [];
		if (qFilterIds) {
			ids = qFilterIds.trim().split(",").filter(s => s);
		}

		// Split by , and filter out empty strings.
		const addresses = await getManyAddresses(ids);
		return res.json({
			ok: true,
			data: addresses,
		});
	}
	catch (err) {
		next(err);
	}
});

// Get an address by id
app.get("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;

		const address = await getOneAddress(id);
		return res.json({
			ok: true,
			data: address,
		});
	}
	catch (err) {
		next(err);
	}
});

// Create a new address
app.post("/", async (req, res, next) => {
	try {
		const data = req.body;
		const address = await createAddress(data);

		return res.status(201).json({
			ok: true,
			data: address,
		});
	}
	catch (err) {
		next(err);
	}
});

// Update an address by id
app.put("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;
		const data = req.body;

		const address = await updateAddress({
			id,
			...data,
		});
		return res.json({
			ok: true,
			data: address,
		});
	}
	catch (err) {
		next(err);
	}
});

// Delete an address by id
app.delete("/:id", async (req, res, next) => {
	try {
		const {id} = req.params;

		await deleteAddress(id);
		return res.status(204).end();
	}
	catch (err) {
		next(err);
	}
});

export default app;