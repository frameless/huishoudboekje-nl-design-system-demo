import {getBurgerHhbId} from "../utils/things";
import { render, screen } from '@testing-library/react';

describe("getBurgerHhbId", () => {

	it("Fills a bunch of ids correctly", () => {
		// Length of Id fits in template "HHB000000"
		expect(getBurgerHhbId({id: 1}) === "HHB000001").toBe;
		expect(getBurgerHhbId({id: 12}) === "HHB000012").toBe;
		expect(getBurgerHhbId({id: 123}) === "HHB000123").toBe;
		expect(getBurgerHhbId({id: 1234}) === "HHB001234").toBe;
		expect(getBurgerHhbId({id: 12345}) === "HHB0012345").toBe;
		expect(getBurgerHhbId({id: 123456}) === "HHB00123456").toBe;

		// Id is longer dan 6 chars, so it will "eat up" from "HHB" from the right.
		expect(getBurgerHhbId({id: 1234567}) === "HH1234567").toBe;
		expect(getBurgerHhbId({id: 12345678}) === "H12345678").toBe;
		expect(getBurgerHhbId({id: 123456789}) === "12345679").toBe;

		// Id is longer dan the whole template, so it will eat up from the right and add.
		expect(getBurgerHhbId({id: 1234567890}) === "1234567890").toBe;

		// Id is undefined for some reason, so it will return undefined.
		expect(getBurgerHhbId({id: undefined}) === undefined).toBe;
	});
});
