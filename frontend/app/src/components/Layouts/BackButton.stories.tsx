import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import BackButton from "./BackButton";

export default {
	title: "Huishoudboekje/Componenten/BackButton",
	component: BackButton,
	argTypes: {
		to: {
			type: {
				name: "string",
				required: true,
			},
			description: "A url or Route to navigate to when this element is clicked.",
			defaultValue: "/",
		},
		label: {
			type: {
				name: "string",
				required: false,
			},
			description: "The label on the button.",
		},
	},
} as ComponentMeta<typeof BackButton>;

const Template: ComponentStory<typeof BackButton> = (args) => <BackButton {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = {
	label: "Terug naar overzicht",
};