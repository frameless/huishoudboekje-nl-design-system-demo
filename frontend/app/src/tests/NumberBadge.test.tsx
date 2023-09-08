import {getByText, render} from "@testing-library/react";
import React from "react";
import NumberBadge from "../components/shared/NumberBadge";

jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	Badge: ({ children, ...rest }) => (
    	<div {...rest}>{children}</div>
  	),
}));
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useContext: () => 'mocked useContext',
}));

describe("Numberbadge", () => {
	it("shows NumberBage count", () => {
		const {container} = render(<NumberBadge count={9} />);

		const count = getByText(container, "9");
		expect(count).toBeDefined();
	});

	it("shows NumberBage count more than 99", () => {
		const {container} = render(<NumberBadge count={9999} />);

		const count = getByText(container, "99+");
		expect(count).toBeDefined();
	});
});
