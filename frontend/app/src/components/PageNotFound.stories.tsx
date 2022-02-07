import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import PageNotFound from "../components/PageNotFound";

export default {
	title: "Huishoudboekje/Components/PageNotFound",
	component: PageNotFound,
	argTypes: {},
	args: {},
} as ComponentMeta<typeof PageNotFound>;

const Template: ComponentStory<typeof PageNotFound> = () => <PageNotFound />;

export const Default = Template.bind({});
Default.args = {};