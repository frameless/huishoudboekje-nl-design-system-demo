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
	},
};

const Template: ComponentStory<typeof PrettyIban> = ({iban}) => <PrettyIban iban={iban} />;

export const Default = Template.bind({});
Default.args = {
	iban: "NL99BANK01234567890",
};