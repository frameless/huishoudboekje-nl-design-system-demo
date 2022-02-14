import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import ZoektermenList from "./ZoektermenList";

export default {
	title: "Huishoudboekje/ZoektermenList",
	component: ZoektermenList,
	argTypes: {
		zoektermen: {
			type: {
				name: "array",
				required: false,
			},
			description: "",
		},
		onDeleteZoekterm: {
			type: {
				name: "function",
				required: false,
			},
			defaultValue: null,
		},
	},
} as ComponentMeta<typeof ZoektermenList>;

const Template: ComponentStory<typeof ZoektermenList> = ({zoektermen, onDeleteZoekterm}) => (
	<ZoektermenList zoektermen={zoektermen} {...onDeleteZoekterm && {onDeleteZoekterm}} />
);

export const EmptyList = Template.bind({});
EmptyList.args = {
	zoektermen: [],
};

export const OneItem = Template.bind({});
OneItem.args = {
	zoektermen: ["leefgeld"],
};

export const MultipleItems = Template.bind({});
MultipleItems.args = {
	zoektermen: ["zoekterm", "persona1", "leefgeld"],
};

export const Deletable = Template.bind({});
Deletable.args = {
	zoektermen: ["zoekterm", "persona1", "leefgeld"],
	onDeleteZoekterm: (z) => window.alert(`Zoekterm ${z} verwijderd.`),
};