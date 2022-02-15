import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Page from "./Page";
import BackButton from "./BackButton";
import {IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Stack} from "@chakra-ui/react";
import {ChevronDownIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";

export default {
	title: "Huishoudboekje/Page",
	component: Page,
	argTypes: {
		title: {},
		backButton: {},
		menu: {},
		right: {},
		children: {},
	},
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = ({title, backButton, menu, right}) => (
	<Page title={title} backButton={backButton} menu={menu} right={right} />
);

export const Title = Template.bind({});
Title.args = {
	title: "Bankafschriften",
};

export const TitleAndBackButton = Template.bind({});
TitleAndBackButton.args = {
	title: "Huishouden de Jager-de Burg",
	backButton: <BackButton to={"Terug"} />,
};

export const TitleAndDoubleBackButton = Template.bind({});
TitleAndDoubleBackButton.args = {
	title: "Huishouden de Jager-de Burg",
	backButton:
        <Stack direction={["column", "row"]} spacing={[2, 5]}>
        	<BackButton label={"Terug naar alle burgers"} to={""} />
        	<BackButton label={"Bekijk huishouden"} to={""} />
        </Stack>
};

export const TitleBackButtonAndMenu = Template.bind({});
TitleBackButtonAndMenu.args = {
	title: "Afspraak bekijken",
	backButton: <BackButton to={"Terug"} />,
	menu:
        <Menu>
        	<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
        	<MenuList>
        		<MenuItem>Wijzigen</MenuItem>
        		<MenuItem>Beeindigen</MenuItem>
        		<MenuItem>Verwijderen</MenuItem>
        	</MenuList>
        </Menu>
};

export const TitleAndMenu = Template.bind({});
TitleAndMenu.args = {
	title: "Transacties",
	menu:
        <Menu>
        	<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
        	<MenuList>
        		<MenuItem>Alle transacties afletteren</MenuItem>
        	</MenuList>
        </Menu>
};

export const TitleAndRight = Template.bind({});
TitleAndRight.args = {
	title: "Burger",
	right:
        <InputGroup>
        	<InputLeftElement>
        		<SearchIcon color={"gray.300"} />
        	</InputLeftElement>
        	<Input type={"text"} bg={"white"} placeholder={"zoeken"} />
        	{(<InputRightElement zIndex={0}>
        		<IconButton size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={"Zoeken"} color={"gray.300"} />
        	</InputRightElement>)}
        </InputGroup>
};