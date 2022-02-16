import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import AddButton from "./AddButton";
import DeadEndPage from "./DeadEndPage";

export default {
	title: "Huishoudboekje/DeadEndPage",
	component: DeadEndPage,
	argTypes: {
		message: {
			type: {
				name: "string",
				required: false,
			},
			description: "This is de message that is shown on the page.",
		},
		children: {
			type: {
				name: "other",
				required: false,
			},
			description: "Here you can add extra components for example an AddButton",
		}
	},
} as ComponentMeta<typeof DeadEndPage>;

const Template: ComponentStory<typeof DeadEndPage> = ({message, children}) => (
	<DeadEndPage message={message}>
		{children}
	</DeadEndPage>
);

export const WithMessage = Template.bind({});
WithMessage.args = {
	message: "Er zijn geen banktransacties gevonden. Let op: er kunnen filteropties actief zijn waardoor er geen resultaten worden weergegeven.",
};

export const WithButton = Template.bind({});
WithButton.args = {
	message: "Voeg burgers toe door te klikken op de knop Toevoegen.",
	children: (
		<AddButton onClick={() => void (0)} />
	),
};