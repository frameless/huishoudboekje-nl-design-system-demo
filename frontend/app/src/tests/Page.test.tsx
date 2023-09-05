import {Button, ButtonGroup, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {fireEvent, getByLabelText, getByText, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import MenuIcon from "../components/shared/MenuIcon";
import Page from "../components/shared/Page";
import SectionContainer from "../components/shared/SectionContainer";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

describe("Page", () => {

	it("Renders a title", () => {
		const {container} = render(<Page title={"Bankafschriften"} />);

		expect(container.innerHTML).toMatchSnapshot();

		// Checks the title
		const [pageTitle] = screen.queryAllByRole("heading");

		const title = getByText(pageTitle, "Bankafschriften");
		expect(title).toBeDefined();
	});

	it("Renders the page component with all options", () => {
		const onClick = jest.fn();

		const {container} = render((
			<Page
				title={"Bankafschriften"}
				backButton={<Button onClick={onClick}>Click</Button>}
				menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
						<MenuList>
							<MenuItem>Alle transacties afletteren</MenuItem>
						</MenuList>
					</Menu>
				)}
				right={(
					<ButtonGroup size={"sm"} isAttached variant={"outline"}>
						<Button mr={"-px"} colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
						<Button colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
					</ButtonGroup>
				)}
			>
				<SectionContainer />
			</Page>
		));

		expect(container.innerHTML).toMatchSnapshot();
	});

	it("Renders with a backbutton", () => {
		const onClick = jest.fn();

		const {container} = render(<Page title={"Bankafschriften"} backButton={<Button onClick={onClick}>Click</Button>} />);

		expect(container.innerHTML).toMatchSnapshot();

		// Checks the backbutton
		const [pageButton] = screen.queryAllByRole("button");

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		const backButton = getByText(pageButton, "Click");
		expect(backButton).toBeDefined();

		fireEvent(backButton, clickEvent);
		expect(onClick).toHaveBeenCalledTimes(1);

	});

	it("Renders a menu", async () => {
		const onClick = jest.fn();

		const {container} = render((
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
		));

		expect(container.innerHTML).toMatchSnapshot();
		expect(onClick).toHaveBeenCalledTimes(0);

		const iconButton = getByLabelText(container, "Open menu");
		expect(iconButton).toBeDefined();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		fireEvent(iconButton, clickEvent);

		expect(container.innerHTML).toMatchSnapshot();
		expect(onClick).toHaveBeenCalledTimes(1);

		const menuItem = getByText(container, "Alle transacties afletteren");
		await waitFor(() => expect(menuItem).toBeDefined());

		fireEvent(menuItem, clickEvent);
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it("Renders components on the right", () => {
		const onClick = jest.fn();

		const {container} = render((
			<Page
				title={"Bankafschriften"}
				right={(
					<HStack>
						<Text>Tekst zichtbaar</Text>
						<Button colorScheme={"primary"} variant={"outline"} size={"sm"} onClick={onClick}>Actie</Button>
					</HStack>
				)}
			/>
		));

		expect(container.innerHTML).toMatchSnapshot();
		expect(onClick).toHaveBeenCalledTimes(0);

		const text = getByText(container, "Tekst zichtbaar");
		expect(text).toBeDefined();

		const button = getByText(container, "Actie");
		expect(button).toBeDefined();

		const clickEvent = new Event("click", {
			bubbles: true,
			cancelable: true,
		});

		fireEvent(button, clickEvent);

		expect(container.innerHTML).toMatchSnapshot();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("Renders component with children", () => {
		const {container} = render((
			<Page title={"Bankafschriften"}>
				<Text>Hier kunnen verschillende componenten komen te staan.</Text>
			</Page>
		));

		expect(container.innerHTML).toMatchSnapshot();

		const text = getByText(container, "Hier kunnen verschillende componenten komen te staan.");
		expect(text).toBeDefined();
	});
});