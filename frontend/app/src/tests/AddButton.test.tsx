import {act, fireEvent, getByText} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import AddButton from "../components/shared/AddButton";

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

it("Shows the button with Toevoegen as the label", () => {
	const label = "Toevoegen";

	act(() => {
		render(<AddButton>{label}</AddButton>, container);
	});

	expect(container!.textContent).toBe(label);
});

it("Shows the button with the default label", () => {
	act(() => {
		render(<AddButton />, container);
	});

	expect(container!.textContent).toBe("global.actions.add");
});

it("Shows the button with the default label", () => {
	// Spy on the onClick function
	const fn = jest.fn();

	act(() => {
		render(<AddButton onClick={fn}>Click</AddButton>, container);
	});

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