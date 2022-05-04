import {act, getByText} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Asterisk from "../components/shared/Asterisk";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

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

describe("Asterisk", () => {

	it("Renders asterisk component", () => {
		act(() => {
			render(<Asterisk />, container);
		});

		expect(container?.innerHTML).toMatchSnapshot();

		const asterisk = getByText(container!, "*");
		expect(asterisk).toBeVisible();

		const text = getByText(container!, "forms.asterisk");
		expect(text).toBeVisible();

	});
});
