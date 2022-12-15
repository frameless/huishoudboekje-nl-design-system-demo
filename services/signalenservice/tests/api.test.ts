import {Prisma, Signal} from "@prisma/client";
import supertest from "supertest";
import {prismaMock} from "../.jest/mockClient";
import getOneSignal from "../prisma/operations/getOneSignal";
import app from "../src/app";
import signals from "./fixtures/signals.json";
import ResolvedValue = jest.ResolvedValue;

const api = supertest(app);

const toSignal = (data: any): Signal => {
	return {
		...data,
	};
};

describe("Signal CRUD (operations)", () => {

	describe("Given the Signal exists", () => {
		it("should return the Signal", async () => {
			const signal = toSignal(signals[0]);
			prismaMock.signal.findUnique.mockResolvedValue(signal);

			const result = await api.get("/v1/signals/" + signal.id);
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return all Signals", async () => {
			prismaMock.signal.findMany.mockResolvedValue(signals as ResolvedValue<unknown>);

			const result = await api.get("/v1/signals/");
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return Signals filtered by id (through request query params)", async () => {
			const filterIds = signals.map(a => a.id).slice(0, 2);
			prismaMock.signal.findMany.mockResolvedValue(signals.filter(a => filterIds.includes(a.id)) as ResolvedValue<unknown>);

			const result = await api.get("/v1/signals/?filter_ids=" + filterIds.join(","));
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return Signals filtered by id (through request body)", async () => {
			const filterIds = signals.map(a => a.id).slice(0, 2);
			prismaMock.signal.findMany.mockResolvedValue(signals.filter(a => filterIds.includes(a.id)) as ResolvedValue<unknown>);

			const result = await api.get("/v1/signals/").send({
				filter_ids: filterIds,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the Signal", async () => {
			const newSignal: Omit<Signal, "id"> = {
				alarmId: "d9c00acb-8d04-4cf0-9be4-061f33b3357d",
				banktransactieIds: [],
				isActive: true,
				type: "default",
				actions: [],
				context: {
					is: true,
					something: "else",
				},
				bedragDifference: "300",
				timeUpdated: new Date("2022-09-01T23:00:00"),
			};
			const timeUpdated = signals[0].timeUpdated;

			prismaMock.signal.update.mockResolvedValue({
				...newSignal,
				id: signals[0].id,
				timeUpdated,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/signals/" + signals[0].id).send(newSignal);

			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should delete the Signal", async () => {
			prismaMock.signal.delete.mockResolvedValue(undefined!);

			const result = await api.delete("/v1/signals/" + signals[0].id);
			expect(result.statusCode).toBe(204);
		});
	});

	describe("Given the Signal does not exist", () => {
		it("should return 404 Not Found when tyring to getOneSignal", async () => {
			prismaMock.signal.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", {code: "P2025", clientVersion: "0.0.0"}));

			const result = await api.get("/v1/signals/" + signals[0].id);
			expect(result.statusCode).toEqual(404);
		});

		it("should create the Signal", async () => {
			const {id, ...signal} = toSignal(signals[0]);
			prismaMock.signal.create.mockResolvedValue({...signal, id});

			const result = await api.post("/v1/signals").send(signal);
			expect(result.statusCode).toBe(201);
			expect(result.body).toMatchSnapshot();
		});

		it("should return 404 Not Found when trying to updateSignal", async () => {
			const newStreet = "Barstreet";
			prismaMock.signal.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", {code: "P2025", clientVersion: "0.0.0"}));

			const result = await api.put("/v1/signals/" + signals[0].id).send({
				id: signals[0].id,
				street: newStreet,
			});
			expect(result.statusCode).toEqual(404);
		});

		it("should delete the Signal", async () => {
			prismaMock.signal.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", {code: "P2025", clientVersion: "0.0.0"}));
			const result = await api.delete("/v1/signals/" + signals[0].id);
			expect(result.statusCode).toEqual(204);
		});
	});

	describe("Given an unknown error occurs on the server", () => {
		const error = new Error("Server did a boo boo");

		it("should return a 500 when tyring to getOneSignal", async () => {
			prismaMock.signal.findUnique.mockRejectedValue(error);
			const getSignalResult = getOneSignal(signals[0].id);
			await expect(getSignalResult).rejects.toEqual(error);

			const result = await api.get("/v1/signals/" + signals[0].id);
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when tyring to getManysignals", async () => {
			prismaMock.signal.findMany.mockRejectedValue(error);
			const ids = signals.map(a => a.id);

			const result = await api.get("/v1/signals/?filter_ids=" + ids.join(","));
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when trying to create the Signal", async () => {
			prismaMock.signal.create.mockRejectedValue(error);

			const result = await api.post("/v1/signals").send(signals[0]);
			expect(result.statusCode).toBe(500);
			expect(result.body).toMatchSnapshot();
		});

		it("should return a 500 when trying to updateSignal", async () => {
			prismaMock.signal.update.mockRejectedValue(error);

			const newStreet = "Barstreet";
			const result = await api.put("/v1/signals/" + signals[0].id).send({
				id: signals[0].id,
				street: newStreet,
			});
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when trying to deleteSignal", async () => {
			prismaMock.signal.delete.mockRejectedValue(error);
			const result = await api.delete("/v1/signals/" + signals[0].id);
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
