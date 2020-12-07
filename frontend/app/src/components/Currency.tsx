import {BoxProps, Stack, Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {currencyFormat2} from "../utils/things";

const Currency: React.FC<BoxProps & { value: number, text?: TextProps}> = ({value, text, ...props}) => {
	return (
		<Stack direction={"row"} justifyContent={"space-between"} minWidth={150} {...props}>
			<Text {...text}>&euro;</Text>
			<Text {...text}>{currencyFormat2(false).format(value)}</Text>
		</Stack>
	);
};

export default Currency;