import {Button, useDisclosure} from "@chakra-ui/react";
import {Meta, Story} from "@storybook/react";
import React from "react";
import Modal from "./Modal";

export default {
	title: "Huishoudboekje/Modal",
	component: Modal,
	argTypes: {
		title: {
			type: {
				name: "string",
				required: true,
			},
			description: "This is the title of the modal.",
		},
		onClose: {
			type: {
				name: "function",
				required: true,
			},
			description: "A function that will close the modal.",
		},
		children: {
			type: {
				name: "other",
				required: true,
			},
			description: "This will be visible in the body of the modal.",
		},
	},
} as Meta<typeof Modal>;

type ModalProps = {
	title: string;
	children: React.ReactNode;
};

const Template: Story<ModalProps> = ({title, children}: any) => {
	const {isOpen, onOpen, onClose} = useDisclosure();

	return (<>
		<Button onClick={onOpen}>Open Modal</Button>
		{isOpen && (
			<Modal title={title} onClose={onClose}>
				{children}
			</Modal>
		)}
	</>);
};

export const Default = Template.bind({});
Default.args = {
	title: "Lorem ipsum",
	children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, aperiam culpa delectus, doloremque eum id labore numquam perferendis placeat qui quia quibusdam quod rem, sequi sunt tempora tempore temporibus veniam.",
}