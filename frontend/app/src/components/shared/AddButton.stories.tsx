import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import AddButton from "./AddButton";

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
} as ComponentMeta<typeof AddButton>;

const Template: ComponentStory<typeof AddButton> = ({onClick, children}) => (
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