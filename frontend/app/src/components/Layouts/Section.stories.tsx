import {Text} from "@chakra-ui/react";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Section from "./Section";

export default {
	title: "Huishoudboekje/Components/Section",
	component: Section,
	argTypes: {
		children: {},
	},
} as ComponentMeta<typeof Section>;

const Template: ComponentStory<typeof Section> = (args) => <Section {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithSpacing = Template.bind({});
WithSpacing.args = {
	spacing: 10,
	children: [
		<Text>This text is spaced</Text>,
		<Text>This text is spaced</Text>,
		<Text>This text is spaced</Text>,
		<Text>This text is spaced</Text>,
	],
};