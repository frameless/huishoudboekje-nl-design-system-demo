import React from "react";
import {Button, RadioProps} from "@chakra-ui/core";

const CustomRadioButton: React.FC<RadioProps> = React.forwardRef((props, ref) => {
	const {isChecked, isDisabled, value, children, ...rest} = props;
	return (
		<Button aria-checked={isChecked} ref={ref} variantColor={isChecked ? "primary" : "gray"} isDisabled={isDisabled} {...rest}>{children}</Button>
	);
});

export default CustomRadioButton;