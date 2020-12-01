import {UseRadioProps} from "@chakra-ui/radio/dist/types/use-radio";
import {Button, ButtonProps, Stack, useId, useRadio, useRadioGroup} from "@chakra-ui/react";
import React from "react";

type RadioButtonGroupProps = {
	onChange: (value: string) => void
	defaultValue?: string,
	value?: string,
	name?: string,
	options: string[] | { [key: string]: string },
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({onChange, defaultValue = undefined, value = undefined, name, options = []}) => {
	const {getRadioProps, getRootProps} = useRadioGroup({
		name, defaultValue, onChange, value: value || defaultValue
	});
	const group = getRootProps();

	const mapOptions = (renderFn: (value: string, i: number, label: string) => JSX.Element) => {
		const mapThis = options instanceof Array ? options : Object.keys(options);
		return mapThis.map((value, i) => renderFn(value, i, options instanceof Array ? value : options[value]));
	}

	return (
		<Stack {...group} direction={"row"} spacing={0}>
			{mapOptions((value, i, label) => {
				const roundingOptions = {
					...i > 0 && {
						roundedLeft: 0,
					},
					...(i < Object.keys(options).length - 1) && {
						roundedRight: 0,
					}
				};

				return (<RadioButton key={i} radio={getRadioProps({value})} {...roundingOptions}>{label}</RadioButton>);
			})}
		</Stack>
	);
};

type RadioButtonProps = ButtonProps & {
	radio: UseRadioProps
}

const RadioButton: React.FC<RadioButtonProps> = ({children, radio, ...props}) => {
	const id = useId(radio.id, "radioButton");
	const {getInputProps, getCheckboxProps} = useRadio({...radio, id});

	const checkbox = getCheckboxProps();

	return (
		<Button {...props} as={"label"} htmlFor={getInputProps().id} colorScheme={radio.isChecked ? "primary" : "gray"} {...checkbox}>
			<input {...(getInputProps())} />
			{children}
		</Button>
	);
}


export default RadioButtonGroup;