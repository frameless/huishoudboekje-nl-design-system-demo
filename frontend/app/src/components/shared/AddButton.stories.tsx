import {Meta, StoryFn} from "@storybook/react";
import AddButton from "./AddButton";
import React from 'react';

export default {
	title: "Huishoudboekje/AddButton",
	component: AddButton,
	argTypes: {
		onClick: {
			type: {
				name: "function",
				required: true,
			},
			description: "A function that will execute when this button is clicked.",
		},
		children: {
			type: {
				name: "string",
				required: false,
			},
			description: "This will override the button label.",
		},
	},
} as Meta<typeof AddButton>;

type AddButtonProps = {
	children: React.ReactNode;
};

const Template: StoryFn<AddButtonProps> = ({onClick, children}: any) => (
	<AddButton onClick={onClick}>
		{children}
	</AddButton>
);

export const Default = Template.bind({});
Default.args = {};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
	children: "Kies een of meerdere bestanden",
};