import server from "../src/server";
import burgers from "./fixtures/burgers.json";
import {GetOneBurger} from "./queries";

jest.setTimeout(60000);

describe("BurgerLoader", () => {

	describe("Given the burger exists", () => {

		it("gets the entire burger", async () => {
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