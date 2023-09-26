import React from 'react';
import { render, getByText, fireEvent, screen } from '@testing-library/react';
import Alert from "../components/shared/Alert";
import {Button} from "@chakra-ui/react";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	Button: ({ children, onClick, ...rest }) => (
    	<button onClick={onClick} {...rest}>
      		{children}
    	</button>
  	),
	AlertDialog: ({ isOpen, onClose, children }) => (
		isOpen ? (
			<div>
				{children}
				<button onClick={onClose}>Close</button>
			</div>
		) : null
	),
	useDisclosure: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }),
	AlertDialogOverlay: ({ children }) => <div>{children}</div>,
	AlertDialogContent: ({ children }) => <div>{children}</div>,
	AlertDialogHeader: ({ children }) => <div>{children}</div>,
	AlertDialogBody: ({ children }) => <div>{children}</div>,
	AlertDialogFooter: ({ children }) => <div>{children}</div>,
	AlertDialogCloseButton: ({ onClick }) => <button onClick={onClick}>Close</button>,
}));

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
	useState: () => 'mocked useState',
	useCallback: () => 'mocked callBack'
}));

describe("Alert", () => {
	it("Shows the Alert", async () => {
		const myTitle = "Burger verwijderen uit huishouden";
		const myContent = "Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?"

		const {container} = render((
			<Alert title={myTitle} onClose={() => void (0)}>
				{myContent}
			</Alert>
		));

		const definedAlert = screen.findAllByTitle(myTitle)
		const definedContent = screen.findByText(myContent)
		expect(definedAlert).toBeDefined();
		expect(definedContent).toBeDefined();
	});

	it("CloseButton and cancelButton are working", async () => {
		const onClose = jest.fn();
		const onConfirm = jest.fn();
		const myTitle = "Burger verwijderen uit huishouden";
		const myContent = "Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?";

		const {container} = render((
			<Alert
				title={myTitle}
				confirmButton={<Button colorScheme={"red"} onClick={onConfirm} ml={3}>Verwijderen</Button>}
				cancelButton
				onClose={onClose}
			>
				{myContent}
			</Alert>
		));

		const alert = screen.findAllByTitle(myTitle)
		expect(alert).toBeDefined();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		const confirmButton = screen.getByText("Verwijderen");
		expect(confirmButton).toBeDefined();

		fireEvent(confirmButton, clickEvent);
		expect(onConfirm).toHaveBeenCalledTimes(1);

		const closeButton = screen.getAllByText("Close");
		expect(closeButton).toBeDefined();

		fireEvent(closeButton[1], clickEvent); //second close button has the on close event fn
		
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
