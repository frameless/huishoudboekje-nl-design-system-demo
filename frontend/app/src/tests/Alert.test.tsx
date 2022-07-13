import {Button} from "@chakra-ui/react";
import {fireEvent, getByLabelText, getByText, render, screen} from "@testing-library/react";
import React from "react";
import Alert from "../components/shared/Alert";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

describe("Alert", () => {
	it("Shows the Alert", async () => {
		render((
			<Alert title={"Burger verwijderen uit huishouden"} onClose={() => void (0)}>
				Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
			</Alert>
		));

		const [alert] = screen.queryAllByRole("alertdialog");
		expect(alert).toMatchSnapshot();
	});

	it("CloseButton and cancelButton are working", async () => {
		const onClose = jest.fn();
		const onConfirm = jest.fn();

		render((
			<Alert
				title={"Burger verwijderen uit huishouden"}
				confirmButton={<Button colorScheme={"red"} onClick={onConfirm} ml={3}>Verwijderen</Button>}
				cancelButton
				onClose={onClose}
			>
				Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
			</Alert>
		));

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
