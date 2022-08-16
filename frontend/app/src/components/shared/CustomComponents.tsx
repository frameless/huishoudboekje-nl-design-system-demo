import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {components} from "react-select";

export const MultiLineOption = (props) => {
	const labels = props.label || [];
	return (
		<components.Option {...props}>
			<Stack spacing={0}>
				{labels.map((l, i) => {
					return (
						<Text key={i} {...i > 0 && {fontSize: "sm"}}>{l}</Text>
					);
				})}
			</Stack>
		</components.Option>
	);
};

export const MultiLineValueContainer = (props) => {
	const value = props.getValue()?.[0];
	if (!value) {
		return (
			<components.ValueContainer {...props} />
		);
	}

	const labels = value.label || [];
	return (
		<components.ValueContainer {...props}>
			<Stack spacing={0}>
				{labels.map((l, i) => {
					return (
						<Text key={i} {...i > 0 && {fontSize: "sm"}}>{l}</Text>
					);
				})}
			</Stack>
		</components.ValueContainer>
	);
};

export const ReverseMultiLineOption = (props) => {
	const labels = props.label || [];

	return (
		<components.Option {...props}>
			<Stack spacing={0}>
				{labels.map((l, i) => {
					return (
						<Text key={i} {...i === 0 && {fontSize: "sm"}}>{l}</Text>
					);
				})}
			</Stack>
		</components.Option>
	);
};

export const ReverseMultiLineValueContainer = (props) => {
	const value = props.getValue()?.[0];

	if (!value) {
		return (
			<components.ValueContainer {...props} />
		);
	}

	const labels = value.label || [];

	return (
		<components.ValueContainer {...props}>
			<Stack spacing={0}>
				{labels.map((l, i) => {
					return (
						<Text key={i} {...i === 0 && {fontSize: "sm"}}>{l}</Text>
					);
				})}
			</Stack>
		</components.ValueContainer>
	);
};