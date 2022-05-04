import {act, getByText} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import NumberBadge from "../components/shared/NumberBadge";

let container: HTMLDivElement | null = null;

beforeEach(() => {
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container!);
	container!.remove();
	container = null;
});

describe("Numberbadge", () => {

	it("shows NumberBage count", () => {

		act(() => {
			render(<NumberBadge count={9} />, container);
		});

		expect(container?.innerHTML).toMatchSnapshot();

		const count = getByText(container!, "9");
		expect(count).toBeVisible();
	});

	it("shows NumberBage count more than 99", () => {

		act(() => {
			render(<NumberBadge count={9999} />, container);
		});

		expect(container?.innerHTML).toMatchSnapshot();

		const count = getByText(container!, "99+");
		expect(count).toBeVisible();
	});
});

