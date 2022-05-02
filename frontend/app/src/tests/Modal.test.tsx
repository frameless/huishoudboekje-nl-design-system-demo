import {act, fireEvent, screen} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Modal from "../components/shared/Modal";

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

describe("Modal", () => {
	it("Show the Modal", async () => {
		const onClose = jest.fn();

		act(() => {
			render((
				<Modal title={"Burger toevoegen"} onClose={onClose}>
					Hier kan een formulier staan
				</Modal>
			), container);
		});

		const [modal] = screen.queryAllByRole("ChakraModal");
		expect(modal).toMatchSnapshot();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		const closeButton = screen.getByLabelText("Close");
		expect(closeButton).toBeInTheDocument();

		fireEvent(closeButton, clickEvent);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});