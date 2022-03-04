import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Asterisk from "./Asterisk";

export default {
	title: "Huishoudboekje/Asterisk",
	component: Asterisk,
} as ComponentMeta<typeof Asterisk>;

const Template: ComponentStory<typeof Asterisk> = () => <Asterisk />;

export const Default = Template.bind({});
Default.args = {};