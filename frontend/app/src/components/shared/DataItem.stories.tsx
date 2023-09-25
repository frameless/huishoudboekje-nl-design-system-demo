import {ViewIcon} from "@chakra-ui/icons";
import {HStack, IconButton, Text} from "@chakra-ui/react";
import {Meta, StoryFn} from "@storybook/react";
import DataItem from "./DataItem";

export default {
	title: "Huishoudboekje/DataItem",
	component: DataItem,
	argTypes: {
		children: {
			type: {
				name: "other",
				required: true,
			},
			description: "The information that needs to be displayed.",
		},
		label: {
			type: {
				name: "string",
				required: true,
			},
			description: "This is provides information on what information you get from the children.",
		},
	},
	args: {},
} as Meta<typeof DataItem>;

type DataItemProps = {
	label: string;
	children: React.ReactNode;
};

const Template: StoryFn<DataItemProps> = ({label, children}: any) => (
	<DataItem label={label}>
		{children}
	</DataItem>
);

export const Default = Template.bind({});
Default.args = {
	label: "Naam",
	children: "Fien Sandra de Jager",
};

export const Phonenumber = Template.bind({});
Phonenumber.args = {
	label: "Telefoonnummer",
	children: "0612345678",
};

export const Address = Template.bind({});
Address.args = {
	label: "Adres",
	children: [
		<Text>Stationsplein-Noord 6</Text>,
		<Text>3445 AD Woerden</Text>,
	],
};

export const WithButton = Template.bind({});
WithButton.args = {
	label: "Burger",
	children: (
		<HStack>
			<Text>Fien Sandra de Jager</Text>
			<IconButton variant={"ghost"} size={"sm"} icon={<ViewIcon />} aria-label={"Bekijk burger"} />
		</HStack>
	),
};