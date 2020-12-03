import {Stack, StackProps} from "@chakra-ui/react";
import React from "react";

const Section: React.FC<StackProps & { fluid?: boolean }> = ({fluid = false, children, ...props}) => {
	return (
		<Stack maxWidth={fluid ? "100%" : 1200} bg={"white"} p={5} borderRadius={10} spacing={5} {...props}>
			{children}
		</Stack>
	);
};

export default Section;