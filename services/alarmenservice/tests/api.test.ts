import {Alarm, DayOfWeek, Prisma} from "@prisma/client";
import supertest from "supertest";
import {prismaMock} from "../.jest/mockClient";
import getOneAlarm from "../prisma/operations/getOneAlarm";
import app from "../src/app";
import alarms from "./fixtures/alarms.json";
import ResolvedValue = jest.ResolvedValue;

const api = supertest(app);

const toAlarm = (data: any): Alarm => {
	return {
		...data,
		byDay: alarms[0]!.byDay.map(a => {
			return DayOfWeek[a];
		}),
	};
};

describe("Alarm CRUD (operations)", () => {

	describe("Given the Alarm exists", () => {
		it("should return the Alarm", async () => {
			const alarm = toAlarm(alarms[0]);
			prismaMock.alarm.findUnique.mockResolvedValue(alarm);

			const result = await api.get("/v1/alarms/" + alarm.id);
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return all Alarms", async () => {
			prismaMock.alarm.findMany.mockResolvedValue(alarms as ResolvedValue<unknown>);

			const result = await api.get("/v1/alarms/");
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return Alarms filtered by id (through request query params)", async () => {
			const filterIds = alarms.map(a => a.id).slice(0, 2);
			prismaMock.alarm.findMany.mockResolvedValue(alarms.filter(a => filterIds.includes(a.id)) as ResolvedValue<unknown>);

			const result = await api.get("/v1/alarms/?filter_ids=" + filterIds.join(","));
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return Alarms filtered by id (through request body)", async () => {
			const filterIds = alarms.map(a => a.id).slice(0, 2);
			prismaMock.alarm.findMany.mockResolvedValue(alarms.filter(a => filterIds.includes(a.id)) as ResolvedValue<unknown>);

			const result = await api.get("/v1/alarms/").send({
				filter_ids: filterIds,
			});
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return only active Alarms", async () => {
			prismaMock.alarm.findMany.mockResolvedValue(alarms.filter(a => a.isActive) as ResolvedValue<unknown>);

			// Take the first two
			const result = await api.get("/v1/alarms/?filter_active=true");
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should return only inactive Alarms", async () => {
			prismaMock.alarm.findMany.mockResolvedValue(alarms.filter(a => !a.isActive) as ResolvedValue<unknown>);

			// Take the first two
			const result = await api.get("/v1/alarms/?filter_active=false");
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should update the Alarm", async () => {
			const newAlarm: Omit<Alarm, "id"> = {
				afspraakId: 999,
				bedrag: 999,
				bedragMargin: 99,
				byDay: [DayOfWeek.Wednesday],
				byMonth: [],
				byMonthDay: [],
				startDate: "2033-12-31",
				endDate: "",
				datumMargin: 10,
				isActive: false,
				signaalId: "71d65065-2eb9-4f44-8f16-44d1e5a4d6f7",
			};

			prismaMock.alarm.update.mockResolvedValue({
				...newAlarm,
				id: alarms[0].id,
			} as ResolvedValue<unknown>);

			const result = await api.put("/v1/alarms/" + alarms[0].id).send(newAlarm);
			expect(result.statusCode).toBe(200);
			expect(result.body).toMatchSnapshot();
		});

		it("should delete the Alarm", async () => {
			prismaMock.alarm.delete.mockResolvedValue(undefined!);

			const result = await api.delete("/v1/alarms/" + alarms[0].id);
			expect(result.statusCode).toBe(204);
		});
	});

	describe("Given the Alarm does not exist", () => {
		it("should return 404 Not Found when tyring to getOneAlarm", async () => {
			prismaMock.alarm.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", "P2025", "Client"));

			const result = await api.get("/v1/alarms/" + alarms[0].id);
			expect(result.statusCode).toEqual(404);
		});

		it("should create the Alarm", async () => {
			const {id, ...alarm} = toAlarm(alarms[0]);
			prismaMock.alarm.create.mockResolvedValue({...alarm, id});

			const result = await api.post("/v1/alarms").send(alarm);
			expect(result.statusCode).toBe(201);
			expect(result.body).toMatchSnapshot();
		});

		it("should return 404 Not Found when trying to updateAlarm", async () => {
			const newStreet = "Barstreet";
			prismaMock.alarm.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", "P2025", "Client"));

			const result = await api.put("/v1/alarms/" + alarms[0].id).send({
				id: alarms[0].id,
				street: newStreet,
			});
			expect(result.statusCode).toEqual(404);
		});

		it("should delete the Alarm", async () => {
			prismaMock.alarm.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Not found", "P2025", "Client"));
			const result = await api.delete("/v1/alarms/" + alarms[0].id);
			expect(result.statusCode).toEqual(204);
		});
	});

	describe("Given an unknown error occurs on the server", () => {
		const error = new Error("Server did a boo boo");

		it("should return a 500 when tyring to getOneAlarm", async () => {
			prismaMock.alarm.findUnique.mockRejectedValue(error);
			const getAlarmResult = getOneAlarm(alarms[0].id);
			await expect(getAlarmResult).rejects.toEqual(error);

			const result = await api.get("/v1/alarms/" + alarms[0].id);
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when tyring to getManyalarms", async () => {
			prismaMock.alarm.findMany.mockRejectedValue(error);
			const ids = alarms.map(a => a.id);

			const result = await api.get("/v1/alarms/?filter_ids=" + ids.join(","));
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when trying to create the Alarm", async () => {
			prismaMock.alarm.create.mockRejectedValue(error);

			const result = await api.post("/v1/alarms").send(alarms[0]);
			expect(result.statusCode).toBe(500);
			expect(result.body).toMatchSnapshot();
		});

		it("should return a 500 when trying to updateAlarm", async () => {
			prismaMock.alarm.update.mockRejectedValue(error);

			const newStreet = "Barstreet";
			const result = await api.put("/v1/alarms/" + alarms[0].id).send({
				id: alarms[0].id,
				street: newStreet,
			});
			expect(result.statusCode).toEqual(500);
		});

		it("should return a 500 when trying to deleteAlarm", async () => {
			prismaMock.alarm.delete.mockRejectedValue(error);
			const result = await api.delete("/v1/alarms/" + alarms[0].id);
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
