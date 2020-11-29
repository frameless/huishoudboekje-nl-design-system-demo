import {Box, Button, HStack, StackProps, useRadio, useRadioGroup} from "@chakra-ui/react";
import React from "react";

const RadioButton = ({radio, isChecked, ...props}) => {
	const {getInputProps, getCheckboxProps} = useRadio(radio);

	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<Box as="label">
			<input {...input} />
			<Button as={Box} {...checkbox} {...props} colorScheme={isChecked ? "primary" : "gray"}>
				{props.children}
			</Button>
		</Box>
	)
};

const RadioButtonGroup: React.FC<StackProps & { options: { [key: string]: string }, name: string, onChange: (value: string) => void, defaultValue?: string }> = ({options = [], name, onChange, defaultValue}) => {
	const {getRootProps, getRadioProps} = useRadioGroup({name, defaultValue, onChange});
	const group = getRootProps();

	return (
		<HStack {...group} spacing={0}>
			{Object.keys(options).map((option, i) => {
				const radio = getRadioProps({value: option});
				const roundingOptions = {
					...i > 0 && {
						roundedLeft: 0,
					},
					...(i < Object.keys(options).length - 1) && {
						roundedRight: 0,
					}
				};

				return (
					<RadioButton key={option} radio={radio} isChecked={radio.value === defaultValue} {...roundingOptions}>
						{options[option]}
					</RadioButton>
				)
			})}
		</HStack>
	)
};

export default RadioButtonGroup;