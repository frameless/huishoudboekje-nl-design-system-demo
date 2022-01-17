import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import DeleteConfirmButton from "../components/DeleteConfirmButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Example/DeleteConfirmButton",
	component: DeleteConfirmButton,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		onConfirm: {
			type: "function",
			description: "A function that does whatever it needs to do after confirming that the item can be deleted."
		}
	},
} as ComponentMeta<typeof DeleteConfirmButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DeleteConfirmButton> = (args) => <DeleteConfirmButton {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};