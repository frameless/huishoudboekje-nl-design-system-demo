import {getByText, render} from "@testing-library/react";
import React from "react";
import NumberBadge from "../components/shared/NumberBadge";

describe("Numberbadge", () => {

	it("shows NumberBage count", () => {
		const {container} = render(<NumberBadge count={9} />);

		expect(container.innerHTML).toMatchSnapshot();

		const count = getByText(container, "9");
		expect(count).toBeVisible();
	});

	it("shows NumberBage count more than 99", () => {
		const {container} = render(<NumberBadge count={9999} />);

		expect(container.innerHTML).toMatchSnapshot();

		const count = getByText(container, "99+");
		expect(count).toBeVisible();
	});
});

