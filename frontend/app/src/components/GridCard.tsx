import React from "react";
import {BoxProps, Stack} from "@chakra-ui/react";

const GridCard: React.FC<BoxProps> = ({children, ...props}) => {
	return (
		<Stack direction={"row"} width={"100%"} alignItems={"center"} bg={"white"} borderRadius={5} p={5} cursor={"pointer"}
		       userSelect={"none"} {...props}>
			{children}
		</Stack>
	);
};

export default GridCard;