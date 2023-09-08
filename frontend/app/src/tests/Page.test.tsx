import {Button, ButtonGroup, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {fireEvent, getByLabelText, getByText, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import MenuIcon from "../components/shared/MenuIcon";
import Page from "../components/shared/Page";
import SectionContainer from "../components/shared/SectionContainer";

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
	useDisclosure: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }),
	Heading: ({ children }) => <div>{children}</div>,
	Flex: ({ children }) => <div>{children}</div>,
	Stack: ({ children }) => <div>{children}</div>,
	HStack: ({ children }) => <div>{children}</div>,
	Text: ({ children }) => <div>{children}</div>,
	Image: ({...rest}) => <img src={rest?.src} />,
	Button: ({children, ...rest}) => <button {...rest}>{children}</button>,
	Menu: ({children, ...rest}) => <div {...rest}>{children}</div>,
	IconButton: ({children, ...rest}) => <div {...rest}>{children}</div>,
	MenuList: ({children, ...rest}) => <div {...rest}>{children}</div>,
	MenuItem: ({children, ...rest}) => <div {...rest}>{children}</div>,
}));

describe("Page", () => {
	it("Renders a title", () => {
		const {container} = render(<Page title={"Bankafschriften"} />);

		// Checks the title
		const element = screen.findByRole("heading").then((result) => {
			const title = getByText(result, "Bankafschriften");
			expect(title).toBeDefined();
		});
	});

	it("Renders with a backbutton", () => {
		const onClick = jest.fn(),
			{container} = render(<Page title={"Bankafschriften"} backButton={<Button onClick={onClick}>Click</Button>} />),
			[pageButton] = screen.queryAllByRole("button"),
			clickEvent = new Event("click", {
				bubbles: true,
				cancelable: true,
			}),
			backButton = getByText(pageButton, "Click");

		expect(backButton).toBeDefined();

		fireEvent(backButton, clickEvent);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("Renders a menu", async () => {
		const onClick = jest.fn(),
			{container} = render((
				<Page
					title={"Bankafschriften"}
					menu={(
						<Menu>
							<IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} onClick={onClick} />
							<MenuList>
								<MenuItem onClick={onClick}>Alle transacties afletteren</MenuItem>
							</MenuList>
						</Menu>
					)}
				/>
			)),
			iconButton = getByLabelText(container, "Open menu"),
			clickEvent = new Event("click", {
				bubbles: true,
				cancelable: true,
			}),
			menuItem = getByText(container, "Alle transacties afletteren");

		expect(onClick).toHaveBeenCalledTimes(0);
		expect(iconButton).toBeDefined();

		fireEvent(iconButton, clickEvent);

		expect(onClick).toHaveBeenCalledTimes(1);

		await waitFor(() => expect(menuItem).toBeDefined());

		fireEvent(menuItem, clickEvent);

		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it("Renders components on the right", async () => {
		const onClick = jest.fn(),
			{container} = render((
				<Page
					title={"Bankafschriften"}
					right={(
						<HStack>
							<Text>Tekst zichtbaar</Text>
							<Button onClick={ onClick }>KlikActie</Button>
						</HStack>
					)}
				/>
			)),
			text = getByText(container, "Tekst zichtbaar"),
			button = screen.getByText("KlikActie"),
			clickEvent = new Event("click", {
				bubbles: true,
				cancelable: true,
			});

		expect(onClick).toHaveBeenCalledTimes(0);
		expect(text).toBeDefined();
		expect(button).toBeDefined();

		fireEvent(button, clickEvent);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("Renders component with children", () => {
		const myText = "Hier kunnen verschillende componenten komen te staan.",
			{container} = render((
				<Page title={"Bankafschriften"}>
					<Text>{myText}</Text>
				</Page>
			)),
			textCheck = getByText(container, myText);

		expect(textCheck).toBeDefined();
	});
});
