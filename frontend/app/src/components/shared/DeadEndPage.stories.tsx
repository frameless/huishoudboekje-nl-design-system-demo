import {Meta, StoryFn} from "@storybook/react";
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
		},
	},
} as Meta<typeof DeadEndPage>;

const Template: StoryFn<typeof DeadEndPage> = ({message, children}) => (
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
		<AddButton onClick={() => console.info("Click!")} />
	),
};
