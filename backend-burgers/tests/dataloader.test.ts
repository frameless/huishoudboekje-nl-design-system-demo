import Huishoudboekjeservice from "../src/datasources/huishoudboekjeservice";
import server from "../src/server";
import burgers from "./fixtures/burgers.json";
import {GetOneBurger} from "./queries";

jest.mock("../src/datasources/huishoudboekjeservice");

describe("BurgerLoader", () => {

	describe("Given the burger exists", () => {

		it("gets the entire burger", async () => {
			jest.spyOn(Huishoudboekjeservice.prototype, "getBurgersByBsns").mockImplementation(async (bsns) => burgers.filter(b => bsns.includes(b.bsn)));

			const result = await server.executeOperation({
				query: GetOneBurger,
				variables: {
					bsn: burgers[0].bsn,
				},
			});

			expect(result.errors).toEqual(undefined);
			expect(result.data).toMatchSnapshot();
		});

	});

});