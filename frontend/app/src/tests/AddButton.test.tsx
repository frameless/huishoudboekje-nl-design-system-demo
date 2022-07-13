import {fireEvent, getByText, render} from "@testing-library/react";
import React from "react";
import AddButton from "../components/shared/AddButton";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

it("Shows the button with Toevoegen as the label", () => {
	const label = "Toevoegen";
	const {container} = render(<AddButton>{label}</AddButton>);
	expect(container!.textContent).toBe(label);
});

it("Shows the button with the default label", () => {
	const {container} = render(<AddButton />);
	expect(container!.textContent).toBe("global.actions.add");
});

it("Shows the button with the default label", () => {
	// Spy on the onClick function
	const fn = jest.fn();
	const {container} = render(<AddButton onClick={fn}>Click</AddButton>);

	// Check if the component was rendered
	expect(container?.textContent).toBe("Click");

	// Create a click event
	const clickEvent = new Event("click", {
		bubbles: true,
		cancelable: true,
	});

	// Get the element on which the event should be triggered
	const element = getByText(container!, "Click");

	// Trigger an onClick event and check if the function was called once
	fireEvent(element, clickEvent);
	expect(fn).toHaveBeenCalledTimes(1);

	// Trigger an onClick event again and check if the function was called 2 times
	fireEvent(element, clickEvent);
	expect(fn).toHaveBeenCalledTimes(2);

	// Trigger an onClick event again and check if the function was called 3 times
	fireEvent(element, clickEvent);
	expect(fn).toHaveBeenCalledTimes(3);
});
