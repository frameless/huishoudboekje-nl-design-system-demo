import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Logo from "../components/Logo";

export default {
	title: "Huishoudboekje/Componenten/Logo",
	component: Logo,
	argTypes: {},
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

export const Default = Template.bind({});
Default.args = {};