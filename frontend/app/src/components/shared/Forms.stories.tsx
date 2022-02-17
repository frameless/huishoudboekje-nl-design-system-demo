import {FormControl, FormLabel, Input, Stack} from "@chakra-ui/react";
import {ComponentMeta} from "@storybook/react";
import React from "react";
import {FormLeft, FormRight} from "./Forms";

export default {
	title: "Huishoudboekje/FormLeft",
	component: FormLeft,
	argTypes: {
		title: {
			type: {
				name: "string",
				required: false,
			},
			description: "This title will be shown on the left side",
		},
		helperText: {
			type: {
				name: "string",
				required: false,
			},
			description: "This text will be displayed under the title and gives extra clarity on what to do on the form.",
		},
	},
} as ComponentMeta<typeof FormLeft>;

export const Gebeurtenissen = () => {
	return (
		<Stack direction={["column", "row"]} spacing={2}>
			<FormLeft title={"Gebeurtenissen"} helperText={"Dit is een lijst met gebruikersactiviteiten van deze burger."} />
			<FormRight spacing={5}>
				<Stack spacing={2} direction={["column", "row"]}>
					<FormControl id={"bsn"} isRequired={true}>
						<Stack spacing={1} flex={1}>
							<FormLabel>Burgerservicenummer</FormLabel>
							<Input />
						</Stack>
					</FormControl>
				</Stack>
			</FormRight>
		</Stack>
	);
};