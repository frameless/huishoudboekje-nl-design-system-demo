import {Prisma} from "@prisma/client";
import supertest from "supertest";
import {prismaMock} from "../.jest/mockClient";
import getOneAddress from "../prisma/operations/getOneAddress";
import app from "../src/app";
import addresses from "./fixtures/addresses";
import ResolvedValue = jest.ResolvedValue;

const api = supertest(app);

describe("Address CRUD (operations)", () => {

	describe("Given the address exists", () => {
		it("should return the address", async () => {
			prismaMock.address.findUnique.mockResolvedValue(addresses[0]);

			const result = await api.get("/v1/addresses/" + addresses[0].id);
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return all addresses", async () => {
			prismaMock.address.findMany.mockResolvedValue(addresses as ResolvedValue<unknown>);

			const result = await api.get("/v1/addresses/");
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return addresses filtered by id (through request query params)", async () => {
			const filterIds = addresses.map(a => a.id).slice(0, 2);
			prismaMock.address.findMany.mockResolvedValue(addresses.filter(a => filterIds.includes(a.id)) as ResolvedValue<unknown>);

			const result = await api.get("/v1/addresses/?filter_ids=" + filterIds.join(","));
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return addresses filtered by id (through request body)", async () => {
			const filterIds = addresses.map(a => a.id).slice(0, 2);
			prismaMock.address.findMany.mockResolvedValue(addresses.filter(a => filterIds.includes(a.id)) as ResolvedValue<unknown>);

			const result = await api.get("/v1/addresses/").send({
				filter_ids: filterIds,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the street", async () => {
			const newStreet = "Barstreet";
			prismaMock.address.update.mockResolvedValue({
				...addresses[0],
				street: newStreet,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				street: newStreet,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the house number", async () => {
			const newHouseNumber = "123AB";
			prismaMock.address.update.mockResolvedValue({
				...addresses[0],
				houseNumber: newHouseNumber,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				houseNumber: newHouseNumber,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the postalcode", async () => {
			const newPostalCode = "1111AA";
			prismaMock.address.update.mockResolvedValue({
				...addresses[0],
				postalCode: newPostalCode,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				postalCode: newPostalCode,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the locality", async () => {
			const newLocality = "Diemen";
			prismaMock.address.update.mockResolvedValue({
				...(addresses[0]),
				locality: newLocality,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				locality: newLocality,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the Address", async () => {
			const newAddress = {
				street: "Bazstreet",
				houseNumber: "99",
				postalCode: "4444RR",
				locality: "Utrecht",
			};
			const timeCreated = addresses[0].timeCreated;

			prismaMock.address.update.mockResolvedValue({
				...newAddress,
				id: addresses[0].id,
				timeCreated,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				...newAddress,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should delete the Address", async () => {
			prismaMock.address.delete.mockResolvedValue(undefined!);

			const result = await api.delete("/v1/addresses/" + addresses[0].id);
			expect(result.statusCode).toBe(204);
		});
	});

	describe("Given the address does not exist", () => {
		it("should return 404 Not Found when tyring to getOneAddress", async () => {
			prismaMock.address.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", {code: "P2025", clientVersion: "0.0.0"}));

			const result = await api.get("/v1/addresses/" + addresses[0].id);
			expect(result.statusCode).toEqual(404);
		});

		it("should create the address", async () => {
			prismaMock.address.create.mockResolvedValue(addresses[0]);

			const result = await api.post("/v1/addresses").send(addresses[0]);
			expect(result.statusCode).toBe(201);
			expect(result.body).toMatchSnapshot();
		});

		it("should return 404 Not Found when trying to updateAddress", async () => {
			const newStreet = "Barstreet";
			prismaMock.address.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", {code: "P2025", clientVersion: "0.0.0"}));

			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				id: addresses[0].id,
				street: newStreet,
			});
			expect(result.statusCode).toEqual(404);
		});

		it("should delete the Address", async () => {
			prismaMock.address.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", {code: "P2025", clientVersion: "0.0.0"}));
			const result = await api.delete("/v1/addresses/" + addresses[0].id);
			expect(result.statusCode).toEqual(204);
		});
	});

	describe("Given an unknown error occurs on the server", () => {
		const error = new Error("Server did a boo boo");

		it("should return a 500 when tyring to getOneAddress", async () => {
			prismaMock.address.findUnique.mockRejectedValue(error);
			const getAddressResult = getOneAddress(addresses[0].id);
			await expect(getAddressResult).rejects.toEqual(error);

			const result = await api.get("/v1/addresses/" + addresses[0].id);
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when tyring to getManyAddresses", async () => {
			prismaMock.address.findMany.mockRejectedValue(error);
			const ids = addresses.map(a => a.id);

			const result = await api.get("/v1/addresses/?filter_ids=" + ids.join(","));
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when trying to create the address", async () => {
			prismaMock.address.create.mockRejectedValue(error);

			const result = await api.post("/v1/addresses").send(addresses[0]);
			expect(result.statusCode).toBe(500);
			expect(result.body).toMatchSnapshot();
		});

		it("should return a 500 when trying to updateAddress", async () => {
			prismaMock.address.update.mockRejectedValue(error);

			const newStreet = "Barstreet";
			const result = await api.put("/v1/addresses/" + addresses[0].id).send({
				id: addresses[0].id,
				street: newStreet,
			});
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when trying to deleteAddress", async () => {
			prismaMock.address.delete.mockRejectedValue(error);
			const result = await api.delete("/v1/addresses/" + addresses[0].id);
			expect(result.statusCode).toEqual(500);
		});
	});

	describe("Given the server is healthy", () => {
		it("should return 200 OK", async () => {
			const result = await api.get("/health");
			expect(result.statusCode).toEqual(200);
		});
	});

});
