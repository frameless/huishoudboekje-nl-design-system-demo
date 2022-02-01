import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import PageNotFound from "../components/PageNotFound";

export default {
	title: "Huishoudboekje/Componenten/PageNotFound",
	component: PageNotFound,
} as ComponentMeta<typeof PageNotFound>;

const Template: ComponentStory<typeof PageNotFound> = (args) => <PageNotFound />;

export const Default = Template.bind({});
Default.args = {};