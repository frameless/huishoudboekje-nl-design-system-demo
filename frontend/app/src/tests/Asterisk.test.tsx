import {getByText, render} from "@testing-library/react";
import React from "react";
import Asterisk from "../components/shared/Asterisk";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

describe("Asterisk", () => {

	it("Renders asterisk component", () => {
		const {container} = render(<Asterisk />);

		expect(container?.innerHTML).toMatchSnapshot();

		const asterisk = getByText(container!, "*");
		expect(asterisk).toBeDefined();

		const text = getByText(container!, "forms.asterisk");
		expect(text).toBeDefined();

	});
});