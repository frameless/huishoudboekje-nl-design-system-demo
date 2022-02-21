import {ComponentStory} from "@storybook/react";
import React, {useState} from "react";
import MonthSelector from "./MonthSelector";

export default {
	title: "Huishoudboekje/MonthSelector",
	component: MonthSelector,
	argTypes: {
		isRequired: {
			type: {
				name: "boolean",
				required: false,
				default: false,
			},
			description: "Set this to true if the field is required. An asterisk will then appear.",
		},
		isInvalid: {
			type: {
				name: "boolean",
				required: false,
				default: false,
			},
			description: "Set this to true if the field is invalid.",
		},
		value: {
			type: {
				name: "number[]",
				required: false,
				default: [],
			},
			description: "An array of numbers that represent the months, starting at 1 for January, 2 for February etc.",
		},
	},
};

const Template: ComponentStory<typeof MonthSelector> = ({value, ...props}) => {
	const [months, setMonths] = useState<number[]>(value);

	return (
		<MonthSelector {...props} onChange={setMonths} value={months} />
	);
};

export const Default = Template.bind({});
Default.args = {};

export const WithValidation = Template.bind({});
WithValidation.args = {
	isInvalid: true,
	isRequired: true,
};

export const WithValues = Template.bind({});
WithValues.args = {
	isInvalid: true,
	value: [1, 4, 7, 10],
};