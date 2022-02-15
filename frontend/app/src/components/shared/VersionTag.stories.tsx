import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import VersionTag from "./VersionTag";

export default {
	title: "Huishoudboekje/VersionTag",
	component: VersionTag,
	argTypes: {},
} as ComponentMeta<typeof VersionTag>;

const Template: ComponentStory<typeof VersionTag> = () => (
	<VersionTag />
);

export const Default = Template.bind({});
Default.args = {};