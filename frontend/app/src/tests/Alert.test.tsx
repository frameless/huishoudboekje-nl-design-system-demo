import {Button} from "@chakra-ui/react";
import {act, fireEvent, getByLabelText, getByText, screen} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Alert from "../components/shared/Alert";

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

describe("Alert", () => {
	it("Shows the Alert", async () => {
		act(() => {
			render((
				<Alert title={"Burger verwijderen uit huishouden"} onClose={() => void(0)}>
					Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
				</Alert>
			), container);
		});

		const [alert] = screen.queryAllByRole("alertdialog");
		expect(alert).toMatchSnapshot();
	});

	it("CloseButton and cancelButton are working", async () => {
		const onClose = jest.fn();
		const onConfirm = jest.fn();

		act(() => {
			render((
				<Alert
					title={"Burger verwijderen uit huishouden"}
					confirmButton={<Button colorScheme={"red"} onClick={onConfirm} ml={3}>Verwijderen</Button>}
					cancelButton
					onClose={onClose}
				>
					Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
				</Alert>
			), container);
		});

		const [alert] = screen.queryAllByRole("alertdialog");
		expect(alert).toMatchSnapshot();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		const confirmButton = getByText(alert, "Verwijderen");
		expect(confirmButton).toBeInTheDocument();

		fireEvent(confirmButton, clickEvent);
		expect(onConfirm).toHaveBeenCalledTimes(1);

		const closeButton = getByLabelText(alert, "Close");
		expect(closeButton).toBeInTheDocument();

		fireEvent(closeButton, clickEvent);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
