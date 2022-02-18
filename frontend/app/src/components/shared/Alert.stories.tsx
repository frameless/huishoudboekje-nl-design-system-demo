import {Button, useDisclosure} from "@chakra-ui/react";
import {ComponentMeta} from "@storybook/react";
import React from "react";
import Alert from "./Alert";

export default {
	title: "Huishoudboekje/Alert",
	component: Alert,
	argTypes: {
		title: {
			type: {
				name: "string",
				required: true,
			},
			description: "This is the title of the alert.",
		},
		children: {
			type: {
				name: "other",
				required: true,
			},
			description: "This is information what is shown in the alert.",
		},
		confirmButton: {
			type: {
				name: "function",
				required: true,
			},
			description: "When this button is clicked, the action will be executed.",
		},
		cancelButton: {
			type: {
				name: "boolean",
				required: true,
			},
			description: "When this button is clicked, the action will not be executed and the alert will be closed.",
		},
		onClose: {
			type: {
				name: "function",
				required: true,
			},
			description: "A function that will close the alert.",
		},
	},
} as ComponentMeta<typeof Alert>;

export const Default = () => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	return (
		<>
			<Button onClick={onOpen}>Open</Button>
			{isOpen && (
				<Alert
					title={"Burger verwijderen uit huishouden"}
					confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
					cancelButton={true}
					onClose={onClose}
				>
					Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
				</Alert>
			)}
		</>
	);
};

export const WithoutCancelButton = () => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	return (
		<>
			<Button onClick={onOpen}>Open</Button>
			{isOpen && (
				<Alert
					title={"Burger verwijderen uit huishouden"}
					confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
					cancelButton={false}
					onClose={onClose}
				>
					Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
				</Alert>
			)}
		</>
	);
};