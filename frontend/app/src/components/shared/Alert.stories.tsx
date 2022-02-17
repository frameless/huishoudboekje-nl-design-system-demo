import {ComponentMeta} from "@storybook/react";
import React from "react";
import Alert from "./Alert";
import {Button, useDisclosure} from "@chakra-ui/react";

export default {
	title: "Huishoudboekje/Alert",
	component: Alert,
	argTypes: {
		title: {
			type: {
				name: "string",
				required: true,
			},
			description: "This is the title of the modal.",
		},
		children: {
			type: {
				name: "string",
				required: true,
			},
			description: "This is information what is shown on the modal.",
		},
		confirmButton: {
			type: {
				name: "function",
				required: true,
			},
			description: "This button will do the action.",
		},
		cancelButton: {
			type: {
				name: "boolean",
				required: true,
			},
			description: "This button will stop the action.",
		},
		onClose: {
			type: {
				name: "function",
				required: true,
			},
			description: "This function will close the modal",
		}
	},
} as ComponentMeta<typeof Alert>;

export var BasicUsage = () => {
	const {isOpen, onOpen, onClose} = useDisclosure()
	return (
		<>
			<Button onClick={onOpen}>Open</Button>
			{isOpen && (
				<Alert
					title={"Burger verwijderen uit huishouden"}
					confirmButton={<Button colorScheme="red" ml={3}>Verwijderen</Button>}
					cancelButton={true}
					onClose={onClose}
				>
					{"Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?"}
				</Alert>
			)}
		</>
	)
}

export var WithoutCancelButton = () => {
	const {isOpen, onOpen, onClose} = useDisclosure()
	return (
		<>
			<Button onClick={onOpen}>Open</Button>
			{isOpen && (<Alert
				title={"Burger verwijderen uit huishouden"}
				confirmButton={<Button colorScheme="red" ml={3}>Verwijderen</Button>}
				cancelButton={false}
				onClose={onClose}
			>
				{"Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?"}
			</Alert>
			)}
		</>
	)
}