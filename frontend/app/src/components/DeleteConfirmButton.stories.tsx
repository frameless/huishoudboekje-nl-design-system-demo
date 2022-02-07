import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import DeleteConfirmButton from "../components/DeleteConfirmButton";

export default {
	title: "Huishoudboekje/Components/DeleteConfirmButton",
	component: DeleteConfirmButton,
	argTypes: {
		onConfirm: {
			type: {
				name: "function",
				required: true,
			},
			description: "A function that does whatever it needs to do after confirming that the item can be deleted.",
		},
	},
} as ComponentMeta<typeof DeleteConfirmButton>;

const Template: ComponentStory<typeof DeleteConfirmButton> = ({onConfirm}) => <DeleteConfirmButton onConfirm={onConfirm} />;

export const Default = Template.bind({});
Default.args = {};