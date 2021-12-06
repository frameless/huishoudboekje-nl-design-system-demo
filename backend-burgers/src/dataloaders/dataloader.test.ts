import fetch from "node-fetch";
import sampleBurgers from "../sampleData/burger.json";
import {createMockedFetch} from "../test-utils";
import DataLoader from "./dataloader";

jest.mock("node-fetch");

describe("Testing BurgerLoader", () => {

	it("loads one burger", async () => {
		// Create a mocked response
		const jestFn = createMockedFetch(fetch, sampleBurgers[0]);

		// Make the call
		const burger = await DataLoader.getBurgerById(sampleBurgers[0].id);

		// Assertions
		expect(jestFn).toHaveBeenCalledTimes(1);
		expect(burger.voornamen).toEqual("Fien Sandra");
	});

	it("loads all afspraken for one burger", async () => {
		// Create a mocked response
		const jestFn = createMockedFetch(fetch, sampleBurgers[0].afspraken);
		const afspraken = await DataLoader.getAfsprakenByBurgerId(sampleBurgers[0].id);

		// Assertions
		expect(jestFn).toHaveBeenCalledTimes(1);
		expect(afspraken).toHaveLength(sampleBurgers[0].afspraken.length);
		expect(afspraken).toMatchObject(sampleBurgers[0].afspraken);
	});

});