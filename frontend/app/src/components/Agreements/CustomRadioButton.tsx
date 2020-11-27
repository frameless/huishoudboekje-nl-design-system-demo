import {Box, Button, useRadio} from "@chakra-ui/react";
import React from "react";

const CustomRadioButton = ({...props}) => {
	const {getInputProps, getCheckboxProps} = useRadio(props);
	const {children} = props;

	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<Box as={"label"}>
			<input {...input} />
			{/* Todo: Checked */}
			<Button {...checkbox}>
				{children}
			</Button>
		</Box>
	);
}

export default CustomRadioButton;