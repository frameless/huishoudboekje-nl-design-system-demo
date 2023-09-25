import {Meta, StoryFn} from "@storybook/react";
import BackButton from "./BackButton";

export default {
	title: "Huishoudboekje/BackButton",
	component: BackButton,
	argTypes: {
		to: {
			type: {
				name: "string",
				required: true,
			},
			description: "A url or Route to navigate to when this element is clicked.",
			defaultValue: "/",
		},
		label: {
			type: {
				name: "string",
				required: false,
			},
			description: "The label on the button.",
		},
	},
} as Meta<typeof BackButton>;

type BackButtonProps = {
	label: string;
	to: string;
};

const Template: StoryFn<BackButtonProps> = (args) => <BackButton {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = {
	label: "Terug naar overzicht",
};