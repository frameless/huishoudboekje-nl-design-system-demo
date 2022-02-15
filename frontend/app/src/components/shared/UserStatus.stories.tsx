import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import UserStatus from "./UserStatus";

export default {
	title: "Huishoudboekje/UserStatus",
	component: UserStatus,
	argTypes: {
		name: {},
	},
} as ComponentMeta<typeof UserStatus>;

const Template: ComponentStory<typeof UserStatus> = ({name}) => (
	<UserStatus name={name} />
);

export const Default = Template.bind({});
Default.args = {
	name: "fien.de.jager@sloothuizen.nl",
};