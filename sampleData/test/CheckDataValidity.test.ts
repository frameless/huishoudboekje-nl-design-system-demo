import {burgers, organisaties} from "../data";
import {testBurger, testOrganisatie} from "./test-utils";

// xdescribe("Check if data for organisaties is valid.", () => {
// 	it(`There are ${organisaties.length} organisaties to load.`, () => {
// 		expect(organisaties.length).toBeGreaterThanOrEqual(1);
// 	});
//
// 	organisaties.forEach(organisatie => testOrganisatie(organisatie));
// });

describe("Check if data for burgers is valid.", () => {

	it(`There are ${burgers.length} burgers to load.`, () => {
		expect(burgers.length).toBeGreaterThanOrEqual(1);
	});

	burgers.forEach(burger => testBurger(burger));

});