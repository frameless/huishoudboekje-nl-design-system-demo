import {ChevronDownIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Stack} from "@chakra-ui/react";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import BackButton from "./BackButton";
import Page from "./Page";

export default {
	title: "Huishoudboekje/Page",
	component: Page,
	argTypes: {
		title: {
			type: {
				name: "string",
				required: true,
			},
			description: "This is the title of the page.",
		},
		backButton: {
			type: {
				name: "string",
				required: false,
			},
			description: "Add a button at the top of the page to navigate elsewhere.",
		},
		menu: {
			type: {
				name: "string",
				required: false,
			},
			description: "This will show an menu with options.",
		},
		right: {
			type: {
				name: "string",
				required: false,
			},
			description: "This will show whatever you put in here on the top right of the page.",
		},
	},
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = ({title, backButton, menu, right}) => (
	<Page title={title} backButton={backButton} menu={menu} right={right} />
);

export const Default = Template.bind({});
Default.args = {
	title: "Bankafschriften",
};

export const WithBackButton = Template.bind({});
WithBackButton.args = {
	title: "Huishouden de Jager-de Burg",
	backButton: (
		<BackButton label={"Terug naar overzicht"} to={"/huishoudens"} />
	),
};

export const WithMultipleBackButtons = Template.bind({});
WithMultipleBackButtons.args = {
	title: "Huishouden de Jager-de Burg",
	backButton: (
		<Stack direction={["column", "row"]}>
			<BackButton label={"Terug naar alle burgers"} to={"/burgers"} />
			<BackButton label={"Bekijk huishouden"} to={"/huishoudens/1"} />
		</Stack>
	),
};

export const WithMenu = Template.bind({});
WithMenu.args = {
	title: "Transacties",
	menu: (
		<Menu>
			<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
			<MenuList>
				<MenuItem>Alle transacties afletteren</MenuItem>
			</MenuList>
		</Menu>
	),
};

export const WithBackButtonAndMenu = Template.bind({});
WithBackButtonAndMenu.args = {
	title: "Afspraak bekijken",
	backButton: <BackButton label={"Terug"} to={"/"} />,
	menu: (
		<Menu>
			<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
			<MenuList>
				<MenuItem>Wijzigen</MenuItem>
				<MenuItem>Beeindigen</MenuItem>
				<MenuItem>Verwijderen</MenuItem>
			</MenuList>
		</Menu>
	),
};

export const WithSearchRight = Template.bind({});
WithSearchRight.args = {
	title: "Burgers",
	right: (
		<InputGroup>
			<InputLeftElement>
				<SearchIcon color={"gray.300"} />
			</InputLeftElement>
			<Input type={"text"} bg={"white"} placeholder={"zoeken"} />
			<InputRightElement>
				<IconButton size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={"Zoeken"} color={"gray.300"} />
			</InputRightElement>
		</InputGroup>
	),
};