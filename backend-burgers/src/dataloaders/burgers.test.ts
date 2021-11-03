import fetch from "node-fetch";
import sampleBurgers from "../sampleData/burger.json";
import {createFetchMock} from "../test-utils";
import AfsprakenLoader from "./afspraken";
import BurgerLoader from "./burgers";

jest.mock("node-fetch");

describe("Testing BurgerLoader", () => {

	it("loads one burger", async () => {
		// Create a mocked response
		const jestFn = createFetchMock(fetch, sampleBurgers[0]);

		// Make the call
		const burger = await BurgerLoader.findById(sampleBurgers[0].id);

		// Assertions
		expect(jestFn).toHaveBeenCalledTimes(1);
		expect(burger.voornamen).toEqual("Fien Sandra");
	});

	it("loads all burgers", async () => {
		// Create a mocked response
		const jestFn = createFetchMock(fetch, sampleBurgers);
		const burgers = await BurgerLoader.findAll();

		// Assertions
		expect(jestFn).toHaveBeenCalledTimes(1);
		expect(burgers).toHaveLength(sampleBurgers.length);
		expect(burgers).toMatchObject(sampleBurgers);
	});

	it("loads all afspraken for one burger", async () => {
		// Create a mocked response
		const jestFn = createFetchMock(fetch, sampleBurgers[0]);
		const afspraken = await AfsprakenLoader.findAllByBurgerId(sampleBurgers[0].id);

		// Assertions
		expect(jestFn).toHaveBeenCalledTimes(1);
		expect(afspraken).toHaveLength(sampleBurgers[0].afspraken.length);
		expect(afspraken).toMatchObject(sampleBurgers[0].afspraken);
	});

});