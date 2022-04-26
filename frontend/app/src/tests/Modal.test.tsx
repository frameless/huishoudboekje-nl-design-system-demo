import {act, fireEvent, screen} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Modal from "../components/shared/Modal";
import {Button} from "@chakra-ui/react";

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
		act(() => {
			render((
				<Modal title={"Burger toevoegen"} isOpen={true} onClose={() => void (0)}>
                    Hier kan een formulier staan
				</Modal>
			), container);
		});

		const [modal] = screen.queryAllByRole("ChakraModal");
		expect(modal).toMatchSnapshot();
	});

	it("Show the Modal with confirmbutton", () => {
		const onClose = jest.fn();
		const onConfirm = jest.fn();

		act(() => {
			render((
				<Modal
					title={"Burger wijzigen"}
					isOpen={true}
					onClose={onClose}
					confirmButton={<Button colorScheme={"primary"} onClick={onConfirm}>Opslaan</Button>}>
                    Hier kan een formulier staan.
				</Modal>
			), container);
		});

		const [modal] = screen.queryAllByRole("ChakraModal");
		expect(modal).toMatchSnapshot();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		})

		const confirmButton = screen.getByText("Opslaan");
		expect(confirmButton).toBeInTheDocument();

		fireEvent(confirmButton, clickEvent);
		expect(onConfirm).toHaveBeenCalledTimes(1);

		const closeButton = screen.getByLabelText("Close");
		expect(closeButton).toBeInTheDocument();

		fireEvent(closeButton, clickEvent);
		expect(onClose).toHaveBeenCalledTimes(1);

	});
})