import {Text} from "@chakra-ui/react";
import {act, getByText} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import TwoColumns from "../components/shared/TwoColumns";

let container: HTMLDivElement | null = null;

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());

beforeEach(() => {
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container!);
	container!.remove();
	container = null;
});

describe("TwoColumns", () => {

	it("Renders the children", async () => {
		act(() => {
			render((
				<TwoColumns>
					<Text>Children</Text>
				</TwoColumns>
			), container);
		});

		expect(container?.innerHTML).toMatchSnapshot();

		const text = getByText(container!, "Children");
		expect(text).toBeVisible();
	});

});