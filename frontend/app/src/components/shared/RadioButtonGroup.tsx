import {Stack, useRadioGroup} from "@chakra-ui/react";
import React from "react";
import RadioButton from "./RadioButton";

type RadioButtonGroupProps = {
	onChange: (value: string) => void
	defaultValue?: string,
	value?: string,
	name?: string,
	options: string[] | {[key: string]: string},
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({onChange, defaultValue = undefined, value = undefined, name, options = []}) => {
	const {getRadioProps, getRootProps} = useRadioGroup({
		name, defaultValue, onChange, value: value || defaultValue,
	});
	const group = getRootProps();

	const mapOptions = (renderFn: (value: string, i: number, label: string) => JSX.Element) => {
		const mapThis = options instanceof Array ? options : Object.keys(options);
		return mapThis.map((value, i) => renderFn(value, i, options instanceof Array ? value : options[value]));
	};

	return (
		<Stack {...group} direction={"row"} spacing={0}>
			{mapOptions((value, i, label) => {
				const roundingOptions = {
					...i > 0 && {
						roundedLeft: 0,
					},
					...i < Object.keys(options).length - 1 && {
						roundedRight: 0,
					},
				};

				return (
					<RadioButton key={i} radio={getRadioProps({value})} {...roundingOptions}>{label}</RadioButton>
				);
			})}
		</Stack>
	);
};

export default RadioButtonGroup;
