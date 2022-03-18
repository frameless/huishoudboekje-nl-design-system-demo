import {ComponentStory} from "@storybook/react";
import React from "react";
import PrettyIban from "./PrettyIban";

export default {
	title: "Huishoudboekje/PrettyIban",
	component: PrettyIban,
	argTypes: {
		iban: {
			type: {
				name: "string",
				required: true,
			},
		},
		fallback: {
			type: {
				name: "string",
				required: false,
			},
		},
	},
};

const Template: ComponentStory<typeof PrettyIban> = ({iban, fallback}) => <PrettyIban iban={iban} fallback={fallback} />;

export const Default = Template.bind({});
Default.args = {
	iban: "NL99BANK01234567890",
};

export const Fallback = Template.bind({});
Fallback.args = {
	iban: undefined,
	fallback: "Onbekende IBAN"
};