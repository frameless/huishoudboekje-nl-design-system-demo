import {Meta, StoryFn} from "@storybook/react";
import Asterisk from "./Asterisk";

export default {
	title: "Huishoudboekje/Asterisk",
	component: Asterisk,
} as Meta<typeof Asterisk>;

const Template: StoryFn<typeof Asterisk> = () => <Asterisk />;

export const Default = Template.bind({});
Default.args = {};