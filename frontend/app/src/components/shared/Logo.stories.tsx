import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Logo from "./Logo";

export default {
	title: "Huishoudboekje/Logo",
	component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = () => <Logo />;

export const Default = Template.bind({});
Default.args = {};