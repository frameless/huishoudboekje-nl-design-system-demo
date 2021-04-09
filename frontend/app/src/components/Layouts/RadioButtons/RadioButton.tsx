import {UseRadioProps} from "@chakra-ui/radio/dist/types/use-radio";
import {Button, ButtonProps, Input, useId, useRadio} from "@chakra-ui/react";
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
			<Input {...(getInputProps())} />
			{children}
		</Button>
	);
};

export default RadioButton;