import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Logo from "../components/Logo";

export default {
	title: "Huishoudboekje/Components/Logo",
	component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = () => <Logo />;

export const Default = Template.bind({});