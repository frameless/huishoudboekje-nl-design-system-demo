import {Text} from "@chakra-ui/react";
import {ComponentMeta} from "@storybook/react";
import React from "react";
import TwoColumns from "./TwoColumns";

export default {
	title: "Huishoudboekje/Componenten/TwoColumns",
	component: TwoColumns,
	argTypes: {},
} as ComponentMeta<typeof TwoColumns>;

export const Default = () => (
	<TwoColumns>
		<Text>Dit is wat er rechts komt te staan.</Text>
	</TwoColumns>
);