import {createIcon} from "@chakra-ui/icon";
import {Button, ButtonGroup, Checkbox, CheckboxGroup, FormControl, FormLabel, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import BackButton from "./components/shared/BackButton";
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
			<Section
				title={"Sectietitel"}
				helperText={"Ondersteunende tekst"}
				menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<MenuIcon />} variant={"ghost"} size={"sm"} aria-label={"Open menu"} />
						<MenuList>
							<MenuItem as={NavLink} to={"#"}>Wijzigen</MenuItem>
							<MenuItem>Toevoegen</MenuItem>
							<MenuItem>Verwijderen</MenuItem>
						</MenuList>
					</Menu>
				)}
				left={(
					<FormControl>
						<FormLabel>Filter</FormLabel>
						<CheckboxGroup defaultValue={["active"]}>
							<Stack>
								<Checkbox value={"active"}>Actieve signalen</Checkbox>
								<Checkbox value={"inactive"}>Inactieve signalen</Checkbox>
							</Stack>
						</CheckboxGroup>
					</FormControl>
				)}
				right={(
					<Button colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
				)}>
				<Text>Content</Text>
			</Section>
		</Page>
	);
};

export default TestPage;