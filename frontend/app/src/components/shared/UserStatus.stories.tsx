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
				required: true,
			},
			description: "The name of the user.",
		},
		role: {
			type: {
				name: "string",
				required: false,
			},
			description: "The user's role in the application.",
		},
	},
} as ComponentMeta<typeof UserStatus>;

const Template: ComponentStory<typeof UserStatus> = ({name, role}) => (
	<UserStatus name={name} role={role} />
);

export const Default = Template.bind({});
Default.args = {
	name: "medewerker@utrecht.nl",
};

export const WithRole = Template.bind({});
WithRole.args = {
	name: "medewerker@utrecht.nl",
	role: "Applicatiebeheerder",
};