import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import DashedAddButton from "./DashedAddButton";

export default {
	title: "Huishoudboekje/DashedAddButton",
	component: DashedAddButton,
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
} as ComponentMeta<typeof DashedAddButton>;

const Template: ComponentStory<typeof DashedAddButton> = ({onClick, children}) => (
	<DashedAddButton onClick={onClick}>
		{children}
	</DashedAddButton>
);

export const Default = Template.bind({});
Default.args = {};
