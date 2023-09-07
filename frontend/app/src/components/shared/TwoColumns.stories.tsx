import {Text} from "@chakra-ui/react";
import {Meta, StoryFn} from "@storybook/react";
import React from "react";
import TwoColumns from "./TwoColumns";

export default {
	title: "Huishoudboekje/TwoColumns",
	component: TwoColumns,
	argTypes: {},
} as Meta<typeof TwoColumns>;

const Template: StoryFn<typeof TwoColumns> = ({children}) => <TwoColumns>{children}</TwoColumns>;

export const Default = Template.bind({});
Default.args = {
	children: (
		<Text>Dit is wat er rechts komt te staan.</Text>
	),
};