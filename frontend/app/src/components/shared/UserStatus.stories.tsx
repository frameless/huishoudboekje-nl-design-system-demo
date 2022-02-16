import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import UserStatus from "./UserStatus";

export default {
	title: "Huishoudboekje/UserStatus",
	component: UserStatus,
	argTypes: {
		name: {
			type: {
				name: "string",
				required: false,
			},
			description: "This will provide the e-mail of the user.",
		},
	},
} as ComponentMeta<typeof UserStatus>;

const Template: ComponentStory<typeof UserStatus> = ({name}) => (
	<UserStatus name={name} />
);

export const Default = Template.bind({});
Default.args = {
	name: "fien.de.jager@sloothuizen.nl",
};