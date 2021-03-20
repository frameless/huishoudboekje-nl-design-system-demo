import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {components} from "react-select";
import {formatIBAN} from "../../../utils/things";

export const RekeningValueContainer = (props) => {
	const value = props.getValue()?.[0];

	if (!value) {
		return (<components.ValueContainer {...props} />);
	}

	const context = value?.context || {};
	return (
		<components.ValueContainer {...props}>
			<Stack spacing={0}>
				<Text>{formatIBAN(context.iban)}</Text>
				<Text fontSize={"sm"}>{context.rekeninghouder || ""}</Text>
			</Stack>
		</components.ValueContainer>
	);
};

export const RekeningOption = (props) => {
	const {context} = props.data;
	return (
		<components.Option {...props}>
			<Stack spacing={0}>
				<Text>{formatIBAN(context.iban)}</Text>
				<Text fontSize={"sm"}>{context.rekeninghouder}</Text>
			</Stack>
		</components.Option>
	);
};