import {Text} from "@chakra-ui/react";
import {getByText, render} from "@testing-library/react";
import React from "react";
import TwoColumns from "../components/shared/TwoColumns";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());
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
}));
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	useDisclosure: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }),
	Flex: ({ children }) => <div>{children}</div>,
	Stack: ({ children }) => <div>{children}</div>,
	Text: ({ children }) => <div>{children}</div>,
	Image: ({...rest}) => <img src={rest?.src} />,
}));

describe("TwoColumns", () => {
	it("Renders the children", async () => {
		const {container} = render((
			<TwoColumns>
				<Text>Children</Text>
			</TwoColumns>
		));

		const text = getByText(container, "Children");
		expect(text).toBeDefined();
	});
});
