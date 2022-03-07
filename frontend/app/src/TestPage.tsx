import {Badge, Button, ButtonGroup, Checkbox, CheckboxGroup, Divider, FormControl, FormLabel, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import BackButton from "./components/shared/BackButton";
import MenuIcon from "./components/shared/MenuIcon";
import Page from "./components/shared/Page";
import Section from "./components/shared/Section";
import SectionContainer from "./components/shared/SectionContainer";

const TestPage = () => {
	return (
		<Stack spacing={10} divider={<Divider />}>
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
				<SectionContainer>
					<Section
						title={(
							<HStack>
								<Text>Sectietitel</Text>
								<Badge colorScheme={"primary"}>1</Badge>
							</HStack>
						)}
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
					<Section
						title={(
							<HStack>
								<Text>Sectietitel</Text>
								<Badge colorScheme={"primary"}>1</Badge>
							</HStack>
						)}
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
				</SectionContainer>
			</Page>
		</Stack>
	);
};

export default TestPage;