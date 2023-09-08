import {fireEvent, getByText, render} from "@testing-library/react";
import React from "react";
import DashedAddButton from "../components/shared/DashedAddButton";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	Button: ({ children, onClick, ...rest }) => (
	  <button onClick={onClick} {...rest}>
		{children}
	  </button>
	),
  }));

describe("Dashed button", () => {
	it("Show dashed button with label", () => {
		const label = "Toevoegen";
		const {container} = render(<DashedAddButton>{label}</DashedAddButton>);

		expect(container.innerHTML).toMatchSnapshot();
		expect(container.textContent).toBe(label);
	});

	it("Show dashed button with default label", () => {
		const {container} = render(<DashedAddButton />);

		expect(container.innerHTML).toMatchSnapshot();
		expect(container.textContent).toBe("global.actions.add");
	});

	it("Check the onClick", () => {
		const onClick = jest.fn();
		const label = "Opslaan";

		const {container} = render(<DashedAddButton onClick={onClick}>{label}</DashedAddButton>);

		expect(container.innerHTML).toMatchSnapshot();
		expect(container.textContent).toBe("Opslaan");

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		const element = getByText(container, "Opslaan");

		fireEvent(element, clickEvent);
		expect(onClick).toHaveBeenCalledTimes(1);

		fireEvent(element, clickEvent);
		expect(onClick).toHaveBeenCalledTimes(2);

	});
});