import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import PageNotFound from "./PageNotFound";

export default {
	title: "Huishoudboekje/PageNotFound",
	component: PageNotFound,
	argTypes: {},
	args: {},
} as ComponentMeta<typeof PageNotFound>;

const Template: ComponentStory<typeof PageNotFound> = () => <PageNotFound />;

export const Default = Template.bind({});
Default.args = {};