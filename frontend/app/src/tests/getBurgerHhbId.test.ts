import {getBurgerHhbId} from "../utils/things";

describe("getBurgerHhbId", () => {

	it("Fills a bunch of ids correctly", () => {
		// Length of Id fits in template "HHB000000"
		expect(getBurgerHhbId({id: 1})).toEqual("HHB000001");
		expect(getBurgerHhbId({id: 12})).toEqual("HHB000012");
		expect(getBurgerHhbId({id: 123})).toEqual("HHB000123");
		expect(getBurgerHhbId({id: 1234})).toEqual("HHB001234");
		expect(getBurgerHhbId({id: 12345})).toEqual("HHB012345");
		expect(getBurgerHhbId({id: 123456})).toEqual("HHB123456");

		// Id is longer dan 6 chars, so it will "eat up" from "HHB" from the right.
		expect(getBurgerHhbId({id: 1234567})).toEqual("HH1234567");
		expect(getBurgerHhbId({id: 12345678})).toEqual("H12345678");
		expect(getBurgerHhbId({id: 123456789})).toEqual("123456789");

		// Id is longer dan the whole template, so it will eat up from the right and add.
		expect(getBurgerHhbId({id: 1234567890})).toEqual("1234567890");

		// Id is undefined for some reason, so it will return undefined.
		expect(getBurgerHhbId({id: undefined})).toEqual(undefined);
	});

});