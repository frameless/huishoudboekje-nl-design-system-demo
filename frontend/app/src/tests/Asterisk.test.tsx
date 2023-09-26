import {getByText, render} from "@testing-library/react";
import React from "react";
import Asterisk from "../components/shared/Asterisk";

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
	useState: () => 'mocked useState',
	useCallback: () => 'mocked callBack'
}));
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	useDisclosure: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }),
	HStack: ({ children }) => <div>{children}</div>,
	Text: ({ children }) => <div>{children}</div>,
}));

describe("Asterisk", () => {
	it("Renders asterisk component", () => {
		const {container} = render(<Asterisk />);

		const asterisk = getByText(container!, "*");
		expect(asterisk).toBeDefined();

		const text = getByText(container!, "forms.asterisk");
		expect(text).toBeDefined();
	});
});
