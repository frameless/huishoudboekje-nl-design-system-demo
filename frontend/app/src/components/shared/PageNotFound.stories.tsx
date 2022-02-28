import {ComponentMeta} from "@storybook/react";
import React from "react";
import PageNotFound from "./PageNotFound";

export default {
	title: "Huishoudboekje/PageNotFound",
	component: PageNotFound,
	argTypes: {},
} as ComponentMeta<typeof PageNotFound>;

export const Default = () => {
	return (
		<PageNotFound />
	);
};
Default.args = {};