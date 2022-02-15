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
				required: false,
			},
			description: "A function that does something after clicking on this button.",
		},
	},
} as ComponentMeta<typeof AddButton>;

const Template: ComponentStory<typeof AddButton> = ({onClick, children}) => (
	<AddButton onClick={onClick}>
		{children}
	</AddButton>
);

export const DefaultLabel = Template.bind({});
DefaultLabel.args = {};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
	children: "Kies een of meerdere bestanden",
};