import {ComponentStory} from "@storybook/react";
import React from "react";
import PeriodiekSelector, {Periodiek} from "./PeriodiekSelector";

export default {
	title: "Huishoudboekje/PeriodiekSelector",
	component: PeriodiekSelector,
	argTypes: {
		value: {
			type: {
				required: false,
			},
		},
	},
};

const Template: ComponentStory<typeof PeriodiekSelector> = (props) => <PeriodiekSelector {...props} />;

export const Default = Template.bind({});
Default.args = {};

export const WithValidation = Template.bind({});
WithValidation.args = {
	isInvalid: true,
	isRequired: true,
};

export const WithValue = Template.bind({});
WithValue.args = {
	value: Periodiek.Eenmalig,
};