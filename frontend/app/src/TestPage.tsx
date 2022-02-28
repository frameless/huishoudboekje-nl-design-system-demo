import {createIcon} from "@chakra-ui/icon";
import {Button, ButtonGroup, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import BackButton from "./components/shared/BackButton";
import {FormLeft, FormRight} from "./components/shared/Forms";
import Page from "./components/shared/Page";
import Section from "./components/shared/Section";

const MenuIcon = createIcon({
	// Taken from HiDotsVertical from react-icons/hi
	displayName: "HiDotsVertical",
	d: "M10 6a2 2 0 110-4 2 2 0 010 4z M10 12a2 2 0 110-4 2 2 0 010 4z M10 18a2 2 0 110-4 2 2 0 010 4z",
});

const TestPage = () => {
	return (
		<Page
			title={"Paginatitel"}
			backButton={<BackButton to={"#"} />}
			menu={(
				<Menu>
					<IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} size={"sm"} aria-label={"Open menu"} />
					<MenuList>
						<MenuItem as={NavLink} to={"#"}>Wijzigen</MenuItem>
						<MenuItem>Toevoegen</MenuItem>
						<MenuItem>Verwijderen</MenuItem>
					</MenuList>
				</Menu>
			)}
			right={(
				<ButtonGroup size={"sm"} isAttached variant={"outline"}>
					<Button mr={"-px"} colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
					<Button colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
				</ButtonGroup>
			)}>

			<Section>
				<Stack direction={"row"}>
					<FormLeft title={"Sectietitel"} helperText={"Ondersteunende tekst"} />
					<FormRight>
						<Text>Content</Text>
					</FormRight>
				</Stack>
			</Section>

			<Section>
				<FormLeft title={"Sectietitel"} helperText={"Ondersteunende tekst"} />
				<FormRight>
					<Text>Content</Text>
				</FormRight>
			</Section>

			<Section>
				<Stack direction={["column", "row"]} justify={"flex-start"} align={"flex-start"}>
					<Stack flex={1} alignItems={"flex-start"}>
						<Heading size={"md"}>Titel</Heading>
						<Text fontSize={"md"} color={"gray.500"}>Ondersteunende tekst</Text>

						<Text>Filteropties</Text>
					</Stack>
					<Stack flex={3}>
						<Text>Content</Text>
					</Stack>
				</Stack>
			</Section>

		</Page>
	);
};

export default TestPage;