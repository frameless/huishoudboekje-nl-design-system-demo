import {Meta, StoryFn} from "@storybook/react";
import DeleteConfirmButton from "./DeleteConfirmButton";

export default {
	title: "Huishoudboekje/DeleteConfirmButton",
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
} as Meta<typeof DeleteConfirmButton>;

const Template: StoryFn<typeof DeleteConfirmButton> = ({onConfirm}: any) => <DeleteConfirmButton onConfirm={onConfirm} />;

export const Default = Template.bind({});
Default.args = {};