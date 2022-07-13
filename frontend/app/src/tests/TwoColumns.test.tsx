import {Text} from "@chakra-ui/react";
import {getByText, render} from "@testing-library/react";
import React from "react";
import TwoColumns from "../components/shared/TwoColumns";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());

describe("TwoColumns", () => {

	it("Renders the children", async () => {
		const {container} = render((
			<TwoColumns>
				<Text>Children</Text>
			</TwoColumns>
		));

		expect(container.innerHTML).toMatchSnapshot();

		const text = getByText(container, "Children");
		expect(text).toBeVisible();
	});

});