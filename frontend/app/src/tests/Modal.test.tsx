import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";
import Modal from "../components/shared/Modal";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

describe("Modal", () => {
	it("Shows the Modal", async () => {
		const onClose = jest.fn();

		render((
			<Modal title={"Burger toevoegen"} onClose={onClose}>
				Hier kan een formulier staan
			</Modal>
		));

		const [modal] = screen.queryAllByRole("dialog");
		expect(modal).toMatchSnapshot();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		const closeButton = screen.getByLabelText("Close");
		expect(closeButton).toBeDefined();

		fireEvent(closeButton, clickEvent);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});