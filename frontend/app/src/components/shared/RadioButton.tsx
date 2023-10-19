import {Button, ButtonProps, Input, useId, useRadio, UseRadioProps} from "@chakra-ui/react";
import React from "react";

type RadioButtonProps = ButtonProps & {
	radio: UseRadioProps
}

const RadioButton: React.FC<RadioButtonProps> = ({children, radio, ...props}) => {
	const id = useId(radio.id, "radioButton");
	const {getInputProps, getCheckboxProps} = useRadio({...radio, id});

	const checkbox = getCheckboxProps();

	return (
		<Button {...props} as={"label"} htmlFor={getInputProps().id} colorScheme={radio.isChecked ? "primary" : "gray"} {...checkbox}>
			<Input
				autoComplete="no"
				aria-autocomplete="none"
				{...(getInputProps())}
			/>
			{children}
		</Button>
	);
};

export default RadioButton;