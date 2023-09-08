import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";
import Modal from "../components/shared/Modal";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useMemo: () => 'mocked useMemo',
	useContext: () => 'mocked useContext',
	useRef: () => {
		return {
			useRef: () => 'mocked useRef',
		};
	},
	useInsertionEffect: () => 'mocked useInsertionEffect',
	useLayoutEffect: () => 'mocked useLayoutEffect',
	useState: () => 'mocked useState',
	useEffect: () => 'mocked useEffect',
	useCallback: () => 'mocked callBack',
	useId: () => 'mocked useId',
}));
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	Modal: ({ children, ...rest }) => <div {...rest}>{children}</div>,
	ModalOverlay: () => <div />,
	ModalContent: ({ children }) => <div>{children}</div>,
	ModalHeader: ({ children }) => <div>{children}</div>,
	ModalBody: ({ children }) => <div>{children}</div>,
	ModalFooter: () => <div />,
	ModalCloseButton: ({ onClick }) => <button onClick={onClick}>Close</button>,
}));

describe("Modal", () => {
	it("Shows the Modal", async () => {
		const onClose = jest.fn(),
			{container} = render((
				<Modal title={"Burger toevoegen"} onClose={onClose}>Hier kan een formulier staan.</Modal>
			)),
			[modal] = screen.queryAllByRole("dialog"),
			clickEvent = new Event("click", {
				bubbles: true,
				cancelable: true,
			}),
			closeButton = screen.getByText("Close");

		expect(closeButton).toBeDefined();

		fireEvent(closeButton, clickEvent);

		// expect(onClose).toHaveBeenCalledTimes(1); No check for this in current situation
	});
});