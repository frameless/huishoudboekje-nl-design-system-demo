import {BoxProps, Stack, Text} from "@chakra-ui/core";
import React from "react";
import {currencyFormat2} from "../utils/things";

const Currency: React.FC<BoxProps & { value: number }> = ({value, ...props}) => {
	return (
		<Stack direction={"row"} justifyContent={"space-between"} {...props}>
			<Text>&euro;</Text>
			<Text>{currencyFormat2(false).format(value)}</Text>
		</Stack>
	);
};

export default Currency;